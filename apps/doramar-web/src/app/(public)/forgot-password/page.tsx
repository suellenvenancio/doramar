"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import z from "zod"

import logo from "@/assets/doramar.png"
import { CustomButton } from "@/components/button"
import { CustomInput } from "@/components/input"
import { toast } from "@/components/toast"
import { auth } from "@/firebase.config"
import { AuthService } from "@/services/auth.service"

export const forgotPasswordSchema = z.object({
  email: z.email(),
})

type FormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPassword() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const router = useRouter()

  const onSubmit = async ({ email }: FormData) => {
    try {
      const authService = new AuthService(auth)
      await authService.resetPassword(email)
      toast(
        "As intruções de redefinição de senha foram enviadas para seu email!",
      )
      router.push("/login")
    } catch (e) {
      toast("erro ao enviar redefinição!")
      console.error(`Erro ao enviar o reset de senha: ${e}`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-end md:justify-center items-center p-6 w-full gap-1 h-screen"
    >
      <Image width={42} className="h-24 w-42 mb-24" src={logo} alt="logo" />

      <div className="flex flex-col items-center w-full ">
        <CustomInput
          name="email"
          type="email"
          placeholder="e-mail"
          control={control}
          className="w-full md:w-96 px-6 py-4 border border-pink-500 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all mb-2"
        />
        <CustomButton
          loading={isSubmitting}
          name="enviar"
          className="mb-4 md:w-96"
        />
      </div>
    </form>
  )
}
