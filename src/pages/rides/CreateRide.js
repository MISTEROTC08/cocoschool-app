import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import {
  Card,
  Button,
  Input,
  DatePicker,
  TimePicker,
  Alert,
} from '@/components/ui';

const CreateRide = () => {
  const [meetingPoints, setMeetingPoints] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [departureTime, setDepartureTime] = useState(null);
  const [maxPassengers, setMaxPassengers] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Permettre au conducteur de cliquer sur la carte pour ajouter des points de rendez-vous
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setMeetingPoints([...meetingPoints, {
          lat,
          lng,
          time: new Date(),
          id: Date.now()
        }]);
      },
    });
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (meetingPoints.length < 2) {
        throw new Error('Veuillez définir au moins un point de départ et d\'arrivée');
      }

      // Créer le trajet
      const response = await fetch('/api/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          date: selectedDate,
          departureTime,
          maxPassengers,
          meetingPoints,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du trajet');
      }

      // Rediriger vers le détail du trajet
      const ride = await response.json();
      navigate(`/rides/${ride.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeMeetingPoint = (pointId) => {
    setMeetingPoints(points => points.filter(p => p.id !== pointId));
  };

  return (
    <div className="p-4">
      <Card className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Créer un Trajet</h1>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2">Date du trajet</label>
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              minDate={new Date()}
              required
            />
          </div>

          <div>
            <label className="block mb-2">Heure de départ</label>
            <TimePicker
              value={departureTime}
              onChange={setDepartureTime}
              required
            />
          </div>

          <div>
            <label className="block mb-2">Nombre maximum de passagers</label>
            <Input
              type="number"
              value={maxPassengers}
              onChange={(e) => setMaxPassengers(Number(e.target.value))}
              min={1}
              max={8}
              required
            />
          </div>

          <div>
            <label className="block mb-2">Points de rendez-vous</label>
            <div className="h-96 mb-4">
              <MapContainer
                center={[50.8503, 4.3517]}
                zoom={13}
                className="h-full w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClickHandler />
                {meetingPoints.map((point) => (
                  <Marker
                    key={point.id}
                    position={[point.lat, point.lng]}
                    eventHandlers={{
                      click: () => removeMeetingPoint(point.id),
                    }}
                  />
                ))}
              </MapContainer>
            </div>
            <p className="text-sm text-gray-500">
              Cliquez sur la carte pour ajouter des points de rendez-vous.
              Cliquez sur un point pour le supprimer.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Création...' : 'Créer le trajet'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CreateRide;