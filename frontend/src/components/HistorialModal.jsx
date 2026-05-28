import React, { useState, useEffect } from 'react';
import { X, History, ArrowRight, Calendar, Tag, Briefcase, MapPin } from 'lucide-react';
import api from '../config/api';

const HistorialModal = ({ personal, onClose }) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await api.get(`/api/personal/${personal.id}/historial`);
        setHistorial(response.data);
      } catch (error) {
        console.error('Error fetching historial:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistorial();
  }, [personal.id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const DiffItem = ({ icon: Icon, label, oldVal, newVal, colorClass }) => {
    if (oldVal === newVal) return null;
    return (
      <div className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
        <div className={`p-1.5 rounded-md ${colorClass} bg-opacity-10 mt-0.5`}>
          <Icon size={14} className={colorClass.replace('bg-', 'text-')} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm text-slate-500 line-through truncate max-w-[150px]">
              {oldVal || 'Sin asignar'}
            </span>
            <ArrowRight size={12} className="text-slate-300 flex-shrink-0" />
            <span className="text-sm font-semibold text-slate-800 truncate">
              {newVal || 'Sin asignar'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <History size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 leading-none">Trayectoria Laboral</h2>
              <p className="text-sm text-slate-500 mt-1">
                {personal.primer_nombre} {personal.apellido_paterno}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto bg-slate-50/50 flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm font-medium">Recuperando historial...</p>
            </div>
          ) : historial.length > 0 ? (
            <div className="relative border-l-2 border-slate-200 ml-4 pl-8 space-y-8 py-2">
              {historial.map((mov, index) => (
                <div key={mov.id} className="relative">
                  {/* Dot */}
                  <div className={`absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm ${index === 0 ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                  
                  {/* Card */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-blue-200">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">
                          {formatDate(mov.fecha_movimiento)}
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-bold uppercase tracking-wide">
                        {mov.tipo_movimiento}
                      </span>
                    </div>
                    
                    <div className="p-4 space-y-1">
                      <DiffItem 
                        icon={Briefcase} 
                        label="Cargo" 
                        oldVal={mov.detalles_anteriores.cargo_actual} 
                        newVal={mov.detalles_nuevos.cargo_actual}
                        colorClass="bg-blue-500 text-blue-600"
                      />
                      <DiffItem 
                        icon={Tag} 
                        label="Ítem / ID" 
                        oldVal={mov.detalles_anteriores.identificador_laboral} 
                        newVal={mov.detalles_nuevos.identificador_laboral}
                        colorClass="bg-amber-500 text-amber-600"
                      />
                      <DiffItem 
                        icon={MapPin} 
                        label="Unidad" 
                        oldVal={mov.detalles_anteriores.unidad_servicio} 
                        newVal={mov.detalles_nuevos.unidad_servicio}
                        colorClass="bg-emerald-500 text-emerald-600"
                      />
                      
                      {mov.motivo && (
                        <div className="mt-3 pt-3 border-t border-slate-50 text-[11px] text-slate-500 italic">
                          <span className="font-bold text-slate-400 uppercase not-italic mr-1">Motivo:</span> 
                          {mov.motivo}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                <History size={32} className="text-slate-300" />
              </div>
              <h3 className="text-slate-800 font-bold">Sin movimientos registrados</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                No se han detectado cambios en la situación laboral desde la implementación del historial.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-all font-bold text-sm shadow-lg shadow-slate-200"
          >
            Cerrar Historial
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistorialModal;
