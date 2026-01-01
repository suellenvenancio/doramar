import { useState } from "react"
import { IconButton } from "../button/iconButton"
import { CloseIcon } from "../icons/close"
import { CustomButton } from "../button"
import type { User } from "@/types"
import z from "zod"
import { useForm } from "react-hook-form"
import { CustomInput } from "../input"
import { MemberCard } from "../memberCart"

interface addMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onAddMember: (userId: string) => Promise<void>
  onSearchMember: (email: string) => Promise<User | null>
}

const addMemberSchema = z.object({
  email:  z.email()
})

type FormData = z.infer<typeof addMemberSchema>


export function AddMemberModal({
  isOpen,
  onClose,
  onAddMember,
  onSearchMember,
}: addMemberModalProps) {
  const [user, setUser] = useState<User | null>(null)
  const [showMessage, setShowMessage] = useState(false)
  const {
    handleSubmit,
    control,
    formState: { isLoading },
  } = useForm<FormData>()

  if (!isOpen) return null

  const onSubmit = async ({ email }: FormData) => {
    try {
      const fetchedUser = await onSearchMember(email)
 
      if (!fetchedUser) {
        setShowMessage(true)
        return
      }
      setUser(fetchedUser)
      setShowMessage(false)

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex justify-center items-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
            Adicionar membro a comunidade
          </h2>

          <IconButton icon={<CloseIcon />} onClick={onClose} />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 flex flex-row gap-4 items-end w-full justify-between"
        >
          <div className="w-full">
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-600 mb-2"
            >
              email
            </label>
            <CustomInput
              name="email"
              control={control}
              type="text"
              placeholder="digite o email ou username"
              className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
            />
          </div>

          <CustomButton
            name="Pesquisar"
            loading={isLoading}
            className="text-sm font-semibold text-white bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300 rounded-lg shadow-sm transition-all gap-2 w-24 mb-2"
          />
        </form>
        {showMessage && (
          <p className="text-sm text-red-500 p-4">
            Nenhum usuário foi encontado
          </p>
        )}
        {user && (
          <div
            className="p-4 cursor-pointer"
            onClick={() => onAddMember(user.id)}
          >
            <MemberCard
              id={user.id}
              name={user.name}
              profilePicture={user.profilePicture}
              isAddMemberModal={true}
            />
          </div>
        )}
      </div>
    </div>
  )
}
