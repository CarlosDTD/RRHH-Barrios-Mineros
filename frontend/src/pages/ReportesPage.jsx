import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileSpreadsheet, Download, CalendarClock, Users, Filter,
  ChevronRight, Settings, Calendar
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const ReportesPage = () => {
  const [config, setConfig] = useState({ fuentes: [], tipos: [], unidades: [] });
  const [selectedReport, setSelectedReport] = useState(null);
  const [filters, setFilters] = useState({
    estado: 'TODOS', fuente_id: '', tipo_id: '', unidad_id: '', days: 30
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/reportes/config`)
      .then(res => setConfig(res.data))
      .catch(err => console.error(err));
  }, []);

  const reports = [
    {
      id: 'inventario',
      title: 'Inventario Personal HBM',
      description: 'Reporte completo con todos los campos del inventario de personal, mismo formato que el libro Excel original.',
      icon: <FileSpreadsheet size={24} className="text-blue-600" />,
      color: 'blue',
      filters: ['estado', 'fuente_id', 'tipo_id', 'unidad_id']
    },
    {
      id: 'contratos-vencer',
      title: 'Contratos por Vencer',
      description: 'Personal con contratos que vencen en los próximos N días. Útil para planificación de renovaciones.',
      icon: <CalendarClock size={24} className="text-amber-600" />,
      color: 'amber',
      filters: ['days']
    },
  ];

  const handleExport = async () => {
    setLoading(true);
    try {
      let url;
      if (selectedReport === 'inventario') {
        const params = new URLSearchParams();
        if (filters.estado !== 'TODOS') params.append('estado', filters.estado);
        if (filters.fuente_id) params.append('fuente_id', filters.fuente_id);
        if (filters.tipo_id) params.append('tipo_id', filters.tipo_id);
        if (filters.unidad_id) params.append('unidad_id', filters.unidad_id);
        url = `${API_BASE_URL}/api/reportes/inventario?${params}`;
      } else if (selectedReport === 'contratos-vencer') {
        url = `${API_BASE_URL}/api/reportes/contratos-vencer?days=${filters.days}`;
      }
      window.open(url, '_blank');
    } catch (error) {
      alert('Error al generar reporte: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const colorClasses = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', hover: 'hover:bg-blue-100', ring: 'ring-blue-500' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', hover: 'hover:bg-amber-100', ring: 'ring-amber-500' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', hover: 'hover:bg-emerald-100', ring: 'ring-emerald-500' },
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Centro de Reportes</h1>
        <p className="text-slate-500 text-sm">Genera reportes del personal del Hospital Barrios Mineros</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Reportes */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Reportes Disponibles</h2>
          {reports.map(report => {
            const colors = colorClasses[report.color];
            const isSelected = selectedReport === report.id;
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  isSelected 
                    ? `${colors.border} ${colors.bg} ring-2 ${colors.ring} ring-opacity-20` 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    {report.icon}
                  </div>
                  <div className="flex-1">
                    <div className={`font-bold text-sm ${isSelected ? colors.text : 'text-slate-800'}`}>
                      {report.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{report.description}</div>
                  </div>
                  <ChevronRight size={16} className={isSelected ? colors.text : 'text-slate-400'} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Configuración del Reporte */}
        <div className="lg:col-span-2">
          {selectedReport ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h2 className="text-lg font-bold text-slate-800">
                  {reports.find(r => r.id === selectedReport)?.title}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {reports.find(r => r.id === selectedReport)?.description}
                </p>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex items-center gap-2 mb-4">
                  <Filter size={16} className="text-slate-400" />
                  <h3 className="text-sm font-bold text-slate-700 uppercase">Filtros</h3>
                </div>

                {selectedReport === 'inventario' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Estado</label>
                        <select
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          value={filters.estado}
                          onChange={e => setFilters({...filters, estado: e.target.value})}
                        >
                          <option value="TODOS">Todos (Activos + Inactivos)</option>
                          <option value="ACTIVO">Solo Activos</option>
                          <option value="INACTIVO">Solo Inactivos</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Fuente de Financiamiento</label>
                        <select
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          value={filters.fuente_id}
                          onChange={e => setFilters({...filters, fuente_id: e.target.value})}
                        >
                          <option value="">Todas</option>
                          {config.fuentes.map(f => <option key={f.id} value={f.id}>{f.nombre_fuente}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tipo de Personal</label>
                        <select
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          value={filters.tipo_id}
                          onChange={e => setFilters({...filters, tipo_id: e.target.value})}
                        >
                          <option value="">Todos</option>
                          {config.tipos.map(t => <option key={t.id} value={t.id}>{t.nombre_tipo}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Unidad / Servicio</label>
                        <select
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          value={filters.unidad_id}
                          onChange={e => setFilters({...filters, unidad_id: e.target.value})}
                        >
                          <option value="">Todas</option>
                          {config.unidades.map(u => <option key={u.id} value={u.id}>{u.nombre_unidad}</option>)}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {selectedReport === 'contratos-vencer' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Días a consultar</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="7"
                        max="90"
                        step="7"
                        value={filters.days}
                        onChange={e => setFilters({...filters, days: parseInt(e.target.value)})}
                        className="flex-1"
                      />
                      <span className="text-sm font-bold text-slate-700 min-w-[60px] text-center">
                        {filters.days} días
                      </span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={handleExport}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-bold shadow-lg shadow-blue-500/20"
                  >
                    <Download size={16} />
                    {loading ? 'Generando...' : 'Exportar Excel'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <Settings size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-600 mb-2">Selecciona un Reporte</h3>
              <p className="text-sm text-slate-400">Elige un reporte de la lista para configurar y exportar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportesPage;
