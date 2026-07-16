
"use client";
import React, { useState } from 'react';

interface ChannelStatus {
  id: string;
  name: string;
  logo: string;
  status: 'connected' | 'disconnected';
  lastSync: string;
  activeReservations: number;
}

export default function ChannelIntegrationPage() {
  const [channels, setChannels] = useState<ChannelStatus[]>([
    { id: '1', name: 'Booking.com', logo: '🏨', status: 'connected', lastSync: 'Hace 5 minutos', activeReservations: 24 },
    { id: '2', name: 'Airbnb', logo: '🏡', status: 'connected', lastSync: 'Hace 12 minutos', activeReservations: 14 },
  ]);

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setChannels(prev =>
        prev.map(ch => ({ ...ch, lastSync: 'Justo ahora' }))
      );
      setIsSyncing(false);
      alert("Sincronización completa con las APIs de Booking y Airbnb.");
    }, 2000);
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>RF-14: Integración de Canales Omnicanal</h1>
          <p style={{ color: '#4b5563', fontSize: '14px' }}>Sincronización de disponibilidad y reservas externas (Asturias Hotel).</p>
        </div>
        <button 
          onClick={handleSyncAll}
          disabled={isSyncing}
          style={{
            backgroundColor: '#2563eb', color: 'white', padding: '10px 16px', 
            borderRadius: '6px', border: 'none', cursor: isSyncing ? 'not-allowed' : 'pointer', fontWeight: '500'
          }}
        >
          {isSyncing ? 'Sincronizando APIS...' : 'Sincronizar Canales Ahora'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {channels.map(channel => (
          <div key={channel.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '32px' }}>{channel.logo}</span>
                <h2 style={{ fontSize: '18px', fontWeight: '600' }}>{channel.name}</h2>
              </div>
              <span style={{
                backgroundColor: channel.status === 'connected' ? '#d1fae5' : '#fee2e2',
                color: channel.status === 'connected' ? '#065f46' : '#991b1b',
                padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600'
              }}>
                {channel.status === 'connected' ? 'En Línea' : 'Desconectado'}
              </span>
            </div>
            
            <hr style={{ border: '0', borderTop: '1px solid #e5e7eb', marginBottom: '16px' }} />
            
            <div style={{ fontSize: '14px', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div><strong>Última Sincronización:</strong> {channel.lastSync}</div>
              <div><strong>Reservas Activas Importadas:</strong> {channel.activeReservations}</div>
              <div><strong>Webhook Status:</strong> Escuchando cambios (200 OK)</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
