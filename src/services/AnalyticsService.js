class AnalyticsService {
  // Obtenir les données d'utilisation avancées
  getUsageAnalytics = async (params) => {
    try {
      const response = await fetch('/api/analytics/usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Erreur récupération analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur analytics:', error);
      throw error;
    }
  };

  // Analyse prédictive de la demande
  getPredictiveAnalytics = async (params) => {
    try {
      const response = await fetch('/api/analytics/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Erreur prédictions');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur prédictions:', error);
      throw error;
    }
  };

  // Analyse des tendances
  getTrendAnalytics = async (params) => {
    try {
      const response = await fetch('/api/analytics/trends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Erreur tendances');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur tendances:', error);
      throw error;
    }
  };

  // Analyse des comportements utilisateurs
  getUserBehaviorAnalytics = async (params) => {
    try {
      const response = await fetch('/api/analytics/user-behavior', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Erreur analyse comportement');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur analyse comportement:', error);
      throw error;
    }
  };

  // Analyse de performance
  getPerformanceAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/performance', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur performance');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur performance:', error);
      throw error;
    }
  };

  // Analyse économique et environnementale
  getImpactAnalytics = async (params) => {
    try {
      const response = await fetch('/api/analytics/impact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Erreur analyse impact');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur analyse impact:', error);
      throw error;
    }
  };

  // Hook React pour utiliser les analytics
  useAnalytics = (type, params) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          let result;
          switch (type) {
            case 'usage':
              result = await this.getUsageAnalytics(params);
              break;
            case 'predictions':
              result = await this.getPredictiveAnalytics(params);
              break;
            case 'trends':
              result = await this.getTrendAnalytics(params);
              break;
            case 'behavior':
              result = await this.getUserBehaviorAnalytics(params);
              break;
            case 'performance':
              result = await this.getPerformanceAnalytics();
              break;
            case 'impact':
              result = await this.getImpactAnalytics(params);
              break;
            default:
              throw new Error('Type d\'analyse non reconnu');
          }
          setData(result);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [type, params]);

    return { data, loading, error };
  };
}

// Créer une instance singleton
const analyticsService = new AnalyticsService();
export { analyticsService };