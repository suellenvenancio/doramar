import { CommunityVisibility } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { IconButton } from "../button/iconButton"
import { CloseIcon } from "../icons/close"
import { CustomInput } from "../input"
import { toast } from "../toast"
import { CustomButton } from "../button"
import { TextButton } from "../textButton"

interface CreateListModalProps {
  onClose: () => void
  onCreate: (data: {
    name: string
    visibility: string
    description?: string
  }) => Promise<void>
}

const createCommunitySchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  visibility: z.string(),
  rules: z.string().optional(),
})

type FormData = z.infer<typeof createCommunitySchema>

export function CreateCommunityModal({
  onClose,
  onCreate,
}: CreateListModalProps) {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<z.infer<typeof createCommunitySchema>>({
    resolver: zodResolver(createCommunitySchema),
    defaultValues: {
      name: "",
      description: "",
      visibility: CommunityVisibility.PUBLIC,
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      await onCreate(data)
      onClose()
      return reset()
    } catch (error) {
      toast("Erro ao criar comunidade!")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex justify-center items-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Nova comunidade</h2>

          <IconButton icon={<CloseIcon />} onClick={onClose} />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 flex flex-col gap-4"
        >
          <div>
            <label
              htmlFor="listName"
              className="block text-base font-medium text-gray-600 mb-1"
            >
              Nome da comunidade
            </label>
            <CustomInput
              control={control}
              name="name"
              errorMessage={errors.name?.message}
              type="text"
              className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all text-base mb-2"
            />

            <label
              htmlFor="listName"
              className="block text-base font-medium text-gray-600 mb-1"
            >
              Descrição
            </label>
            <CustomInput
              control={control}
              name="description"
              errorMessage={errors.description?.message}
              type="text"
              className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all text-base mb-2"
            />

            <label
              htmlFor="visibility"
              className="block text-base font-medium text-gray-600 mb-1"
            >
              Visibilidade
            </label>
            <Controller
              name="visibility"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all text-base mb-2 p-4"
                >
                  <option value={CommunityVisibility.PUBLIC}>PÚBLICO</option>
                  <option value={CommunityVisibility.PRIVATE}>PRIVADO</option>
                  <option value={CommunityVisibility.SECRET}>SECRETO</option>
                </select>
              )}
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <TextButton
              name={"Cancelar"}
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors no-underline"
            />

            <CustomButton
              name={"Criar"}
              loading={isLoading}
              className="p-2 w-26"
            />
          </div>
        </form>
      </div>
    </div>
  )
}
