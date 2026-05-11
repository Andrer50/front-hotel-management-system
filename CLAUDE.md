# Reglas de Arquitectura y Desarrollo para la IA

Este documento define la estructura estricta y las convenciones de código que la IA debe seguir SIEMPRE al generar, modificar o refactorizar código en este proyecto (`mediconnect-app`).

## 1. Arquitectura de Carpetas (Domain-Driven Design / Arquitectura Hexagonal)

El proyecto utiliza una separación estricta por dominios (módulos). Por ejemplo, para un módulo llamado `users` o `auth`, la estructura obligatoria es:

- **`/src/core/[modulo]/`**: Capa de infraestructura y tipado puro. No contiene lógica de React (ni hooks, ni componentes).
  - `interfaces.ts`: Interfaces y tipos TypeScript (ej. `LoginRequest`, `TokenResponse`).
  - `actions.ts`: Funciones puras que hacen las peticiones HTTP (Axios/Fetch) al backend. Retornan promesas.

- **`/src/modules/domain/[modulo]/hooks/`**: Capa de aplicación.
  - Aquí residen exclusivamente los custom hooks de **TanStack Query** (ej. `useLoginMutation.ts`, `useGetPatientsQuery.ts`).
  - Estos hooks consumen los `actions` de la capa `/core`.

- **`/src/modules/features/[modulo]/`**: Capa de lógica compleja, reglas de negocio y utilidades específicas del módulo.
  - `validations.ts`: Esquemas de validación (ej. Yup, Zod).
  - `constants.ts`: Constantes específicas del dominio.
  - `utils.ts`: Funciones de utilidad pura del dominio.

- **`/src/presentation/[modulo]/`**: Capa de Vista (UI).
  - `components/`: Componentes UI complementarios a la página (ej. `LoginFormHeader.tsx`, `PatientTable.tsx`). Estos componentes deben ser lo más "tontos" (dumb) posible.
  - `pages/` (Opcional, si no están en `/src/pages`): Las pantallas principales enlazadas a las rutas.

## 2. Pila Tecnológica Obligatoria

- **Gestión de Estado del Servidor**: `@tanstack/react-query` (Nunca usar `useEffect` para fetch).
- **Llamadas HTTP**: `axios` usando las instancias centralizadas en `/src/core/shared/api.ts` (`authApi` o `coreApi`).
- **Formularios**: `formik` para el manejo de estados de formularios.
- **Validaciones**: `yup` junto con Formik.
- **Estilos**: Tailwind CSS v4. No usar CSS en línea salvo excepciones estrictas. Los colores deben usar las variables definidas en `global.css` (ej. `bg-celeste`, `text-petroleo`).
- **Componentes UI**: Usar la carpeta `/src/components/ui/` (shadcn adaptado a Tailwind v4).
- **Framework Principal**: React + Ionic Framework v8 (`@ionic/react`).

## 3. Convenciones de Código y Estado

- **Regla de Peticiones API**: Todo endpoint debe tiparse con una interfaz `Request` y una `Response`. El formato esperado del backend es siempre un wrapper genérico:
  ```typescript
  export interface ApiResponse<T> {
    code: string;
    message: string;
    data: T;
  }
  ```
- **Rutas (Routing)**: Se usa React Router DOM a través de `<IonReactRouter>`. Las páginas nunca deben estar en la ruta raíz `/` directamente por convenciones de animación de Ionic (usar un `<Redirect>` hacia rutas nombradas como `/login` o `/home`).
- **Nombres de Archivos**: Componentes React en `PascalCase` (`MiComponente.tsx`). Archivos de utilidades, hooks o actions en `camelCase` (`useMiHook.ts`, `actions.ts`).

## 4. Instrucción Directa a la IA

**"Al iniciar cualquier tarea o refactorización, DEBES revisar este archivo (CLAUDE.md) y asegurar que tu código encaje perfectamente en las carpetas de `core`, `domain`, `features` o `presentation` correspondientes al módulo que estás trabajando."**
