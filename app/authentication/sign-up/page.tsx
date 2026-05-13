import { RegisterForm } from "@/presentation/auth/components/RegisterForm";
import Link from "next/link";

export default function SignUp() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-100/70">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-200/80 my-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-dark-primary">Crear Cuenta</h1>
          <p className="text-sm text-slate-500 mt-1">Ingresa tus datos para registrarte en el sistema</p>
        </div>
        
        <RegisterForm />
        
        <div className="mt-6 pt-6 border-t border-slate-100 text-center text-sm text-slate-600">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/authentication/login" className="text-brand-blue font-semibold hover:underline transition-all">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
