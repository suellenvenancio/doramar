import type {   Member } from "@/types"
import { useNavigate } from "react-router-dom"
import { MemberCard } from "../memberCart"

interface MemberModalProps {
  isOpen: boolean
  onClose: () => void
  members: Member[]
  }

export function MemberModal({
  isOpen,
  onClose,
  members,
 }: MemberModalProps) {
  if (!isOpen) return null

  const navigate = useNavigate()

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Participantes</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            Fechar
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {members.map((member) => {
            return (
              <MemberCard id={member.userId} profilePicture={member.user.profilePicture} name={member.user.name} isAddMemberModal={false} />
            )
          })}
        </div>
      </div>
    </div>
  )
}
