import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Upload, Save } from 'lucide-react';

export default function CorrespondenciaForm() {
  const { authAxios } = useAuth();
  const api = authAxios();
  const navigate = useNavigate();
  const [catalogos, setCatalogos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [form, setForm] = useState({
    tipo_id: '', clasificacion_id: '', remitente_externo: '',
    remitente_interno_id: '', destinatario_original: '',
    referencia: '', folios: '', fecha_documento: new Date().toISOString().split('T')[0],
    etiquetas: [], cite: '', observaciones: '',
    derivar_a: '', instruccion_derivacion: ''
  });

  useEffect(() => {
    api.get('/api/correspondencia/catalogos').then(r => setCatalogos(r.data)).catch(() => {});
  }, []);

  const toggleEtiqueta = (id) => {
    setForm(f => ({
      ...f,
      etiquetas: f.etiquetas.includes(id) ? f.etiquetas.filter(e => e !== id) : [...f.etiquetas, id]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'etiquetas') {
        formData.append(k, JSON.stringify(v));
      } else if (v !== '' && v !== null) {
        formData.append(k, v);
      }
    });
    if (pdfFile) formData.append('pdf', pdfFile);

    try {
      const res = await api.post('/api/correspondencia', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(`/correspondencia/${res.data.id}`);
    } catch (err) {
      alert('Error al guardar: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!catalogos) return <div className="p-8 text-slate-400">Cargando...</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <button onClick={() => navigate('/correspondencia')} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6">
        <ArrowLeft size={18} /> Volver a Correspondencia
      </button>

      <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-8">Nuevo Registro de Correspondencia</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Información del Documento</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo *</label>
              <select value={form.tipo_id} onChange={e => setForm(f => ({ ...f, tipo_id: e.target.value }))} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Seleccionar...</option>
                {catalogos.tipos?.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Clasificación *</label>
              <select value={form.clasificacion_id} onChange={e => setForm(f => ({ ...f, clasificacion_id: e.target.value }))} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Seleccionar...</option>
                {catalogos.clasificaciones?.map(c => <option key={c.id} value={c.id}>{c.codigo} - {c.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CITE</label>
              <input type="text" value={form.cite} onChange={e => setForm(f => ({ ...f, cite: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono" placeholder="HBM/DR/OFI/N° 001/2026" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha del Documento *</label>
              <input type="date" value={form.fecha_documento} onChange={e => setForm(f => ({ ...f, fecha_documento: e.target.value }))} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Referencia / Asunto *</label>
              <textarea value={form.referencia} onChange={e => setForm(f => ({ ...f, referencia: e.target.value }))} required rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Remitente Externo</label>
              <input type="text" value={form.remitente_externo} onChange={e => setForm(f => ({ ...f, remitente_externo: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Destinatario Original</label>
              <input type="text" value={form.destinatario_original} onChange={e => setForm(f => ({ ...f, destinatario_original: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">N° de Folios</label>
              <input type="number" value={form.folios} onChange={e => setForm(f => ({ ...f, folios: e.target.value }))} min={0} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Observaciones</label>
              <textarea value={form.observaciones} onChange={e => setForm(f => ({ ...f, observaciones: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Documento PDF</h2>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <Upload size={32} className="mx-auto text-slate-400 mb-2" />
            <p className="text-sm text-slate-500 mb-2">Arrastra un PDF o haz clic para seleccionar</p>
            <p className="text-xs text-slate-400">El PDF se comprimirá automáticamente al subirse</p>
            <input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files[0])} className="hidden" id="pdf-upload" />
            <label htmlFor="pdf-upload" className="inline-block mt-3 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm cursor-pointer hover:bg-slate-200 transition-colors">Seleccionar Archivo</label>
            {pdfFile && <p className="text-sm text-emerald-600 mt-2">✓ {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(1)} MB)</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Etiquetas</h2>
          <div className="flex flex-wrap gap-2">
            {catalogos.etiquetas?.map(e => (
              <button key={e.id} type="button" onClick={() => toggleEtiqueta(e.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${form.etiquetas.includes(e.id) ? 'text-white' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'}`}
                style={form.etiquetas.includes(e.id) ? { backgroundColor: e.color } : {}}>
                {e.nombre}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Derivación Inicial</h2>
          <p className="text-sm text-slate-500 mb-3">Opcional: deriva automáticamente al registrar</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Derivar a</label>
              <select value={form.derivar_a} onChange={e => setForm(f => ({ ...f, derivar_a: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Sin derivación</option>
                {catalogos.usuarios?.map(u => <option key={u.id} value={u.id}>{u.nombre_completo} - {u.cargo_actual || u.username}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Instrucción</label>
              <input type="text" value={form.instruccion_derivacion} onChange={e => setForm(f => ({ ...f, instruccion_derivacion: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Para revisión, respuesta, archivo..." />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/correspondencia')} className="px-6 py-2.5 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 font-medium">Cancelar</button>
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">
            <Save size={18} /> {loading ? 'Guardando...' : 'Guardar y Registrar'}
          </button>
        </div>
      </form>
    </div>
  );
}
