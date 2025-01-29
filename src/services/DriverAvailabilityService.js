class DriverAvailabilityService {
  // Vérifier la disponibilité d'un conducteur
  checkAvailability = async (driverId, date, timeSlot) => {
    try {
      const response = await fetch(`/api/drivers/${driverId}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ date, timeSlot }),
      });

      if (!response.ok) {
        throw new Error('Erreur vérification disponibilité');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur vérification disponibilité:', error);
      throw error;
    }
  };

  // Définir les disponibilités récurrentes
  setRecurringAvailability = async (driverId, schedule) => {
    try {
      const response = await fetch(`/api/drivers/${driverId}/recurring-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ schedule }),
      });

      if (!response.ok) {
        throw new Error('Erreur définition disponibilités');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur définition disponibilités:', error);
      throw error;
    }
  };

  // Obtenir les créneaux horaires disponibles
  getAvailableTimeSlots = async (driverId, date) => {
    try {
      const response = await fetch(`/api/drivers/${driverId}/time-slots?date=${date}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur récupération créneaux');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur récupération créneaux:', error);
      throw error;
    }
  };

  // Marquer des créneaux comme indisponibles
  blockTimeSlots = async (driverId, slots) => {
    try {
      const response = await fetch(`/api/drivers/${driverId}/block-slots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ slots }),
      });

      if (!response.ok) {
        throw new Error('Erreur blocage créneaux');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur blocage créneaux:', error);
      throw error;
    }
  };

  // Définir les heures de garde alternée
  setCustodySchedule = async (driverId, custodySchedule) => {
    try {
      const response = await fetch(`/api/drivers/${driverId}/custody-schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ custodySchedule }),
      });

      if (!response.ok) {
        throw new Error('Erreur définition garde alternée');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur définition garde alternée:', error);
      throw error;
    }
  };

  // Obtenir les conducteurs disponibles pour un créneau
  findAvailableDrivers = async (date, timeSlot, location) => {
    try {
      const response = await fetch('/api/drivers/available', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ date, timeSlot, location }),
      });

      if (!response.ok) {
        throw new Error('Erreur recherche conducteurs');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur recherche conducteurs:', error);
      throw error;
    }
  };

  // Définir les préférences de trajet
  setRoutePreferences = async (driverId, preferences) => {
    try {
      const response = await fetch(`/api/drivers/${driverId}/route-preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ preferences }),
      });

      if (!response.ok) {
        throw new Error('Erreur définition préférences');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur définition préférences:', error);
      throw error;
    }
  };
}

// Créer une instance singleton
const driverAvailabilityService = new DriverAvailabilityService();
export { driverAvailabilityService };