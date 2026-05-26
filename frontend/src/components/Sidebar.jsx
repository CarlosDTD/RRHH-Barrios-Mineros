import { Link, useLocation } from 'react-router-dom';
import { 
  Users, Calendar, Clock, Plane, FileBadge, 
  MessageSquare, RefreshCw, LayoutDashboard, Cpu,
  FileSpreadsheet, FileText, Inbox, Settings, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { usuario, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Gestión de Personal', icon: <Users size={20} />, path: '/personal' },
    { name: 'Asistencias', icon: <Clock size={20} />, path: '/asistencias' },
    { name: 'Biométrico', icon: <Cpu size={20} />, path: '/biometrico' },
    { name: 'Turnos', icon: <Calendar size={20} />, path: '/turnos' },
    { name: 'Vacaciones', icon: <Plane size={20} />, path: '/vacaciones' },
    { name: 'Permisos', icon: <FileBadge size={20} />, path: '/permisos' },
    { name: 'Certificaciones', icon: <FileBadge size={20} />, path: '/certificaciones' },
    { name: 'Comunicados/Memo', icon: <MessageSquare size={20} />, path: '/comunicados' },
    { name: 'Reemplazos', icon: <RefreshCw size={20} />, path: '/reemplazos' },
  ];

  const correspondenciaItems = [
    { name: 'Correspondencia', icon: <FileText size={20} />, path: '/correspondencia' },
    { name: 'Bandeja Entrada', icon: <Inbox size={20} />, path: '/correspondencia/bandeja' },
  ];

  const adminItems = [
    { name: 'Configuración', icon: <Settings size={20} />, path: '/admin/config' },
  ];

  const isActive = (path) => location.pathname === path;
  const linkClass = (path) => 
    `flex items-center gap-3 p-3 rounded-lg mb-1 transition-colors ${
      isActive(path) ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
    }`;

  return (
    <div className="w-64 bg-slate-800 text-white min-h-screen p-4 flex flex-col">
      <div className="text-xl font-bold mb-8 px-2 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-md"></div>
        Barrios Mineros
      </div>

      <div className="mb-4 px-3 py-2 bg-slate-700/50 rounded-lg">
        <p className="text-sm font-medium truncate">{usuario?.nombre_completo || usuario?.username}</p>
        <p className="text-xs text-slate-400 truncate">{usuario?.cargo || usuario?.roles?.join(', ')}</p>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-500 uppercase px-3 mb-2 tracking-wider">General</p>
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path} className={linkClass(item.path)}>
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
        <Link to="/reportes" className={linkClass('/reportes')}>
          <FileSpreadsheet size={20} />
          <span>Reportes</span>
        </Link>

        <p className="text-xs font-semibold text-slate-500 uppercase px-3 mt-4 mb-2 tracking-wider">Correspondencia</p>
        {correspondenciaItems.map((item) => (
          <Link key={item.path} to={item.path} className={linkClass(item.path)}>
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}

        {usuario?.roles?.includes('ADMIN') && (
          <>
            <p className="text-xs font-semibold text-slate-500 uppercase px-3 mt-4 mb-2 tracking-wider">Administración</p>
            {adminItems.map((item) => (
              <Link key={item.path} to={item.path} className={linkClass(item.path)}>
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </>
        )}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-700">
        <button onClick={logout} className="flex items-center gap-3 p-3 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white w-full transition-colors">
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
