// src/pages/CustomerDashboard.tsx
/**
 * Customer Dashboard
 * Features:
 * - Medication availability tracking
 * - Region-based predictions
 * - Shortage prediction model
 * - Regional availability heatmap
 * - Medication search & details
 * - Personalized alerts
 */


// import { useState } from 'react';
// import {
//   Search,
//   MapPin,
//   AlertTriangle,
//   CheckCircle,
//   TrendingDown,
//   Pill,
//   Menu,
//   X,
//   Bell,
//   ChevronDown,
// } from 'lucide-react';
// import CustomerMedicationSearch from './MedicationSearch';
// import RegionalAvailability from './RegionalAvailability';
// import ShortagePredictions from './ShortagePrediction';
// import PersonalAlerts from './PersonalAlerts';
// import MedicationDetails from './MedicationDetails';

// type PageType = 'search' | 'availability' | 'predictions' | 'alerts' | 'details';

// interface Medication {
//   id: number;
//   name: string;
//   dosage: string;
//   format: string;
//   price: number;
//   availability: 'available' | 'low' | 'out';
//   nearbyPharmacies: number;
//   distance: string;
//   stock: number;
//   rating: number;
//   region: string;
//   description: string;
// }

// export default function CustomerDashboard() {
//   const [currentPage, setCurrentPage] = useState<PageType>('search');
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [userMenuOpen, setUserMenuOpen] = useState(false);
//   const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
//   const [userLocation] = useState('All Regions');

//   const navItems = [
//     { id: 'search', label: 'Find Medicine', icon: <Search className="w-5 h-5" /> },
//     { id: 'availability', label: 'Availability', icon: <MapPin className="w-5 h-5" /> },
//     { id: 'predictions', label: 'Predictions', icon: <TrendingDown className="w-5 h-5" /> },
//     { id: 'alerts', label: 'My Alerts', icon: <Bell className="w-5 h-5" /> },
//   ];

//   const renderPage = () => {
//     switch (currentPage) {
//       case 'search':
//         return (
//           <CustomerMedicationSearch
//             userLocation={userLocation}
//             onSelectMedication={(med) => {
//               setSelectedMedication(med);
//               setCurrentPage('details');
//             }}
//           />
//         );
//       case 'availability':
//         return <RegionalAvailability userLocation={userLocation} />;
//       case 'predictions':
//         return <ShortagePredictions userLocation={userLocation} />;
//       case 'alerts':
//         return <PersonalAlerts />;
//       case 'details':
//         return selectedMedication && <MedicationDetails />;
//       default:
//         return <CustomerMedicationSearch userLocation={userLocation} onSelectMedication={setSelectedMedication} />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-950 text-white flex flex-col">
//       {/* Visual Background Orbs */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />
//         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-600/5 rounded-full blur-3xl" />
//       </div>

//       <div className="relative z-10 flex-1 flex flex-col">
//         {/* ========== TOP NAVBAR ========== */}
//         <nav className="sticky top-0 z-40 border-b border-slate-800/50 backdrop-blur-xl bg-slate-950/80">
//           <div className="max-w-7xl mx-auto px-6 py-4">
//             <div className="flex items-center justify-between">
//               {/* Logo */}
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-linear-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center">
//                   <Pill className="w-6 h-6 text-slate-950" />
//                 </div>
//                 <div>
//                   <h1 className="text-lg font-black bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
//                     MediAlert
//                   </h1>
//                   <p className="text-xs text-slate-500 uppercase tracking-tighter font-bold">Patient Portal</p>
//                 </div>
//               </div>

//               {/* Desktop Nav */}
//               <div className="hidden md:flex items-center gap-6">
//                 {navItems.map((item) => (
//                   <button
//                     key={item.id}
//                     onClick={() => setCurrentPage(item.id as PageType)}
//                     className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
//                       currentPage === item.id
//                         ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
//                         : 'text-slate-400 hover:text-emerald-400'
//                     }`}
//                   >
//                     {item.icon}
//                     <span className="text-sm font-bold">{item.label}</span>
//                   </button>
//                 ))}
//               </div>

