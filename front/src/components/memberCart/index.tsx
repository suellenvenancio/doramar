import { useNavigate } from "react-router-dom"
import { Avatar } from "../avatar"

interface MemberPros {
  id: string
  profilePicture?: string
  name: string 
  isAddMemberModal: boolean
}

export function MemberCard({
  profilePicture,
  id,
  name,
  isAddMemberModal,
}: MemberPros) {
  const navigate = useNavigate()

  return (
    <div
      key={id}
      className="flex items-center justify-between bg-gray-50 rounded-xl p-3 shadow-sm hover:shadow-md transition"
    >
      <div
        className="flex items-center gap-4"
        onClick={() => !isAddMemberModal && navigate(`/profile/${id}`)}
      >
        <Avatar
          imageUrl={profilePicture}
          title={name}
          className="w-15 h-15 rounded-full"
        />

        <div>
          <p className="font-semibold text-gray-800">{name}</p>
        </div>
      </div>
    </div>
  )
}