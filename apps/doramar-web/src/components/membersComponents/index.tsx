import { useNavigate } from "react-router-dom"
import { Avatar } from "../avatar"

interface MembersProps {
  name: string
  profilePicture?: string
  id: string
}

export function Members({ name, profilePicture, id }: MembersProps) {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-1 gap-1" onClick={() => navigate(`/profile/${id}`)}>
      <Avatar
        title={name}
        imageUrl={profilePicture}
        className="rounded-full w-15 h-15"
      />
      <p
        className="text-xs text-start w-full"

      >
        {name}
      </p>
    </div>
  )
}
