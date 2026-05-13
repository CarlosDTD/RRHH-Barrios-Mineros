import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, Download, Upload, UserPlus, Edit, Calendar, Phone, IdCard, ChevronLeft, ChevronRight, History } from 'lucide-react';
import PersonalForm from '../components/PersonalForm';
import HistorialModal from '../components/HistorialModal';
import ImportResultsModal from '../components/ImportResultsModal';

const PersonalPage = () => {
  const [personal, setPersonal] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [catalogos, setCatalogos] = useState({ expediciones: [], profesiones: [] });
  const [filters, setFilters] = useState({ nombre: '', ci: '', item: '', fuentes: [] });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showHistorial, setShowHistorial] = useState(false);
  const [showImportResults, setShowImportResults] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [selectedPersonal, setSelectedPersonal] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPersonal(1);
    fetchCatalogos();
  }, []);

  // Efecto para búsquedas con debounce o al cambiar filtros
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPersonal(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const fetchPersonal = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/personal', { 
        params: { 
          ...filters, 
          fuentes: filters.fuentes.join(','),
          page, 
          limit: 50 
        } 
      });
      setPersonal(response.data.data);
      setPagination(response.data.pagination);
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

  const handleFuenteToggle = (id) => {
    setFilters(prev => {
      const fuentes = prev.fuentes.includes(id)
        ? prev.fuentes.filter(f => f !== id)
        : [...prev.fuentes, id];
      return { ...prev, fuentes };
    });
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
    const params = new URLSearchParams({
      ...filters,
      fuentes: filters.fuentes.join(',')
    }).toString();
    window.open(`http://localhost:3001/api/personal/export?${params}`);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3001/api/personal/import', formData);
      setImportResults(response.data);
      setShowImportResults(true);
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
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6 space-y-4">
        <div className="flex gap-4 items-center">
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
          <div className="w-48 relative">
            <IdCard className="absolute left-3 top-2.5 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="CI..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={filters.ci}
              onChange={(e) => setFilters({ ...filters, ci: e.target.value })}
            />
          </div>
          <div className="w-48 relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Ítem..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={filters.item}
              onChange={(e) => setFilters({ ...filters, item: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <span className="text-sm font-medium text-slate-600">Fuente de Financiamiento:</span>
          <div className="flex gap-4">
            {catalogos.fuentes?.map(fuente => (
              <label key={fuente.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={filters.fuentes.includes(fuente.id)}
                  onChange={() => handleFuenteToggle(fuente.id)}
                />
                <span className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors uppercase">{fuente.nombre_fuente}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="overflow-auto max-h-[calc(100vh-320px)]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm bg-slate-50">CI / Doc.</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm bg-slate-50">Apellidos y Nombres</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm bg-slate-50">Información Laboral</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm bg-slate-50">Profesión</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm bg-slate-50">Contacto</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right bg-slate-50">Acciones</th>
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
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar size={12} /> {formatDate(p.fecha_nacimiento)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-800">{p.cargo_actual || 'SIN CARGO'}</div>
                      <div className="flex gap-2 mt-1">
                        {p.identificador_laboral && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-bold uppercase">
                            Ítem: {p.identificador_laboral}
                          </span>
                        )}
                        {p.nombre_fuente && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded font-bold uppercase">
                            {p.nombre_fuente}
                          </span>
                        )}
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
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => { setSelectedPersonal(p); setShowHistorial(true); }}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Ver trayectoria laboral"
                        >
                          <History size={18} />
                        </button>
                        <button 
                          onClick={() => { setSelectedPersonal(p); setShowForm(true); }}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Editar registro"
                        >
                          <Edit size={18} />
                        </button>
                      </div>
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

      {/* Paginación */}
      {!loading && personal.length > 0 && (
        <div className="mt-4 flex items-center justify-between bg-white px-4 py-3 rounded-xl shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500">
            Mostrando <span className="font-medium">{personal.length}</span> de <span className="font-medium">{pagination.total}</span> registros
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchPersonal(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center px-4 text-sm font-medium text-slate-700">
              Página {pagination.page} de {pagination.totalPages}
            </div>
            <button
              onClick={() => fetchPersonal(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <PersonalForm 
          personal={selectedPersonal} 
          catalogos={catalogos}
          onClose={() => { setShowForm(false); setSelectedPersonal(null); }}
          onSave={handleSave}
        />
      )}

      {showHistorial && selectedPersonal && (
        <HistorialModal 
          personal={selectedPersonal}
          onClose={() => { setShowHistorial(false); setSelectedPersonal(null); }}
        />
      )}

      {showImportResults && (
        <ImportResultsModal 
          results={importResults}
          onClose={() => { setShowImportResults(false); setImportResults(null); }}
        />
      )}
    </div>
  );
};

export default PersonalPage;