//               {/* Right Side Actions */}
//               <div className="flex items-center gap-4">
//                 <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700/50 hover:border-emerald-500/50 transition">
//                   <MapPin className="w-4 h-4 text-emerald-400" />
//                   <span className="text-sm text-slate-300 font-medium">{userLocation}</span>
//                 </button>

//                 {/* User Menu */}
//                 <div className="relative">
//                   <button
//                     onClick={() => setUserMenuOpen(!userMenuOpen)}
//                     className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-800/50 transition"
//                   >
//                     <div className="w-8 h-8 bg-linear-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center text-sm font-bold text-slate-950">
//                       JD
//                     </div>
//                     <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
//                   </button>

//                   {userMenuOpen && (
//                     <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 animate-fadeIn">
//                       <div className="px-4 py-3 border-b border-slate-800">
//                         <p className="text-sm font-bold">John Doe</p>
//                         <p className="text-xs text-slate-500">john@example.com</p>
//                       </div>
//                       <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-800 text-slate-300 transition">Profile Settings</button>
//                       <button className="w-full text-left px-4 py-2 text-sm hover:bg-red-500/10 text-red-400 transition">Sign Out</button>
//                     </div>
//                   )}
//                 </div>

//                 {/* Mobile Menu Toggle */}
//                 <button
//                   onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                   className="md:hidden p-2 text-slate-400"
//                 >
//                   {mobileMenuOpen ? <X /> : <Menu />}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </nav>

//         {/* ========== MAIN CONTENT ========== */}
//         <main className="max-w-7xl mx-auto w-full px-6 py-8">
          
//           {/* Unified Stats Banner (Pharmacist-Style Colors) */}
//           <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
//             {/* Available - Emerald */}
//             <div className="p-6 bg-linear-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-2xl group hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-default">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-widest">Available Today</p>
//                   <p className="text-3xl font-black text-white">2,847</p>
//                   <p className="text-xs text-emerald-400/70 mt-2 font-medium">In your region</p>
//                 </div>
//                 <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 group-hover:scale-110 transition-transform">
//                   <CheckCircle className="w-6 h-6 text-emerald-400" />
//                 </div>
//               </div>
//             </div>

//             {/* Tracking - Amber */}
//             <div className="p-6 bg-linear-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 rounded-2xl group hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 cursor-default">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-widest">On Watch</p>
//                   <p className="text-3xl font-black text-white">5</p>
//                   <p className="text-xs text-amber-400/70 mt-2 font-medium">Active trackers</p>
//                 </div>
//                 <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/50 group-hover:scale-110 transition-transform">
//                   <AlertTriangle className="w-6 h-6 text-amber-400" />
//                 </div>
//               </div>
//             </div>

//             {/* Risk - Red */}
//             <div className="p-6 bg-linear-to-br from-red-500/20 to-red-600/10 border border-red-500/30 rounded-2xl group hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 cursor-default">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-widest">Shortage Risk</p>
//                   <p className="text-3xl font-black text-white">12</p>
//                   <p className="text-xs text-red-400/70 mt-2 font-medium">Predicted supply gaps</p>
//                 </div>
//                 <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 group-hover:scale-110 transition-transform">
//                   <TrendingDown className="w-6 h-6 text-red-400" />
//                 </div>
//               </div>
//             </div>

//             {/* Alerts - Blue */}
//             <div className="p-6 bg-linear-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-2xl group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-default">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-widest">Active Alerts</p>
//                   <p className="text-3xl font-black text-white">3</p>
//                   <p className="text-xs text-blue-400/70 mt-2 font-medium">Unread notifications</p>
//                 </div>
//                 <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/50 group-hover:scale-110 transition-transform">
//                   <Bell className="w-6 h-6 text-blue-400" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Page Content Rendering */}
//           <div className="animate-fadeIn">
//             {renderPage()}
//           </div>
//         </main>
//       </div>

