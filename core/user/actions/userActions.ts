import { apiClient } from "@/lib/http-client";
import { User, CreateUserRequest, UpdateUserRequest } from "../interfaces";

export const getUsersAction = async (): Promise<User[]> => {
  return apiClient.get<User[]>("hotel/users");
};

export const createUserAction = async (request: CreateUserRequest): Promise<void> => {
  return apiClient.post<void>("hotel/register", request);
};

export const updateUserAction = async (request: UpdateUserRequest): Promise<void> => {
  const { id, ...data } = request;
  return apiClient.patch<void>(`hotel/users/${id}`, data);
};
