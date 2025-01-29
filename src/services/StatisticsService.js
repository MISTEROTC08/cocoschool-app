class StatisticsService {
  // Obtenir les statistiques globales
  getGlobalStats = async () => {
    try {
      const response = await fetch('/api/statistics/global', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur récupération statistiques globales');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur statistiques globales:', error);
      throw error;
    }
  };

  // Obtenir les statistiques par école
  getSchoolStats = async (schoolId) => {
    try {
      const response = await fetch(`/api/statistics/schools/${schoolId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur récupération statistiques école');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur statistiques école:', error);
      throw error;
    }
  };

  // Obtenir les statistiques d'un utilisateur
  getUserStats = async (userId) => {
    try {
      const response = await fetch(`/api/statistics/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur récupération statistiques utilisateur');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur statistiques utilisateur:', error);
      throw error;
    }
  };

  // Génération de rapports personnalisés
  generateReport = async (params) => {
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Erreur génération rapport');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur génération rapport:', error);
      throw error;
    }
  };

  // Calculer les économies CO2
  calculateCO2Savings = async (params) => {
    try {
      const response = await fetch('/api/statistics/co2-savings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Erreur calcul CO2');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur calcul CO2:', error);
      throw error;
    }
  };

  // Obtenir les tendances d'utilisation
  getUsageTrends = async (params) => {
    try {
      const response = await fetch('/api/statistics/trends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Erreur récupération tendances');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur récupération tendances:', error);
      throw error;
    }
  };

  // Calculer le taux d'occupation moyen
  calculateOccupancyRate = async (params) => {
    try {
      const response = await fetch('/api/statistics/occupancy-rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Erreur calcul taux occupation');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur calcul taux occupation:', error);
      throw error;
    }
  };

  // Hook pour utiliser les statistiques
  useStatistics = () => {
    const [globalStats, setGlobalStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const loadStats = async () => {
        try {
          const stats = await this.getGlobalStats();
          setGlobalStats(stats);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      loadStats();
    }, []);

    return {
      globalStats,
      loading,
      error,
      getSchoolStats: this.getSchoolStats,
      getUserStats: this.getUserStats,
      generateReport: this.generateReport,
      calculateCO2Savings: this.calculateCO2Savings,
      getUsageTrends: this.getUsageTrends,
      calculateOccupancyRate: this.calculateOccupancyRate,
    };
  };
}

// Créer une instance singleton
const statisticsService = new StatisticsService();
export { statisticsService };