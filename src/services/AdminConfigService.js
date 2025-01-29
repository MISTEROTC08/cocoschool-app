class AdminConfigService {
  // Obtenir la configuration actuelle
  getConfig = async () => {
    try {
      const response = await fetch('/api/admin/config', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur récupération configuration');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur récupération config:', error);
      throw error;
    }
  };

  // Mettre à jour la configuration
  updateConfig = async (config) => {
    try {
      const response = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Erreur mise à jour configuration');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur mise à jour config:', error);
      throw error;
    }
  };

  // Gérer les rôles et permissions
  updateUserRole = async (userId, role) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error('Erreur mise à jour rôle');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur mise à jour rôle:', error);
      throw error;
    }
  };

  // Gérer les écoles
  addSchool = async (schoolData) => {
    try {
      const response = await fetch('/api/admin/schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(schoolData),
      });

      if (!response.ok) {
        throw new Error('Erreur ajout école');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur ajout école:', error);
      throw error;
    }
  };

  // Gérer la modération
  moderateContent = async (contentId, action) => {
    try {
      const response = await fetch(`/api/admin/moderation/${contentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error('Erreur modération');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur modération:', error);
      throw error;
    }
  };

  // Gérer les notifications système
  sendSystemNotification = async (notification) => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(notification),
      });

      if (!response.ok) {
        throw new Error('Erreur envoi notification');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur envoi notification:', error);
      throw error;
    }
  };

  // Gérer la maintenance
  setMaintenanceMode = async (enabled, message) => {
    try {
      const response = await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ enabled, message }),
      });

      if (!response.ok) {
        throw new Error('Erreur configuration maintenance');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur configuration maintenance:', error);
      throw error;
    }
  };

  // Hook React pour utiliser la configuration admin
  useAdminConfig = () => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const loadConfig = async () => {
        try {
          const data = await this.getConfig();
          setConfig(data);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      loadConfig();
    }, []);

    return {
      config,
      loading,
      error,
      updateConfig: this.updateConfig,
      updateUserRole: this.updateUserRole,
      addSchool: this.addSchool,
      moderateContent: this.moderateContent,
      sendSystemNotification: this.sendSystemNotification,
      setMaintenanceMode: this.setMaintenanceMode,
    };
  };
}

// Créer une instance singleton
const adminConfigService = new AdminConfigService();
export { adminConfigService };