//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(8px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.4s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   );
// }







import { useState, type ReactNode } from 'react'; // Added ReactNode for the icon type
import { 
  Bell, 
  MapPin, 
  ChevronDown, 
  CheckCircle, 
  AlertTriangle, 
  TrendingDown,
  Menu
} from 'lucide-react';

// 1. FIX: Use 'import type' for the CustomerPageType to satisfy verbatimModuleSyntax
import type { CustomerPageType } from '../../components/dashboard/CustomerSidebar'; 
import CustomerSidebar from '../../components/dashboard/CustomerSidebar';

import CustomerMedicationSearch from './MedicationSearch';
import RegionalAvailability from './RegionalAvailability';
import ShortagePredictions from './ShortagePrediction';
import PersonalAlerts from './PersonalAlerts';

// 2. FIX: Define a proper interface for the StatCard props to remove 'any'
interface StatCardProps {
  label: string;
  val: string;
  sub: string;
  icon: ReactNode;
  color: 'emerald' | 'amber' | 'red' | 'blue';
}

const StatCard = ({ label, val, sub, icon, color }: StatCardProps) => {
  // 3. FIX: Define the record type for the color map to remove 'any'
  const colorMap: Record<string, string> = {
    emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400",
    amber: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400",
    red: "from-red-500/20 to-red-600/10 border-red-500/30 text-red-400",
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
  };
  
  return (
    <div className={`p-6 bg-linear-to-br border rounded-2xl group hover:shadow-xl transition-all duration-300 ${colorMap[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">{label}</p>
          <p className="text-3xl font-black text-white">{val}</p>
          <p className="text-xs mt-2 font-medium opacity-70">{sub}</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default function CustomerDashboard() {
  const [currentPage, setCurrentPage] = useState<CustomerPageType>('search');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userLocation] = useState('All Regions');

  const renderPage = () => {
    switch (currentPage) {
      case 'search':
        return <CustomerMedicationSearch userLocation={userLocation} onSelectMedication={() => {}} />;
      case 'availability':
        return <RegionalAvailability userLocation={userLocation} />;
      case 'predictions':
        return <ShortagePredictions userLocation={userLocation} />;
      case 'alerts':
        return <PersonalAlerts />;
      default:
        return <CustomerMedicationSearch userLocation={userLocation} onSelectMedication={() => {}} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden no-scrollbar">
      <CustomerSidebar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-linear-to-r from-slate-900/95 to-slate-800/95 border-b border-slate-700/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition lg:hidden"
            >
              <Menu className="w-6 h-6 text-slate-400" />
            </button>
            <h1 className="text-xl font-bold">MediAlert</h1>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700/50 hover:border-emerald-500/50 transition">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-slate-300 font-medium">{userLocation}</span>
            </button>

            <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-slate-800/50 transition cursor-pointer group">
              <div className="w-8 h-8 bg-linear-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center font-bold text-slate-950 text-sm">
                JD
              </div>
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold leading-tight text-white">John Doe</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Patient</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto py-8 overflow-auto no-scrollbar px-6">
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              label="Available Today" 
              val="2,847" 
              sub="In your region" 
              icon={<CheckCircle className="w-6 h-6" />} 
              color="emerald" 
            />
            <StatCard 
              label="On Watch" 
              val="5" 
              sub="Active trackers" 
              icon={<AlertTriangle className="w-6 h-6" />} 
              color="amber" 
            />
            <StatCard 
              label="Shortage Risk" 
              val="12" 
              sub="Predicted gaps" 
              icon={<TrendingDown className="w-6 h-6" />} 
              color="red" 
            />
            <StatCard 
              label="Active Alerts" 
              val="3" 
              sub="Unread notifications" 
              icon={<Bell className="w-6 h-6" />} 
              color="blue" 
            />
          </div>

          <div className="animate-fadeIn">
            {renderPage()}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}