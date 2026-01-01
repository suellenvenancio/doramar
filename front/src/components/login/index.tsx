import { useForm } from "react-hook-form"
import { useCallback } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { AuthService } from "@/services/auth.service"

import { CustomInput } from "../input"
import { TextButton } from "../textButton"
import { CustomButton } from "../button"
import { useUser } from "@/hooks/use-user"
import { useNavigate } from "react-router-dom"
import { toast } from "../toast"
 
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

type FormData = z.infer<typeof loginSchema> 

export function LoginComponent() {
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  })
  const { login } = useUser()
  const navigate = useNavigate()

  const handleLoginSubmit = useCallback(
    async (data: { email: string; password: string }) => {
      try {
  
          await login(
            data.email,
            data.password
          )
      
          navigate("/home")  
          return reset() 
        
      } catch (error) {
        toast("Erro ao efetuar login, verifique dados e tente novamente!")
      }
    },
    [setError, reset]
  )

  return (
    <form
      className="flex flex-col w-full items-center justify-end gap-1"
      onSubmit={handleSubmit(handleLoginSubmit)}
    >
      <CustomInput
        name="email"
        control={control}
        type="email"
        className="w-full md:w-100  px-4 py-4 border border-pink-500 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
      />
      <CustomInput
        name="password"
        control={control}
        type="password"
        className="w-full md:w-100 px-6 py-4 border border-pink-500 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
      />
      <div className="flex flex-row justify-between w-full md:w-100  mb-2">
        <TextButton
          name="Cadastre-se"
          onClick={() => navigate("/create-account")}
        />
        <TextButton
          name="Esqueci a senha"
          onClick={() => navigate("/forgot-password")}
        />
      </div>
      <CustomButton name="Login" loading={isSubmitting} className="md:w-100 " />
    </form>
  )
}
