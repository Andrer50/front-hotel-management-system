import { apiClient } from "@/lib/http-client";
import {
  RegisterAuthenticationRequest,
  RegisterAuthenticationResponse,
} from "../interfaces";

export const registerAction = async (
  request: RegisterAuthenticationRequest,
): Promise<RegisterAuthenticationResponse> => {
  return apiClient.post<RegisterAuthenticationResponse>(
    "hotel/register",
    request,
  );
};
