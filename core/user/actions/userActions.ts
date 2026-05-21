import { apiClient } from "@/lib/http-client";
import { User, CreateUserRequest, UpdateUserRequest } from "../interfaces";

export const getUsersAction = async (): Promise<User[]> => {
  return apiClient.get<User[]>("hotel/users");
};

export const createUserAction = async (request: CreateUserRequest): Promise<User> => {
  return apiClient.post<User>("hotel/register", request);
};

export const updateUserAction = async (request: UpdateUserRequest): Promise<User> => {
  const { id, ...data } = request;
  return apiClient.patch<User>(`hotel/users/${id}`, data);
};
