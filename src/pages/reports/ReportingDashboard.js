import React, { useState } from 'react';
import {
  Card,
  Button,
  Select,
  DateRangePicker,
  Tabs,
  Table,
  Alert,
} from '@/components/ui';
import { reportingService } from '@/services/ReportingService';
import {
  Download,
  Calendar,
  FileText,
  BarChart,
  School,
  Users,
} from 'lucide-react';

const ReportingDashboard = () => {
  const [reportType, setReportType] = useState('general');
  const [dateRange, setDateRange] = useState([null, null]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [exportFormat, setExportFormat] = useState('xlsx');

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const report = await reportingService.generateReport({
        type: reportType,
        dateRange,
        schoolId: selectedSchool !== 'all' ? selectedSchool : null,
      });

      // Gérer le rapport généré
      console.log('Rapport généré:', report);
    } catch (err) {
      setError('Erreur lors de la génération du rapport');
      console.error('Erreur rapport:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await reportingService.exportData(exportFormat, {
        type: reportType,
        dateRange,
        schoolId: selectedSchool !== 'all' ? selectedSchool : null,
      });
    } catch (error) {
      console.error('Erreur export:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Rapports et Analyses</h1>

        {/* Filtres */}
        <Card className="mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2">Type de rapport</label>
              <Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="general">Rapport général</option>
                <option value="school">Rapport par école</option>
                <option value="user">Rapport par utilisateur</option>
                <option value="financial">Rapport financier</option>
                <option value="environmental">Impact environnemental</option>
              </Select>
            </div>

            <div>
              <label className="block mb-2">Période</label>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-2">École</label>
              <Select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
              >
                <option value="all">Toutes les écoles</option>
                {/* Options des écoles */}
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <Select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="w-32"
            >
              <option value="xlsx">Excel</option>
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
            </Select>

            <Button
              variant="outline"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>

            <Button
              onClick={handleGenerateReport}
              disabled={loading}
            >
              {loading ? 'Génération...' : 'Générer le rapport'}
            </Button>
          </div>
        </Card>

        {error && (
          <Alert severity="error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Rapports récents */}
        <Card className="mb-6">
          <Tabs>
            <Tabs.Tab
              label={
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Rapports récents
                </div>
              }
            >
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Date</Table.Head>
                    <Table.Head>Type</Table.Head>
                    <Table.Head>Période</Table.Head>
                    <Table.Head>Actions</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {/* Liste des rapports récents */}
                </Table.Body>
              </Table>
            </Tabs.Tab>

            <Tabs.Tab
              label={
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Rapports planifiés
                </div>
              }
            >
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Nom</Table.Head>
                    <Table.Head>Fréquence</Table.Head>
                    <Table.Head>Dernier envoi</Table.Head>
                    <Table.Head>Actions</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {/* Liste des rapports planifiés */}
                </Table.Body>
              </Table>
            </Tabs.Tab>
          </Tabs>
        </Card>

        {/* Visualisations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Tendances</h3>
            <div className="h-80">
              {/* Graphique des tendances */}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Statistiques clés</h3>
            <div className="space-y-4">
              {/* Statistiques importantes */}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportingDashboard;