class ReportingService {
  // Générer un rapport détaillé
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

  // Obtenir les rapports planifiés
  getScheduledReports = async () => {
    try {
      const response = await fetch('/api/reports/scheduled', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur récupération rapports planifiés');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur récupération rapports:', error);
      throw error;
    }
  };

  // Planifier un rapport récurrent
  scheduleReport = async (config) => {
    try {
      const response = await fetch('/api/reports/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Erreur planification rapport');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur planification rapport:', error);
      throw error;
    }
  };

  // Générer des rapports spécifiques
  generateSchoolReport = async (schoolId, params) => {
    try {
      const response = await fetch(`/api/reports/schools/${schoolId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Erreur génération rapport école');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur rapport école:', error);
      throw error;
    }
  };

  generateUserReport = async (userId, params) => {
    try {
      const response = await fetch(`/api/reports/users/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Erreur génération rapport utilisateur');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur rapport utilisateur:', error);
      throw error;
    }
  };

  // Exporter les données
  exportData = async (format, params) => {
    try {
      const response = await fetch('/api/reports/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ format, ...params }),
      });

      if (!response.ok) {
        throw new Error('Erreur export données');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export_${new Date().toISOString()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur export données:', error);
      throw error;
    }
  };

  // Hook React pour utiliser les rapports
  useReporting = () => {
    const [scheduledReports, setScheduledReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const loadReports = async () => {
        try {
          const reports = await this.getScheduledReports();
          setScheduledReports(reports);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      loadReports();
    }, []);

    return {
      scheduledReports,
      loading,
      error,
      generateReport: this.generateReport,
      scheduleReport: this.scheduleReport,
      generateSchoolReport: this.generateSchoolReport,
      generateUserReport: this.generateUserReport,
      exportData: this.exportData,
    };
  };
}

// Créer une instance singleton
const reportingService = new ReportingService();
export { reportingService };