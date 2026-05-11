"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus2, Mail, Calendar, Hash, UserCheck, Sparkles } from "lucide-react";

interface Guest {
  id: string;
  name: string;
  email: string;
  lastCheckIn: string;
  totalStays: number;
  status: "ACTIVE" | "INACTIVE";
  avatarBg: string;
  initials: string;
}

interface CreateGuestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddGuest: (newGuest: Guest) => void;
}

export function CreateGuestDialog({
  isOpen,
  onOpenChange,
  onAddGuest
}: CreateGuestDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [lastCheckIn, setLastCheckIn] = useState("");
  const [totalStays, setTotalStays] = useState(1);
  const [status, setStatus] = useState<Guest["status"]>("ACTIVE");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "El formato de correo no es válido.";
    }
    if (!lastCheckIn) {
      newErrors.lastCheckIn = "La fecha de check-in es obligatoria.";
    }
    if (totalStays < 0) {
      newErrors.totalStays = "El número de estancias no puede ser negativo.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Formulario de Huésped Inválido", {
        description: "Por favor, complete correctamente los campos requeridos."
      });
      return;
    }

    // Formatear fecha del input (YYYY-MM-DD) a formato premium legible (DD mmm, YYYY)
    const dateObj = new Date(lastCheckIn + "T12:00:00");
    const months = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];
    const formattedDate = `${dateObj.getDate().toString().padStart(2, "0")} ${months[dateObj.getMonth()]}, ${dateObj.getFullYear()}`;

    // Generar iniciales y fondo aleatorio del avatar
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "GS";

    const bgColors = [
      "bg-blue-100 text-blue-600",
      "bg-emerald-100 text-emerald-600",
      "bg-indigo-100 text-indigo-600",
      "bg-pink-100 text-pink-600",
      "bg-amber-100 text-amber-600",
      "bg-purple-100 text-purple-600",
      "bg-teal-100 text-teal-600"
    ];
    const avatarBg = bgColors[Math.floor(Math.random() * bgColors.length)];

    const newGuest: Guest = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      lastCheckIn: formattedDate,
      totalStays: Number(totalStays),
      status,
      avatarBg,
      initials
    };

    onAddGuest(newGuest);

    // Resetear formulario
    setName("");
    setEmail("");
    setLastCheckIn("");
    setTotalStays(1);
    setStatus("ACTIVE");
    setErrors({});

    // Mostrar confirmación premium
    toast.success("Huésped Registrado Exitosamente", {
      description: `Se ha creado el registro VIP para ${name} con éxito.`
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-3xl border border-zinc-100 shadow-2xl p-0 overflow-hidden isolate">
        
        {/* Cabecera Premium en tonos esmeralda/teal para huéspedes */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-6 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 opacity-10">
            <UserPlus2 className="h-40 w-40" />
          </div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20">
              <UserPlus2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-extrabold tracking-tight">
                Registrar Nuevo Huésped
              </DialogTitle>
              <DialogDescription className="text-white/80 text-xs mt-1 font-medium">
                Ingrese las credenciales del cliente para dar de alta su membresía en el Grand Concierge.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          
          {/* Campo: Nombre */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name" className="text-xs font-bold text-dark-primary flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-emerald-600" /> Nombre Completo
            </Label>
            <Input
              id="name"
              placeholder="Ej. Sir Alexander Thompson"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className={`rounded-xl border h-10.5 text-xs px-4 bg-zinc-50/50 focus:bg-white focus:border-emerald-600/30 focus:ring-4 focus:ring-emerald-600/5 transition-all outline-none ${
                errors.name ? "border-red-400 focus:border-red-400 focus:ring-red-500/10" : "border-zinc-200"
              }`}
            />
            {errors.name && (
              <span className="text-[10px] font-semibold text-red-500 mt-0.5 ml-1">{errors.name}</span>
            )}
          </div>

          {/* Campo: Email */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email" className="text-xs font-bold text-dark-primary flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-emerald-600" /> Correo Electrónico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Ej. alex.thompson@corporation.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              className={`rounded-xl border h-10.5 text-xs px-4 bg-zinc-50/50 focus:bg-white focus:border-emerald-600/30 focus:ring-4 focus:ring-emerald-600/5 transition-all outline-none ${
                errors.email ? "border-red-400 focus:border-red-400 focus:ring-red-500/10" : "border-zinc-200"
              }`}
            />
            {errors.email && (
              <span className="text-[10px] font-semibold text-red-500 mt-0.5 ml-1">{errors.email}</span>
            )}
          </div>

          {/* Dos Columnas: Fecha de Check-In & Número de Estancias */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Campo: Fecha de Último Check-In */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lastCheckIn" className="text-xs font-bold text-dark-primary flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-emerald-600" /> Fecha Check-In
              </Label>
              <Input
                id="lastCheckIn"
                type="date"
                value={lastCheckIn}
                onChange={(e) => {
                  setLastCheckIn(e.target.value);
                  if (errors.lastCheckIn) setErrors((prev) => ({ ...prev, lastCheckIn: "" }));
                }}
                className={`rounded-xl border h-10.5 text-xs px-3 bg-zinc-50/50 focus:bg-white focus:border-emerald-600/30 focus:ring-4 focus:ring-emerald-600/5 transition-all outline-none cursor-pointer ${
                  errors.lastCheckIn ? "border-red-400 focus:border-red-400 focus:ring-red-500/10" : "border-zinc-200"
                }`}
              />
              {errors.lastCheckIn && (
                <span className="text-[10px] font-semibold text-red-500 mt-0.5 ml-1">{errors.lastCheckIn}</span>
              )}
            </div>

            {/* Campo: Número de Estancias */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="totalStays" className="text-xs font-bold text-dark-primary flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5 text-emerald-600" /> Total Estancias
              </Label>
              <Input
                id="totalStays"
                type="number"
                min="0"
                value={totalStays}
                onChange={(e) => {
                  setTotalStays(Number(e.target.value));
                  if (errors.totalStays) setErrors((prev) => ({ ...prev, totalStays: "" }));
                }}
                className={`rounded-xl border h-10.5 text-xs px-4 bg-zinc-50/50 focus:bg-white focus:border-emerald-600/30 focus:ring-4 focus:ring-emerald-600/5 transition-all outline-none ${
                  errors.totalStays ? "border-red-400 focus:border-red-400 focus:ring-red-500/10" : "border-zinc-200"
                }`}
              />
              {errors.totalStays && (
                <span className="text-[10px] font-semibold text-red-500 mt-0.5 ml-1">{errors.totalStays}</span>
              )}
            </div>

          </div>

          {/* Campo de Ancho Completo: Estado del Cliente */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="status" className="text-xs font-bold text-dark-primary flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Estado de Membresía
            </Label>
            <Select
              value={status}
              onValueChange={(val) => setStatus(val as Guest["status"])}
            >
              <SelectTrigger className="w-full h-10.5 border border-zinc-200 bg-zinc-50/50 text-xs rounded-xl px-3 font-semibold text-dark-primary focus:bg-white focus:border-emerald-600/30 focus:ring-4 focus:ring-emerald-600/5 outline-none transition-all cursor-pointer">
                <SelectValue placeholder="Seleccione membresía..." />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-2xl border border-zinc-100 shadow-xl p-1">
                <SelectItem value="ACTIVE">Activo (Membresía Activa)</SelectItem>
                <SelectItem value="INACTIVE">Inactivo (Membresía Suspendida)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Footer del Dialog */}
          <DialogFooter className="mt-4 flex sm:flex-row gap-2.5 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-xs font-bold text-dark-secondary hover:text-dark-primary hover:bg-zinc-100 rounded-xl px-4 py-2.5 cursor-pointer transition-all"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs px-5 py-2.5 shadow-lg shadow-emerald-600/15 transition-all cursor-pointer"
            >
              Guardar Huésped
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
