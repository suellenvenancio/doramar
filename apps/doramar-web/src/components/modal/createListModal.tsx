import React, { useState } from "react"
import { IconButton } from "../button/iconButton"
import { CloseIcon } from "../icons/close"
import z from "zod"
import { useForm } from "react-hook-form"
import { CustomInput } from "../input"
import { CustomButton } from "../button"

interface CreateListModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (name: string) => Promise<void>
}

const createListSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
})

type FormData = z.infer<typeof createListSchema> 

export function CreateListModal({
  isOpen,
  onClose,
  onCreate,
}: CreateListModalProps) { 
    const {handleSubmit, control, formState: {isLoading}} = useForm<FormData>()
  
  if (!isOpen) return null

  const onSubmit = async ({name}: FormData) => {
   
     try {
      await onCreate(name)
      onClose()
    } catch (error) {
      console.error(error)
    } 
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex justify-center items-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Nova Lista</h2>

          <IconButton icon={<CloseIcon />} onClick={onClose} />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 flex flex-col gap-4"
        >
          <div>
            <label
              htmlFor="listName"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Nome da Lista
            </label>
            <CustomInput
              name="name"
              control={control}
              placeholder="Ex: Para chorar, Comédias românticas..."
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
            />
          </div>

          <div className="flex justify-end gap-3 mt-2"> 
            <CustomButton
              name="Cancelar"
              loading={isLoading}
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-pink-600 bg-gray-100 rounded-lg transition-colors"
            />

            <CustomButton
              name="Criar"
              loading={isLoading}
              className="px-4 py-2 text-sm font-semibold text-white bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300 rounded-lg shadow-sm transition-all flex items-center gap-2"
            />
          </div>
        </form>
      </div>
    </div>
  )
}
