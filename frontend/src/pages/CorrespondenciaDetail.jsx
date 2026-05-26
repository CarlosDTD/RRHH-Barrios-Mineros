import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Send, FileText, Users, Calendar, Tag, MessageSquare } from 'lucide-react';

export default function CorrespondenciaDetail() {
  const { id } = useParams();
  const { authAxios, usuario } = useAuth();
  const api = authAxios();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [catalogos, setCatalogos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [derivarModal, setDerivarModal] = useState(false);
  const [responderModal, setResponderModal] = useState(null);
  const [derivarForm, setDerivarForm] = useState({ para_usuario_id: '', instruccion: '' });
  const [respuestaText, setRespuestaText] = useState('');

  useEffect(() => {
    api.get(`/api/correspondencia/${id}`).then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false));
    api.get('/api/correspondencia/catalogos').then(r => setCatalogos(r.data)).catch(() => {});
  }, [id]);

  const handleDerivar = async () => {
    try {
      await api.post(`/api/correspondencia/${id}/derivar`, derivarForm);
      setDerivarModal(false);
      setDerivarForm({ para_usuario_id: '', instruccion: '' });
      const r = await api.get(`/api/correspondencia/${id}`);
      setData(r.data);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleResponder = async (derivacionId) => {
    try {
      await api.put(`/api/correspondencia/derivaciones/${derivacionId}/responder`, { respuesta: respuestaText });
      setResponderModal(null);
      setRespuestaText('');
      const r = await api.get(`/api/correspondencia/${id}`);
      setData(r.data);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const estadoBadge = (estado) => {
    const colors = { recibido: 'bg-blue-100 text-blue-700', derivado: 'bg-amber-100 text-amber-700', respondido: 'bg-emerald-100 text-emerald-700' };
    return <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[estado] || 'bg-slate-100 text-slate-600'}`}>{estado}</span>;
  };

  if (loading) return <div className="p-8 text-slate-400">Cargando...</div>;
  if (!data) return <div className="p-8 text-red-500">Correspondencia no encontrada</div>;

  const tieneDerivacionPendiente = data.derivaciones?.some(
    d => !d.completada && d.para_usuario_id === usuario?.id
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <button onClick={() => navigate('/correspondencia')} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6">
        <ArrowLeft size={18} /> Volver a Correspondencia
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            HR-{String(data.hr_correlativo).padStart(3, '0')}/{data.gestion}
          </h1>
          <p className="text-slate-500 mt-1">Registrado el {new Date(data.fecha_recepcion).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-3">
          {estadoBadge(data.estado)}
          {data.cite && <span className="font-mono text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">{data.cite}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-700 mb-4">Detalle del Documento</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase">Tipo</dt>
                <dd className="text-sm text-slate-700 mt-0.5">{data.tipo_nombre || '-'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase">Clasificación</dt>
                <dd className="text-sm text-slate-700 mt-0.5">{data.clasificacion_nombre || '-'}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs font-medium text-slate-400 uppercase">Referencia</dt>
                <dd className="text-sm text-slate-700 mt-0.5">{data.referencia}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase">Remitente Externo</dt>
                <dd className="text-sm text-slate-700 mt-0.5">{data.remitente_externo || '-'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase">Remitente Interno</dt>
                <dd className="text-sm text-slate-700 mt-0.5">{data.remitente_nombre || '-'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase">Destinatario Original</dt>
                <dd className="text-sm text-slate-700 mt-0.5">{data.destinatario_original || '-'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase">Fecha Documento</dt>
                <dd className="text-sm text-slate-700 mt-0.5">{new Date(data.fecha_documento).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase">Folios</dt>
                <dd className="text-sm text-slate-700 mt-0.5">{data.folios || '-'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase">Registrado por</dt>
                <dd className="text-sm text-slate-700 mt-0.5">{data.recepcion_nombre || '-'}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs font-medium text-slate-400 uppercase">Observaciones</dt>
                <dd className="text-sm text-slate-700 mt-0.5">{data.observaciones || '-'}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs font-medium text-slate-400 uppercase">Etiquetas</dt>
                <dd className="mt-1">
                  <div className="flex gap-1 flex-wrap">
                    {data.etiquetas?.map(e => (
                      <span key={e.id} className="px-2.5 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: e.color }}>{e.nombre}</span>
                    ))}
                    {(!data.etiquetas || data.etiquetas.length === 0) && <span className="text-sm text-slate-400">-</span>}
                  </div>
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-700">Derivaciones</h2>
              <button onClick={() => setDerivarModal(true)} className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                <Send size={14} /> Derivar
              </button>
            </div>

            {data.derivaciones?.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">Sin derivaciones registradas</p>
            ) : (
              <div className="space-y-3">
                {data.derivaciones?.map(d => (
                  <div key={d.id} className={`border-l-4 ${d.completada ? 'border-emerald-400' : 'border-amber-400'} bg-slate-50 rounded-r-lg p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-slate-700">{d.de_nombre || '?'}</span>
                        <span className="text-slate-400">→</span>
                        <span className="font-medium text-slate-700">{d.para_nombre || '?'}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${d.completada ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {d.completada ? 'Respondido' : 'Pendiente'}
                      </span>
                    </div>
                    {d.instruccion && <p className="text-sm text-slate-500 italic">"{d.instruccion}"</p>}
                    <p className="text-xs text-slate-400 mt-1">{new Date(d.fecha_derivacion).toLocaleString()}</p>
                    {d.respuesta && (
                      <div className="mt-2 bg-white p-3 rounded-lg border border-slate-200">
                        <p className="text-xs font-medium text-slate-500 mb-1">Respuesta:</p>
                        <p className="text-sm text-slate-700">{d.respuesta}</p>
                        {d.fecha_respuesta && <p className="text-xs text-slate-400 mt-1">{new Date(d.fecha_respuesta).toLocaleString()}</p>}
                      </div>
                    )}
                    {!d.completada && d.para_usuario_id === usuario?.id && (
                      <button onClick={() => { setResponderModal(d.id); setRespuestaText(''); }} className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Responder
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {tieneDerivacionPendiente && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-amber-700 font-medium mb-1">
                <MessageSquare size={16} /> Tienes una derivación pendiente
              </div>
              <p className="text-sm text-amber-600">Revisa y responde en la sección de derivaciones</p>
            </div>
          )}

          {data.pdf_original && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><FileText size={16} /> Documentos</h3>
              <div className="space-y-2">
                <a href={`http://localhost:3001/${data.pdf_original.replace(/\\/g, '/')}`} target="_blank" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700" rel="noreferrer">
                  <FileText size={14} /> Ver PDF Original
                </a>
                {data.pdf_comprimido && data.pdf_comprimido !== data.pdf_original && (
                  <a href={`http://localhost:3001/${data.pdf_comprimido.replace(/\\/g, '/')}`} target="_blank" className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700" rel="noreferrer">
                    <FileText size={14} /> Ver PDF Comprimido
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><Calendar size={16} /> Información</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-400">HR Completo</dt>
                <dd className="font-mono text-slate-700">HR-{String(data.hr_correlativo).padStart(3, '0')}/{data.gestion}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Gestión</dt>
                <dd className="text-slate-700">{data.gestion}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Registro</dt>
                <dd className="text-slate-700">{new Date(data.fecha_recepcion).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {derivarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Derivar Correspondencia</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Derivar a</label>
                <select value={derivarForm.para_usuario_id} onChange={e => setDerivarForm(f => ({ ...f, para_usuario_id: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Seleccionar...</option>
                  {catalogos?.usuarios?.filter(u => u.id !== usuario?.id).map(u => (
                    <option key={u.id} value={u.id}>{u.nombre_completo} - {u.cargo_actual || u.username}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Instrucción</label>
                <input type="text" value={derivarForm.instruccion} onChange={e => setDerivarForm(f => ({ ...f, instruccion: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Para revisión, respuesta, archivo..." />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setDerivarModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50">Cancelar</button>
                <button onClick={handleDerivar} disabled={!derivarForm.para_usuario_id} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">Derivar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {responderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Responder Derivación</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tu respuesta</label>
                <textarea value={respuestaText} onChange={e => setRespuestaText(e.target.value)} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Escribe tu respuesta..." />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setResponderModal(null)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50">Cancelar</button>
                <button onClick={() => handleResponder(responderModal)} disabled={!respuestaText.trim()} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50">Enviar Respuesta</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
