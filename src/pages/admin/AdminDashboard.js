import React, { useState } from 'react';
import {
  Card,
  Tabs,
  Button,
  Input,
  Switch,
  Select,
  Alert,
  Dialog,
} from '@/components/ui';
import { adminConfigService } from '@/services/AdminConfigService';
import {
  Settings,
  Users,
  School,
  Bell,
  Shield,
  Tool,
} from 'lucide-react';

const AdminDashboard = () => {
  const {
    config,
    loading,
    error,
    updateConfig,
    updateUserRole,
    addSchool,
    moderateContent,
    sendSystemNotification,
    setMaintenanceMode,
  } = adminConfigService.useAdminConfig();

  const [activeTab, setActiveTab] = useState('settings');
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [maintenanceMode, setMaintenanceModeState] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');

  // Gérer le mode maintenance
  const handleMaintenanceToggle = async () => {
    try {
      await setMaintenanceMode(!maintenanceMode, maintenanceMessage);
      setMaintenanceModeState(!maintenanceMode);
    } catch (error) {
      console.error('Erreur changement mode maintenance:', error);
    }
  };

  const maintenanceSection = (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Mode Maintenance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Activer le mode maintenance</label>
              <p className="text-sm text-gray-500">
                L'application sera inaccessible sauf pour les administrateurs
              </p>
            </div>
            <Switch
              checked={maintenanceMode}
              onChange={handleMaintenanceToggle}
            />
          </div>
          
          <div>
            <label className="block mb-2">Message de maintenance</label>
            <Input
              value={maintenanceMessage}
              onChange={(e) => setMaintenanceMessage(e.target.value)}
              placeholder="Ex: Maintenance en cours, retour à 14h..."
            />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Sauvegarde des données</h3>
        <div className="space-y-4">
          <Button variant="outline" className="w-full">
            Télécharger la sauvegarde
          </Button>
        </div>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Administration</h1>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.Tab value="settings" label={
            <div className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Configuration
            </div>
          }>
            <div className="space-y-6">
              <Card className="p-4">
                <h2 className="text-xl font-bold mb-4">Paramètres généraux</h2>
                {/* Configuration générale ici */}
              </Card>
            </div>
          </Tabs.Tab>

          <Tabs.Tab value="maintenance" label={
            <div className="flex items-center">
              <Tool className="w-4 h-4 mr-2" />
              Maintenance
            </div>
          }>
            {maintenanceSection}
          </Tabs.Tab>

          <Tabs.Tab value="moderation" label={
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Modération
            </div>
          }>
            <div className="space-y-6">
              {/* Contenu modération */}
            </div>
          </Tabs.Tab>
        </Tabs>
      </div>

      {/* Dialog de notification */}
      <Dialog 
        open={showNotificationDialog}
        onClose={() => setShowNotificationDialog(false)}
      >
        <Dialog.Title>Envoyer une notification</Dialog.Title>
        <div className="space-y-4">
          {/* Formulaire de notification */}
        </div>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;