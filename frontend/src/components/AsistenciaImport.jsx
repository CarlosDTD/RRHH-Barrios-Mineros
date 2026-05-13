import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Calendar, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import ImportResultsModal from './ImportResultsModal';

const AsistenciaImport = () => {
  const [file, setFile] = useState(null);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor seleccione un archivo Excel.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('mes', mes);
    formData.append('anio', anio);

    try {
      const response = await fetch('http://localhost:3001/api/asistencia/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al importar asistencia');
      }

      setResults(data);
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const meses = [
    { id: 1, nombre: 'Enero' }, { id: 2, nombre: 'Febrero' }, { id: 3, nombre: 'Marzo' },
    { id: 4, nombre: 'Abril' }, { id: 5, nombre: 'Mayo' }, { id: 6, nombre: 'Junio' },
    { id: 7, nombre: 'Julio' }, { id: 8, nombre: 'Agosto' }, { id: 9, nombre: 'Septiembre' },
    { id: 10, nombre: 'Octubre' }, { id: 11, nombre: 'Noviembre' }, { id: 12, nombre: 'Diciembre' }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Importación de Asistencia</h1>
        <p className="text-slate-500">Cargue los consolidados mensuales de asistencia (Ministeriales y Residentes)</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Calendar size={16} className="text-blue-500" />
                Mes correspondiente
              </label>
              <select 
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                {meses.map(m => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Calendar size={16} className="text-blue-500" />
                Año
              </label>
              <input 
                type="number"
                value={anio}
                onChange={(e) => setAnio(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div 
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
              file ? 'border-blue-400 bg-blue-50/30' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
            }`}
          >
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              accept=".xlsx, .xls"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <div className={`p-4 rounded-full mb-4 ${file ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {file ? <FileSpreadsheet size={40} /> : <Upload size={40} />}
              </div>
              {file ? (
                <div>
                  <p className="text-blue-600 font-bold text-lg mb-1">{file.name}</p>
                  <p className="text-slate-500 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              ) : (
                <div>
                  <p className="text-slate-800 font-bold text-lg mb-1">Haga clic para seleccionar el archivo</p>
                  <p className="text-slate-500 text-sm">Soporta formatos .xlsx y .xls</p>
                </div>
              )}
            </label>
          </div>

          {error && (
            <div className="mt-6 flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all shadow-lg ${
                !file || loading 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-blue-500/20'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Procesando...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Iniciar Importación
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-slate-50 p-6 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">Instrucciones</h3>
          <ul className="space-y-2 text-sm text-slate-500">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>
              Asegúrese de que el archivo Excel contenga los encabezados de CI y los días del mes.
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>
              El sistema detectará automáticamente si la hoja corresponde a personal Ministerial o Residentes.
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>
              Los datos se vincularán al personal existente por su número de cédula.
            </li>
          </ul>
        </div>
      </div>

      {results && (
        <ImportResultsModal 
          results={results} 
          onClose={() => setResults(null)} 
        />
      )}
    </div>
  );
};

export default AsistenciaImport;
