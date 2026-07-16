'use client';

import React, { useState } from 'react';

interface Task {
  id: string;
  incidencia: string;
  prioridad: 'Baja' | 'Media' | 'Alta';
  tecnicoAsignado: string;
  especialidad: string;
  estado: 'Asignado' | 'En Progreso' | 'Resuelto';
  razonIA: string;
}

export default function ResolutionAutomatedPage() {
  const [incidencia, setIncidencia] = useState('');
  const [prioridad, setPrioridad] = useState<'Baja' | 'Media' | 'Alta'>('Media');
  const [procesando, setProcesando] = useState(false);
  const [historialTareas, setHistorialTareas] = useState<Task[]>([
    {
      id: "TSK-042",
      incidencia: "Aire acondicionado no enfría en la Suite 405",
      prioridad: "Media",
      tecnicoAsignado: "Carlos Mendoza",
      especialidad: "Climatización",
      estado: "En Progreso",
      razonIA: "Asignado automáticamente por cercanía al sector norte y especialización en sistemas de aire central."
    },
    {
      id: "TSK-041",
      incidencia: "Cortocircuito en tomacorriente de pasillo del piso 2",
      prioridad: "Alta",
      tecnicoAsignado: "Jorge Torres",
      especialidad: "Electricidad",
      estado: "Asignado",
      razonIA: "Prioridad crítica. Único electricista certificado disponible en el turno de tarde."
    }
  ]);

  const manejarSimulacionIA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidencia.trim()) return;

    setProcesando(true);

    // Simulamos la carga cognitiva del algoritmo IA
    setTimeout(() => {
      // Base de datos simulada de técnicos disponibles
      const tecnicos = [
        { nombre: "Luis Castro", especialidad: "Fontanería/Plomería" },
        { nombre: "Jorge Torres", especialidad: "Electricidad" },
        { nombre: "Carlos Mendoza", especialidad: "Climatización" },
        { nombre: "Raúl Peña", especialidad: "Mantenimiento General" }
      ];

      // Inteligencia Artificial básica para emparejar la incidencia con el técnico correcto
      let tecnicoElegido = tecnicos[3]; // Por defecto general
      let explicacion = "Asignado al personal de guardia general debido a baja complejidad detectada.";

      const textoMinuscula = incidencia.toLowerCase();
      if (textoMinuscula.includes('agua') || textoMinuscula.includes('tubería') || textoMinuscula.includes('fuga') || textoMinuscula.includes('caño')) {
        tecnicoElegido = tecnicos[0];
        explicacion = "El procesamiento de lenguaje natural detectó problemas de plomería. Asignado a especialista en sistemas hidráulicos.";
      } else if (textoMinuscula.includes('luz') || textoMinuscula.includes('enchufe') || textoMinuscula.includes('cable') || textoMinuscula.includes('corto')) {
        tecnicoElegido = tecnicos[1];
        explicacion = "El procesamiento de lenguaje natural detectó riesgo eléctrico. Asignado de forma prioritaria a electricista certificado.";
      } else if (textoMinuscula.includes('aire') || textoMinuscula.includes('frío') || textoMinuscula.includes('calor') || textoMinuscula.includes('ventilador')) {
        tecnicoElegido = tecnicos[2];
        explicacion = "El procesamiento de lenguaje natural identificó falla de HVAC. Asignado a especialista en climatización activa.";
      }

      const nuevaTarea: Task = {
        id: `TSK-0${Math.floor(Math.random() * 900) + 100}`,
        incidencia: incidencia,
        prioridad: prioridad,
        tecnicoAsignado: tecnicoElegido.nombre,
        especialidad: tecnicoElegido.especialidad,
        estado: 'Asignado',
        razonIA: explicacion
      };

      setHistorialTareas([nuevaTarea, ...historialTareas]);
      setIncidencia('');
      setProcesando(false);
    }, 1500);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-screen text-gray-800">
      {/* Cabecera */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">RF-24: Resolución Automatizada</h1>
        <p className="text-sm text-gray-500">Asignación inteligente de tareas de mantenimiento mediante Inteligencia Artificial.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de Registro de Incidencia */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h2 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>⚡</span> Reportar Nueva Incidencia
            </h2>
            <form onSubmit={manejarSimulacionIA} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Descripción de la Falla</label>
                <textarea
                  value={incidencia}
                  onChange={(e) => setIncidencia(e.target.value)}
                  placeholder="Ej: Fuga de agua constante en la ducha de la habitación 201..."
                  rows={4}
                  className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Prioridad Inicial</label>
                <select
                  value={prioridad}
                  onChange={(e) => setPrioridad(e.target.value as any)}
                  className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Baja">Baja (Sin impacto inmediato)</option>
                  <option value="Media">Media (Afecta comodidad del huésped)</option>
                  <option value="Alta">Alta (Urgencia/Riesgo en habitación)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={procesando}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 px-4 rounded-md transition-all flex items-center justify-center gap-2"
              >
                {procesando ? (
                  <>
                    <span className="animate-spin">🔄</span>
                    Procesando con IA...
                  </>
                ) : (
                  <>
                    <span>🤖</span>
                    Asignar con Algoritmo IA
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="mt-6 p-3 bg-blue-50 rounded-md border border-blue-100">
            <p className="text-xs text-blue-700 font-medium">
              💡 **Análisis de lenguaje natural:** El sistema lee la descripción para emparejar automáticamente la especialidad del técnico.
            </p>
          </div>
        </div>

        {/* Lista de Tareas Asignadas */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-md font-bold text-gray-900 flex items-center gap-2">
            <span>📋</span> Panel de Tareas de Mantenimiento Inteligentes
          </h2>

          <div className="space-y-3">
            {historialTareas.map((task) => (
              <div key={task.id} className="p-4 rounded-lg border border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold bg-gray-200 px-2 py-0.5 rounded text-gray-700">{task.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      task.prioridad === 'Alta' ? 'bg-red-100 text-red-700' :
                      task.prioridad === 'Media' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                    }`}>
                      Prioridad {task.prioridad}
                    </span>
                    <span className="text-xs text-gray-400">| Técnico: <strong>{task.tecnicoAsignado}</strong> ({task.especialidad})</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{task.incidencia}</h3>
                  <p className="text-xs text-blue-800 bg-blue-50/50 p-2 rounded border border-blue-50/70">
                    🧠 <strong>Decisión del Motor IA:</strong> {task.razonIA}
                  </p>
                </div>

                <div className="flex md:flex-col justify-between items-end gap-2 shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                    task.estado === 'Resuelto' ? 'bg-green-100 text-green-800' :
                    task.estado === 'En Progreso' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {task.estado}
                  </span>
                  <span className="text-[10px] text-gray-400">Asignación Instantánea</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
