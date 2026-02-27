import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth';
import Landing from './pages/Landing';
import Dashboard from './pages/pharmacist/Dashboard';
import PredictionPage from './pages/pharmacist/Prediction';
import AlertsPage from './pages/pharmacist/AlertsPage';
import AnalyticsPage from './pages/pharmacist/AnalyticsPage';
import ReportsPage from './pages/pharmacist/ReportsPage';
import SettingsPage from './pages/pharmacist/SettingsPage';
// Notice the curly braces for named exports from DashboardPages
import DashboardHome from './pages/pharmacist/DashboardHome';
import CustomerDashboard from './pages/Customer/Dashboard';
import MedicationDetails from './pages/Customer/MedicationDetails';
import MedicationSearch from './pages/Customer/MedicationSearch';
import PersonalAlerts from './pages/Customer/PersonalAlerts';
import RegionalAvailability from './pages/Customer/RegionalAvailability';
import ShortagePredictions from './pages/Customer/ShortagePrediction';
import ScrollToTop from './utility/ScrollToTop';

// Interfaces
interface HistoricalDataPoint {
  day: number;
  stock: number;
  usage: number;
  demand: number;
}

interface Medication {
  id: number;
  name: string;
  currentStock: number;
  minThreshold: number;
  maxThreshold: number;
  avgDailyUsage: number;
  category: string;
  historicalData: HistoricalDataPoint[];
  riskLevel: string;
}

export default function App() {
  const [medications] = useState<Medication[]>([]); 

  const getStockStatus = (med: Medication) => {
    const ratio = med.currentStock / med.maxThreshold;
    if (ratio < 0.2) return { status: 'Critical', color: 'from-red-600 to-red-400' };
    if (ratio < 0.5) return { status: 'Low', color: 'from-orange-500 to-yellow-400' };
    return { status: 'Healthy', color: 'from-blue-600 to-cyan-400' };
  };

  const predictShortage = (med: Medication) => ({
    prediction: med.currentStock < med.minThreshold ? 'HIGH RISK' : 'LOW RISK',
    daysToThreshold: Math.floor(med.currentStock / (med.avgDailyUsage || 1)),
    confidence: 85
  });

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Pharmacist Protected Routes - Wrapped in Dashboard Layout */}
        <Route path="pharmacist/dashboard" element={<Dashboard />}>
           {/* This is the default page when you go to /dashboard */}
          <Route index element={<DashboardHome />} />
          
          <Route path="predictions" element={
            <PredictionPage 
              medications={medications}
              predictShortage={predictShortage}
              getStockStatus={getStockStatus}
            />
          } />
          
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />

        </Route>

        {/* Customer Routes */}
          <Route path="customer/dashboard" element={<CustomerDashboard />} />
          <Route path="customer/medication/:id" element={<MedicationDetails />} />
          <Route path="customer/medication-search" element={<MedicationSearch userLocation="Central" onSelectMedication={(med) => window.location.hash = `/dashboard/medication/${med.id}`}  />} />
          <Route path="customer/personal-alerts" element={<PersonalAlerts />} />
          <Route path="customer/regional-availability" element={<RegionalAvailability userLocation="Central" />} />
          <Route path="customer/shortage-predictions" element={<ShortagePredictions userLocation="Central" />} />


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}