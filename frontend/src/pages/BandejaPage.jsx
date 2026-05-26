import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Inbox, Mail, MailOpen } from 'lucide-react';

export default function BandejaPage() {
  const { authAxios } = useAuth();
  const api = authAxios();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/correspondencia/bandeja')
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-slate-400">Cargando...</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
          <Inbox size={28} className="text-blue-600" /> Bandeja de Entrada
        </h1>
        <p className="text-slate-500 mt-1">Correspondencia derivada a ti</p>
      </div>

      {data.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <Mail size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-600">Bandeja vacía</h3>
          <p className="text-slate-400 mt-1">No tienes correspondencia pendiente</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map(item => (
            <Link key={item.derivacion_id} to={`/correspondencia/${item.correspondencia_id}`}
              className={`block bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition-shadow ${!item.completada ? 'border-l-4 border-l-blue-500 border-slate-200' : 'border-slate-200 opacity-70'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {item.completada ? <MailOpen size={16} className="text-slate-400" /> : <Mail size={16} className="text-blue-600" />}
                  <span className="font-mono text-sm font-medium text-blue-600">
                    HR-{String(item.hr_correlativo).padStart(3, '0')}/{item.gestion}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${!item.completada ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                    {item.completada ? 'Completado' : 'Pendiente'}
                  </span>
                </div>
                <span className="text-xs text-slate-400">{new Date(item.fecha_derivacion).toLocaleDateString()}</span>
              </div>
              <h3 className="font-medium text-slate-700 mb-1">{item.referencia}</h3>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>De: {item.de_nombre}</span>
                {item.tipo_nombre && <span>• {item.tipo_nombre}</span>}
                {item.clasificacion_nombre && <span>• {item.clasificacion_nombre}</span>}
                {item.instruccion && <span>• "{item.instruccion}"</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
