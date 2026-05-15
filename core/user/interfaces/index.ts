import { Role } from "@/core/role/interfaces";

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: number | null;
  role_details: Role | null;
  sede_asignada: number | null;
  phone: string;
}

export interface CreateUserRequest {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: number;
  phone: string;
  sede_asignada?: number;
}