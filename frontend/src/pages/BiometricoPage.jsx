import React, { useState, useEffect } from 'react';
import { 
  Cpu, Settings, RefreshCw, Database, 
  Link, UserCheck, AlertCircle, CheckCircle2,
  Clock, Activity
} from 'lucide-react';
import api from '../config/api';

const BiometricoPage = () => {
  const [config, setConfig] = useState({ ip_address: '', port: 4370, comms_key: '0' });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchConfig();
    fetchLogs();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await api.get('/api/biometrico/config');
      if (res.data && res.data.ip_address) setConfig(res.data);
    } catch (e) {
      console.error('Error fetching config:', e);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await api.get('/api/biometrico/raw-logs');
      setLogs(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error('Error fetching logs:', e);
      setLogs([]);
    }
  };

  const handleUpdateConfig = async () => {
    setLoading(true);
    try {
      await api.post('/api/biometrico/config', config);
      setStatus({ type: 'success', text: 'Configuración guardada' });
    } catch (e) {
      setStatus({ type: 'error', text: 'Error al conectar con el servidor' });
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setLoading(true);
    setStatus({ type: 'info', text: 'Conectando con el equipo y extrayendo logs...' });
    try {
      const res = await api.post('/api/biometrico/sync-logs');
      setStatus({ type: 'success', text: `Sincronización completa. Registros: ${res.data.nuevosGuardados}` });
      fetchLogs();
    } catch (e) {
      setStatus({ type: 'error', text: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Módulo Biométrico</h1>
          <p className="text-slate-500 mt-1">Sincronización directa con equipo ZKTeco</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleSync}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all disabled:bg-slate-300"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            Sincronizar Logs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuración */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Settings size={20} /></div>
              <h3 className="font-bold text-slate-800 text-lg">Dispositivo</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Dirección IP</label>
                <input 
                  type="text" 
                  value={config.ip_address}
                  onChange={e => setConfig({...config, ip_address: e.target.value})}
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Ej. 192.168.1.201"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Puerto</label>
                  <input 
                    type="number" 
                    value={config.port}
                    onChange={e => setConfig({...config, port: parseInt(e.target.value)})}
                    className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Comms Key</label>
                  <input 
                    type="text" 
                    value={config.comms_key}
                    onChange={e => setConfig({...config, comms_key: e.target.value})}
                    className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
              <button 
                onClick={handleUpdateConfig}
                className="w-full py-3 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-colors"
              >
                Guardar Configuración
              </button>
            </div>
          </div>

          {status && (
            <div className={`p-6 rounded-3xl flex items-start gap-4 border ${
              status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 
              status.type === 'info' ? 'bg-blue-50 border-blue-100 text-blue-700' :
              'bg-rose-50 border-rose-100 text-rose-700'
            }`}>
              {status.type === 'success' ? <CheckCircle2 className="mt-1 shrink-0" /> : <AlertCircle className="mt-1 shrink-0" />}
              <p className="text-sm font-medium leading-relaxed">{status.text}</p>
            </div>
          )}
        </div>

        {/* Marcaciones Crudas */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Activity size={20} /></div>
                <h3 className="font-bold text-slate-800 text-lg">Últimas Marcaciones Extraídas</h3>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-500 rounded-full">RAW DATA</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-8 py-4">Personal</th>
                    <th className="px-8 py-4">ID Biométrico</th>
                    <th className="px-8 py-4">Fecha y Hora</th>
                    <th className="px-8 py-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-8 py-20 text-center text-slate-300">
                        <Database size={48} className="mx-auto mb-4 opacity-20" />
                        Aún no hay logs sincronizados en la base de datos local.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-4 font-bold text-slate-700">
                          {log.primer_nombre ? `${log.primer_nombre} ${log.apellido_paterno}` : <span className="text-rose-400 italic">No vinculado</span>}
                        </td>
                        <td className="px-8 py-4">
                          <code className="bg-slate-100 px-2 py-1 rounded text-blue-600 font-mono text-sm">{log.biometrico_id}</code>
                        </td>
                        <td className="px-8 py-4 text-slate-500 font-medium">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-8 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            log.estado_asistencia === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {log.estado_asistencia === 0 ? 'Entrada' : 'Salida/Otro'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiometricoPage;
