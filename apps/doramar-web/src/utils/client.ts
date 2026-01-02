import type { ResponseType } from "@/types"
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios"

export class AxiosWrapper {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })

    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("appToken")
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }

        if (config.data instanceof FormData) {
          delete config.headers["Content-Type"]
        }

        return config
      },
      (error) => Promise.reject(error),
    )
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<ResponseType<T>>(url, config)

    return response.data.data
  }

  public async post<T>(
    url: string,
    body?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.instance.post<ResponseType<T>>(
      url,
      body,
      config,
    )

    return response.data.data
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.instance.put<ResponseType<T>>(url, data, config)
    return response.data.data
  }

  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.instance.patch<ResponseType<T>>(
      url,
      data,
      config,
    )
    return response.data.data
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.delete(url, config)
    return response.data
  }
}

export const apiClient = new AxiosWrapper()
