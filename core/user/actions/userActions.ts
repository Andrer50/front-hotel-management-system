import { apiClient } from "@/lib/http-client";
import { User, CreateUserRequest } from "../interfaces";

export const getUsersAction = async (): Promise<User[]> => {
  return apiClient.get<User[]>("hotel/users");
};

export const createUserAction = async (request: CreateUserRequest): Promise<void> => {
  return apiClient.post<void>("hotel/register", request);
};
