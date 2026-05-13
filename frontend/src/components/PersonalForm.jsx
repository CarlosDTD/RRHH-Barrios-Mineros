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
    fecha_nacimiento: formatDateForInput(personal.fecha_nacimiento),
    fecha_ingreso: formatDateForInput(personal.fecha_ingreso),
    fecha_institucionalizacion: formatDateForInput(personal.fecha_institucionalizacion)
  } : {
    ci: '',
    complemento: '',
    exp_id: '',
    apellido_paterno: '',
    apellido_materno: '',
    apellido_casada: '',
    primer_nombre: '',
    segundo_nombre: '',
    tercer_nombre: '',
    fecha_nacimiento: '',
    profesion_id: '',
    telefono: '',
    // Datos laborales
    establecimiento_id: '',
    tipo_personal_id: '',
    fuente_financiamiento_id: '',
    identificador_laboral: '',
    unidad_servicio: '',
    cargo_actual: '',
    carga_horaria: '',
    fecha_ingreso: '',
    fecha_institucionalizacion: '',
    cargo_planilla: '',
    cargo_escala: '',
    nro_resumen_ejecutivo: '',
    observaciones: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden max-h-[95vh] flex flex-col border border-slate-200">
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {personal ? 'Actualizar Ficha Técnica' : 'Nueva Ficha de Personal'}
            </h2>
            <p className="text-slate-500 text-sm font-medium">Gestión integral de datos personales y laborales</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-rose-500 transition-all">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="overflow-y-auto bg-slate-50/30">
          <div className="p-8 space-y-10">
            {/* Sección: Datos de Identidad */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1.5 bg-blue-600 rounded-full"></div>
                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">I. Identidad y Datos Personales</h3>
              </div>
              
              <div className="grid grid-cols-12 gap-5">
                <div className="col-span-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">Documento de Identidad (CI) *</label>
                  <div className="flex gap-2">
                    <input
                      required
                      placeholder="Número"
                      className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm font-bold text-slate-700 shadow-sm transition-all"
                      value={formData.ci}
                      onChange={(e) => setFormData({...formData, ci: e.target.value})}
                    />
                    <input
                      placeholder="Ext"
                      className="w-14 px-2 py-2.5 bg-white border border-slate-200 rounded-xl outline-none text-sm text-center font-bold text-slate-700 shadow-sm"
                      value={formData.complemento || ''}
                      onChange={(e) => setFormData({...formData, complemento: e.target.value})}
                    />
                    <select 
                      className="w-20 px-2 py-2.5 bg-white border border-slate-200 rounded-xl outline-none text-sm font-bold text-slate-700 shadow-sm cursor-pointer"
                      value={formData.exp_id || ''}
                      onChange={(e) => setFormData({...formData, exp_id: e.target.value})}
                    >
                      <option value="">Exp.</option>
                      {catalogos.expediciones?.map(e => <option key={e.id} value={e.id}>{e.sigla}</option>)}
                    </select>
                  </div>
                </div>

                <div className="col-span-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">Primer Nombre *</label>
                  <input
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm font-bold text-slate-700 shadow-sm transition-all"
                    value={formData.primer_nombre}
                    onChange={(e) => setFormData({...formData, primer_nombre: e.target.value})}
                  />
                </div>

                <div className="col-span-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">Segundo Nombre</label>
                  <input
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm font-bold text-slate-700 shadow-sm transition-all"
                    value={formData.segundo_nombre || ''}
                    onChange={(e) => setFormData({...formData, segundo_nombre: e.target.value})}
                  />
                </div>

                <div className="col-span-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">Apellido Paterno</label>
                  <input
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm font-bold text-slate-700 shadow-sm transition-all"
                    value={formData.apellido_paterno || ''}
                    onChange={(e) => setFormData({...formData, apellido_paterno: e.target.value})}
                  />
                </div>

                <div className="col-span-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">Apellido Materno</label>
                  <input
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm font-bold text-slate-700 shadow-sm transition-all"
                    value={formData.apellido_materno || ''}
                    onChange={(e) => setFormData({...formData, apellido_materno: e.target.value})}
                  />
                </div>

                <div className="col-span-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">Apellido de Casada</label>
                  <input
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm font-bold text-slate-700 shadow-sm transition-all"
                    value={formData.apellido_casada || ''}
                    onChange={(e) => setFormData({...formData, apellido_casada: e.target.value})}
                  />
                </div>

                <div className="col-span-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm font-bold text-slate-700 shadow-sm transition-all"
                    value={formData.fecha_nacimiento}
                    onChange={(e) => setFormData({...formData, fecha_nacimiento: e.target.value})}
                  />
                </div>

                <div className="col-span-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">Número de Teléfono</label>
                  <input
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm font-bold text-slate-700 shadow-sm transition-all"
                    value={formData.telefono || ''}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  />
                </div>

                <div className="col-span-6">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">Profesión / Grado Académico</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none text-sm font-bold text-slate-700 shadow-sm cursor-pointer"
                    value={formData.profesion_id || ''}
                    onChange={(e) => setFormData({...formData, profesion_id: e.target.value})}
                  >
                    <option value="">Seleccionar profesión...</option>
                    {catalogos.profesiones?.map(p => <option key={p.id} value={p.id}>{p.nombre_profesion}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* Sección: Estatus Laboral */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1.5 bg-emerald-500 rounded-full"></div>
                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">II. Información Laboral y Cargos</h3>
              </div>

              <div className="grid grid-cols-12 gap-5 bg-emerald-50/20 p-6 rounded-2xl border border-emerald-100">
                <div className="col-span-6">
                  <label className="block text-[10px] font-black text-emerald-600 uppercase mb-1.5 ml-1">Establecimiento de Salud</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-white border border-emerald-100 rounded-xl outline-none text-sm font-bold text-slate-700 shadow-sm"
                    value={formData.establecimiento_id || ''}
                    onChange={(e) => setFormData({...formData, establecimiento_id: e.target.value})}
                  >
                    <option value="">Seleccionar establecimiento...</option>
                    {catalogos.establecimientos?.map(est => <option key={est.id} value={est.id}>{est.nombre_establecimiento}</option>)}
                  </select>
                </div>

                <div className="col-span-3">
                  <label className="block text-[10px] font-black text-emerald-600 uppercase mb-1.5 ml-1">Tipo de Personal</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-white border border-emerald-100 rounded-xl outline-none text-sm font-bold text-slate-700 shadow-sm"
                    value={formData.tipo_personal_id || ''}
                    onChange={(e) => setFormData({...formData, tipo_personal_id: e.target.value})}
                  >
                    <option value="">Seleccionar tipo...</option>
                    {catalogos.tipos?.map(t => <option key={t.id} value={t.id}>{t.nombre_tipo}</option>)}
                  </select>
                </div>

                <div className="col-span-3">
                  <label className="block text-[10px] font-black text-emerald-600 uppercase mb-1.5 ml-1">Fuente de Financiamiento</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-white border border-emerald-100 rounded-xl outline-none text-sm font-bold text-slate-700 shadow-sm"
                    value={formData.fuente_financiamiento_id || ''}
                    onChange={(e) => setFormData({...formData, fuente_financiamiento_id: e.target.value})}
                  >
                    <option value="">Seleccionar fuente...</option>
                    {catalogos.fuentes?.map(f => <option key={f.id} value={f.id}>{f.nombre_fuente}</option>)}
                  </select>
                </div>

                <div className="col-span-3">
                  <label className="block text-[10px] font-black text-emerald-600 uppercase mb-1.5 ml-1">N° Ítem / Contrato</label>
                  <input
                    placeholder="Ej. 42004"
                    className="w-full px-4 py-2.5 bg-white border border-emerald-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-black text-blue-600 shadow-sm transition-all"
                    value={formData.identificador_laboral || ''}
                    onChange={(e) => setFormData({...formData, identificador_laboral: e.target.value})}
                  />
                </div>

                <div className="col-span-9">
                  <label className="block text-[10px] font-black text-emerald-600 uppercase mb-1.5 ml-1">Cargo Actual (Funcional)</label>
                  <input
                    placeholder="Ej. MÉDICO ESPECIALISTA..."
                    className="w-full px-4 py-2.5 bg-white border border-emerald-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-bold text-slate-700 shadow-sm transition-all"
                    value={formData.cargo_actual || ''}
                    onChange={(e) => setFormData({...formData, cargo_actual: e.target.value})}
                  />
                </div>

                {/* Campos Nuevos */}
                <div className="col-span-4">
                  <label className="block text-[10px] font-black text-emerald-600 uppercase mb-1.5 ml-1">Cargo según Planilla</label>
                  <input
                    className="w-full px-4 py-2.5 bg-white border border-emerald-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-bold text-slate-700 shadow-sm transition-all"
                    value={formData.cargo_planilla || ''}
                    onChange={(e) => setFormData({...formData, cargo_planilla: e.target.value})}
                  />
                </div>

                <div className="col-span-4">
                  <label className="block text-[10px] font-black text-emerald-600 uppercase mb-1.5 ml-1">Cargo según Escala</label>
                  <input
                    className="w-full px-4 py-2.5 bg-white border border-emerald-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-bold text-slate-700 shadow-sm transition-all"
                    value={formData.cargo_escala || ''}
                    onChange={(e) => setFormData({...formData, cargo_escala: e.target.value})}
                  />
                </div>

                <div className="col-span-4">
                  <label className="block text-[10px] font-black text-emerald-600 uppercase mb-1.5 ml-1">N° Resumen Ejecutivo</label>
                  <input
                    className="w-full px-4 py-2.5 bg-white border border-emerald-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-bold text-slate-700 shadow-sm transition-all"
                    value={formData.nro_resumen_ejecutivo || ''}
                    onChange={(e) => setFormData({...formData, nro_resumen_ejecutivo: e.target.value})}
                  />
                </div>

                <div className="col-span-6">
                  <label className="block text-[10px] font-black text-emerald-600 uppercase mb-1.5 ml-1">Unidad o Servicio</label>
                  <input
                    className="w-full px-4 py-2.5 bg-white border border-emerald-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-bold text-slate-700 shadow-sm transition-all"
                    value={formData.unidad_servicio || ''}
                    onChange={(e) => setFormData({...formData, unidad_servicio: e.target.value})}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-emerald-600 uppercase mb-1.5 ml-1">Carga Horaria</label>
                  <input
                    placeholder="MT / TC"
                    className="w-full px-4 py-2.5 bg-white border border-emerald-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-bold text-slate-700 shadow-sm transition-all text-center"
                    value={formData.carga_horaria || ''}
                    onChange={(e) => setFormData({...formData, carga_horaria: e.target.value})}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-emerald-600 uppercase mb-1.5 ml-1">F. Ingreso</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 bg-white border border-emerald-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-bold text-slate-700 shadow-sm transition-all"
                    value={formData.fecha_ingreso}
                    onChange={(e) => setFormData({...formData, fecha_ingreso: e.target.value})}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-emerald-600 uppercase mb-1.5 ml-1">F. Instituc.</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 bg-white border border-emerald-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-bold text-slate-700 shadow-sm transition-all"
                    value={formData.fecha_institucionalizacion}
                    onChange={(e) => setFormData({...formData, fecha_institucionalizacion: e.target.value})}
                  />
                </div>

                <div className="col-span-12">
                  <label className="block text-[10px] font-black text-emerald-600 uppercase mb-1.5 ml-1">Observaciones Generales</label>
                  <textarea
                    rows="2"
                    placeholder="Anotaciones adicionales sobre el vínculo laboral..."
                    className="w-full px-4 py-2.5 bg-white border border-emerald-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-medium text-slate-700 shadow-sm transition-all"
                    value={formData.observaciones || ''}
                    onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  ></textarea>
                </div>
              </div>
            </section>
          </div>

          <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-all text-sm font-bold"
            >
              Cerrar sin guardar
            </button>
            <button 
              type="submit"
              className="px-10 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-500/20 text-sm font-black uppercase tracking-wider"
            >
              {personal ? 'Guardar Cambios' : 'Confirmar Registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalForm;
