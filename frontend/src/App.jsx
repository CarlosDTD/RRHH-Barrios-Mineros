import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PersonalPage from './pages/PersonalPage';

const Dashboard = () => <div className="p-6"><h1>Dashboard - Hospital Barrios Mineros</h1></div>;
const Placeholder = ({ title }) => <div className="p-6"><h1>{title} - Próximamente</h1></div>;

function App() {
  return (
    <Router>
      <div className="flex bg-slate-50 min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/personal" element={<PersonalPage />} />
            <Route path="/asistencias" element={<Placeholder title="Asistencias" />} />
            <Route path="/turnos" element={<Placeholder title="Turnos" />} />
            <Route path="/vacaciones" element={<Placeholder title="Vacaciones" />} />
            <Route path="/permisos" element={<Placeholder title="Permisos" />} />
            <Route path="/certificaciones" element={<Placeholder title="Certificaciones" />} />
            <Route path="/comunicados" element={<Placeholder title="Comunicados/Memorándums" />} />
            <Route path="/reemplazos" element={<Placeholder title="Reemplazos" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
