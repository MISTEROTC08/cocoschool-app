class DetailedNotificationService {
  constructor() {
    this.socket = null;
    this.listeners = new Set();
  }

  // Initialiser les notifications en temps réel
  initialize = () => {
    if (this.socket) return;

    this.socket = new WebSocket(process.env.REACT_APP_WS_URL);
    
    this.socket.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      this.handleNewNotification(notification);
    };

    this.socket.onclose = () => {
      setTimeout(this.initialize, 3000);
    };
  };

  // Gérer une nouvelle notification
  handleNewNotification = (notification) => {
    // Vérifier les permissions de notification du navigateur
    if ('Notification' in window && Notification.permission === 'granted') {
      this.showSystemNotification(notification);
    }

    // Notifier les abonnés
    this.notifyListeners(notification);
  };

  // Afficher une notification système
  showSystemNotification = (notification) => {
    const { title, body, icon, data } = this.formatNotification(notification);
    
    new Notification(title, {
      body,
      icon,
      data,
      tag: notification.id,
    });
  };

  // Formater une notification
  formatNotification = (notification) => {
    let title, body, icon, data;

    switch (notification.type) {
      case 'ride_request':
        title = 'Nouvelle demande de trajet';
        body = `${notification.senderName} souhaite rejoindre votre trajet`;
        icon = '/icons/ride.png';
        break;

      case 'ride_accepted':
        title = 'Trajet accepté';
        body = `Votre demande de trajet a été acceptée`;
        icon = '/icons/accepted.png';
        break;

      case 'ride_cancelled':
        title = 'Trajet annulé';
        body = notification.message;
        icon = '/icons/cancelled.png';
        break;

      case 'emergency':
        title = '⚠️ Alerte';
        body = notification.message;
        icon = '/icons/emergency.png';
        break;

      case 'admin':
        title = 'Message administrateur';
        body = notification.message;
        icon = '/icons/admin.png';
        break;

      default:
        title = 'Notification';
        body = notification.message;
        icon = '/icons/default.png';
    }

    return {
      title,
      body,
      icon,
      data: notification,
    };
  };

  // Obtenir les notifications
  getNotifications = async (params) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Erreur récupération notifications');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur notifications:', error);
      throw error;
    }
  };

  // Marquer comme lu
  markAsRead = async (notificationIds) => {
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ notificationIds }),
      });

      if (!response.ok) {
        throw new Error('Erreur marquage notifications');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur marquage:', error);
      throw error;
    }
  };

  // Supprimer des notifications
  deleteNotifications = async (notificationIds) => {
    try {
      const response = await fetch('/api/notifications/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ notificationIds }),
      });

      if (!response.ok) {
        throw new Error('Erreur suppression notifications');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur suppression:', error);
      throw error;
    }
  };

  // Configurer les préférences
  updatePreferences = async (preferences) => {
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Erreur mise à jour préférences');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur préférences:', error);
      throw error;
    }
  };

  // S'abonner aux notifications
  subscribe = (callback) => {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  };

  // Notifier les abonnés
  notifyListeners = (data) => {
    this.listeners.forEach(callback => callback(data));
  };

  // Hook React pour utiliser les notifications
  useNotifications = (params) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      // Charger les notifications initiales
      const loadNotifications = async () => {
        try {
          const data = await this.getNotifications(params);
          setNotifications(data);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      loadNotifications();

      // S'abonner aux nouvelles notifications
      const unsubscribe = this.subscribe((notification) => {
        setNotifications(current => [notification, ...current]);
      });

      // Initialiser la connexion WebSocket
      this.initialize();

      return () => {
        unsubscribe();
        if (this.socket) {
          this.socket.close();
          this.socket = null;
        }
      };
    }, [params]);

    return {
      notifications,
      loading,
      error,
      markAsRead: this.markAsRead,
      deleteNotifications: this.deleteNotifications,
      updatePreferences: this.updatePreferences,
    };
  };
}

// Créer une instance singleton
const detailedNotificationService = new DetailedNotificationService();
export { detailedNotificationService };