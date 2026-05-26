import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, FileText, Filter, ChevronDown } from 'lucide-react';

export default function CorrespondenciaPage() {
  const { authAxios } = useAuth();
  const api = authAxios();
  const [data, setData] = useState([]);
  const [catalogos, setCatalogos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ busqueda: '', tipo_id: '', clasificacion_id: '', estado: '', page: 1 });
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    api.get('/api/correspondencia/catalogos').then(r => setCatalogos(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.busqueda) params.append('busqueda', filters.busqueda);
    if (filters.tipo_id) params.append('tipo_id', filters.tipo_id);
    if (filters.clasificacion_id) params.append('clasificacion_id', filters.clasificacion_id);
    if (filters.estado) params.append('estado', filters.estado);
    params.append('page', filters.page);
    params.append('limit', '20');

    api.get(`/api/correspondencia?${params}`)
      .then(r => {
        setData(r.data.data);
        setPagination(r.data.pagination);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters]);

  const estadoBadge = (estado) => {
    const colors = { recibido: 'bg-blue-100 text-blue-700', derivado: 'bg-amber-100 text-amber-700', respondido: 'bg-emerald-100 text-emerald-700' };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[estado] || 'bg-slate-100 text-slate-600'}`}>{estado}</span>;
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Correspondencia</h1>
          <p className="text-slate-500 mt-1">Gestión de hojas de ruta y derivaciones</p>
        </div>
        <Link to="/correspondencia/nueva" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Plus size={18} /> Nuevo Registro
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">Buscar</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={filters.busqueda}
                onChange={e => setFilters(f => ({ ...f, busqueda: e.target.value, page: 1 }))}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="HR, CITE, referencia..."
              />
            </div>
          </div>
          {catalogos && <>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Tipo</label>
              <select value={filters.tipo_id} onChange={e => setFilters(f => ({ ...f, tipo_id: e.target.value, page: 1 }))} className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todos</option>
                {catalogos.tipos?.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Clasificación</label>
              <select value={filters.clasificacion_id} onChange={e => setFilters(f => ({ ...f, clasificacion_id: e.target.value, page: 1 }))} className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todas</option>
                {catalogos.clasificaciones?.map(c => <option key={c.id} value={c.id}>{c.codigo} - {c.nombre}</option>)}
              </select>
            </div>
          </>}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Estado</label>
            <select value={filters.estado} onChange={e => setFilters(f => ({ ...f, estado: e.target.value, page: 1 }))} className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos</option>
              <option value="recibido">Recibido</option>
              <option value="derivado">Derivado</option>
              <option value="respondido">Respondido</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Cargando...</div>
      ) : data.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <FileText size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-600">No hay correspondencia registrada</h3>
          <p className="text-slate-400 mt-1">Crea un nuevo registro para comenzar</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">HR</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">CITE</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Referencia</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Remitente</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Clasificación</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Fecha</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Estado</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Etiquetas</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer" onClick={() => window.location.href = `/correspondencia/${item.id}`}>
                  <td className="p-3 font-mono text-sm font-medium text-blue-600">HR-{String(item.hr_correlativo).padStart(3, '0')}/{item.gestion}</td>
                  <td className="p-3 text-sm text-slate-600 font-mono">{item.cite || '-'}</td>
                  <td className="p-3 text-sm text-slate-700 max-w-xs truncate">{item.referencia}</td>
                  <td className="p-3 text-sm text-slate-600">{item.remitente_nombre || item.remitente_externo || '-'}</td>
                  <td className="p-3 text-sm">{item.clasificacion_nombre || '-'}</td>
                  <td className="p-3 text-sm text-slate-500">{new Date(item.fecha_documento).toLocaleDateString()}</td>
                  <td className="p-3">{estadoBadge(item.estado)}</td>
                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {item.etiquetas?.map(e => (
                        <span key={e.id} className="px-2 py-0.5 rounded-full text-[10px] font-medium text-white" style={{ backgroundColor: e.color }}>{e.nombre}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-200">
              <span className="text-sm text-slate-500">Página {pagination.page} de {pagination.totalPages} ({pagination.total} registros)</span>
              <div className="flex gap-2">
                <button disabled={filters.page <= 1} onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))} className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg disabled:opacity-50 hover:bg-slate-50">Anterior</button>
                <button disabled={filters.page >= pagination.totalPages} onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))} className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg disabled:opacity-50 hover:bg-slate-50">Siguiente</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
