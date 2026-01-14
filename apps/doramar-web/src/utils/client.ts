"use client"

import type { ResponseType } from "@/types"
import axios, {
  AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios"
import { Auth } from "firebase/auth"
import Cookies from "js-cookie"

import { auth } from "@/firebase.config"

export class AxiosWrapper {
  private instance: AxiosInstance

  constructor(private firebaseAuth: Auth) {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      withCredentials: true,
    })

    this.instance.interceptors.request.use(async (config) => {
      let token = await this.getValidToken()

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          const newToken = await this.getValidToken(true)

          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return this.instance(originalRequest)
          }
        }
        return Promise.reject(error)
      },
    )
  }

  private async getValidToken(forceRefresh = false): Promise<string | null> {
    const user = this.firebaseAuth.currentUser

    if (user) {
      const token = await user.getIdToken(forceRefresh)

      Cookies.set("appToken", token, { expires: 1 / 24 })
      return token
    }

    return Cookies.get("appToken") || null
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

export const apiClient = new AxiosWrapper(auth)
