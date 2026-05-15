import { apiClient } from "@/lib/http-client";
import { Role, Permission, CreateRoleRequest, UpdateRoleRequest } from "../interfaces";

export const getRolesAction = async (): Promise<Role[]> => {
  return apiClient.get<Role[]>("hotel/roles");
};

export const getPermissionsAction = async (): Promise<Permission[]> => {
  return apiClient.get<Permission[]>("hotel/permissions");
};

export const createRoleAction = async (request: CreateRoleRequest): Promise<void> => {
  return apiClient.post<void>("hotel/roles", request);
};

export const updateRoleAction = async (request: UpdateRoleRequest): Promise<void> => {
  const { id, ...data } = request;
  return apiClient.patch<void>(`hotel/roles/${id}`, data);
};
