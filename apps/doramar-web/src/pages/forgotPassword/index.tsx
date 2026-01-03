import { CustomButton } from "@/components/button";
import { CustomInput } from "@/components/input";
import logo from "@/assets/doramar.png"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email(),
 })

type FormData = z.infer<typeof forgotPasswordSchema> 

export function ForgotPassword() {
  const { control, handleSubmit, formState: { isSubmitting }, } = useForm<FormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async ({}: FormData) => {
    
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-end md:justify-center items-center p-6 w-full gap-1 h-screen"
    >
      <img className="h-24 w-50 mb-36" src={logo}  />
 
      <div className="flex flex-col items-center w-full ">
        <CustomInput
          name="email"
          type="email"
          placeholder="e-mail"
          control={control}
          className="w-full md:w-100 px-6 py-4 border border-pink-500 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all mb-2"
        />
        <CustomButton
          loading={isSubmitting}
          name="enviar"
          className="mb-4 md:w-100"
        />
      </div>
    </form>
  )
}