class ModerationService {
  // Obtenir les signalements en attente
  getPendingReports = async () => {
    try {
      const response = await fetch('/api/moderation/reports', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur récupération signalements');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur signalements:', error);
      throw error;
    }
  };

  // Traiter un signalement
  handleReport = async (reportId, action, reason) => {
    try {
      const response = await fetch(`/api/moderation/reports/${reportId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ action, reason }),
      });

      if (!response.ok) {
        throw new Error('Erreur traitement signalement');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur traitement:', error);
      throw error;
    }
  };

  // Bannir un utilisateur
  banUser = async (userId, reason, duration) => {
    try {
      const response = await fetch(`/api/moderation/users/${userId}/ban`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ reason, duration }),
      });

      if (!response.ok) {
        throw new Error('Erreur bannissement');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur bannissement:', error);
      throw error;
    }
  };

  // Lever un bannissement
  unbanUser = async (userId) => {
    try {
      const response = await fetch(`/api/moderation/users/${userId}/unban`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur débannissement');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur débannissement:', error);
      throw error;
    }
  };

  // Avertir un utilisateur
  warnUser = async (userId, message) => {
    try {
      const response = await fetch(`/api/moderation/users/${userId}/warn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Erreur avertissement');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur avertissement:', error);
      throw error;
    }
  };

  // Obtenir l'historique de modération
  getModerationHistory = async (userId) => {
    try {
      const response = await fetch(`/api/moderation/history/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur historique modération');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur historique:', error);
      throw error;
    }
  };

  // Modérer un message
  moderateMessage = async (messageId, action) => {
    try {
      const response = await fetch(`/api/moderation/messages/${messageId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error('Erreur modération message');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur modération message:', error);
      throw error;
    }
  };

  // Hook React pour utiliser la modération
  useModeration = () => {
    const [pendingReports, setPendingReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const loadReports = async () => {
        try {
          const reports = await this.getPendingReports();
          setPendingReports(reports);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      loadReports();
    }, []);

    return {
      pendingReports,
      loading,
      error,
      handleReport: this.handleReport,
      banUser: this.banUser,
      unbanUser: this.unbanUser,
      warnUser: this.warnUser,
      getModerationHistory: this.getModerationHistory,
      moderateMessage: this.moderateMessage,
    };
  };
}

// Créer une instance singleton
const moderationService = new ModerationService();
export { moderationService };