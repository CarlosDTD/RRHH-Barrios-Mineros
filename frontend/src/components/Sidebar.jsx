import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, Calendar, Clock, Plane, FileBadge, 
  MessageSquare, RefreshCw, LayoutDashboard, Cpu,
  FileSpreadsheet 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

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
    { name: 'Reportes', icon: <FileSpreadsheet size={20} />, path: '/reportes' },
  ];

  return (
    <div className="w-64 bg-slate-800 text-white min-h-screen p-4 flex flex-col">
      <div className="text-xl font-bold mb-8 px-2 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-md"></div>
        Barrios Mineros
      </div>
      <nav className="flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg mb-1 transition-colors ${
              location.pathname === item.path 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-4 border-t border-slate-700 text-xs text-slate-400">
        v1.0.0 - Hospital Barrios Mineros
      </div>
    </div>
  );
};

export default Sidebar;
