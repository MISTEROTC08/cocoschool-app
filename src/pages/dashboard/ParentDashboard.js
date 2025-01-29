import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {
  Card,
  Button,
  Alert,
  Calendar,
  Tabs,
} from '@/components/ui';
import ChildList from '@/components/dashboard/ChildList';
import RideSchedule from '@/components/dashboard/RideSchedule';
import EmergencyButton from '@/components/common/EmergencyButton';

const ParentDashboard = () => {
  const [activeChild, setActiveChild] = useState(null);
  const [childrenLocations, setChildrenLocations] = useState({});
  const [upcomingRides, setUpcomingRides] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Simulation de données en temps réel
  useEffect(() => {
    // En production, ceci serait connecté à Firebase/WebSocket
    const interval = setInterval(() => {
      updateChildrenLocations();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const updateChildrenLocations = async () => {
    // Appel API pour mettre à jour les positions
    try {
      const response = await fetch('/api/children/locations');
      const data = await response.json();
      setChildrenLocations(data);
    } catch (error) {
      console.error('Erreur de mise à jour des positions:', error);
    }
  };

  const handleEmergency = () => {
    // Logique d'urgence
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Tableau de Bord Parent</h1>
        <EmergencyButton onClick={handleEmergency} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Carte de suivi */}
        <Card className="p-4">
          <h2 className="text-xl mb-4">Localisation en Direct</h2>
          <div className="h-96">
            <MapContainer center={[50.8503, 4.3517]} zoom={13}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {Object.entries(childrenLocations).map(([childId, location]) => (
                <Marker key={childId} position={[location.lat, location.lng]}>
                  <Popup>{location.childName}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </Card>

        {/* Liste des enfants et trajets */}
        <Card className="p-4">
          <Tabs>
            <Tabs.Tab label="Mes Enfants">
              <ChildList
                onChildSelect={setActiveChild}
                activeChild={activeChild}
              />
            </Tabs.Tab>
            <Tabs.Tab label="Trajets">
              <RideSchedule rides={upcomingRides} />
            </Tabs.Tab>
          </Tabs>
        </Card>

        {/* Notifications */}
        <Card className="p-4 md:col-span-2">
          <h2 className="text-xl mb-4">Notifications</h2>
          {notifications.map((notif) => (
            <Alert key={notif.id} severity={notif.severity}>
              {notif.message}
            </Alert>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default ParentDashboard;