import { useEffect, useState } from 'react';

export default class GeolocationService {
  constructor() {
    this.watchId = null;
    this.listeners = new Set();
  }

  // Démarrer le suivi de localisation
  startTracking = async (userId, rideId) => {
    if (!navigator.geolocation) {
      throw new Error('Géolocalisation non supportée');
    }

    try {
      // Vérifier les permissions
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      if (permission.state === 'denied') {
        throw new Error('Permission de géolocalisation refusée');
      }

      // Démarrer le suivi
      this.watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const locationData = {
            userId,
            rideId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString(),
          };

          // Mettre à jour la position sur le serveur
          await this.updateLocation(locationData);

          // Notifier les écouteurs
          this.notifyListeners(locationData);
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          this.notifyListeners({ error });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } catch (error) {
      console.error('Erreur lors du démarrage du suivi:', error);
      throw error;
    }
  };

  // Arrêter le suivi
  stopTracking = () => {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  };

  // Mettre à jour la position sur le serveur
  updateLocation = async (locationData) => {
    try {
      const response = await fetch('/api/location/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(locationData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la position');
      }
    } catch (error) {
      console.error('Erreur de mise à jour de position:', error);
      throw error;
    }
  };

  // Ajouter un écouteur
  addListener = (callback) => {
    this.listeners.add(callback);
  };

  // Retirer un écouteur
  removeListener = (callback) => {
    this.listeners.delete(callback);
  };

  // Notifier tous les écouteurs
  notifyListeners = (data) => {
    this.listeners.forEach(callback => callback(data));
  };

  // Hook React personnalisé pour utiliser le service
  useGeolocation = (userId, rideId) => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
      const handleLocation = (data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setLocation(data);
        }
      };

      // Démarrer le suivi
      this.addListener(handleLocation);
      this.startTracking(userId, rideId).catch(setError);

      // Nettoyage
      return () => {
        this.removeListener(handleLocation);
        this.stopTracking();
      };
    }, [userId, rideId]);

    return { location, error };
  };
}

// Créer une instance singleton
const geolocationService = new GeolocationService();
export { geolocationService };