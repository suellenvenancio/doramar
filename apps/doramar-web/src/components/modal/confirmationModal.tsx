import type { Actor } from "@/types"
import { HeartIcon } from "../icons/heart"
import { Avatar } from "../avatar"
import { on } from "events"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void 
  onClick: (id: string) => void
  id: string
  question: string
 }

export function ConfirmationModal({ isOpen, onClose, onClick, question, id }: ConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"> 
        <div className="p-8 space-y-3 max-h-[70vh] overflow-y-auto">
          <p>{question}</p>
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onClick(id)
                onClose()
              }}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
