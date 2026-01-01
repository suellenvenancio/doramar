import { useForm } from "react-hook-form"
import { useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

 
import logo from "@/assets/doramar.png"
import { useUser } from "@/hooks/use-user"
import { useNavigate } from "react-router-dom"
import { toast } from "@/components/toast"
import { CustomInput } from "@/components/input"
import { CustomButton } from "@/components/button"
 
const createAccountSchema = z.object({
  name: z.string(),
  email: z.email(),
  username: z.string(),
  password: z.string().min(6),
})

type FormData = z.infer<typeof createAccountSchema> 

export function CreateAccountComponent() {
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

  const navigate = useNavigate()

  const handleSubmitCreateAccount = useCallback(async (data: FormData) => {
    try {
      await createAccount(data).then(() => navigate("/"))
      return reset()
    } catch (error) {
      toast("Erro ao criar conta!")

      setError("root", {
        message: "Erro ao criar usuário, por favor tente novamente!",
      })
    }
  }, [])

  return (
    <form
      className="flex flex-col items-center justify-center p-6 h-screen w-full gap-1"
      onSubmit={handleSubmit(handleSubmitCreateAccount)}
    >
      <img className="h-24 w-50 mb-36" src={logo} />
      <CustomInput
        name="name"
        control={control}
        errorMessage={errors.name?.message}
        type="text"
        className="w-full md:w-100 px-4 py-4 border border-pink-500 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
      />
      <CustomInput
        name="email"
        control={control}
        errorMessage={errors.email?.message}
        type="email"
        className="w-full  md:w-100 px-4 py-4 border border-pink-500 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
      />
      <CustomInput
        name="username"
        control={control}
        errorMessage={errors.username?.message}
        type="text"
        className="w-full  md:w-100 px-4 py-4 border border-pink-500 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
      />
      <CustomInput
        name="password"
        control={control}
        errorMessage={errors.password?.message}
        type="password"
        className="w-full  md:w-100 px-4 py-4 border border-pink-500 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
      />

      <CustomButton
        name="Criar conta"
        loading={isSubmitting}
        className=" md:w-100"
      />
    </form>
  )
}
