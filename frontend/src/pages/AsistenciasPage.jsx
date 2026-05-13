import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Trash2, Edit3, ChevronRight, 
  FileSpreadsheet, User, Clock as ClockIcon, Calendar as CalendarIcon,
  ChevronDown, ChevronUp, MoreVertical, Plus
} from 'lucide-react';
import AsistenciaImport from '../components/AsistenciaImport';

const AsistenciasPage = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const [filters, setFilters] = useState({
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear(),
    tipo: '',
    buscar: ''
  });

  const fetchAsistencias = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`http://localhost:3001/api/asistencia?${queryParams}`);
      const data = await response.json();
      setAsistencias(data);
    } catch (error) {
      console.error('Error fetching asistencias:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsistencias();
  }, [filters.mes, filters.anio, filters.tipo]); // Auto-refresh on key filters

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este registro de asistencia?')) return;
    try {
      await fetch(`http://localhost:3001/api/asistencia/${id}`, { method: 'DELETE' });
      fetchAsistencias();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const meses = [
    { id: 1, nombre: 'Enero' }, { id: 2, nombre: 'Febrero' }, { id: 3, nombre: 'Marzo' },
    { id: 4, nombre: 'Abril' }, { id: 5, nombre: 'Mayo' }, { id: 6, nombre: 'Junio' },
    { id: 7, nombre: 'Julio' }, { id: 8, nombre: 'Agosto' }, { id: 9, nombre: 'Septiembre' },
    { id: 10, nombre: 'Octubre' }, { id: 11, nombre: 'Noviembre' }, { id: 12, nombre: 'Diciembre' }
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Gestión de Asistencias</h1>
          <p className="text-slate-500 mt-1">Monitoreo y control de cumplimiento de horarios</p>
        </div>
        <button 
          onClick={() => setShowImport(!showImport)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg ${
            showImport 
            ? 'bg-slate-200 text-slate-700' 
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
          }`}
        >
          {showImport ? 'Volver al Listado' : <><Plus size={20} /> Importar Excel</>}
        </button>
      </div>

      {showImport ? (
        <AsistenciaImport onComplete={() => { setShowImport(false); fetchAsistencias(); }} />
      ) : (
        <div className="space-y-6">
          {/* Filtros */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px] space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Buscar Personal</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Nombre o C.I..."
                  value={filters.buscar}
                  onChange={(e) => setFilters({...filters, buscar: e.target.value})}
                  onKeyDown={(e) => e.key === 'Enter' && fetchAsistencias()}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="w-40 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Mes</label>
              <select 
                value={filters.mes}
                onChange={(e) => setFilters({...filters, mes: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
              >
                {meses.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
              </select>
            </div>

            <div className="w-32 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Año</label>
              <input 
                type="number"
                value={filters.anio}
                onChange={(e) => setFilters({...filters, anio: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="w-44 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Tipo Planilla</label>
              <select 
                value={filters.tipo}
                onChange={(e) => setFilters({...filters, tipo: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="">Todos</option>
                <option value="MINISTERIAL">Ministerial</option>
                <option value="RESIDENTE">Residente</option>
              </select>
            </div>

            <button 
              onClick={fetchAsistencias}
              className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-colors"
            >
              <Filter size={24} />
            </button>
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Personal</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Planilla</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Horas Mes</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Atrasos (min)</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Observaciones</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                        <span className="text-slate-400 font-medium">Cargando registros...</span>
                      </div>
                    </td>
                  </tr>
                ) : asistencias.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-slate-50 text-slate-300 rounded-full">
                          <FileSpreadsheet size={48} />
                        </div>
                        <p className="text-slate-400 font-medium">No se encontraron registros para este período.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  asistencias.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                            {item.primer_nombre[0]}{item.apellido_paterno[0]}
                          </div>
                          <div>
                            <div className="font-bold text-slate-700">{item.primer_nombre} {item.apellido_paterno}</div>
                            <div className="text-xs text-slate-400 font-medium">C.I. {item.ci}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          item.tipo_planilla === 'RESIDENTE' 
                          ? 'bg-purple-50 text-purple-600' 
                          : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {item.tipo_planilla}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 font-bold text-slate-700">
                          <ClockIcon size={14} className="text-blue-400" />
                          {item.total_horas}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={`inline-flex items-center gap-1.5 font-bold ${
                          item.total_atrasos_min > 0 ? 'text-rose-500' : 'text-slate-400'
                        }`}>
                          {item.total_atrasos_min > 0 && <AlertCircle size={14} />}
                          {item.total_atrasos_min}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-slate-500 line-clamp-1 max-w-[200px]">
                          {item.observaciones || '--'}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AsistenciasPage;
