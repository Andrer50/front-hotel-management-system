import { Role } from "@/core/role/interfaces";
import { Status } from "@/core/shared";

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
  status: Status;
}

export interface CreateUserRequest {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: number;
  phone: string;
  sede_asignada?: number;
  status?: Status;
}

export interface UpdateUserRequest {
  id: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: number;
  phone?: string;
  sede_asignada?: number;
  status?: Status;
}