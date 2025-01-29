import React, { useState } from 'react';
import {
  Card,
  Button,
  Input,
  Dialog,
  Alert,
  Table,
} from '@/components/ui';
import { Pencil, Trash, Plus, MapPin } from 'lucide-react';
import { adminConfigService } from '@/services/AdminConfigService';

const SchoolManagement = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    contactEmail: '',
    contactPhone: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedSchool) {
        // Mettre à jour une école existante
        await adminConfigService.updateSchool(selectedSchool.id, formData);
      } else {
        // Ajouter une nouvelle école
        await adminConfigService.addSchool(formData);
      }
      setShowAddDialog(false);
      setSelectedSchool(null);
      setFormData({
        name: '',
        address: '',
        city: '',
        postalCode: '',
        contactEmail: '',
        contactPhone: '',
      });
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleEdit = (school) => {
    setSelectedSchool(school);
    setFormData({
      name: school.name,
      address: school.address,
      city: school.city,
      postalCode: school.postalCode,
      contactEmail: school.contactEmail,
      contactPhone: school.contactPhone,
    });
    setShowAddDialog(true);
  };

  const handleDelete = async (schoolId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette école ?')) {
      try {
        await adminConfigService.deleteSchool(schoolId);
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des écoles</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une école
        </Button>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Nom</Table.Head>
              <Table.Head>Adresse</Table.Head>
              <Table.Head>Contact</Table.Head>
              <Table.Head>Utilisateurs</Table.Head>
              <Table.Head>Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {/* Liste des écoles */}
            <Table.Row>
              <Table.Cell>École Example</Table.Cell>
              <Table.Cell>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  123 Rue Example, Ville
                </div>
              </Table.Cell>
              <Table.Cell>
                <div>contact@example.com</div>
                <div className="text-sm text-gray-500">+32 123 456 789</div>
              </Table.Cell>
              <Table.Cell>
                <div>150 étudiants</div>
                <div>12 professeurs</div>
              </Table.Cell>
              <Table.Cell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit({
                      id: '1',
                      name: 'École Example',
                      address: '123 Rue Example',
                      city: 'Ville',
                      postalCode: '1000',
                      contactEmail: 'contact@example.com',
                      contactPhone: '+32 123 456 789',
                    })}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete('1')}
                  >
                    <Trash className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Card>

      <Dialog
        open={showAddDialog}
        onClose={() => {
          setShowAddDialog(false);
          setSelectedSchool(null);
          setFormData({
            name: '',
            address: '',
            city: '',
            postalCode: '',
            contactEmail: '',
            contactPhone: '',
          });
        }}
      >
        <Dialog.Title>
          {selectedSchool ? 'Modifier une école' : 'Ajouter une école'}
        </Dialog.Title>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Nom de l'école</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block mb-2">Adresse</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Ville</label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block mb-2">Code postal</label>
              <Input
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">Email de contact</label>
            <Input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block mb-2">Téléphone de contact</label>
            <Input
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddDialog(false)}
            >
              Annuler
            </Button>
            <Button type="submit">
              {selectedSchool ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default SchoolManagement;