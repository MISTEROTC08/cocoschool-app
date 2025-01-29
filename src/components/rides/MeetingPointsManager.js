import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {
  Card,
  Button,
  Input,
  TimePicker,
  Dialog,
} from '@/components/ui';

const MeetingPointsManager = ({ 
  rideId, 
  initialPoints = [], 
  onPointsUpdate,
  readOnly = false 
}) => {
  const [meetingPoints, setMeetingPoints] = useState(initialPoints);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showPointDialog, setShowPointDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Gérer les votes et demandes des passagers
  const [pointRequests, setPointRequests] = useState([]);
  const [pointVotes, setPointVotes] = useState({});

  useEffect(() => {
    if (rideId) {
      loadPointRequests();
    }
  }, [rideId]);

  const loadPointRequests = async () => {
    try {
      const response = await fetch(`/api/rides/${rideId}/point-requests`);
      const data = await response.json();
      setPointRequests(data);
    } catch (error) {
      console.error('Erreur chargement demandes:', error);
    }
  };

  const handleMapClick = (event) => {
    if (readOnly) return;

    const newPoint = {
      id: Date.now(),
      latitude: event.latlng.lat,
      longitude: event.latlng.lng,
      time: new Date(),
      status: 'pending'
    };

    setSelectedPoint(newPoint);
    setShowPointDialog(true);
  };

  const handlePointSave = async (pointData) => {
    try {
      setLoading(true);

      const response = await fetch(`/api/rides/${rideId}/meeting-points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(pointData),
      });

      if (!response.ok) {
        throw new Error('Erreur sauvegarde point');
      }

      const savedPoint = await response.json();
      
      setMeetingPoints(current => [...current, savedPoint]);
      onPointsUpdate?.(meetingPoints);
      setShowPointDialog(false);

    } catch (error) {
      console.error('Erreur sauvegarde point:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVotePoint = async (pointId, vote) => {
    try {
      const response = await fetch(`/api/rides/${rideId}/points/${pointId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ vote }),
      });

      if (!response.ok) {
        throw new Error('Erreur vote');
      }

      // Mettre à jour les votes localement
      setPointVotes(current => ({
        ...current,
        [pointId]: vote
      }));

    } catch (error) {
      console.error('Erreur vote point:', error);
    }
  };

  const handleRequestPoint = async (location) => {
    try {
      const response = await fetch(`/api/rides/${rideId}/point-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          latitude: location.lat,
          longitude: location.lng,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur demande point');
      }

      // Recharger les demandes
      await loadPointRequests();

    } catch (error) {
      console.error('Erreur demande point:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="h-96">
        <MapContainer
          center={[50.8503, 4.3517]}
          zoom={13}
          className="h-full w-full"
          onClick={handleMapClick}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {/* Points existants */}
          {meetingPoints.map((point) => (
            <Marker
              key={point.id}
              position={[point.latitude, point.longitude]}
            >
              <Popup>
                <div className="space-y-2">
                  <p>Horaire: {point.time}</p>
                  {!readOnly && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleVotePoint(point.id, 'up')}
                      >
                        👍
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleVotePoint(point.id, 'down')}
                      >
                        👎
                      </Button>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Demandes de points */}
          {pointRequests.map((request) => (
            <Marker
              key={request.id}
              position={[request.latitude, request.longitude]}
              icon={request.status === 'pending' ? pendingIcon : requestIcon}
            >
              <Popup>
                <div className="space-y-2">
                  <p>Demandé par: {request.requesterName}</p>
                  {!readOnly && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproveRequest(request.id)}
                      >
                        Approuver
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectRequest(request.id)}
                      >
                        Refuser
                      </Button>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Dialog ajout/modification point */}
      <Dialog 
        open={showPointDialog} 
        onClose={() => setShowPointDialog(false)}
      >
        <Dialog.Title>
          {selectedPoint ? 'Modifier le point' : 'Ajouter un point'}
        </Dialog.Title>
        <div className="space-y-4">
          <div>
            <label>Heure prévue</label>
            <TimePicker
              value={selectedPoint?.time}
              onChange={(time) => 
                setSelectedPoint(current => ({
                  ...current,
                  time
                }))
              }
            />
          </div>
          <div>
            <label>Note</label>
            <Input
              value={selectedPoint?.note}
              onChange={(e) => 
                setSelectedPoint(current => ({
                  ...current,
                  note: e.target.value
                }))
              }
              placeholder="Ex: Parking de l'école"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowPointDialog(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={() => handlePointSave(selectedPoint)}
              disabled={loading}
            >
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default MeetingPointsManager;