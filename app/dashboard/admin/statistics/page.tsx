import React from 'react';

export default function StatisticsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-screen">
      {/* Cabecera */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">RF-20: Dashboard Gerencial y Reportes</h1>
        <p className="text-sm text-gray-500">Indicadores clave de rendimiento para la toma de decisiones basada en datos.</p>
      </div>

      {/* Tarjetas de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
          <p className="text-xs font-semibold text-gray-400 uppercase">Tasa de Ocupación Promedio</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">78.4%</p>
          <p className="text-xs text-green-600 mt-1">+4.2% esta semana</p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-emerald-500">
          <p className="text-xs font-semibold text-gray-400 uppercase">Ingresos Totales (Sede Única)</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">S/. 45,280.00</p>
          <p className="text-xs text-green-600 mt-1">+12.8% vs mes anterior</p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
          <p className="text-xs font-semibold text-gray-400 uppercase">Reservas Totales Activas</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">142</p>
          <p className="text-xs text-gray-500 mt-1">Booking / Airbnb / Directas</p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
          <p className="text-xs font-semibold text-gray-400 uppercase">Alertas de Stock Bajo (Inventario)</p>
          <p className="text-2xl font-bold text-gray-950 mt-1">3 Alertas</p>
          <p className="text-xs text-red-500 mt-1">Requiere reposición</p>
        </div>
      </div>

      {/* Sección de la Tabla Corregida (Por tipos de habitación) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-md font-bold text-gray-900">Métricas de Ocupación por Tipo de Habitación</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase">
                <th className="p-4">Tipo de Habitación</th>
                <th className="p-4">Habitaciones Totales</th>
                <th className="p-4">Ocupadas</th>
                <th className="p-4">Disponibles</th>
                <th className="p-4">Eficiencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              <tr>
                <td className="p-4 font-medium text-gray-900">Habitaciones Simples</td>
                <td className="p-4">50</td>
                <td className="p-4">42</td>
                <td className="p-4">8</td>
                <td className="p-4 text-green-600 font-semibold">84%</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-gray-900">Habitaciones Dobles</td>
                <td className="p-4">60</td>
                <td className="p-4">51</td>
                <td className="p-4">9</td>
                <td className="p-4 text-green-600 font-semibold">85%</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-gray-900">Suites Ejecutivas</td>
                <td className="p-4">40</td>
                <td className="p-4">26</td>
                <td className="p-4">14</td>
                <td className="p-4 text-amber-500 font-semibold">65%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
