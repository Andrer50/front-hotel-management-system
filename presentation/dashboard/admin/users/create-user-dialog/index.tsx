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
import { UserPlus, Mail, Briefcase, Building2, UserCheck2 } from "lucide-react";

interface PersonalMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: "Servicios al cliente" | "Operaciones" | "Servicios" | "Comercial" | "Recepción";
  status: "Activo" | "En Vacaciones";
  avatarBg: string;
  initials: string;
}

interface CreateUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddStaff: (newMember: PersonalMember) => void;
}

export function CreateUserDialog({
  isOpen,
  onOpenChange,
  onAddStaff
}: CreateUserDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState<PersonalMember["department"]>("Recepción");
  const [status, setStatus] = useState<PersonalMember["status"]>("Activo");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "El formato de correo no es válido.";
    }
    if (!role.trim()) newErrors.role = "El puesto/rol es obligatorio.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Formulario Inválido", {
        description: "Por favor, corrija los campos resaltados en rojo."
      });
      return;
    }

    // Generar iniciales y fondo aleatorio del avatar
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "UN";

    const bgColors = [
      "bg-blue-100 text-blue-600",
      "bg-emerald-100 text-emerald-600",
      "bg-indigo-100 text-indigo-600",
      "bg-pink-100 text-pink-600",
      "bg-amber-100 text-amber-600",
      "bg-purple-100 text-purple-600"
    ];
    const avatarBg = bgColors[Math.floor(Math.random() * bgColors.length)];

    const newStaff: PersonalMember = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      department,
      status,
      avatarBg,
      initials
    };

    onAddStaff(newStaff);

    // Resetear formulario
    setName("");
    setEmail("");
    setRole("");
    setDepartment("Recepción");
    setStatus("Activo");
    setErrors({});

    // Mostrar confirmación premium
    toast.success("Personal Registrado Exitosamente", {
      description: `Se ha registrado a ${name} en el departamento de ${department}.`
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-3xl border border-zinc-100 shadow-2xl p-0 overflow-hidden isolate">
        
        {/* Cabecera Premium */}
        <div className="bg-gradient-to-r from-brand-blue to-blue-600 p-6 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 opacity-10">
            <UserPlus className="h-40 w-40" />
          </div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-extrabold tracking-tight">
                Registrar Nuevo Personal
              </DialogTitle>
              <DialogDescription className="text-white/80 text-xs mt-1 font-medium">
                Complete el formulario de reclutamiento para dar de alta un nuevo miembro de hospitalidad.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          
          {/* Campo: Nombre */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name" className="text-xs font-bold text-dark-primary flex items-center gap-1.5">
              <UserCheck2 className="h-3.5 w-3.5 text-brand-blue" /> Nombre Completo
            </Label>
            <Input
              id="name"
              placeholder="Ej. Alexander Chevalier"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className={`rounded-xl border h-10.5 text-xs px-4 bg-zinc-50/50 focus:bg-white focus:border-brand-blue/30 focus:ring-4 focus:ring-brand-blue/5 transition-all outline-none ${
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
              <Mail className="h-3.5 w-3.5 text-brand-blue" /> Correo Electrónico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Ej. a.chevalier@grandconcierge.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              className={`rounded-xl border h-10.5 text-xs px-4 bg-zinc-50/50 focus:bg-white focus:border-brand-blue/30 focus:ring-4 focus:ring-brand-blue/5 transition-all outline-none ${
                errors.email ? "border-red-400 focus:border-red-400 focus:ring-red-500/10" : "border-zinc-200"
              }`}
            />
            {errors.email && (
              <span className="text-[10px] font-semibold text-red-500 mt-0.5 ml-1">{errors.email}</span>
            )}
          </div>

          {/* Campo: Puesto/Rol */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="role" className="text-xs font-bold text-dark-primary flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-brand-blue" /> Cargo u Ocupación
            </Label>
            <Input
              id="role"
              placeholder="Ej. Concierge VIP de Noche"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                if (errors.role) setErrors((prev) => ({ ...prev, role: "" }));
              }}
              className={`rounded-xl border h-10.5 text-xs px-4 bg-zinc-50/50 focus:bg-white focus:border-brand-blue/30 focus:ring-4 focus:ring-brand-blue/5 transition-all outline-none ${
                errors.role ? "border-red-400 focus:border-red-400 focus:ring-red-500/10" : "border-zinc-200"
              }`}
            />
            {errors.role && (
              <span className="text-[10px] font-semibold text-red-500 mt-0.5 ml-1">{errors.role}</span>
            )}
          </div>

          {/* Dos Columnas: Departamento y Estado */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Campo: Departamento */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="department" className="text-xs font-bold text-dark-primary flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-brand-blue" /> Departamento
              </Label>
              <Select
                value={department}
                onValueChange={(val) => setDepartment(val as PersonalMember["department"])}
              >
                <SelectTrigger className="w-full h-10.5 border border-zinc-200 bg-zinc-50/50 text-xs rounded-xl px-3 font-semibold text-dark-primary focus:bg-white focus:border-brand-blue/30 focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all cursor-pointer">
                  <SelectValue placeholder="Seleccione dpto..." />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-2xl border border-zinc-100 shadow-xl p-1">
                  <SelectItem value="Recepción">Recepción</SelectItem>
                  <SelectItem value="Servicios al cliente">Conserjería</SelectItem>
                  <SelectItem value="Operaciones">Operaciones</SelectItem>
                  <SelectItem value="Servicios">Servicios</SelectItem>
                  <SelectItem value="Comercial">Comercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campo: Estado Inicial */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status" className="text-xs font-bold text-dark-primary flex items-center gap-1.5">
                <UserCheck2 className="h-3.5 w-3.5 text-brand-blue" /> Estado Inicial
              </Label>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as PersonalMember["status"])}
              >
                <SelectTrigger className="w-full h-10.5 border border-zinc-200 bg-zinc-50/50 text-xs rounded-xl px-3 font-semibold text-dark-primary focus:bg-white focus:border-brand-blue/30 focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all cursor-pointer">
                  <SelectValue placeholder="Seleccione estado..." />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-2xl border border-zinc-100 shadow-xl p-1">
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="En Vacaciones">En Vacaciones</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
              className="bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-xs px-5 py-2.5 shadow-lg shadow-brand-blue/15 transition-all cursor-pointer"
            >
              Guardar Personal
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
