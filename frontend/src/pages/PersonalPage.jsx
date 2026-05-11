import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, Download, Upload, UserPlus, Edit, Calendar, Phone, IdCard } from 'lucide-react';
import PersonalForm from '../components/PersonalForm';

const PersonalPage = () => {
  const [personal, setPersonal] = useState([]);
  const [catalogos, setCatalogos] = useState({ expediciones: [], profesiones: [] });
  const [filters, setFilters] = useState({ nombre: '', ci: '' });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPersonal, setSelectedPersonal] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPersonal();
    fetchCatalogos();
  }, [filters]);

  const fetchPersonal = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/personal', { params: filters });
      setPersonal(response.data);
    } catch (error) {
      console.error('Error fetching personal:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCatalogos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/personal/catalogos');
      setCatalogos(response.data);
    } catch (error) {
      console.error('Error fetching catalogos:', error);
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedPersonal) {
        await axios.put(`http://localhost:3001/api/personal/${selectedPersonal.id}`, data);
      } else {
        await axios.post('http://localhost:3001/api/personal', data);
      }
      setShowForm(false);
      setSelectedPersonal(null);
      fetchPersonal();
    } catch (error) {
      alert('Error al guardar: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleExport = () => {
    window.open(`http://localhost:3001/api/personal/export?nombre=${filters.nombre}&ci=${filters.ci}`);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3001/api/personal/import', formData);
      alert(`Importación completada: ${response.data.success} exitosos, ${response.data.errors} errores.`);
      fetchPersonal();
    } catch (error) {
      alert('Error al importar: ' + error.message);
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const formatFullName = (p) => {
    const parts = [
      p.apellido_paterno,
      p.apellido_materno,
      p.apellido_casada ? `de ${p.apellido_casada}` : '',
      p.primer_nombre,
      p.segundo_nombre
    ].filter(Boolean);
    return parts.join(' ');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-BO');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestión de Personal</h1>
          <p className="text-slate-500 text-sm">Control y administración de recursos humanos del Hospital Barrios Mineros</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { setSelectedPersonal(null); setShowForm(true); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <UserPlus size={18} /> Nuevo Registro
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Download size={18} /> Exportar
          </button>
          <button 
            onClick={() => fileInputRef.current.click()}
            className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
          >
            <Upload size={18} /> Importar
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            className="hidden" 
            accept=".xlsx, .xls"
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o apellido..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={filters.nombre}
            onChange={(e) => setFilters({ ...filters, nombre: e.target.value })}
          />
        </div>
        <div className="w-64 relative">
          <IdCard className="absolute left-3 top-2.5 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="CI..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={filters.ci}
            onChange={(e) => setFilters({ ...filters, ci: e.target.value })}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">CI / Doc.</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Apellidos y Nombres</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">F. Nacimiento</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Profesión</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Contacto</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Cargando datos del personal...</span>
                  </div>
                </td></tr>
              ) : personal.length > 0 ? (
                personal.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">
                        {p.ci} {p.complemento ? `-${p.complemento}` : ''}
                      </div>
                      <div className="text-xs text-slate-500 uppercase">{p.expedicion || 'SIN EXP.'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-800 font-semibold">{formatFullName(p)}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-slate-400" />
                        {formatDate(p.fecha_nacimiento)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                        {p.nombre_profesion || 'No asignada'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Phone size={14} className="text-slate-400" />
                        {p.telefono || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => { setSelectedPersonal(p); setShowForm(true); }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Editar registro"
                      >
                        <Edit size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                  No se encontró personal registrado con los criterios de búsqueda.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <PersonalForm 
          personal={selectedPersonal} 
          catalogos={catalogos}
          onClose={() => { setShowForm(false); setSelectedPersonal(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default PersonalPage;
