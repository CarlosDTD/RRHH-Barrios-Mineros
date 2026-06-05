import React, { useState, useEffect } from 'react';
import { 
  Cpu, Settings, RefreshCw, Database, 
  Link, UserCheck, AlertCircle, CheckCircle2,
  Clock, Activity, Upload, Download, Search,
  Users, UserX, ChevronRight, BarChart3,
  FileSpreadsheet, Calendar, Filter, X
} from 'lucide-react';
import api from '../config/api';

const TABS = [
  { id: 'config', label: 'Configuración', icon: Settings },
  { id: 'import', label: 'Importar Datos', icon: Database },
  { id: 'mapping', label: 'Mapeo de Empleados', icon: Link },
  { id: 'attendance', label: 'Asistencia', icon: Clock },
];

const BiometricoPage = () => {
  const [activeTab, setActiveTab] = useState('config');
  const [config, setConfig] = useState({ ip_address: '', port: 4370, comms_key: '0' });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => { fetchConfig(); }, []);

  const fetchConfig = async () => {
    try {
      const res = await api.get('/api/biometrico/config');
      if (res.data && res.data.ip_address) setConfig(res.data);
    } catch (e) { console.error('Error fetching config:', e); }
  };

  const showStatus = (type, text) => {
    setStatus({ type, text });
    setTimeout(() => setStatus(null), 6000);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Módulo Biométrico</h1>
        <p className="text-slate-500 mt-1">Gestión de equipo ZKTeco, importación de datos y mapeo de empleados</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100 inline-flex">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {status && (
        <div className={`mb-6 p-4 rounded-2xl flex items-start gap-3 border ${
          status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 
          status.type === 'info' ? 'bg-blue-50 border-blue-100 text-blue-700' :
          'bg-rose-50 border-rose-100 text-rose-700'
        }`}>
          {status.type === 'success' ? <CheckCircle2 className="mt-0.5 shrink-0" size={18} /> : <AlertCircle className="mt-0.5 shrink-0" size={18} />}
          <p className="text-sm font-medium">{status.text}</p>
        </div>
      )}

      {activeTab === 'config' && <ConfigTab config={config} setConfig={setConfig} loading={loading} setLoading={setLoading} showStatus={showStatus} logs={logs} setLogs={setLogs} />}
      {activeTab === 'import' && <ImportTab showStatus={showStatus} />}
      {activeTab === 'mapping' && <MappingTab showStatus={showStatus} />}
      {activeTab === 'attendance' && <AttendanceTab showStatus={showStatus} />}
    </div>
  );
};

