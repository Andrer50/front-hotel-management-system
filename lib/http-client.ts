import { ApiResponse } from "@/shared";
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { getSession } from "next-auth/react";

// Estructura de error estándar
export class BusinessError extends Error {
  constructor(
    public code: string,
    public message: string,
  ) {
    super(message);
    this.name = "BusinessError";
  }
}

export class HttpClient {
  private static instances: Map<string, HttpClient> = new Map();
  private axiosInstance: AxiosInstance;

  private constructor(baseURL: string) {
    this.axiosInstance = axios.create({ baseURL });
    this.setupInterceptors();
  }

  public static getInstance(
    baseURL: string,
    name: string = "default",
  ): HttpClient {
    if (!HttpClient.instances.has(name)) {
      HttpClient.instances.set(name, new HttpClient(baseURL));
    }
    return HttpClient.instances.get(name)!;
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const session = await getSession();
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
        return config;
      },
      (error: unknown) => Promise.reject(error),
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<unknown>>) => {
        const { data } = response;

        if (data && typeof data === "object" && "code" in data) {
          const apiData = data as ApiResponse<unknown>;
          const codeNum = parseInt(apiData.code);

          if (isNaN(codeNum) || codeNum < 200 || codeNum >= 300) {
            throw new BusinessError(
              apiData.code,
              apiData.message || "Error de negocio",
            );
          }

          return { ...response, data: apiData.data };
        }

        return response;
      },
      async (error) => {
        if (error.response) {
          const responseData = error.response.data;
          let errorMessage = responseData?.message;

          if (
            !errorMessage &&
            responseData &&
            typeof responseData === "object"
          ) {
            for (const [key, val] of Object.entries(responseData)) {
              if (Array.isArray(val) && val.length > 0) {
                errorMessage = `${key}: ${val[0]}`;
                break;
              } else if (typeof val === "string") {
                errorMessage = `${key}: ${val}`;
                break;
              }
            }
          }

          errorMessage = errorMessage ?? "Error del servidor";
          return Promise.reject({
            code: String(error.response.status),
            message: errorMessage,
            status: error.response.status,
            data: responseData?.data ?? responseData,
          });
        }

        return Promise.reject({
          code: "500",
          message: error instanceof Error ? error.message : "Error desconocido",
          status: 500,
        });
      },
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.get<T>(url, config).then((r) => r.data);
  }

  public async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.axiosInstance.post<T>(url, data, config).then((r) => r.data);
  }

  public async put<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.axiosInstance.put<T>(url, data, config).then((r) => r.data);
  }

  public async patch<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.axiosInstance.patch<T>(url, data, config).then((r) => r.data);
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.delete<T>(url, config).then((r) => r.data);
  }
}

// Para usar el "rewrite" de Next.js, el cliente del browser debe llamar a "/api" (local)
export const apiClient = HttpClient.getInstance("/api/", "main");
