"use client";
import React from 'react';

export default function DashboardReportsPage() {
  const kpis = [
    { title: "Tasa de Ocupación Promedio", value: "78.4%", change: "+4.2% esta semana", color: "#3b82f6" },
    { title: "Ingresos Totales (Sedes)", value: "S/. 45,280.00", change: "+12.8% vs mes anterior", color: "#10b981" },
    { title: "Reservas Totales Activas", value: "142", change: "Booking / Airbnb / Directas", color: "#8b5cf6" },
    { title: "Alertas de Stock Bajo (Inventario)", value: "3 Alertas", change: "Requiere reposición", color: "#ef4444" }
  ];

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>RF-20: Dashboard Gerencial y Reportes</h1>
        <p style={{ color: '#4b5563', fontSize: '14px' }}>Indicadores clave de rendimiento para la toma de decisiones basada en datos.</p>
      </div>

      {/* Grid de Tarjetas KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {kpis.map((kpi, index) => (
          <div key={index} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', borderLeft: `6px solid ${kpi.color}`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500', marginBottom: '8px' }}>{kpi.title}</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>{kpi.value}</div>
            <span style={{ fontSize: '12px', color: '#4b5563' }}>{kpi.change}</span>
          </div>
        ))}
      </div>

      {/* Tabla analítica de Rendimiento por Sede */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>Métricas de Ocupación por Sede</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>
              <th style={{ padding: '12px' }}>Sede</th>
              <th style={{ padding: '12px' }}>Habitaciones Totales</th>
              <th style={{ padding: '12px' }}>Ocupadas</th>
              <th style={{ padding: '12px' }}>Disponibles</th>
              <th style={{ padding: '12px' }}>Eficiencia</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '12px', fontWeight: '500' }}>San Isidro</td>
              <td style={{ padding: '12px' }}>50</td>
              <td style={{ padding: '12px' }}>42</td>
              <td style={{ padding: '12px' }}>8</td>
              <td style={{ padding: '12px', color: '#10b981', fontWeight: 'bold' }}>84%</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '12px', fontWeight: '500' }}>Miraflores</td>
              <td style={{ padding: '12px' }}>60</td>
              <td style={{ padding: '12px' }}>51</td>
              <td style={{ padding: '12px' }}>9</td>
              <td style={{ padding: '12px', color: '#10b981', fontWeight: 'bold' }}>85%</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '12px', fontWeight: '500' }}>Los Olivos</td>
              <td style={{ padding: '12px' }}>40</td>
              <td style={{ padding: '12px' }}>26</td>
              <td style={{ padding: '12px' }}>14</td>
              <td style={{ padding: '12px', color: '#f59e0b', fontWeight: 'bold' }}>65%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
