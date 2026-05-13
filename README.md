# Frontend - Hotel Management System

Bienvenido al repositorio frontend del Sistema de Gestión Hotelera. Este proyecto está construido con **Next.js 16 (App Router)**, **React**, **TypeScript**, y **Tailwind CSS**. Utilizamos **TanStack Query** para el manejo del estado del servidor y **Axios** para las peticiones HTTP.

Esta guía está diseñada para que cualquier desarrollador entienda rápidamente la arquitectura, las convenciones del código y el flujo de trabajo del proyecto.

---

## 🏗 Arquitectura y Estructura de Carpetas

El proyecto sigue principios de **Domain-Driven Design (DDD)** y Arquitectura Hexagonal. El código se divide estrictamente según su responsabilidad para mantenerlo escalable y desacoplado.

### 1. `core/` (Capa de Infraestructura y Tipado)
Aquí reside **exclusivamente** el código que interactúa con el backend (Django) y las definiciones de tipos. **No contiene lógica de React (ni hooks, ni componentes).**
- `interfaces.ts`: Tipos estrictos de TypeScript para las respuestas y peticiones (Ej: `LoginRequest`, `Usuario`).
- `actions/[modulo]Actions.ts`: Funciones puras asíncronas que utilizan nuestro cliente HTTP para hacer las peticiones al backend.

### 2. `lib/http-client.ts` (Cliente HTTP - Axios)
Contiene la configuración centralizada de Axios a través del patrón Singleton `HttpClient`.
- Inyecta automáticamente los tokens de autenticación en las cabeceras.
- Maneja la base de las URLs apuntando a `/api/` para aprovechar los **rewrites** de Next.js.

### 3. `hooks/` o `modules/domain/[modulo]/hooks/` (Capa de Aplicación)
Aquí viven los **Custom Hooks de TanStack Query** (`useQuery`, `useMutation`).
- Son el "puente" entre la UI y el `core`.
- Consumen los `actions` creados en la capa `core`.
- Manejan el estado de carga (`isPending`), errores y caché de datos.

### 4. `presentation/` (Capa de UI - Componentes de Dominio)
Esta carpeta contiene los **componentes visuales específicos de una funcionalidad o módulo** (Ej. Formularios, Tablas, Diálogos).
- Son consumidos por las páginas en la carpeta `app/`.
- Deben ser lo más "tontos" (dumb) posible en cuanto a reglas de negocio, delegando la lógica a los hooks de TanStack Query.
- Utilizan componentes base de `components/ui` (shadcn/ui).

### 5. `app/` (Capa de Enrutamiento)
Contiene las páginas (`page.tsx`) y layouts (`layout.tsx`) siguiendo el paradigma del App Router de Next.js. Las páginas se encargan de ensamblar los componentes de la capa `presentation/`.

---

## 🌐 Comunicación con el Backend y Rewrites

### ¿Cómo funcionan los Rewrites?
Para evitar problemas de CORS y mantener las URLs limpias, utilizamos los **Rewrites de Next.js** configurados en `next.config.ts`.

Todas las peticiones que el cliente frontend realiza hacia `/api/*` (exceptuando las de NextAuth) son interceptadas por Next.js y redirigidas "por debajo" hacia el servidor Django.

**Ejemplo de flujo:**
1. Tienes `BACKEND_URL=http://localhost:8000` en tu archivo `.env`.
2. El frontend hace una petición a `/api/hotel/register`.
3. Next.js captura la petición y hace un proxy invisible hacia `http://localhost:8000/api/hotel/register`.

**¿Cómo consumir correctamente?**
En los actions del `core/`, debes usar el `apiClient` e instanciar las rutas de manera relativa:
```typescript
import { apiClient } from "@/lib/http-client";

// CORRECTO:
export const registerUser = async (data: RegisterRequest) => {
  return apiClient.post<ApiResponse<any>>("hotel/register", data);
};
```

---

## ⚡ Manejo de Estado Asíncrono: TanStack Query

Utilizamos `@tanstack/react-query` para mutar o fetchear datos. **Está estrictamente prohibido usar `useEffect` para llamadas a APIs.**

### 🚨 Regla de Oro para Mutaciones (`useMutation`)

**NUNCA utilices `try/catch` envolviendo `mutateAsync` en tus componentes o manejadores de formularios.**

Debes utilizar **siempre** la función `mutate` y delegar el manejo del éxito o error a los callbacks `onSuccess` y `onError` que provee TanStack Query.

#### ❌ Lo que NO debes hacer (Prohibido):
```tsx
const onSubmit = async (values: FormValues) => {
  try {
    // ❌ PROHIBIDO: Usar mutateAsync con try/catch en el componente
    await mutacion.mutateAsync(values);
    toast.success("Éxito");
  } catch (error) {
    toast.error("Error fatal");
  }
}
```

#### ✅ La forma CORRECTA (Obligatorio):
```tsx
const onSubmit = (values: FormValues) => {
  // ✅ CORRECTO: Usar mutate puro con callbacks
  mutacion.mutate(values, {
    onSuccess: (data) => {
      toast.success("Operación exitosa");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Ocurrió un error");
    }
  });
}
```
*¿Por qué?* TanStack Query ya maneja internamente la captura de excepciones. Usar `try/catch` genera código redundante, rompe el flujo de reactividad de Query y dificulta el manejo de estados `isPending`.

---

## 🔐 Autenticación y Protección de Rutas

- Usamos **NextAuth.js** (`next-auth`) configurado con estrategia JWT.
- Las variables de sesión e interfaces están fuertemente tipadas en `core/shared/next-auth.d.ts`.
- Las rutas del `/dashboard/*` están protegidas nativamente por Next.js mediante el archivo **`proxy.ts`** (el cual reemplaza al antiguo `middleware.ts` bajo la nueva convención). El proxy verifica la existencia del token JWT y expulsa al usuario al login si no está autorizado.

## 🚀 Comandos Rápidos

```bash
# Instalar dependencias
pnpm install

# Iniciar el servidor de desarrollo
pnpm dev

# Construir para producción
pnpm build
```
