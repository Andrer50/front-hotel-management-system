import { Status } from "../../shared";

export interface Guest {
  id: number;
  nombre: string;
  apellido: string;
  tipo_documento: string;
  documento: string;
  email: string;
  telefono: string;
  status: Status;
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
  status?: Status;
  preferencias_notas?: string;
}

export interface UpdateGuestRequest extends Partial<CreateGuestRequest> {
  id: number;
}

// Interfaz para Huéspedes (UI mapping)
export interface GuestUI {
  id: string;
  name: string;
  email: string;
  document: string;
  documentType: string;
  phone: string;
  lastCheckIn: string;
  totalStays: number;
  status: Status;
  avatarBg: string;
  initials: string;
  domainData: Guest;
}

export interface SelectGuest {
  id: number;
  nombre_completo: string;
  documento: string;
}

export interface GuestSelectData {
  huespedes: SelectGuest[];
}
