import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PersonalPage from './pages/PersonalPage';
import AsistenciasPage from './pages/AsistenciasPage';
import BiometricoPage from './pages/BiometricoPage';
import Dashboard from './pages/Dashboard';
import ReportesPage from './pages/ReportesPage';

const Placeholder = ({ title }) => (
  <div className="p-8 bg-slate-50 min-h-screen">
    <div className="mb-8">
      <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{title}</h1>
      <p className="text-slate-500 mt-1">Este módulo se encuentra en desarrollo</p>
    </div>
    <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
      <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M9 20V10M6 20V4M15 20V8M18 20V12"/></svg>
      </div>
      <h2 className="text-xl font-bold text-slate-700">Módulo Próximamente</h2>
      <p className="text-slate-400 mt-2 max-w-md mx-auto">Estamos trabajando para integrar esta funcionalidad con los datos reales del hospital.</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="flex bg-slate-50 h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto h-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/personal" element={<PersonalPage />} />
            <Route path="/asistencias" element={<AsistenciasPage />} />
            <Route path="/biometrico" element={<BiometricoPage />} />
            <Route path="/turnos" element={<Placeholder title="Turnos" />} />
            <Route path="/vacaciones" element={<Placeholder title="Vacaciones" />} />
            <Route path="/permisos" element={<Placeholder title="Permisos" />} />
            <Route path="/certificaciones" element={<Placeholder title="Certificaciones" />} />
            <Route path="/comunicados" element={<Placeholder title="Comunicados/Memorándums" />} />
            <Route path="/reemplazos" element={<Placeholder title="Reemplazos" />} />
            <Route path="/reportes" element={<ReportesPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