/* ==================== CONFIG TAB ==================== */
const ConfigTab = ({ config, setConfig, loading, setLoading, showStatus, logs, setLogs }) => {
  const fetchLogs = async () => {
    try {
      const res = await api.get('/api/biometrico/raw-logs');
      setLogs(Array.isArray(res.data) ? res.data : []);
    } catch (e) { setLogs([]); }
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleUpdateConfig = async () => {
    setLoading(true);
    try {
      await api.post('/api/biometrico/config', config);
      showStatus('success', 'Configuración guardada correctamente');
    } catch (e) {
      showStatus('error', 'Error al guardar configuración');
    } finally { setLoading(false); }
  };

  const handleSync = async () => {
    setLoading(true);
    showStatus('info', 'Conectando con el equipo y extrayendo logs...');
    try {
      const res = await api.post('/api/biometrico/sync-logs');
      showStatus('success', `Sincronización completa. ${res.data.nuevosGuardados} nuevos registros`);
      fetchLogs();
    } catch (e) {
      showStatus('error', e.response?.data?.error || e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Settings size={20} /></div>
            <h3 className="font-bold text-slate-800 text-lg">Dispositivo</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Dirección IP</label>
              <input type="text" value={config.ip_address}
                onChange={e => setConfig({...config, ip_address: e.target.value})}
                className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Ej. 192.168.1.201" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Puerto</label>
                <input type="number" value={config.port}
                  onChange={e => setConfig({...config, port: parseInt(e.target.value)})}
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Comms Key</label>
                <input type="text" value={config.comms_key}
                  onChange={e => setConfig({...config, comms_key: e.target.value})}
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
            </div>
            <button onClick={handleUpdateConfig}
              className="w-full py-3 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-colors">
              Guardar Configuración
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Activity size={20} /></div>
            <h3 className="font-bold text-slate-800 text-lg">Sincronización en Vivo</h3>
          </div>
          <p className="text-sm text-slate-500 mb-6">Conecta directamente con el equipo ZKTeco para descargar las marcaciones en tiempo real.</p>
          <button onClick={handleSync} disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all disabled:bg-slate-300">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Sincronizando...' : 'Sincronizar Ahora'}
          </button>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Activity size={20} /></div>
              <h3 className="font-bold text-slate-800 text-lg">Últimas Marcaciones</h3>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-500 rounded-full">EN VIVO</span>
          </div>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-white">
                <tr className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Personal</th>
                  <th className="px-6 py-4">ID Biométrico</th>
                  <th className="px-6 py-4">Fecha y Hora</th>
                  <th className="px-6 py-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-20 text-center text-slate-300">
                      <Database size={48} className="mx-auto mb-4 opacity-20" />
                      Aún no hay logs sincronizados
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700">
                        {log.primer_nombre
                          ? `${log.primer_nombre} ${log.apellido_paterno}`
                          : <span className="text-rose-400 italic">No vinculado</span>}
                      </td>
                      <td className="px-6 py-4">
                        <code className="bg-slate-100 px-2 py-1 rounded text-blue-600 font-mono text-sm">{log.biometrico_id}</code>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
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
  );
};

/* ==================== IMPORT TAB ==================== */
const ImportTab = ({ showStatus }) => {
  const [stats, setStats] = useState(null);
  const [importingEmp, setImportingEmp] = useState(false);
  const [importingMarc, setImportingMarc] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [rangoDesde, setRangoDesde] = useState('2021-01-01');
  const [rangoHasta, setRangoHasta] = useState('2026-12-31');

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await api.get('/api/biometrico/stats-importacion');
      setStats(res.data);
    } catch (e) { setStats(null); }
    finally { setLoadingStats(false); }
  };

  useEffect(() => { fetchStats(); }, []);

  const handleImportEmpleados = async () => {
    setImportingEmp(true);
    try {
      const res = await api.post('/api/biometrico/importar-empleados');
      showStatus('success', `Empleados importados: ${res.data.insertados} nuevos, ${res.data.actualizados} actualizados (${res.data.total} total)`);
      fetchStats();
    } catch (e) {
      showStatus('error', e.response?.data?.error || e.message);
    } finally { setImportingEmp(false); }
  };

  const handleImportMarcaciones = async () => {
    setImportingMarc(true);
    try {
      const res = await api.post('/api/biometrico/importar-marcaciones', {
        desde: rangoDesde,
        hasta: rangoHasta
      });
      showStatus('success', `Marcaciones importadas: ${res.data.importados} nuevas. Rango: ${res.data.rango?.desde || '-'} → ${res.data.rango?.hasta || '-'}`);
      fetchStats();
    } catch (e) {
      showStatus('error', e.response?.data?.error || e.message);
    } finally { setImportingMarc(false); }
  };

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Empleados en ZK', value: stats?.total_empleados || 0, icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'Marcaciones Hist.', value: stats?.total_marcaciones_historicas || 0, icon: Database, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Marcaciones Vivo', value: stats?.total_marcaciones_vivo || 0, icon: Activity, color: 'text-purple-600 bg-purple-50' },
          { label: 'Mapeados', value: stats?.empleados_mapeados || 0, icon: Link, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Sin Mapear', value: stats?.empleados_sin_mapear || 0, icon: UserX, color: 'text-amber-600 bg-amber-50' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${item.color}`}><item.icon size={18} /></div>
              <span className="text-xs font-bold text-slate-400 uppercase">{item.label}</span>
            </div>
            <p className="text-2xl font-black text-slate-800">
              {loadingStats ? <span className="animate-pulse">...</span> : item.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Import actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Empleados */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users size={20} /></div>
            <h3 className="font-bold text-slate-800 text-lg">Importar Empleados</h3>
          </div>
          <p className="text-sm text-slate-500 mb-6">
            Importa los 468 empleados registrados en el software ZKTimeNet (archivo ZKTimeNet.db).
            Los datos se almacenan en <code className="bg-slate-100 px-2 py-0.5 rounded text-xs">biometrico_usuarios</code> para su posterior mapeo.
          </p>
          <button onClick={handleImportEmpleados} disabled={importingEmp}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:bg-slate-300">
            <Upload size={20} className={importingEmp ? 'animate-bounce' : ''} />
            {importingEmp ? 'Importando...' : 'Importar Empleados'}
          </button>
        </div>

        {/* Marcaciones */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Database size={20} /></div>
            <h3 className="font-bold text-slate-800 text-lg">Importar Marcaciones</h3>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Importa las 358,027 marcaciones históricas desde ZKTimeNet.db (2021-2026).
          </p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Desde</label>
              <input type="date" value={rangoDesde} onChange={e => setRangoDesde(e.target.value)}
                className="w-full mt-1 px-3 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Hasta</label>
              <input type="date" value={rangoHasta} onChange={e => setRangoHasta(e.target.value)}
                className="w-full mt-1 px-3 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
          </div>
          <button onClick={handleImportMarcaciones} disabled={importingMarc}
            className="flex items-center justify-center gap-2 w-full bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all disabled:bg-slate-300">
            <Download size={20} className={importingMarc ? 'animate-bounce' : ''} />
            {importingMarc ? 'Importando...' : 'Importar Marcaciones Históricas'}
          </button>
        </div>

        {/* Info */}
        <div className="lg:col-span-2 bg-amber-50 border border-amber-100 rounded-3xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-amber-600 mt-0.5 shrink-0" size={20} />
            <div>
              <p className="font-bold text-amber-800 mb-1">¿De dónde se importan los datos?</p>
              <p className="text-sm text-amber-700">
                Los datos se leen directamente del archivo <code className="bg-amber-100 px-2 py-0.5 rounded font-mono">Sources/ZKTimeNet.db</code> (base de datos SQLite del software ZKTimeNet).
                La ruta se configura en <code className="bg-amber-100 px-2 py-0.5 rounded font-mono">backend/.env</code> con la variable <code className="bg-amber-100 px-2 py-0.5 rounded font-mono">ZKTIMENET_DB_PATH</code>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==================== MAPPING TAB ==================== */
const MappingTab = ({ showStatus }) => {
  const [sugerencias, setSugerencias] = useState([]);
  const [vinculados, setVinculados] = useState([]);
  const [noVinculados, setNoVinculados] = useState([]);
  const [personalSinBio, setPersonalSinBio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState('sugerencias');
  const [selectedPersonal, setSelectedPersonal] = useState({});
  const [resumen, setResumen] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sug, vin, nov, psb, res] = await Promise.all([
        api.get('/api/biometrico/sugerencias'),
        api.get('/api/biometrico/vinculados'),
        api.get('/api/biometrico/no-vinculados'),
        api.get('/api/biometrico/personal-sin-biometrico'),
        api.get('/api/biometrico/resumen-mapeo'),
      ]);
      setSugerencias(sug.data);
      setVinculados(vin.data);
      setNoVinculados(nov.data);
      setPersonalSinBio(psb.data);
      setResumen(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleVincular = async (usuarioId, personalId) => {
    try {
      await api.post('/api/biometrico/vincular', { usuario_id: usuarioId, personal_id: personalId });
      showStatus('success', 'Vinculación exitosa');
      fetchData();
    } catch (e) {
      showStatus('error', e.response?.data?.error || e.message);
    }
  };

  const handleDesvincular = async (personalId) => {
    if (!window.confirm('¿Desvincular este empleado del biométrico?')) return;
    try {
      await api.post('/api/biometrico/desvincular', { personal_id: personalId });
      showStatus('success', 'Vinculación eliminada');
      fetchData();
    } catch (e) {
      showStatus('error', e.response?.data?.error || e.message);
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-400">Cargando datos de mapeo...</div>;

  const subTabs = [
    { id: 'sugerencias', label: `Sugerencias (${sugerencias.length})` },
    { id: 'vinculados', label: `Vinculados (${vinculados.length})` },
    { id: 'no_vinculados', label: `Sin mapear (${noVinculados.length})` },
    { id: 'manual', label: 'Vinculación Manual' },
  ];

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
          <p className="text-3xl font-black text-slate-800">{resumen?.total_biometrico || 0}</p>
          <p className="text-xs font-bold text-slate-400 uppercase mt-1">Empleados en ZK</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
          <p className="text-3xl font-black text-emerald-600">{resumen?.total_vinculados || 0}</p>
          <p className="text-xs font-bold text-slate-400 uppercase mt-1">Vinculados</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
          <p className="text-3xl font-black text-amber-600">{resumen?.sin_mapear || 0}</p>
          <p className="text-xs font-bold text-slate-400 uppercase mt-1">Sin Mapear</p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2">
        {subTabs.map(st => (
          <button key={st.id} onClick={() => setSubTab(st.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              subTab === st.id ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
            }`}>
            {st.label}
          </button>
        ))}
      </div>

      {subTab === 'sugerencias' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Sugerencias de Vinculación Automática</h3>
            <p className="text-sm text-slate-500 mt-1">Coincidencias encontradas entre empleados del biométrico y del sistema por nombre.</p>
          </div>
          {sugerencias.length === 0 ? (
            <div className="p-12 text-center text-slate-400">No hay sugerencias disponibles</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Empleado ZK</th>
                    <th className="px-6 py-4">Departamento</th>
                    <th className="px-6 py-4">→</th>
                    <th className="px-6 py-4">Empleado Sistema</th>
                    <th className="px-6 py-4">CI</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sugerencias.map((s) => (
                    <tr key={s.usuario_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700">
                        {s.nombre_biometrico} {s.apellidos_biometrico}
                        <div className="text-xs text-slate-400 font-mono">PIN: {s.emp_pin}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{s.dept_name || '—'}</td>
                      <td className="px-6 py-4 text-slate-300"><ChevronRight size={18} /></td>
                      <td className="px-6 py-4 font-bold text-slate-700">
                        {s.personal_id ? `${s.nombre_personal} ${s.apellido_paterno} ${s.apellido_materno || ''}` : <span className="text-rose-400 italic">Sin coincidencia</span>}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-500">{s.ci || '—'}</td>
                      <td className="px-6 py-4">
                        {s.biometrico_actual ? (
                          <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">Vinculado</span>
                        ) : s.personal_id ? (
                          <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-600 rounded-full">Disponible</span>
                        ) : (
                          <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-400 rounded-full">Sin match</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {s.personal_id && !s.biometrico_actual && (
                          <button onClick={() => handleVincular(s.usuario_id, s.personal_id)}
                            className="text-xs font-bold px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                            Vincular
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {subTab === 'vinculados' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Empleados Vinculados</h3>
          </div>
          {vinculados.length === 0 ? (
            <div className="p-12 text-center text-slate-400">No hay empleados vinculados</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">PIN</th>
                  <th className="px-6 py-4">Nombre ZK</th>
                  <th className="px-6 py-4">Departamento</th>
                  <th className="px-6 py-4">Nombre Sistema</th>
                  <th className="px-6 py-4">CI</th>
                  <th className="px-6 py-4">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {vinculados.map((v) => (
                  <tr key={v.usuario_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4"><code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">{v.emp_pin}</code></td>
                    <td className="px-6 py-4 font-bold text-slate-700">{v.primer_nombre} {v.apellidos}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{v.dept_name || '—'}</td>
                    <td className="px-6 py-4 font-bold text-slate-700">{v.nombre_personal} {v.apellido_paterno}</td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-500">{v.ci}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDesvincular(v.personal_id)}
                        className="text-xs font-bold px-3 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors">
                        Desvincular
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {subTab === 'no_vinculados' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Empleados del Biométrico sin Vincular</h3>
            <p className="text-sm text-slate-500 mt-1">Estos empleados existen en ZKTimeNet pero no tienen un registro correspondiente en el sistema.</p>
          </div>
          {noVinculados.length === 0 ? (
            <div className="p-12 text-center text-slate-400">Todos los empleados están vinculados</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">PIN</th>
                  <th className="px-6 py-4">Nombre</th>
                  <th className="px-6 py-4">Departamento</th>
                  <th className="px-6 py-4">Activo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {noVinculados.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4"><code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">{u.emp_pin}</code></td>
                    <td className="px-6 py-4 font-bold text-slate-700">{u.primer_nombre} {u.apellidos}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{u.dept_name || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${u.emp_active ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {u.emp_active ? 'Sí' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {subTab === 'manual' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-2">Vinculación Manual</h3>
            <p className="text-sm text-slate-500 mb-6">Selecciona un empleado del biométrico y asígnalo a un registro del sistema.</p>
            <PersonalSelector
              noVinculados={noVinculados}
              personalSinBio={personalSinBio}
              onVincular={handleVincular}
            />
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-2">¿Cómo funciona?</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">1</div>
                <span><strong>Importa</strong> los empleados desde ZKTimeNet.db (pestaña "Importar Datos")</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">2</div>
                <span>Revisa las <strong>sugerencias automáticas</strong> por coincidencia de nombre</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">3</div>
                <span><strong>Vincula</strong> con un clic o usa la vinculación manual</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">4</div>
                <span>Ve a la pestaña <strong>"Asistencia"</strong> para ver las marcaciones de los empleados vinculados</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

const PersonalSelector = ({ noVinculados, personalSinBio, onVincular }) => {
  const [selectedZK, setSelectedZK] = useState('');
  const [selectedPersonal, setSelectedPersonal] = useState('');
  const [searchZK, setSearchZK] = useState('');
  const [searchPersonal, setSearchPersonal] = useState('');

  const filteredZK = noVinculados.filter(u =>
    !searchZK || `${u.primer_nombre} ${u.apellidos} ${u.emp_pin}`.toLowerCase().includes(searchZK.toLowerCase())
  );
  const filteredPersonal = personalSinBio.filter(p =>
    !searchPersonal || `${p.primer_nombre} ${p.apellido_paterno} ${p.ci}`.toLowerCase().includes(searchPersonal.toLowerCase())
  );

  const handleSubmit = () => {
    if (selectedZK && selectedPersonal) {
      onVincular(parseInt(selectedZK), parseInt(selectedPersonal));
      setSelectedZK('');
      setSelectedPersonal('');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Empleado del Biométrico</label>
        <input type="text" placeholder="Buscar..." value={searchZK} onChange={e => setSearchZK(e.target.value)}
          className="w-full mb-2 px-3 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
        <select value={selectedZK} onChange={e => setSelectedZK(e.target.value)}
          className="w-full px-3 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500">
          <option value="">Seleccionar...</option>
          {filteredZK.map(u => (
            <option key={u.id} value={u.id}>{u.primer_nombre} {u.apellidos} (PIN: {u.emp_pin})</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Empleado del Sistema</label>
        <input type="text" placeholder="Buscar..." value={searchPersonal} onChange={e => setSearchPersonal(e.target.value)}
          className="w-full mb-2 px-3 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
        <select value={selectedPersonal} onChange={e => setSelectedPersonal(e.target.value)}
          className="w-full px-3 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500">
          <option value="">Seleccionar...</option>
          {filteredPersonal.map(p => (
            <option key={p.id} value={p.id}>{p.primer_nombre} {p.apellido_paterno} {p.apellido_materno || ''} (CI: {p.ci})</option>
          ))}
        </select>
      </div>
      <button onClick={handleSubmit} disabled={!selectedZK || !selectedPersonal}
        className="w-full py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:bg-slate-300">
        Vincular
      </button>
    </div>
  );
};

/* ==================== ATTENDANCE TAB ==================== */
const AttendanceTab = ({ showStatus }) => {
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [marcaciones, setMarcaciones] = useState([]);
  const [resumen, setResumen] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pers, res] = await Promise.all([
        api.get(`/api/biometrico/asistencia-personas?mes=${mes}&anio=${anio}`),
        api.get(`/api/biometrico/asistencia-mensual?mes=${mes}&anio=${anio}`),
      ]);
      setPersonas(pers.data);
      setResumen(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [mes, anio]);

  const fetchMarcaciones = async (personalId) => {
    try {
      const res = await api.get(`/api/biometrico/marcaciones/${personalId}?mes=${mes}&anio=${anio}`);
      setMarcaciones(res.data);
      setSelectedPersona(personalId);
    } catch (e) { console.error(e); }
  };

  const meses = [
    { id: 1, nombre: 'Enero' }, { id: 2, nombre: 'Febrero' }, { id: 3, nombre: 'Marzo' },
    { id: 4, nombre: 'Abril' }, { id: 5, nombre: 'Mayo' }, { id: 6, nombre: 'Junio' },
    { id: 7, nombre: 'Julio' }, { id: 8, nombre: 'Agosto' }, { id: 9, nombre: 'Septiembre' },
    { id: 10, nombre: 'Octubre' }, { id: 11, nombre: 'Noviembre' }, { id: 12, nombre: 'Diciembre' }
  ];

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-end">
        <div className="w-44 space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Mes</label>
          <select value={mes} onChange={e => setMes(parseInt(e.target.value))}
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500">
            {meses.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
          </select>
        </div>
        <div className="w-32 space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Año</label>
          <input type="number" value={anio} onChange={e => setAnio(parseInt(e.target.value))}
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personas */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Personal con Asistencia</h3>
              <p className="text-xs text-slate-400 mt-1">{personas.length} registrados</p>
            </div>
            <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-slate-400">Cargando...</div>
              ) : personas.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <Clock size={32} className="mx-auto mb-2 opacity-30" />
                  Sin datos para este período
                </div>
              ) : (
                personas.map(p => (
                  <button key={p.id} onClick={() => fetchMarcaciones(p.id)}
                    className={`w-full text-left px-6 py-4 hover:bg-slate-50 transition-colors flex items-center gap-3 ${
                      selectedPersona === p.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                    }`}>
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
                      {p.primer_nombre?.[0]}{p.apellido_paterno?.[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-700">{p.primer_nombre} {p.apellido_paterno}</p>
                      <p className="text-xs text-slate-400 font-mono">CI: {p.ci}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Marcaciones del día */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">
                {selectedPersona ? 'Marcaciones del Empleado' : 'Selecciona un empleado'}
              </h3>
              {selectedPersona && (
                <p className="text-xs text-slate-400 mt-1">{marcaciones.length} registros en {meses.find(m => m.id === mes)?.nombre} {anio}</p>
              )}
            </div>
            {!selectedPersona ? (
              <div className="p-12 text-center text-slate-300">
                <BarChart3 size={48} className="mx-auto mb-4 opacity-20" />
                Selecciona un empleado de la lista para ver sus marcaciones
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-white">
                    <tr className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Fecha</th>
                      <th className="px-6 py-4">Hora</th>
                      <th className="px-6 py-4">Tipo</th>
                      <th className="px-6 py-4">Origen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {marcaciones.map((m, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-700">
                          {new Date(m.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-600">
                          {new Date(m.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            m.estado_asistencia === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {m.estado_asistencia === 0 ? 'Entrada' : 'Salida'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            m.origen === 'HISTORICO' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {m.origen}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiometricoPage;