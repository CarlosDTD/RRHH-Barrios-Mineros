import React from 'react';
import { X, AlertCircle, CheckCircle, FileText } from 'lucide-react';

const ImportResultsModal = ({ results, onClose }) => {
  if (!results) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Resultados de Importación</h2>
              <p className="text-slate-500 text-sm">Resumen del procesamiento del archivo Excel</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Resumen */}
        <div className="p-6 grid grid-cols-2 gap-4 bg-slate-50/50">
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-emerald-500 text-white rounded-full">
              <CheckCircle size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-700">{results.success}</div>
              <div className="text-emerald-600 text-sm font-medium">Exitosos</div>
            </div>
          </div>
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-rose-500 text-white rounded-full">
              <AlertCircle size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-rose-700">{results.errors}</div>
              <div className="text-rose-600 text-sm font-medium">Errores</div>
            </div>
          </div>
        </div>

        {/* Detalle de Errores */}
        <div className="flex-1 overflow-auto p-6">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Detalle de Incidencias</h3>
          
          {results.details && results.details.length > 0 ? (
            <div className="space-y-3">
              {results.details.map((error, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:border-rose-200 transition-colors group">
                  <div className="mt-1">
                    <AlertCircle className="text-rose-400 group-hover:text-rose-500" size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-bold text-slate-800">CI: {error.ci || 'N/A'}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded uppercase">
                        Hoja: {error.hoja || 'Desconocida'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {error.error}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex p-4 bg-emerald-50 text-emerald-500 rounded-full mb-4">
                <CheckCircle size={32} />
              </div>
              <p className="text-slate-500">No se detectaron errores durante la importación.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 text-white px-6 py-2 rounded-xl font-medium hover:bg-slate-700 transition-colors shadow-sm"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportResultsModal;
