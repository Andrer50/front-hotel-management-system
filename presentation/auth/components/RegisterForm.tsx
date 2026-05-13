"use client";

import { useFormik } from "formik";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterMutation } from "@/modules/auth/domain/hooks/useRegisterMutation";
import { registerValidationSchema } from "@/modules/auth/features/validations/registerValidation";
import { RegisterAuthenticationRequest } from "@/core/auth/interfaces";
import { Role, Status } from "@/core/shared";

export const RegisterForm = () => {
  const router = useRouter();
  const { mutate: register, isPending } = useRegisterMutation();

  const formik = useFormik<
    RegisterAuthenticationRequest & { username?: string }
  >({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      repeatPassword: "",
      role: "USER" as Role,
      status: "ACTIVE" as Status,
    },
    validationSchema: registerValidationSchema,
    onSubmit: (values) => {
      // Agregamos username igual al email para cumplir con Django
      const payload = {
        ...values,
        username: values.email,
      };

      register(payload, {
        onSuccess: () => {
          toast.success(
            "Cuenta creada exitosamente. Ahora puedes iniciar sesión.",
          );
          router.push("/");
        },
        onError: (error) => {
          toast.error(error?.message || "Error al crear la cuenta");
        },
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 w-full max-w-md">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="firstName" className="text-slate-700 font-medium">
            Nombre
          </Label>
          <Input
            id="firstName"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Juan"
            className="bg-input-bg border-slate-200 focus-visible:ring-brand-blue rounded-xl"
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <p className="text-xs text-red-500 font-medium">
              {formik.errors.firstName as string}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName" className="text-slate-700 font-medium">
            Apellido
          </Label>
          <Input
            id="lastName"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Pérez"
            className="bg-input-bg border-slate-200 focus-visible:ring-brand-blue rounded-xl"
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <p className="text-xs text-red-500 font-medium">
              {formik.errors.lastName as string}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-slate-700 font-medium">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="juan@example.com"
          className="bg-input-bg border-slate-200 focus-visible:ring-brand-blue rounded-xl"
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-xs text-red-500 font-medium">
            {formik.errors.email as string}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone" className="text-slate-700 font-medium">
          Teléfono
        </Label>
        <Input
          id="phone"
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="+54 11 1234 5678"
          className="bg-input-bg border-slate-200 focus-visible:ring-brand-blue rounded-xl"
        />
        {formik.touched.phone && formik.errors.phone && (
          <p className="text-xs text-red-500 font-medium">
            {formik.errors.phone as string}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-slate-700 font-medium">
          Contraseña
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="bg-input-bg border-slate-200 focus-visible:ring-brand-blue rounded-xl"
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-xs text-red-500 font-medium">
            {formik.errors.password as string}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="repeatPassword" className="text-slate-700 font-medium">
          Repetir Contraseña
        </Label>
        <Input
          id="repeatPassword"
          name="repeatPassword"
          type="password"
          value={formik.values.repeatPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="bg-input-bg border-slate-200 focus-visible:ring-brand-blue rounded-xl"
        />
        {formik.touched.repeatPassword && formik.errors.repeatPassword && (
          <p className="text-xs text-red-500 font-medium">
            {formik.errors.repeatPassword as string}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl py-6 font-semibold transition-all mt-2 shadow-md shadow-brand-blue/20"
        disabled={isPending}
      >
        {isPending ? "Creando cuenta..." : "Registrarse"}
      </Button>
    </form>
  );
};
