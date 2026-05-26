import React, { useState } from 'react';
import { X } from 'lucide-react';

const PersonalForm = ({ personal, catalogos, onClose, onSave }) => {
  // Asegurarse de que las fechas se formateen correctamente para el input date (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  const getSelectedFuenteName = (fuenteId) => {
    const fuente = catalogos.fuentes?.find(f => f.id === parseInt(fuenteId));
    return fuente ? fuente.nombre_fuente.toUpperCase() : '';
  };

  const [formData, setFormData] = useState(personal ? {
    ...personal,
    fecha_nacimiento: formatDateForInput(personal.fecha_nacimiento),
    fecha_ingreso: formatDateForInput(personal.fecha_ingreso),
    fecha_fin_contrato: formatDateForInput(personal.fecha_fin_contrato),
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
    biometrico_id: '',
    // Datos laborales
    establecimiento_id: '',
    tipo_personal_id: '',
    fuente_financiamiento_id: '',
    identificador_laboral: '',
    unidad_servicio_id: '',
    unidad_servicio: '',
    cargo_actual: '',
    carga_horaria: '',
    fecha_ingreso: today,
    fecha_fin_contrato: '',
    fecha_institucionalizacion: '',
    cargo_planilla: '',
    cargo_escala: '',
    nro_resumen_ejecutivo: '',
    observaciones: ''
  });

  const [errors, setErrors] = useState({});

  const selectedFuenteName = getSelectedFuenteName(formData.fuente_financiamiento_id);
  const esMunicipio = selectedFuenteName === 'MUNICIPIO';

  const validate = () => {
    const newErrors = {};
    if (!formData.ci) newErrors.ci = 'El CI es obligatorio';
    if (!formData.primer_nombre) newErrors.primer_nombre = 'El primer nombre es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  const inputClass = (field) => `w-full px-4 py-2.5 bg-white border ${errors[field] ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200'} rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm font-bold text-slate-700 shadow-sm transition-all`;
  const inputClassEmerald = (field) => `w-full px-4 py-2.5 bg-white border ${errors[field] ? 'border-rose-400 ring-2 ring-rose-100' : 'border-emerald-100'} rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-sm font-bold text-slate-700 shadow-sm transition-all`;
  const labelClass = 'block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1';
  const labelClassEmerald = 'block text-[10px] font-black text-emerald-600 uppercase mb-1.5 ml-1';

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
                  <label className={labelClass}>Documento de Identidad (CI) *</label>
                  <div className="flex gap-2">
                    <input
                      required
                      placeholder="Número"
                      className={inputClass('ci')}
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
                  {errors.ci && <p className="text-rose-500 text-xs mt-1 ml-1">{errors.ci}</p>}
                </div>

                <div className="col-span-4">
                  <label className={labelClass}>Primer Nombre *</label>
                  <input
                    required
                    className={inputClass('primer_nombre')}
                    value={formData.primer_nombre}
                    onChange={(e) => setFormData({...formData, primer_nombre: e.target.value})}
                  />
                  {errors.primer_nombre && <p className="text-rose-500 text-xs mt-1 ml-1">{errors.primer_nombre}</p>}
                </div>

                <div className="col-span-4">
                  <label className={labelClass}>Segundo Nombre</label>
                  <input
                    className={inputClass()}
                    value={formData.segundo_nombre || ''}
                    onChange={(e) => setFormData({...formData, segundo_nombre: e.target.value})}
                  />
                </div>

                <div className="col-span-4">
                  <label className={labelClass}>Apellido Paterno</label>
                  <input
                    className={inputClass()}
                    value={formData.apellido_paterno || ''}
                    onChange={(e) => setFormData({...formData, apellido_paterno: e.target.value})}
                  />
                </div>

                <div className="col-span-4">
                  <label className={labelClass}>Apellido Materno</label>
                  <input
                    className={inputClass()}
                    value={formData.apellido_materno || ''}
                    onChange={(e) => setFormData({...formData, apellido_materno: e.target.value})}
                  />
                </div>

                <div className="col-span-4">
                  <label className={labelClass}>Apellido de Casada</label>
                  <input
                    className={inputClass()}
                    value={formData.apellido_casada || ''}
                    onChange={(e) => setFormData({...formData, apellido_casada: e.target.value})}
                  />
                </div>

                <div className="col-span-3">
                  <label className={labelClass}>Fecha de Nacimiento</label>
                  <input
                    type="date"
                    className={inputClass()}
                    value={formData.fecha_nacimiento}
                    onChange={(e) => setFormData({...formData, fecha_nacimiento: e.target.value})}
                  />
                </div>

                <div className="col-span-3">
                  <label className={labelClass}>Número de Teléfono</label>
                  <input
                    className={inputClass()}
                    value={formData.telefono || ''}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  />
                </div>

                <div className="col-span-3">
                  <label className={labelClass}>ID Biométrico</label>
                  <input
                    className={inputClass()}
                    value={formData.biometrico_id || ''}
                    onChange={(e) => setFormData({...formData, biometrico_id: e.target.value})}
                  />
                </div>

                <div className="col-span-3">
                  <label className={labelClass}>Profesión / Grado Académico</label>
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
                <div className="col-span-4">
                  <label className={labelClassEmerald}>Establecimiento de Salud</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-white border border-emerald-100 rounded-xl outline-none text-sm font-bold text-slate-700 shadow-sm cursor-pointer"
                    value={formData.establecimiento_id || ''}
                    onChange={(e) => setFormData({...formData, establecimiento_id: e.target.value})}
                  >
                    <option value="">Seleccionar establecimiento...</option>
                    {catalogos.establecimientos?.map(est => <option key={est.id} value={est.id}>{est.nombre_establecimiento}</option>)}
                  </select>
                </div>

                <div className="col-span-3">
                  <label className={labelClassEmerald}>Tipo de Personal</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-white border border-emerald-100 rounded-xl outline-none text-sm font-bold text-slate-700 shadow-sm cursor-pointer"
                    value={formData.tipo_personal_id || ''}
                    onChange={(e) => setFormData({...formData, tipo_personal_id: e.target.value})}
                  >
                    <option value="">Seleccionar tipo...</option>
                    {catalogos.tipos?.map(t => <option key={t.id} value={t.id}>{t.nombre_tipo}</option>)}
                  </select>
                </div>

                <div className="col-span-3">
                  <label className={labelClassEmerald}>Fuente de Financiamiento</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-white border border-emerald-100 rounded-xl outline-none text-sm font-bold text-slate-700 shadow-sm cursor-pointer"
                    value={formData.fuente_financiamiento_id || ''}
                    onChange={(e) => setFormData({...formData, fuente_financiamiento_id: e.target.value})}
                  >
                    <option value="">Seleccionar fuente...</option>
                    {catalogos.fuentes?.map(f => <option key={f.id} value={f.id}>{f.nombre_fuente}</option>)}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className={labelClassEmerald}>N° Ítem / Contrato</label>
                  <input
                    placeholder="Ej. 42004"
                    className={inputClassEmerald()}
                    value={formData.identificador_laboral || ''}
                    onChange={(e) => setFormData({...formData, identificador_laboral: e.target.value})}
                  />
                </div>

                <div className="col-span-6">
                  <label className={labelClassEmerald}>Unidad o Servicio</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-white border border-emerald-100 rounded-xl outline-none text-sm font-bold text-slate-700 shadow-sm cursor-pointer"
                    value={formData.unidad_servicio_id || ''}
                    onChange={(e) => {
                      const selected = catalogos.unidades_servicios?.find(u => u.id === parseInt(e.target.value));
                      setFormData({
                        ...formData, 
                        unidad_servicio_id: e.target.value,
                        unidad_servicio: selected ? selected.nombre_unidad : ''
                      });
                    }}
                  >
                    <option value="">Seleccionar unidad...</option>
                    {catalogos.unidades_servicios?.map(u => <option key={u.id} value={u.id}>{u.nombre_unidad}</option>)}
                  </select>
                </div>

                <div className="col-span-6">
                  <label className={labelClassEmerald}>Cargo Actual (Funcional)</label>
                  <input
                    placeholder="Ej. MÉDICO ESPECIALISTA..."
                    className={inputClassEmerald()}
                    value={formData.cargo_actual || ''}
                    onChange={(e) => setFormData({...formData, cargo_actual: e.target.value})}
                  />
                </div>

                <div className="col-span-4">
                  <label className={labelClassEmerald}>Cargo según Planilla</label>
                  <input
                    className={inputClassEmerald()}
                    value={formData.cargo_planilla || ''}
                    onChange={(e) => setFormData({...formData, cargo_planilla: e.target.value})}
                  />
                </div>

                {!esMunicipio && (
                  <>
                    <div className="col-span-4">
                      <label className={labelClassEmerald}>Cargo según Escala</label>
                      <input
                        className={inputClassEmerald()}
                        value={formData.cargo_escala || ''}
                        onChange={(e) => setFormData({...formData, cargo_escala: e.target.value})}
                      />
                    </div>

                    <div className="col-span-4">
                      <label className={labelClassEmerald}>N° Resumen Ejecutivo</label>
                      <input
                        className={inputClassEmerald()}
                        value={formData.nro_resumen_ejecutivo || ''}
                        onChange={(e) => setFormData({...formData, nro_resumen_ejecutivo: e.target.value})}
                      />
                    </div>
                  </>
                )}

                {esMunicipio && (
                  <div className="col-span-8">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                      <span className="text-amber-600 text-xs font-bold">MUNICIPIO: No requiere cargo según escala ni resumen ejecutivo</span>
                    </div>
                  </div>
                )}

                <div className="col-span-2">
                  <label className={labelClassEmerald}>Carga Horaria</label>
                  <input
                    placeholder="MT / TC"
                    className={`${inputClassEmerald()} text-center`}
                    value={formData.carga_horaria || ''}
                    onChange={(e) => setFormData({...formData, carga_horaria: e.target.value})}
                  />
                </div>

                <div className="col-span-2">
                  <label className={labelClassEmerald}>F. Ingreso</label>
                  <input
                    type="date"
                    className={inputClassEmerald()}
                    value={formData.fecha_ingreso}
                    onChange={(e) => setFormData({...formData, fecha_ingreso: e.target.value})}
                  />
                </div>

                <div className="col-span-2">
                  <label className={labelClassEmerald}>F. Fin Contrato</label>
                  <input
                    type="date"
                    className={inputClassEmerald()}
                    value={formData.fecha_fin_contrato || ''}
                    onChange={(e) => setFormData({...formData, fecha_fin_contrato: e.target.value})}
                  />
                </div>

                <div className="col-span-2">
                  <label className={labelClassEmerald}>F. Instituc.</label>
                  <input
                    type="date"
                    className={inputClassEmerald()}
                    value={formData.fecha_institucionalizacion}
                    onChange={(e) => setFormData({...formData, fecha_institucionalizacion: e.target.value})}
                  />
                </div>

                <div className="col-span-12">
                  <label className={labelClassEmerald}>Observaciones Generales</label>
                  <textarea
                    rows="2"
                    placeholder="Anotaciones adicionales sobre el vínculo laboral..."
                    className={inputClassEmerald()}
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
