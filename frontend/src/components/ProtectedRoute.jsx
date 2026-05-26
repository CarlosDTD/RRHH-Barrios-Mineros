import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { usuario, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-slate-500 text-lg">Cargando...</div>
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.some(r => usuario.roles?.includes(r))) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">Acceso Denegado</h2>
        <p className="text-slate-500 mt-2">No tienes permisos para ver esta página</p>
      </div>
    );
  }

  return children;
}
