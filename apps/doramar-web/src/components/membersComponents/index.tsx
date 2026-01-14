 import { Avatar } from "../avatar"
import { useRouter } from "next/navigation"

interface MembersProps {
  name: string
  profilePicture?: string
  id: string
}

export function Members({ name, profilePicture, id }: MembersProps) {
  const router = useRouter()

  return (
    <div className="grid grid-cols-1 gap-1" onClick={() => router.push(`/profile/${id}`)}>
      <Avatar
        title={name}
        imageUrl={profilePicture}
        className="rounded-xl w-12 h-12"
      />
      <p className="text-xs text-start w-full">
        {name}
      </p>
    </div>
  )
}
