import React, { useState, useEffect } from 'react';
import { 
  Users, Clock, AlertTriangle, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Briefcase, DollarSign,
  UserX, CalendarClock, CalendarOff
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { API_BASE_URL } from '../config/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertas, setAlertas] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/dashboard/stats`)
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/personal/contratos-alertas`)
      .then(res => res.json())
      .then(data => setAlertas(data))
      .catch(err => console.error('Error fetching alertas:', err));
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const formatDateShort = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-BO', { day: '2-digit', month: 'short' });
  };

  if (loading) return <div className="p-8">Cargando dashboard...</div>;

  if (error) return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <h3 className="font-bold">Error al cargar el dashboard</h3>
        <p className="text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    </div>
  );

  if (!stats) return <div className="p-8">No hay datos disponibles</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Panel de Control</h1>
        <p className="text-slate-500 mt-1">Hospital de Segundo Nivel "Barrios Mineros"</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Personal Total" 
          value={stats?.totales?.personal ?? 0} 
          icon={<Users className="text-blue-600" />} 
          trend="+2.5%" 
          up={true}
        />
        <StatCard 
          title="Horas Trabajadas" 
          value={Math.round(stats?.totales?.horas ?? 0)} 
          icon={<Clock className="text-emerald-600" />} 
          subtitle="Mes de Abril"
        />
        <StatCard 
          title="Minutos Atraso" 
          value={stats?.totales?.atrasos ?? 0} 
          icon={<AlertTriangle className="text-rose-600" />} 
          trend="-12%" 
          up={false}
        />
        <StatCard 
          title="Financiamiento" 
          value={stats?.fuentesDistribucion?.length ?? 0} 
          icon={<DollarSign className="text-amber-600" />} 
          subtitle="Fuentes Activas"
        />
      </div>

      {/* Alertas de Contratos */}
      {alertas && alertas.stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-100 rounded-xl">
                <CalendarOff size={20} className="text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-black text-red-700">{alertas.stats.vencidosCount}</div>
                <div className="text-xs text-red-500 font-medium">Contratos Vencidos</div>
              </div>
            </div>
            {alertas.vencidos.length > 0 && (
              <div className="mt-3 pt-3 border-t border-red-100 space-y-2">
                {alertas.vencidos.slice(0, 3).map(c => (
                  <div key={c.id} className="flex justify-between items-center text-xs">
                    <span className="text-slate-700 font-medium truncate">{c.primer_nombre} {c.apellido_paterno}</span>
                    <span className="text-red-600 font-bold whitespace-nowrap ml-2">{formatDateShort(c.fecha_fin_contrato)}</span>
                  </div>
                ))}
                {alertas.vencidos.length > 3 && (
                  <div className="text-xs text-red-500 font-medium">+{alertas.vencidos.length - 3} más</div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-100 rounded-xl">
                <CalendarClock size={20} className="text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-black text-amber-700">{alertas.stats.porVencerCount}</div>
                <div className="text-xs text-amber-500 font-medium">Por Vencer (30 días)</div>
              </div>
            </div>
            {alertas.porVencer.length > 0 && (
              <div className="mt-3 pt-3 border-t border-amber-100 space-y-2">
                {alertas.porVencer.slice(0, 3).map(c => (
                  <div key={c.id} className="flex justify-between items-center text-xs">
                    <span className="text-slate-700 font-medium truncate">{c.primer_nombre} {c.apellido_paterno}</span>
                    <span className="text-amber-600 font-bold whitespace-nowrap ml-2">{formatDateShort(c.fecha_fin_contrato)}</span>
                  </div>
                ))}
                {alertas.porVencer.length > 3 && (
                  <div className="text-xs text-amber-500 font-medium">+{alertas.porVencer.length - 3} más</div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-slate-100 rounded-xl">
                <UserX size={20} className="text-slate-600" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-700">{alertas.stats.inactivos}</div>
                <div className="text-xs text-slate-500 font-medium">Personal Inactivo</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Activos</span>
                <span className="text-emerald-600 font-bold">{alertas.stats.activos}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Gráfico Tipo Personal */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Composición del Personal</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.tipoDistribucion ?? []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({label}) => label}
                >
                  {(stats?.tipoDistribucion ?? []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico Fuentes de Financiamiento */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Personal por Fuente</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.fuentesDistribucion ?? []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Atrasos */}
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Ranking de Atrasos</h3>
          <div className="space-y-4">
            {(stats?.topAtrasos ?? []).map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
                    {i+1}
                  </div>
                  <div>
                    <div className="font-bold text-slate-700 text-sm">{item.primer_nombre} {item.apellido_paterno}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{item.tipo_planilla}</div>
                  </div>
                </div>
                <div className="text-rose-600 font-black">{item.total_atrasos_min}m</div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen Operativo */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Análisis de Cumplimiento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                    <TrendingUp className="text-blue-500 mb-4" size={24} />
                    <div className="text-slate-500 text-sm font-medium mb-1">Carga Horaria Promedio</div>
                    <div className="text-2xl font-black text-blue-900">142 hrs / mes</div>
                    <div className="text-xs text-blue-600 mt-2 font-bold">+5% respecto al mes anterior</div>
                </div>
                <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                    <Briefcase className="text-emerald-500 mb-4" size={24} />
                    <div className="text-slate-500 text-sm font-medium mb-1">Efectividad de Guardia</div>
                    <div className="text-2xl font-black text-emerald-900">98.2%</div>
                    <div className="text-xs text-emerald-600 mt-2 font-bold">Respuesta inmediata</div>
                </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-100 flex justify-between items-center text-slate-400 text-xs font-medium">
                <span>Última actualización: Hoy, {new Date().toLocaleTimeString()}</span>
                <button className="text-blue-600 font-bold hover:underline">Ver Reporte Detallado</button>
            </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, up, subtitle }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      )}
    </div>
    <div className="text-2xl font-black text-slate-800">{value}</div>
    <div className="text-slate-400 text-sm font-medium">{title}</div>
    {subtitle && <div className="text-[10px] text-slate-300 font-bold uppercase mt-1">{subtitle}</div>}
  </div>
);

export default Dashboard;
