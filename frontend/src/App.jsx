import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import PersonalPage from './pages/PersonalPage';
import AsistenciasPage from './pages/AsistenciasPage';
import BiometricoPage from './pages/BiometricoPage';
import Dashboard from './pages/Dashboard';
import ReportesPage from './pages/ReportesPage';
import LoginPage from './pages/LoginPage';
import CorrespondenciaPage from './pages/CorrespondenciaPage';
import CorrespondenciaForm from './pages/CorrespondenciaForm';
import CorrespondenciaDetail from './pages/CorrespondenciaDetail';
import BandejaPage from './pages/BandejaPage';
import ConfiguracionPage from './pages/ConfiguracionPage';

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

function CambiarPasswordPage() {
  const { usuario, cambiarPassword } = useAuth();
  const navigate = useNavigate();
  const [actual, setActual] = useState('');
  const [nuevo, setNuevo] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (usuario?.password_cambiado) navigate('/');
  }, [usuario, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await cambiarPassword(actual, nuevo);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Cambiar Contraseña</h2>
        <p className="text-sm text-amber-600 mb-4">Debes cambiar tu contraseña antes de continuar</p>
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
        <div className="space-y-4">
          <input type="password" value={actual} onChange={e => setActual(e.target.value)} placeholder="Contraseña actual" required className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="password" value={nuevo} onChange={e => setNuevo(e.target.value)} placeholder="Nueva contraseña (mín. 6 caracteres)" required minLength={6} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700">Cambiar Contraseña</button>
        </div>
      </form>
    </div>
  );
}

function AppContent() {
  const { usuario, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-slate-50"><div className="text-slate-500 text-lg">Cargando...</div></div>;
  }

  if (!usuario) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  if (!usuario.password_cambiado) {
    return (
      <Routes>
        <Route path="*" element={<CambiarPasswordPage />} />
      </Routes>
    );
  }

  return (
    <div className="flex bg-slate-50 h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto h-full">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
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
          <Route path="/reportes" element={<ProtectedRoute roles={['ADMIN', 'SECRETARIO', 'DIRECTOR', 'JEFE_RRHH', 'AUXILIAR']}><ReportesPage /></ProtectedRoute>} />
          <Route path="/correspondencia" element={<ProtectedRoute roles={['ADMIN', 'SECRETARIO', 'DIRECTOR', 'JEFE_RRHH', 'AUXILIAR']}><CorrespondenciaPage /></ProtectedRoute>} />
          <Route path="/correspondencia/nueva" element={<ProtectedRoute roles={['ADMIN', 'SECRETARIO']}><CorrespondenciaForm /></ProtectedRoute>} />
          <Route path="/correspondencia/:id" element={<ProtectedRoute roles={['ADMIN', 'SECRETARIO', 'DIRECTOR', 'JEFE_RRHH', 'AUXILIAR']}><CorrespondenciaDetail /></ProtectedRoute>} />
          <Route path="/correspondencia/bandeja" element={<ProtectedRoute roles={['ADMIN', 'SECRETARIO', 'DIRECTOR', 'JEFE_RRHH', 'AUXILIAR']}><BandejaPage /></ProtectedRoute>} />
          <Route path="/admin/config" element={<ProtectedRoute roles={['ADMIN']}><ConfiguracionPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
