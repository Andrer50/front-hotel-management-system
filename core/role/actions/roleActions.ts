import { apiClient } from "@/lib/http-client";
import { Role, Permission } from "../interfaces";

export const getRolesAction = async (token: string): Promise<Role[]> => {
  return apiClient.get<Role[]>("hotel/roles", {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getPermissionsAction = async (token: string): Promise<Permission[]> => {
  return apiClient.get<Permission[]>("hotel/permissions", {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export interface CreateRoleRequest {
  name: string;
  permission_ids: number[];
}

export const createRoleAction = async (token: string, request: CreateRoleRequest): Promise<void> => {
  return apiClient.post<void>("hotel/roles", request, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export interface UpdateRoleRequest {
  id: number;
  name?: string;
  permission_ids: number[];
}

export const updateRoleAction = async (token: string, request: UpdateRoleRequest): Promise<void> => {
  const { id, ...data } = request;
  return apiClient.patch<void>(`hotel/roles/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
