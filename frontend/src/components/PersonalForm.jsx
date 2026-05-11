import React, { useState } from 'react';
import { X } from 'lucide-react';

const PersonalForm = ({ personal, catalogos, onClose, onSave }) => {
  // Asegurarse de que las fechas se formateen correctamente para el input date (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState(personal ? {
    ...personal,
    fecha_nacimiento: formatDateForInput(personal.fecha_nacimiento)
  } : {
    ci: '',
    complemento: '',
    exp_id: '',
    apellido_paterno: '',
    apellido_materno: '',
    apellido_casada: '',
    primer_nombre: '',
    segundo_nombre: '',
    fecha_nacimiento: '',
    profesion_id: '',
    telefono: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            {personal ? 'Editar Personal' : 'Nuevo Registro de Personal'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">CI *</label>
              <div className="flex gap-2">
                <input
                  required
                  placeholder="Número"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.ci}
                  onChange={(e) => setFormData({...formData, ci: e.target.value})}
                />
                <input
                  placeholder="Ext"
                  className="w-16 px-2 py-2 border border-slate-300 rounded-lg outline-none"
                  value={formData.complemento || ''}
                  onChange={(e) => setFormData({...formData, complemento: e.target.value})}
                />
                <select 
                  className="w-20 px-2 py-2 border border-slate-300 rounded-lg outline-none"
                  value={formData.exp_id || ''}
                  onChange={(e) => setFormData({...formData, exp_id: e.target.value})}
                >
                  <option value="">Exp.</option>
                  {catalogos.expediciones?.map(e => <option key={e.id} value={e.id}>{e.sigla}</option>)}
                </select>
              </div>
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Nacimiento</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.fecha_nacimiento}
                onChange={(e) => setFormData({...formData, fecha_nacimiento: e.target.value})}
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Primer Nombre *</label>
              <input
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.primer_nombre}
                onChange={(e) => setFormData({...formData, primer_nombre: e.target.value})}
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Segundo Nombre</label>
              <input
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.segundo_nombre || ''}
                onChange={(e) => setFormData({...formData, segundo_nombre: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Apellido Paterno</label>
              <input
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.apellido_paterno || ''}
                onChange={(e) => setFormData({...formData, apellido_paterno: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Apellido Materno</label>
              <input
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.apellido_materno || ''}
                onChange={(e) => setFormData({...formData, apellido_materno: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Apellido de Casada</label>
              <input
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.apellido_casada || ''}
                onChange={(e) => setFormData({...formData, apellido_casada: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
              <input
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.telefono || ''}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Profesión</label>
              <select 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                value={formData.profesion_id || ''}
                onChange={(e) => setFormData({...formData, profesion_id: e.target.value})}
              >
                <option value="">Seleccionar...</option>
                {catalogos.profesiones?.map(p => <option key={p.id} value={p.id}>{p.nombre_profesion}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
            >
              {personal ? 'Guardar Cambios' : 'Registrar Personal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalForm;
