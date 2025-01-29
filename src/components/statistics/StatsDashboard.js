import React, { useState } from 'react';
import {
  Card,
  Select,
  DateRangePicker,
  Button,
  Tabs,
} from '@/components/ui';
import {
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Download, Filter } from 'lucide-react';
import { statisticsService } from '@/services/StatisticsService';

const StatsDashboard = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedSchool, setSelectedSchool] = useState('all');
  const { globalStats, loading, error } = statisticsService.useStatistics();

  const handleExport = async () => {
    try {
      const report = await statisticsService.generateReport({
        dateRange,
        schoolId: selectedSchool !== 'all' ? selectedSchool : null,
      });
      
      // Créer et télécharger le fichier
      const blob = new Blob([JSON.stringify(report)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'statistiques_cocoschool.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur export:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Erreur de chargement des statistiques
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Filtres */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <Select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="w-48"
          >
            <option value="all">Toutes les écoles</option>
            {/* Options des écoles */}
          </Select>

          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            className="w-72"
          />

          <Button
            variant="outline"
            className="ml-auto"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2">Trajets totaux</h3>
          <p className="text-3xl font-bold">
            {globalStats?.totalRides.toLocaleString()}
          </p>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2">Économies CO2</h3>
          <p className="text-3xl font-bold">
            {globalStats?.co2Savings.toLocaleString()} kg
          </p>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2">Taux d'occupation</h3>
          <p className="text-3xl font-bold">
            {globalStats?.occupancyRate.toFixed(1)}%
          </p>
        </Card>
      </div>

      {/* Graphiques */}
      <Card className="p-4">
        <Tabs>
          <Tabs.Tab label="Tendances d'utilisation">
            <div className="h-96">
              <ResponsiveContainer>
                <LineChart data={globalStats?.usageTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="rides" 
                    name="Trajets"
                    stroke="#4A90E2" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    name="Utilisateurs"
                    stroke="#82ca9d" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Tabs.Tab>

          <Tabs.Tab label="Distribution horaire">
            <div className="h-96">
              <ResponsiveContainer>
                <BarChart data={globalStats?.timeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="rides" 
                    name="Nombre de trajets"
                    fill="#4A90E2" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Tabs.Tab>

          <Tabs.Tab label="Statistiques écoles">
            <div className="h-96">
              <ResponsiveContainer>
                <BarChart data={globalStats?.schoolStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="school" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="students" 
                    name="Étudiants"
                    fill="#4A90E2" 
                  />
                  <Bar 
                    dataKey="rides" 
                    name="Trajets"
                    fill="#82ca9d" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Tabs.Tab>
        </Tabs>
      </Card>
    </div>
  );
};

export default StatsDashboard;