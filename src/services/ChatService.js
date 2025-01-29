class ChatService {
  constructor() {
    this.socket = null;
    this.listeners = new Set();
  }

  // Initialiser la connexion WebSocket
  initialize = () => {
    if (this.socket) return;

    this.socket = new WebSocket(process.env.REACT_APP_CHAT_WS_URL);
    
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.notifyListeners(message);
    };

    this.socket.onclose = () => {
      // Reconnexion automatique
      setTimeout(this.initialize, 3000);
    };
  };

  // Envoyer un message
  sendMessage = async (chatId, content, type = 'text') => {
    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          chatId,
          content,
          type,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur envoi message');
      }

      const message = await response.json();
      
      // Envoyer via WebSocket aussi pour temps réel
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
          type: 'new_message',
          data: message,
        }));
      }

      return message;
    } catch (error) {
      console.error('Erreur envoi message:', error);
      throw error;
    }
  };

  // Charger l'historique des messages
  loadMessages = async (chatId, limit = 50, before) => {
    try {
      let url = `/api/chat/${chatId}/messages?limit=${limit}`;
      if (before) {
        url += `&before=${before}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur chargement messages');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      throw error;
    }
  };

  // Créer une nouvelle conversation
  createChat = async (participants, name = '') => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          participants,
          name,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur création conversation');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur création conversation:', error);
      throw error;
    }
  };

  // Marquer les messages comme lus
  markAsRead = async (chatId, messageIds) => {
    try {
      const response = await fetch(`/api/chat/${chatId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ messageIds }),
      });

      if (!response.ok) {
        throw new Error('Erreur marquage messages');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur marquage messages:', error);
      throw error;
    }
  };

  // Vérifier si l'utilisateur écrit
  sendTypingStatus = (chatId, isTyping) => {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'typing_status',
        data: { chatId, isTyping },
      }));
    }
  };

  // Ajouter un écouteur de messages
  addListener = (callback) => {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  };

  // Notifier tous les écouteurs
  notifyListeners = (data) => {
    this.listeners.forEach(callback => callback(data));
  };

  // Hook React pour utiliser le chat
  useChat = (chatId) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      // Charger les messages initiaux
      this.loadMessages(chatId)
        .then(setMessages)
        .catch(setError)
        .finally(() => setLoading(false));

      // S'abonner aux mises à jour
      const unsubscribe = this.addListener((data) => {
        if (data.chatId === chatId) {
          setMessages(current => [...current, data]);
        }
      });

      return unsubscribe;
    }, [chatId]);

    return {
      messages,
      loading,
      error,
      sendMessage: (content) => this.sendMessage(chatId, content),
      markAsRead: (messageIds) => this.markAsRead(chatId, messageIds),
      sendTypingStatus: (isTyping) => this.sendTypingStatus(chatId, isTyping),
    };
  };
}

// Créer une instance singleton
const chatService = new ChatService();
export { chatService };