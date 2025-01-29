class RatingService {
  // Soumettre une évaluation
  submitRating = async (rideId, userId, rating) => {
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          rideId,
          userId,
          rating: {
            score: rating.score,
            comment: rating.comment,
            categories: rating.categories,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur soumission évaluation');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur soumission évaluation:', error);
      throw error;
    }
  };

  // Obtenir les évaluations d'un utilisateur
  getUserRatings = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}/ratings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur récupération évaluations');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur récupération évaluations:', error);
      throw error;
    }
  };

  // Calculer la moyenne des évaluations
  calculateAverageRating = (ratings) => {
    if (!ratings.length) return 0;

    const sum = ratings.reduce((acc, curr) => acc + curr.score, 0);
    return (sum / ratings.length).toFixed(1);
  };

  // Signaler une évaluation
  reportRating = async (ratingId, reason) => {
    try {
      const response = await fetch(`/api/ratings/${ratingId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Erreur signalement évaluation');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur signalement évaluation:', error);
      throw error;
    }
  };

  // Obtenir les statistiques d'évaluation
  getRatingStats = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}/rating-stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur récupération statistiques');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur récupération statistiques:', error);
      throw error;
    }
  };

  // Vérifier si l'utilisateur peut évaluer
  canRate = async (rideId, userId) => {
    try {
      const response = await fetch(`/api/ratings/can-rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ rideId, userId }),
      });

      if (!response.ok) {
        throw new Error('Erreur vérification permission');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur vérification permission:', error);
      throw error;
    }
  };

  // Hook React pour utiliser les évaluations
  useRatings = (userId) => {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);

    useEffect(() => {
      const loadData = async () => {
        try {
          const [ratingData, statsData] = await Promise.all([
            this.getUserRatings(userId),
            this.getRatingStats(userId),
          ]);

          setRatings(ratingData);
          setStats(statsData);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }, [userId]);

    return {
      ratings,
      stats,
      loading,
      error,
      submitRating: this.submitRating,
      reportRating: this.reportRating,
    };
  };
}

// Créer une instance singleton
const ratingService = new RatingService();
export { ratingService };