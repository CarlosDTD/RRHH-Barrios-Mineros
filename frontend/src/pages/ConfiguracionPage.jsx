import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Save, Plus, Trash2, Settings } from 'lucide-react';

export default function ConfiguracionPage() {
  const { authAxios, usuario } = useAuth();
  const api = authAxios();
  const [citeConfig, setCiteConfig] = useState(null);
  const [etiquetas, setEtiquetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState({ nombre: '', color: '#3b82f6' });

  useEffect(() => {
    Promise.all([
      api.get('/api/config/cite'),
      api.get('/api/config/etiquetas')
    ]).then(([citeRes, etiqRes]) => {
      setCiteConfig(citeRes.data);
      setEtiquetas(etiqRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSaveCite = async () => {
    setSaving(true);
    try {
      const res = await api.put('/api/config/cite', citeConfig);
      setCiteConfig(res.data);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleAddEtiqueta = async () => {
    if (!nuevaEtiqueta.nombre.trim()) return;
    try {
      const res = await api.post('/api/config/etiquetas', nuevaEtiqueta);
      setEtiquetas([...etiquetas, res.data]);
      setNuevaEtiqueta({ nombre: '', color: '#3b82f6' });
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteEtiqueta = async (id) => {
    try {
      await api.delete(`/api/config/etiquetas/${id}`);
      setEtiquetas(etiquetas.filter(e => e.id !== id));
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <div className="p-8 text-slate-400">Cargando...</div>;

  if (!usuario?.roles?.includes('ADMIN')) {
    return <div className="p-8 text-center"><h2 className="text-xl font-bold text-red-600">Acceso Denegado</h2><p className="text-slate-500 mt-2">Solo administradores</p></div>;
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
          <Settings size={28} className="text-slate-600" /> Configuración del Sistema
        </h1>
        <p className="text-slate-500 mt-1">Administración de códigos, etiquetas y parámetros</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Configuración CITE</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sigla del Hospital</label>
              <input type="text" value={citeConfig?.hospital_sigla || ''} onChange={e => setCiteConfig(f => ({ ...f, hospital_sigla: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase" maxLength={10} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Separador</label>
              <input type="text" value={citeConfig?.separador || ''} onChange={e => setCiteConfig(f => ({ ...f, separador: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono" maxLength={5} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Formato</label>
              <input type="text" value={citeConfig?.formato || ''} onChange={e => setCiteConfig(f => ({ ...f, formato: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs" />
              <p className="text-xs text-slate-400 mt-1">Variables: {'{SIGLA}'}, {'{AREA}'}, {'{TIPO}'}, {'{NRO}'}, {'{GESTION}'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gestión Actual</label>
              <input type="number" value={citeConfig?.gestion_actual || ''} onChange={e => setCiteConfig(f => ({ ...f, gestion_actual: parseInt(e.target.value) }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Vista previa del formato</label>
              <div className="bg-slate-50 p-3 rounded-lg font-mono text-sm text-slate-700">
                {citeConfig && (
                  citeConfig.formato
                    .replace('{SIGLA}', citeConfig.hospital_sigla)
                    .replace('{AREA}', 'DR')
                    .replace('{TIPO}', 'OFI')
                    .replace('{NRO}', '001')
                    .replace('{GESTION}', String(citeConfig.gestion_actual))
                )}
              </div>
            </div>
            <button onClick={handleSaveCite} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
              <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Configuración'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Etiquetas</h2>
          <div className="flex gap-2 mb-4">
            <input type="text" value={nuevaEtiqueta.nombre} onChange={e => setNuevaEtiqueta(f => ({ ...f, nombre: e.target.value }))} placeholder="Nueva etiqueta..." className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="color" value={nuevaEtiqueta.color} onChange={e => setNuevaEtiqueta(f => ({ ...f, color: e.target.value }))} className="w-10 h-10 p-1 border border-slate-300 rounded-lg cursor-pointer" />
            <button onClick={handleAddEtiqueta} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={18} /></button>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {etiquetas.map(e => (
              <div key={e.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: e.color }}></div>
                  <span className="text-sm text-slate-700">{e.nombre}</span>
                </div>
                <button onClick={() => handleDeleteEtiqueta(e.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            ))}
            {etiquetas.length === 0 && <p className="text-sm text-slate-400 text-center py-4">Sin etiquetas</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
