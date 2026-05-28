import { useState, useEffect } from 'react';
import api from '../config/api';
import {
  Settings, Calendar, Download, Plus, X, Search, ChevronLeft, ChevronRight,
  UserPlus, UserX, RefreshCw, FileSpreadsheet, FileText,
  Save, Edit, Trash2, Loader2
} from 'lucide-react';

const FUENTE_COLORS = {
  TGN: 'bg-blue-100 text-blue-800 border-blue-300',
  HIPC: 'bg-green-100 text-green-800 border-green-300',
  MINISTERIO: 'bg-orange-100 text-orange-800 border-orange-300',
  MUNICIPIO: 'bg-purple-100 text-purple-800 border-purple-300',
  CONTRATO: 'bg-gray-100 text-gray-600 border-gray-300',
};

const FUENTE_BG = {
  TGN: 'bg-blue-500',
  HIPC: 'bg-green-500',
  MINISTERIO: 'bg-orange-500',
  MUNICIPIO: 'bg-purple-500',
  CONTRATO: 'bg-gray-400',
};

const TurnosPage = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const [servicios, setServicios] = useState([]);
  const [tiposTurno, setTiposTurno] = useState([]);
  const [selectedServicio, setSelectedServicio] = useState('');
  const [roles, setRoles] = useState([]);
  const [planilla, setPlanilla] = useState([]);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [anio, setAnio] = useState(new Date().getFullYear());

  const fetchServicios = async () => {
    try {
      const { data } = await api.get(`/api/turnos/servicios`);
      setServicios(data);
      if (data.length > 0 && !selectedServicio) setSelectedServicio(String(data[0].id));
    } catch (e) { console.error(e); }
  };

  const fetchTiposTurno = async () => {
    try {
      const { data } = await api.get(`/api/turnos/tipos-turno`);
      setTiposTurno(data);
    } catch (e) { console.error(e); }
  };

  const fetchRoles = async () => {
    if (!selectedServicio) return;
    try {
      const { data } = await api.get(`/api/turnos/roles-turno/servicio/${selectedServicio}`);
      setRoles(data);
    } catch (e) { console.error(e); }
  };

  const fetchPlanilla = async () => {
    if (!selectedServicio) return;
    try {
      const { data } = await api.get(`/api/turnos/planilla`, {
        params: { servicio_id: selectedServicio, mes, anio }
      });
      setPlanilla(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchServicios();
    fetchTiposTurno();
  }, []);

  useEffect(() => {
    if (selectedServicio) fetchRoles();
  }, [selectedServicio]);

  useEffect(() => {
    if (selectedServicio) fetchPlanilla();
  }, [selectedServicio, mes, anio]);

  const diasMes = new Date(anio, mes, 0).getDate();

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Turnos y Guardias</h1>
          <p className="text-slate-500 mt-1">Gestión de roles de turno y planillas por servicio</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedServicio}
            onChange={e => setSelectedServicio(e.target.value)}
            className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 min-w-[250px]"
          >
            <option value="">Seleccionar servicio...</option>
            {servicios.map(s => (
              <option key={s.id} value={s.id}>{s.nombre_unidad}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-1 mb-6 bg-white p-1 rounded-xl shadow-sm border border-slate-100 w-fit">
        {[
          { id: 'roles', label: 'Roles de Turno', icon: <Settings size={16} /> },
          { id: 'planilla', label: 'Planilla', icon: <Calendar size={16} /> },
          { id: 'exportar', label: 'Exportar', icon: <Download size={16} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {!selectedServicio ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
          <p className="text-slate-400">Selecciona un servicio para comenzar</p>
        </div>
      ) : (
        <>
          {activeTab === 'roles' && (
            <RolesTab
              selectedServicio={selectedServicio}
              roles={roles}
              fetchRoles={fetchRoles}
              tiposTurno={tiposTurno}
            />
          )}
          {activeTab === 'planilla' && (
            <PlanillaTab
              selectedServicio={selectedServicio}
              planilla={planilla}
              fetchPlanilla={fetchPlanilla}
              roles={roles}
              tiposTurno={tiposTurno}
              mes={mes} setMes={setMes}
              anio={anio} setAnio={setAnio}
              diasMes={diasMes}
            />
          )}
          {activeTab === 'exportar' && (
            <ExportTab
              selectedServicio={selectedServicio}
              servicios={servicios}
              mes={mes} setMes={setMes}
              anio={anio} setAnio={setAnio}
            />
          )}
        </>
      )}
    </div>
  );
};

// ====================== ROLES TAB ======================
const RolesTab = ({ selectedServicio, roles, fetchRoles }) => {
  const [selectedRol, setSelectedRol] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', cantidad_requerida: 1, prioridad_minima: 5 });
  const [personalAsignado, setPersonalAsignado] = useState([]);
  const [personalDisponible, setPersonalDisponible] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRol, setEditingRol] = useState(null);

  const fetchPersonalAsignado = async () => {
    if (!selectedRol) return;
    try {
      const { data } = await api.get(`/api/turnos/personal-asignado/${selectedRol}`);
      setPersonalAsignado(data);
    } catch (e) { console.error(e); }
  };

  const fetchPersonalDisponible = async () => {
    try {
      const { data } = await api.get(`/api/turnos/personal-disponible`, {
        params: { servicio_id: selectedServicio, q: searchTerm }
      });
      setPersonalDisponible(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (selectedRol) fetchPersonalAsignado();
  }, [selectedRol]);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      fetchPersonalDisponible();
    } else {
      setPersonalDisponible([]);
    }
  }, [searchTerm]);

  const handleCreateRol = async () => {
    try {
      await api.post(`/api/turnos/roles-turno`, {
        ...formData, servicio_id: parseInt(selectedServicio)
      });
      setShowForm(false);
      setFormData({ nombre: '', cantidad_requerida: 1, prioridad_minima: 5 });
      fetchRoles();
    } catch (e) { console.error(e); }
  };

  const handleUpdateRol = async () => {
    try {
      await api.put(`/api/turnos/roles-turno/${editingRol.id}`, formData);
      setEditingRol(null);
      setFormData({ nombre: '', cantidad_requerida: 1, prioridad_minima: 5 });
      fetchRoles();
    } catch (e) { console.error(e); }
  };

  const handleDeleteRol = async (id) => {
    if (!confirm('¿Eliminar este rol de turno?')) return;
    try {
      await api.delete(`/api/turnos/roles-turno/${id}`);
      if (selectedRol === id) { setSelectedRol(null); setPersonalAsignado([]); }
      fetchRoles();
    } catch (e) { console.error(e); }
  };

  const handleAssignPersonal = async (personalId) => {
    try {
      await api.post(`/api/turnos/personal-asignado`, {
        personal_id: personalId, rol_turno_id: selectedRol, prioridad: 1
      });
      fetchPersonalAsignado();
      setSearchTerm('');
      setPersonalDisponible([]);
    } catch (e) { console.error(e); }
  };

  const handleRemovePersonal = async (id) => {
    try {
      await api.delete(`/api/turnos/personal-asignado/${id}`);
      fetchPersonalAsignado();
    } catch (e) { console.error(e); }
  };

  const getFuenteColor = (fuente) => FUENTE_COLORS[fuente] || FUENTE_COLORS.CONTRATO;

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-700">Roles de Turno</h2>
          <button
            onClick={() => { setShowForm(true); setEditingRol(null); setFormData({ nombre: '', cantidad_requerida: 1, prioridad_minima: 5 }); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus size={15} /> Nuevo
          </button>
        </div>

        {showForm && (
          <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <input
              type="text" placeholder="Nombre del rol (ej: Médico de Guardia)"
              value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mb-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Cantidad requerida</label>
                <input type="number" min={1} value={formData.cantidad_requerida}
                  onChange={e => setFormData({ ...formData, cantidad_requerida: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Prioridad mínima (1=TGN, 5=Contrato)</label>
                <input type="number" min={1} max={5} value={formData.prioridad_minima}
                  onChange={e => setFormData({ ...formData, prioridad_minima: parseInt(e.target.value) || 5 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={editingRol ? handleUpdateRol : handleCreateRol}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                <Save size={14} className="inline mr-1" /> {editingRol ? 'Guardar' : 'Crear'}
              </button>
              <button onClick={() => { setShowForm(false); setEditingRol(null); }}
                className="px-3 py-2 bg-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-300">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {roles.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">No hay roles definidos</p>
        ) : (
          <div className="space-y-1.5">
            {roles.map(rol => (
              <div
                key={rol.id}
                onClick={() => { setSelectedRol(rol.id); setEditingRol(null); setShowForm(false); }}
                className={`p-3 rounded-xl cursor-pointer transition-all border ${
                  selectedRol === rol.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-50 border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-700 text-sm">{rol.nombre}</p>
                    <p className="text-xs text-slate-400">
                      Req: {rol.cantidad_requerida} | Prioridad: {rol.prioridad_minima}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={e => { e.stopPropagation(); setEditingRol(rol); setFormData({ nombre: rol.nombre, cantidad_requerida: rol.cantidad_requerida, prioridad_minima: rol.prioridad_minima }); setShowForm(true); }}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit size={14} />
                    </button>
                    <button onClick={e => { e.stopPropagation(); handleDeleteRol(rol.id); }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        {!selectedRol ? (
          <div className="text-center text-slate-400 py-12">
            <Settings size={40} className="mx-auto mb-3 opacity-40" />
            <p>Selecciona un rol de turno para gestionar su personal</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-700">Personal Asignado</h2>
            </div>

            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text" placeholder="Buscar personal para asignar (mín. 2 caracteres)"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              {personalDisponible.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                  {personalDisponible.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleAssignPersonal(p.id)}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-blue-50 text-left text-sm border-b border-slate-50 last:border-0"
                    >
                      <div>
                        <span className="font-medium text-slate-700">{p.nombre_completo}</span>
                        <span className="text-slate-400 ml-2">({p.ci})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getFuenteColor(p.nombre_fuente)}`}>
                          {p.nombre_fuente || 'S/F'}
                        </span>
                        <UserPlus size={14} className="text-blue-600" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {personalAsignado.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">Nadie asignado aún a este rol</p>
            ) : (
              <div className="space-y-2">
                {personalAsignado.map(pa => (
                  <div key={pa.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${FUENTE_BG[pa.nombre_fuente] || 'bg-gray-400'}`}>
                        {pa.primer_nombre?.[0]}{pa.apellido_paterno?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-700 text-sm">
                          {pa.primer_nombre} {pa.apellido_paterno}
                        </p>
                        <p className="text-xs text-slate-400">
                          {pa.cargo_actual} · {pa.ci}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getFuenteColor(pa.nombre_fuente)}`}>
                        {pa.nombre_fuente || 'S/F'}
                      </span>
                      <button onClick={() => handleRemovePersonal(pa.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <UserX size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ====================== PLANILLA TAB ======================
const PlanillaTab = ({ selectedServicio, planilla, fetchPlanilla, roles, tiposTurno, mes, setMes, anio, setAnio, diasMes }) => {
  const [loading, setLoading] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manualData, setManualData] = useState({ rol_turno_id: '', personal_id: '', tipo_turno_id: '1', fecha: '' });
  const [selectedDia, setSelectedDia] = useState(null);
  const [showDetalle, setShowDetalle] = useState(false);

  const planillaAgrupada = {};
  for (const item of planilla) {
    const dia = new Date(item.fecha).getDate();
    const key = `${item.rol_turno_id}-${dia}`;
    if (!planillaAgrupada[key]) planillaAgrupada[key] = [];
    planillaAgrupada[key].push(item);
  }

  const handleGenerarAuto = async () => {
    if (!confirm(`¿Generar planilla automática para ${mes}/${anio}?`)) return;
    setLoading(true);
    try {
      await api.post(`/api/turnos/planilla/generar`, {
        servicio_id: parseInt(selectedServicio), mes, anio
      });
      fetchPlanilla();
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleCreateManual = async () => {
    try {
      await api.post(`/api/turnos/planilla`, {
        servicio_id: parseInt(selectedServicio),
        rol_turno_id: parseInt(manualData.rol_turno_id),
        personal_id: parseInt(manualData.personal_id),
        tipo_turno_id: parseInt(manualData.tipo_turno_id),
        fecha: manualData.fecha,
      });
      setShowManual(false);
      setManualData({ rol_turno_id: '', personal_id: '', tipo_turno_id: '1', fecha: '' });
      fetchPlanilla();
    } catch (e) { console.error(e); }
  };

  const handleDeleteItem = async (id) => {
    try {
      await api.delete(`/api/turnos/planilla/${id}`);
      fetchPlanilla();
      setShowDetalle(false);
    } catch (e) { console.error(e); }
  };

  const cambiarMes = (delta) => {
    let nuevoMes = mes + delta;
    let nuevoAnio = anio;
    if (nuevoMes > 12) { nuevoMes = 1; nuevoAnio++; }
    if (nuevoMes < 1) { nuevoMes = 12; nuevoAnio--; }
    setMes(nuevoMes);
    setAnio(nuevoAnio);
  };

  const getNombreFuente = (item) => item.nombre_fuente || 'CONTRATO';

  const horarios = tiposTurno.reduce((acc, t) => ({ ...acc, [t.codigo]: `${t.hora_inicio?.slice(0,5)||'--'}-${t.hora_fin?.slice(0,5)||'--'}` }), {});

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => cambiarMes(-1)} className="p-2 hover:bg-slate-100 rounded-lg">
            <ChevronLeft size={20} className="text-slate-500" />
          </button>
          <h2 className="text-lg font-bold text-slate-700 min-w-[120px] text-center">
            {new Date(anio, mes - 1).toLocaleString('es', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={() => cambiarMes(1)} className="p-2 hover:bg-slate-100 rounded-lg">
            <ChevronRight size={20} className="text-slate-500" />
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowManual(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200">
            <Plus size={15} /> Manual
          </button>
          <button onClick={handleGenerarAuto} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {loading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
            Generar Automático
          </button>
        </div>
      </div>

      {showManual && (
        <div className="mb-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="text-sm font-bold text-slate-600 mb-3">Agregar Asignación Manual</h3>
          <div className="grid grid-cols-5 gap-3">
            <select value={manualData.rol_turno_id} onChange={e => setManualData({ ...manualData, rol_turno_id: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Rol de turno...</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </select>
            <input type="date" value={manualData.fecha} onChange={e => setManualData({ ...manualData, fecha: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <select value={manualData.tipo_turno_id} onChange={e => setManualData({ ...manualData, tipo_turno_id: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
              {tiposTurno.map(tt => <option key={tt.id} value={tt.id}>{tt.nombre} ({horarios[tt.codigo]})</option>)}
            </select>
            <PersonalSearchSelect servicioId={selectedServicio}
              onChange={v => setManualData({ ...manualData, personal_id: v })} />
            <div className="flex gap-2">
              <button onClick={handleCreateManual}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Asignar</button>
              <button onClick={() => setShowManual(false)}
                className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-300">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 text-slate-500 font-medium text-xs sticky left-0 bg-white z-10 min-w-[180px]">Rol de Turno</th>
              {Array.from({ length: diasMes }, (_, i) => (
                <th key={i} className={`text-center p-1.5 text-xs font-medium ${new Date(anio, mes - 1, i + 1).getDay() === 0 ? 'text-red-400' : 'text-slate-500'}`}>
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map(rol => (
              <tr key={rol.id}>
                <td className="text-left p-2 text-xs font-medium text-slate-600 sticky left-0 bg-white border-t border-slate-100">{rol.nombre}</td>
                {Array.from({ length: diasMes }, (_, i) => {
                  const dia = i + 1;
                  const items = planillaAgrupada[`${rol.id}-${dia}`] || [];
                  return (
                    <td key={i}
                      onClick={() => { setSelectedDia(dia); setShowDetalle(true); }}
                      className="text-center p-0.5 border-t border-slate-50 align-top cursor-pointer hover:bg-blue-50 transition-colors"
                      style={{ minWidth: '40px', height: '50px' }}
                    >
                      <div className="space-y-0.5">
                        {items.slice(0, 3).map((item) => (
                          <div key={item.id}
                            className={`text-[10px] leading-tight px-1 py-0.5 rounded ${FUENTE_BG[getNombreFuente(item)]} text-white truncate`}
                            title={`${item.primer_nombre} ${item.apellido_paterno} (${item.turno_codigo})`}
                          >
                            {item.primer_nombre?.slice(0, 1)}.{item.apellido_paterno?.slice(0, 3)}
                          </div>
                        ))}
                        {items.length > 3 && <div className="text-[9px] text-slate-400">+{items.length - 3}</div>}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDetalle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDetalle(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-700">
                Asignaciones - Día {selectedDia} de {new Date(anio, mes - 1).toLocaleString('es', { month: 'long', year: 'numeric' })}
              </h3>
              <button onClick={() => setShowDetalle(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {planilla
                .filter(p => new Date(p.fecha).getDate() === selectedDia)
                .map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="font-medium text-slate-700 text-sm">
                        {item.primer_nombre} {item.apellido_paterno}
                      </p>
                      <p className="text-xs text-slate-400">
                        {item.rol_nombre} · {item.turno_nombre}
                      </p>
                    </div>
                    <button onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg">
                      <X size={14} />
                    </button>
                  </div>
                ))}
            </div>
            {planilla.filter(p => new Date(p.fecha).getDate() === selectedDia).length === 0 && (
              <p className="text-center text-slate-400 py-4">Sin asignaciones este día</p>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500"></span> TGN</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500"></span> HIPC</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-500"></span> MINISTERIO</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-500"></span> MUNICIPIO</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-400"></span> CONTRATO</span>
      </div>
    </div>
  );
};

const PersonalSearchSelect = ({ servicioId, onChange }) => {
  const [personal, setPersonal] = useState([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (search.length >= 2) {
      api.get(`/api/turnos/personal-disponible`, {
        params: { servicio_id: servicioId, q: search }
      }).then(r => setPersonal(r.data)).catch(() => {});
    }
  }, [search, servicioId]);

  return (
    <div className="relative">
      <input type="text" placeholder="Buscar personal..."
        value={search} onChange={e => { setSearch(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />
      {open && personal.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-40 overflow-y-auto">
          {personal.map(p => (
            <button key={p.id} onClick={() => { onChange(String(p.id)); setSearch(`${p.primer_nombre || ''} ${p.apellido_paterno || ''}`); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 border-b border-slate-50 last:border-0">
              {p.nombre_completo} - {p.nombre_fuente}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ====================== EXPORT TAB ======================
const ExportTab = ({ selectedServicio, servicios, mes, setMes, anio, setAnio }) => {
  const servicio = servicios.find(s => s.id === parseInt(selectedServicio));

  const handleExport = async (formato) => {
    try {
      const { data } = await api.get(`/api/turnos/planilla/export`, {
        params: { servicio_id: selectedServicio, mes, anio, formato },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `planilla_${servicio?.nombre_unidad?.replace(/\s+/g, '_')}_${mes}_${anio}.${formato === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
      <div className="max-w-md mx-auto text-center">
        <Download size={48} className="mx-auto mb-4 text-blue-600 opacity-60" />
        <h2 className="text-xl font-bold text-slate-700 mb-2">Exportar Planilla</h2>
        <p className="text-slate-400 text-sm mb-6">
          {servicio?.nombre_unidad} - {new Date(anio, mes - 1).toLocaleString('es', { month: 'long', year: 'numeric' })}
        </p>

        <div className="flex items-center justify-center gap-3 mb-6">
          <button onClick={() => { let m = mes - 1; let a = anio; if (m < 1) { m = 12; a--; } setMes(m); setAnio(a); }}
            className="p-2 hover:bg-slate-100 rounded-lg"><ChevronLeft size={18} className="text-slate-500" /></button>
          <span className="font-medium text-slate-600 min-w-[100px]">
            {new Date(anio, mes - 1).toLocaleString('es', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => { let m = mes + 1; let a = anio; if (m > 12) { m = 1; a++; } setMes(m); setAnio(a); }}
            className="p-2 hover:bg-slate-100 rounded-lg"><ChevronRight size={18} className="text-slate-500" /></button>
        </div>

        <div className="flex gap-4 justify-center">
          <button onClick={() => handleExport('xlsx')}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium text-sm hover:bg-green-700 transition-colors">
            <FileSpreadsheet size={18} /> Exportar Excel
          </button>
          <button onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-medium text-sm hover:bg-red-700 transition-colors">
            <FileText size={18} /> Exportar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default TurnosPage;
