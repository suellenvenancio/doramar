"use client"

import { useForm } from "react-hook-form"
import { useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import logo from "@/assets/doramar.png"
import { useUser } from "@/hooks/use-user"
import { useRouter } from "next/navigation" 
import { toast } from "@/components/toast"
import { CustomInput } from "@/components/input"
import { CustomButton } from "@/components/button"
import Image from "next/image"

const createAccountSchema = z.object({
  name: z.string(),
  email: z.email(),
  username: z.string(),
  password: z.string().min(6),
})

type FormData = z.infer<typeof createAccountSchema>

export default function CreateAccountComponent() {
  const { createAccount } = useUser()
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(createAccountSchema),
  })

  const router = useRouter()  

  const handleSubmitCreateAccount = useCallback(async (data: FormData) => {
    try {
      const newUser = await createAccount(data)
      if (newUser) {
        router.push("/login")
        return
      }
      toast("Erro ao criar conta!")

      return reset()
    } catch (error) {

      setError("root", {
        message: "Erro ao criar usuário, por favor tente novamente!",
      })
    }
  }, [createAccount])

  return (
    <form
      className="flex flex-col items-center justify-center p-6 h-screen w-full gap-1"
      onSubmit={handleSubmit(handleSubmitCreateAccount)}
    >
      <Image className="h-24 w-42 mb-24" src={logo} alt="logo" />
      <CustomInput
        name="name"
        control={control}
        placeholder="nome"
        errorMessage={errors.name?.message}
        type="text"
        className="w-full md:w-96 px-4 py-4 border border-pink-500 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
      />
      <CustomInput
        name="email"
        placeholder="e-mail"
        control={control}
        errorMessage={errors.email?.message}
        type="email"
        className="w-full md:w-96 px-4 py-4 border border-pink-500 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
      />
      <CustomInput
        name="username"
        control={control}
        placeholder="username"
        errorMessage={errors.username?.message}
        type="text"
        className="w-full md:w-96 px-4 py-4 border border-pink-500 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
      />
      <CustomInput
        name="password"
        control={control}
        placeholder="senha"
        errorMessage={errors.password?.message}
        type="password"
        className="w-full md:w-96 px-4 py-4 border border-pink-500 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
      />

      <CustomButton
        name="Criar conta"
        loading={isSubmitting}
        className="md:w-96"
      />
    </form>
  )
}
