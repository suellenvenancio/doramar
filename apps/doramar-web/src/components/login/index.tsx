"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useUser } from "@/hooks/use-user"

import { CustomButton } from "../button"
import { CustomInput } from "../input"
import { TextButton } from "../textButton"

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"), // Ajustado: z.string().email()
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
})

type FormData = z.infer<typeof loginSchema>

export default function LoginComponent() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  })

  const { login } = useUser()
  const router = useRouter()

  const handleLoginSubmit = useCallback(
    async (data: FormData) => {
      await login(data.email, data.password)
      router.push("/")
      reset()
    },
    [login, router, reset],
  )

  return (
    <form
      className="flex flex-col w-full items-center justify-end gap-1"
      onSubmit={handleSubmit(handleLoginSubmit)}
    >
      <CustomInput
        name="email"
        control={control}
        placeholder="e-mail"
        type="email"
        className="w-full md:w-96 px-4 py-4 border border-pink-500 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
      />
      <CustomInput
        name="password"
        control={control}
        placeholder="senha"
        type="password"
        className="w-full md:w-96 px-6 py-4 border border-pink-500 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
      />
      <div className="flex flex-row justify-between w-full md:w-96 mb-2">
        <TextButton
          name="Cadastre-se"
          onClick={() => router.push("/create-account")}
        />
        <TextButton
          name="Esqueci a senha"
          onClick={() => router.push("/forgot-password")}
        />
      </div>
      <CustomButton name="Login" loading={isSubmitting} className="md:w-96 " />
    </form>
  )
}
