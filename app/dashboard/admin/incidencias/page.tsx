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

export default function IncidenciasPage() {
  const [incidencia, setIncidencia] = useState('');
  const [prioridad, setPrioridad] = useState<'Baja' | 'Media' | 'Alta'>('Media');
  const [procesando, setProcesando] = useState(false);
  const [historialTareas, setHistorialTareas] = useState<Task[]>([
    {
      id: "INC-042",
      incidencia: "Aire acondicionado no enfría en la Suite 405",
      prioridad: "Media",
      tecnicoAsignado: "Carlos Mendoza",
      especialidad: "Climatización",
      estado: "En Progreso",
      razonIA: "Asignado automáticamente por cercanía al sector norte y especialización en sistemas de aire central."
    },
    {
      id: "INC-041",
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

    setTimeout(() => {
      const tecnicos = [
        { nombre: "Luis Castro", especialidad: "Fontanería" },
        { nombre: "Jorge Torres", especialidad: "Electricidad" },
        { nombre: "Carlos Mendoza", especialidad: "Climatización" },
        { nombre: "Raúl Peña", especialidad: "Mantenimiento General" }
      ];

      let tecnicoElegido = tecnicos[3];
      let explicacion = "Asignado al personal de guardia general debido a baja complejidad detectada.";

      const textoMinuscula = incidencia.toLowerCase();
      if (textoMinuscula.includes('agua') || textoMinuscula.includes('tubería') || textoMinuscula.includes('fuga') || textoMinuscula.includes('caño') || textoMinuscula.includes('ducha')) {
        tecnicoElegido = tecnicos[0];
        explicacion = "El procesamiento de lenguaje natural detectó problemas de plomería. Asignado a especialista en sistemas hidráulicos.";
      } else if (textoMinuscula.includes('luz') || textoMinuscula.includes('enchufe') || textoMinuscula.includes('cable') || textoMinuscula.includes('corto') || textoMinuscula.includes('corriente')) {
        tecnicoElegido = tecnicos[1];
        explicacion = "El procesamiento de lenguaje natural detectó riesgo eléctrico. Asignado de forma prioritaria a electricista certificado.";
      } else if (textoMinuscula.includes('aire') || textoMinuscula.includes('frío') || textoMinuscula.includes('calor') || textoMinuscula.includes('ventilador') || textoMinuscula.includes('clima')) {
        tecnicoElegido = tecnicos[2];
        explicacion = "El procesamiento de lenguaje natural identificó falla de HVAC. Asignado a especialista en climatización activa.";
      }

      const nuevaTarea: Task = {
        id: `INC-0${Math.floor(Math.random() * 900) + 100}`,
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
    }, 1200);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-screen text-gray-800">
      {/* Cabecera estilo Dashboard de Asturias */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Mantenimiento IA</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">RF-24: Resolución Automatizada de Incidencias</h1>
        <p className="text-sm text-gray-500">Asignación inteligente y priorización automática de tareas mediante Inteligencia Artificial.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h2 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🛠️</span> Reportar Incidencia Operativa
            </h2>
            <form onSubmit={manejarSimulacionIA} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Descripción del Problema</label>
                <textarea
                  value={incidencia}
                  onChange={(e) => setIncidencia(e.target.value)}
                  placeholder="Ej: Fuga de agua en el caño del baño de la habitación 102..."
                  rows={4}
                  className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Prioridad de la Incidencia</label>
                <select
                  value={prioridad}
                  onChange={(e) => setPrioridad(e.target.value as any)}
                  className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Baja">Baja (Mantenimiento menor)</option>
                  <option value="Media">Media (Incomodidad del huésped)</option>
                  <option value="Alta">Alta (Riesgo / Habitación inoperativa)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={procesando}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 px-4 rounded-md transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {procesando ? (
                  <>
                    <span className="animate-spin">🔄</span>
                    Procesando con IA...
                  </>
                ) : (
                  <>
                    <span>🤖</span>
                    Asignar con Motor IA
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="mt-6 p-3 bg-blue-50 rounded-md border border-blue-100">
            <p className="text-xs text-blue-700">
              💡 **Análisis en tiempo real:** El algoritmo lee la descripción para buscar coincidencias clave y determinar el especialista adecuado.
            </p>
          </div>
        </div>

        {/* Panel de Tareas */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-md font-bold text-gray-900 flex items-center gap-2">
            <span>📋</span> Control de Tareas Asignadas Inteligentes
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
                    <span className="text-xs text-gray-500">| Técnico: <strong className="text-gray-700">{task.tecnicoAsignado}</strong> ({task.especialidad})</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{task.incidencia}</h3>
                  <div className="text-xs text-blue-800 bg-blue-50/70 p-2.5 rounded border border-blue-100">
                    🧠 <strong>Decisión de la IA:</strong> {task.razonIA}
                  </div>
                </div>

                <div className="flex md:flex-col justify-between items-end gap-2 shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                    task.estado === 'Resuelto' ? 'bg-green-100 text-green-800' :
                    task.estado === 'En Progreso' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {task.estado}
                  </span>
                  <span className="text-[10px] text-gray-400">Automatizado</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
