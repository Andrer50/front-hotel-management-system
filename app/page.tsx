"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  BrainCircuit, 
  Activity, 
  Hotel,
  ShieldCheck
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      // Django autentica con username; usamos el email como username
      username: email,
      password,
    });

    setIsLoading(false);

    if (result?.error) {
      toast.error(result.error === "CredentialsSignin"
        ? "Credenciales inválidas. Verifica tu email y contraseña."
        : result.error
      );
      return;
    }

    toast.success("¡Bienvenido al panel!");
    router.push("/dashboard/admin");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white selection:bg-brand-blue/30 overflow-x-hidden">
      
      {/* Columna Izquierda: Imagen del lobby y features (Oculto en móvil) */}
      <section className="relative hidden lg:flex lg:col-span-7 flex-col justify-between p-12 overflow-hidden">
        {/* Imagen de fondo de hotel elegante con carga prioritaria */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hotel-lobby.png"
            alt="Lobby del Hotel Asturias"
            fill
            sizes="58vw"
            priority
            className="object-cover transition-transform duration-10000 hover:scale-110"
          />
          {/* Capas de gradientes para dar un aspecto oscuro, premium y corporativo */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d]/95 via-[#0c1a36]/80 to-[#0a0f1d]/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1d]/40 to-[#0a0f1d]/90 z-10" />
        </div>

        {/* Header superior de la columna izquierda */}
        <div className="relative z-20">
          <div className="bg-[#00723a] text-[#ebfef2] text-[11px] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full w-fit flex items-center gap-1.5 shadow-sm border border-emerald-500/10">
            <ShieldCheck className="h-3.5 w-3.5" />
            Excelencia en el Servicio
          </div>
        </div>

        {/* Sección de texto central e información */}
        <div className="relative z-20 flex flex-col gap-8 max-w-xl">
          <div className="flex flex-col gap-3">
            <h1 className="text-5xl font-extrabold text-white tracking-tight leading-tight">
              Hotel Asturias
            </h1>
            <p className="text-zinc-300 text-lg leading-relaxed font-light">
              Eleve su eficiencia operativa con la suite de gestión definitiva para destinos de hospitalidad premium.
            </p>
          </div>

          {/* Tarjetas de Features con diseño Glassmorphism */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            {/* Tarjeta 1 */}
            <div className="backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.12] p-5 rounded-2xl flex-1 text-white shadow-xl transition-all duration-300 group cursor-pointer hover:-translate-y-1">
              <div className="bg-brand-blue/30 p-2.5 rounded-xl w-fit mb-3.5 group-hover:bg-brand-blue/40 transition-colors">
                <BrainCircuit className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-[15px] mb-1.5 tracking-wide text-white">
                IA de Análisis
              </h3>
              <p className="text-zinc-300 text-[13px] leading-relaxed font-light">
                Pronóstico predictivo de demanda y perfil de huéspedes.
              </p>
            </div>

            {/* Tarjeta 2 */}
            <div className="backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.12] p-5 rounded-2xl flex-1 text-white shadow-xl transition-all duration-300 group cursor-pointer hover:-translate-y-1">
              <div className="bg-brand-blue/30 p-2.5 rounded-xl w-fit mb-3.5 group-hover:bg-brand-blue/40 transition-colors">
                <Activity className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-[15px] mb-1.5 tracking-wide text-white">
                Ops en Tiempo Real
              </h3>
              <p className="text-zinc-300 text-[13px] leading-relaxed font-light">
                Monitoreo de cada habitación y solicitud de servicios al instante.
              </p>
            </div>
          </div>
        </div>

        {/* Footer inferior de la columna izquierda */}
        <div className="relative z-20 flex justify-between items-center text-[11px] text-zinc-400 font-medium tracking-wider">
          <span>PUERTA DE AUTENTICACIÓN RP-03</span>
          <span>v1.4.1</span>
        </div>
      </section>

      {/* Columna Derecha: Formulario de Login (Exclusivamente Modo Claro) */}
      <section className="col-span-1 lg:col-span-5 flex flex-col justify-between p-6 sm:p-12 lg:p-16 relative bg-zinc-50/50 min-h-screen">
        
        {/* Espacio para centrado óptico */}
        <div className="hidden lg:block h-4" />

        {/* Contenedor principal del Formulario */}
        <div className="w-full max-w-md mx-auto my-auto flex flex-col gap-8">
          
          {/* Logo del Hotel */}
          <div className="self-start">
            <div className="bg-gradient-to-br from-brand-blue to-blue-600 text-white p-3 rounded-2xl shadow-md shadow-brand-blue/20 flex items-center justify-center transition-all duration-300 hover:scale-105">
              <Hotel className="h-6 w-6" />
            </div>
          </div>

          {/* Textos de Bienvenida */}
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-dark-primary">
              Bienvenido de Nuevo
            </h2>
            <p className="text-dark-secondary text-sm leading-relaxed">
              Por favor, ingrese sus credenciales para acceder al panel.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Campo: Correo Electrónico */}
            <div className="flex flex-col">
              <label 
                htmlFor="email" 
                className="text-xs font-semibold text-dark-primary mb-2 tracking-wide"
              >
                Correo Electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-dark-secondary/65 group-focus-within:text-brand-blue transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="gerente@grandhotel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-input-bg border border-transparent focus:border-brand-blue/30 focus:bg-white focus:ring-4 focus:ring-brand-blue/10 rounded-xl pl-10.5 pr-4 py-3.5 text-sm text-dark-primary placeholder-zinc-400 transition-all duration-200 outline-none shadow-xs"
                />
              </div>
            </div>

            {/* Campo: Contraseña */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <label 
                  htmlFor="password" 
                  className="text-xs font-semibold text-dark-primary tracking-wide"
                >
                  Contraseña
                </label>
                <a 
                  href="#" 
                  className="text-xs font-semibold text-brand-blue hover:text-blue-600 hover:underline transition-colors"
                >
                  ¿Olvidó su contraseña?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-dark-secondary/65 group-focus-within:text-brand-blue transition-colors">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-input-bg border border-transparent focus:border-brand-blue/30 focus:bg-white focus:ring-4 focus:ring-brand-blue/10 rounded-xl pl-10.5 pr-11 py-3.5 text-sm text-dark-primary placeholder-zinc-400 transition-all duration-200 outline-none shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-dark-secondary/60 hover:text-dark-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Mantener sesión iniciada */}
            <div className="flex items-center gap-2.5 my-1 select-none">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-brand-blue focus:ring-brand-blue/20 bg-input-bg accent-brand-blue cursor-pointer"
              />
              <label 
                htmlFor="remember" 
                className="text-xs text-dark-secondary font-medium cursor-pointer"
              >
                Mantener sesión iniciada por 30 días
              </label>
            </div>

            {/* Botón de Enviar */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-blue hover:bg-blue-600 disabled:bg-brand-blue/60 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 active:scale-[0.985] flex items-center justify-center gap-2 shadow-md shadow-brand-blue/15 hover:shadow-brand-blue/25 hover:shadow-lg cursor-pointer text-sm"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Ingresar al Panel
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Registrarse o solicitar acceso */}
          <div className="text-center text-xs text-dark-secondary">
            ¿Aún no tiene una cuenta?{" "}
            <a 
              href="#" 
              className="text-brand-blue hover:text-blue-600 font-bold hover:underline transition-colors"
            >
              Contactar Administración
            </a>
          </div>
        </div>

        {/* Footer de la columna derecha */}
        <div className="w-full max-w-md mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-dark-secondary/50 font-medium border-t border-zinc-200/50">
          <div className="flex gap-4">
            <a href="#" className="hover:text-dark-primary transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-dark-primary transition-colors">Términos de Servicio</a>
          </div>
          <span>© 2026 Gesto Concierge Inc.</span>
        </div>
      </section>

    </div>
  );
}
