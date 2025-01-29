import { useState, useEffect } from 'react';

class NotificationService {
  constructor() {
    this.subscribers = new Set();
    this.socket = null;
    this.notifications = [];
  }

  // Initialiser la connexion WebSocket
  initialize = () => {
    if (this.socket) return;

    this.socket = new WebSocket(process.env.REACT_APP_WS_URL);

    this.socket.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      this.handleNewNotification(notification);
    };

    this.socket.onclose = () => {
      // Reconnexion automatique après 5 secondes
      setTimeout(this.initialize, 5000);
    };
  };

  // Gérer une nouvelle notification
  handleNewNotification = (notification) => {
    this.notifications.unshift(notification);
    
    // Limiter le nombre de notifications stockées
    if (this.notifications.length > 50) {
      this.notifications.pop();
    }

    // Notifier tous les abonnés
    this.notifySubscribers();

    // Afficher une notification système si supporté
    this.showSystemNotification(notification);
  };

  // Afficher une notification système
  showSystemNotification = async (notification) => {
    if (!('Notification' in window)) return;

    try {
      // Demander la permission si nécessaire
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }

      if (Notification.permission === 'granted') {
        new Notification('CoCoSchool', {
          body: notification.message,
          icon: '/logo192.png',
          tag: notification.id,
        });
      }
    } catch (error) {
      console.error('Erreur notification système:', error);
    }
  };

  // S'abonner aux notifications
  subscribe = (callback) => {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  };

  // Notifier tous les abonnés
  notifySubscribers = () => {
    this.subscribers.forEach(callback => {
      callback(this.notifications);
    });
  };

  // Marquer une notification comme lue
  markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors du marquage de la notification');
      }

      // Mettre à jour localement
      this.notifications = this.notifications.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      );

      this.notifySubscribers();
    } catch (error) {
      console.error('Erreur marquage notification:', error);
      throw error;
    }
  };

  // Supprimer une notification
  delete = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la notification');
      }

      // Mettre à jour localement
      this.notifications = this.notifications.filter(
        notif => notif.id !== notificationId
      );

      this.notifySubscribers();
    } catch (error) {
      console.error('Erreur suppression notification:', error);
      throw error;
    }
  };

  // Hook React pour utiliser les notifications
  useNotifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
      // S'abonner aux notifications
      const unsubscribe = this.subscribe(setNotifications);
      
      // Initialiser la connexion WebSocket
      this.initialize();

      // Nettoyage
      return () => {
        unsubscribe();
        if (this.socket) {
          this.socket.close();
          this.socket = null;
        }
      };
    }, []);

    return {
      notifications,
      markAsRead: this.markAsRead,
      delete: this.delete,
    };
  };
}

// Créer une instance singleton
const notificationService = new NotificationService();
export { notificationService };