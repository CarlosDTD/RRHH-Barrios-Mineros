import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, UserCheck, UserX, Key, X, Save, RefreshCw, Plus, Search, UserPlus } from 'lucide-react';

export default function AdminUsuariosPage() {
  const { authAxios } = useAuth();
  const api = authAxios();
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);

  const [crearModalAbierto, setCrearModalAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [personalResultados, setPersonalResultados] = useState([]);
  const [buscandoPersonal, setBuscandoPersonal] = useState(false);
  const [personalSeleccionado, setPersonalSeleccionado] = useState(null);
  const [creando, setCreando] = useState(false);
  const searchTimeout = useRef(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes, permRes] = await Promise.all([
        api.get('/api/usuarios'),
        api.get('/api/usuarios/roles'),
        api.get('/api/usuarios/permisos')
      ]);
      setUsuarios(usersRes.data);
      setRoles(rolesRes.data);
      setPermisos(permRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openModal = (user) => {
    setUsuarioEditando(user);
    const roleIds = roles
      .filter(r => (user.roles || []).includes(r.nombre))
      .map(r => r.id);
    setSelectedRoleIds(roleIds);
    setModalAbierto(true);
  };

  const closeModal = () => {
    setModalAbierto(false);
    setUsuarioEditando(null);
    setSelectedRoleIds([]);
  };

  const toggleRole = (rolId) => {
    setSelectedRoleIds(prev =>
      prev.includes(rolId) ? prev.filter(id => id !== rolId) : [...prev, rolId]
    );
  };

  const handleSaveRoles = async () => {
    if (!usuarioEditando) return;
    setSaving(true);
    try {
      await api.put(`/api/usuarios/${usuarioEditando.id}/roles`, { role_ids: selectedRoleIds });
      await loadData();
      closeModal();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActivo = async (user) => {
    const msg = user.activo
      ? `¿Desactivar al usuario "${user.username}"? No podrá iniciar sesión.`
      : `¿Activar al usuario "${user.username}"?`;
    if (!window.confirm(msg)) return;
    try {
      await api.put(`/api/usuarios/${user.id}/toggle-activo`);
      await loadData();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleResetPassword = async (user) => {
    if (!window.confirm(`¿Resetear contraseña de "${user.username}" a su CI (${user.ci})?`)) return;
    try {
      await api.post(`/api/usuarios/${user.id}/reset-password`);
      alert(`Contraseña reseteada a: ${user.ci}`);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const formatNombre = (u) => {
    const parts = [u.primer_nombre, u.segundo_nombre, u.apellido_paterno, u.apellido_materno].filter(Boolean);
    return parts.join(' ') || u.username;
  };

  const openCrearModal = () => {
    setCrearModalAbierto(true);
    setBusqueda('');
    setPersonalResultados([]);
    setPersonalSeleccionado(null);
  };

  const closeCrearModal = () => {
    setCrearModalAbierto(false);
    setBusqueda('');
    setPersonalResultados([]);
    setPersonalSeleccionado(null);
  };

  const handleBuscarPersonal = (value) => {
    setBusqueda(value);
    setPersonalSeleccionado(null);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!value.trim()) {
      setPersonalResultados([]);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      setBuscandoPersonal(true);
      try {
        const res = await api.get(`/api/personal?nombre=${encodeURIComponent(value)}&limit=10`);
        const results = res.data.data || [];
        const { data: usuariosExistentes } = await api.get('/api/usuarios');
        const existingIds = new Set(usuariosExistentes.filter(u => u.personal_id).map(u => u.personal_id));
        setPersonalResultados(results.filter(p => !existingIds.has(p.id)));
      } catch (err) {
        console.error(err);
        setPersonalResultados([]);
      } finally {
        setBuscandoPersonal(false);
      }
    }, 400);
  };

  const handleCrearUsuario = async () => {
    if (!personalSeleccionado) return;
    setCreando(true);
    try {
      await api.post('/api/usuarios', {
        personal_id: personalSeleccionado.id,
        ci: personalSeleccionado.ci
      });
      await loadData();
      closeCrearModal();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setCreando(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-400">Cargando...</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            <Shield size={28} className="text-slate-600" /> Usuarios del Sistema
          </h1>
          <p className="text-slate-500 mt-1">Administración de usuarios, roles y privilegios</p>
        </div>
        <button onClick={openCrearModal} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <UserPlus size={18} /> Crear Usuario
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-left">
                <th className="px-4 py-3 font-semibold">Usuario</th>
                <th className="px-4 py-3 font-semibold">CI</th>
                <th className="px-4 py-3 font-semibold">Username</th>
                <th className="px-4 py-3 font-semibold">Roles</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Último Acceso</th>
                <th className="px-4 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usuarios.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{formatNombre(u)}</p>
                    {u.cargo_actual && <p className="text-xs text-slate-400">{u.cargo_actual}</p>}
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-mono">{u.ci || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{u.username}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(u.roles || []).map(rol => {
                        const colors = {
                          ADMIN: 'bg-purple-100 text-purple-700 border-purple-200',
                          SECRETARIO: 'bg-blue-100 text-blue-700 border-blue-200',
                          DIRECTOR: 'bg-amber-100 text-amber-700 border-amber-200',
                          JEFE_RRHH: 'bg-green-100 text-green-700 border-green-200',
                          AUXILIAR: 'bg-slate-100 text-slate-700 border-slate-200'
                        };
                        return (
                          <span key={rol} className={`px-2 py-0.5 rounded-md text-xs font-medium border ${colors[rol] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                            {rol}
                          </span>
                        );
                      })}
                      {(!u.roles || u.roles.length === 0) && <span className="text-xs text-slate-400">Sin roles</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {u.activo
                      ? <span className="flex items-center gap-1 text-xs font-medium text-green-700"><span className="w-2 h-2 rounded-full bg-green-500"></span> Activo</span>
                      : <span className="flex items-center gap-1 text-xs font-medium text-red-700"><span className="w-2 h-2 rounded-full bg-red-500"></span> Inactivo</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {u.ultimo_acceso ? new Date(u.ultimo_acceso).toLocaleString('es-BO') : 'Nunca'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openModal(u)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar Roles">
                        <Shield size={16} />
                      </button>
                      <button onClick={() => handleToggleActivo(u)} className={`p-2 rounded-lg transition-colors ${u.activo ? 'text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`} title={u.activo ? 'Desactivar' : 'Activar'}>
                        {u.activo ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                      <button onClick={() => handleResetPassword(u)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Resetear Contraseña">
                        <Key size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">No hay usuarios registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {crearModalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">Crear Nuevo Usuario</h2>
              <button onClick={closeCrearModal} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Buscar personal por nombre o CI</label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={e => handleBuscarPersonal(e.target.value)}
                  placeholder="Escribe nombre o CI..."
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div className="mt-3 max-h-52 overflow-y-auto space-y-1">
                {buscandoPersonal && (
                  <div className="flex items-center gap-2 text-sm text-slate-400 py-3 pl-2">
                    <RefreshCw size={14} className="animate-spin" /> Buscando...
                  </div>
                )}
                {!buscandoPersonal && busqueda && personalResultados.length === 0 && (
                  <p className="text-sm text-slate-400 py-3 pl-2">No se encontraron personal sin usuario</p>
                )}
                {!buscandoPersonal && personalResultados.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPersonalSeleccionado(p)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      personalSeleccionado?.id === p.id
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <p className="text-sm font-medium text-slate-800">
                      {[p.primer_nombre, p.segundo_nombre, p.apellido_paterno, p.apellido_materno].filter(Boolean).join(' ')}
                    </p>
                    <p className="text-xs text-slate-400 font-mono">CI: {p.ci}</p>
                  </button>
                ))}
              </div>

              {personalSeleccionado && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-slate-800">Personal seleccionado:</p>
                  <p className="text-sm text-slate-600">
                    {[personalSeleccionado.primer_nombre, personalSeleccionado.segundo_nombre, personalSeleccionado.apellido_paterno, personalSeleccionado.apellido_materno].filter(Boolean).join(' ')}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">CI: {personalSeleccionado.ci}</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-200">
              <button onClick={closeCrearModal} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                Cancelar
              </button>
              <button onClick={handleCrearUsuario} disabled={!personalSeleccionado || creando} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                {creando ? <RefreshCw size={16} className="animate-spin" /> : <UserPlus size={16} />}
                {creando ? 'Creando...' : 'Crear Usuario'}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalAbierto && usuarioEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Editar Roles</h2>
                <p className="text-sm text-slate-500">{formatNombre(usuarioEditando)} ({usuarioEditando.username})</p>
              </div>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {roles.map(rol => (
                <label key={rol.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedRoleIds.includes(rol.id) ? 'border-blue-300 bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input
                    type="checkbox"
                    checked={selectedRoleIds.includes(rol.id)}
                    onChange={() => toggleRole(rol.id)}
                    className="mt-0.5 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{rol.nombre}</p>
                    <p className="text-xs text-slate-500">{rol.descripcion}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {permisos.filter(p => p.modulo === 'correspondencia' || p.modulo === 'usuarios' || p.modulo === 'config').map(p => (
                        <span key={p.id} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                          {p.codigo}
                        </span>
                      ))}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-200">
              <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                Cancelar
              </button>
              <button onClick={handleSaveRoles} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? 'Guardando...' : 'Guardar Roles'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
