export interface Guest {
  id: number;
  nombre: string;
  apellido: string;
  tipo_documento: string;
  documento: string;
  email: string;
  telefono: string;
  preferencias_notas?: string;
  // Campos calculados o adicionales que el front pueda necesitar
  fullName?: string;
}

export interface CreateGuestRequest {
  nombre: string;
  apellido: string;
  tipo_documento: string;
  documento: string;
  email: string;
  telefono?: string;
  preferencias_notas?: string;
}

export interface UpdateGuestRequest extends Partial<CreateGuestRequest> {
  id: number;
}
