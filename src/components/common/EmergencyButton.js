import React, { useState, useRef, useEffect } from 'react';
import { Alert, Button, Dialog } from '@/components/ui';
import { Phone, AlertTriangle } from 'lucide-react';

const EmergencyButton = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [timer, setTimer] = useState(null);
  const pressTimeout = useRef(null);

  const handleEmergency = async () => {
    try {
      // Envoyer signal d'urgence
      await fetch('/api/emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date(),
          location: await getCurrentLocation(),
          type: 'sos',
        }),
      });

      // Appeler les services d'urgence
      window.location.href = 'tel:112';
      
      // Notifier les contacts d'urgence
      notifyEmergencyContacts();
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi du signal d\'urgence:', error);
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Géolocalisation non disponible');
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const notifyEmergencyContacts = async () => {
    // Logique de notification des contacts d'urgence
  };

  const handlePressStart = () => {
    setIsPressed(true);
    pressTimeout.current = setTimeout(() => {
      setShowDialog(true);
    }, 2000); // 2 secondes de pression pour activer
  };

  const handlePressEnd = () => {
    setIsPressed(false);
    if (pressTimeout.current) {
      clearTimeout(pressTimeout.current);
    }
  };

  const handleConfirm = () => {
    handleEmergency();
    setShowDialog(false);
  };

  return (
    <>
      <Button
        className={`
          fixed bottom-4 right-4 w-16 h-16 rounded-full 
          ${isPressed ? 'bg-red-700' : 'bg-red-500'} 
          transition-all duration-200 
          hover:bg-red-600 
          focus:outline-none 
          focus:ring-4 
          focus:ring-red-300
          shadow-lg
        `}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      >
        <Phone className="w-8 h-8 text-white" />
      </Button>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <Dialog.Title>
          <AlertTriangle className="w-6 h-6 text-red-500 inline-block mr-2" />
          Confirmation d'Urgence
        </Dialog.Title>
        <Dialog.Description>
          Êtes-vous sûr de vouloir déclencher l'alerte d'urgence ? 
          Cela va :
          - Contacter les services d'urgence (112)
          - Envoyer votre position GPS
          - Notifier vos contacts d'urgence
        </Dialog.Description>
        <div className="flex justify-end space-x-4 mt-4">
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Confirmer l'urgence
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default EmergencyButton;