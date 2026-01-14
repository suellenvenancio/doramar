import { useRouter } from "next/navigation"
import type { ReactElement } from "react"

import { mergeCn } from "@/utils/cn"

import { CommunityIcon } from "../icons/community"
import { FolderIcon } from "../icons/folder"
import { HomeIcon } from "../icons/home"
import { ProfileIcon } from "../icons/profile"

export function SideBar() {
  const router = useRouter()

  return (
    <aside className="hidden md:flex w-72 h-[calc(100vh-6rem)] sticky top-20 px-4">
      <div className="flex flex-col justify-start items-start bg-[#FEEEF5] rounded-2xl p-4">
        <SideBarItem
          icon={<HomeIcon />}
          title={"Home"}
          className="pr-16"
          onClick={() => router.push("/")}
        />
        <SideBarItem
          icon={<FolderIcon />}
          title={"Minhas Listas"}
          onClick={() => router.push("/lists")}
        />
        <SideBarItem
          icon={<CommunityIcon />}
          title={"Comunidades"}
          onClick={() => router.push("/communities")}
        />
        <SideBarItem
          icon={<ProfileIcon />}
          title={"Perfil"}
          className="pr-16 "
          onClick={() => router.push("/profile")}
        />
      </div>
    </aside>
  )
}
interface SideBarItemProps {
  icon: ReactElement
  title: string
  className?: string
  onClick: () => void
}

function SideBarItem({ icon, title, className, onClick }: SideBarItemProps) {
  return (
    <div
      className={mergeCn(
        `flex flex-row justify-start items-center gap-3 p-2 py-2 text-black rounded-xl cursor-pointer transition-all duration-200 hover:bg-[#FEDCEA] mb-2`,
        className,
      )}
      onClick={onClick}
    >
      {icon}
      <p>{title}</p>
    </div>
  )
}
