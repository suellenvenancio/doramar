"use-client"

import { usePathname, useRouter } from "next/navigation"

import { CommunityIcon } from "../icons/community"
import { FolderIcon } from "../icons/folder"
import { HomeIcon } from "../icons/home"
import { ProfileIcon } from "../icons/profile"

export function MobileFooterMenu() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-50
        md:hidden
        bg-white/80 backdrop-blur
        border-t
        px-4 py-2
        flex justify-between
        rounded-t-3xl                   
        shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]
      "
    >
      <FooterItem
        icon={<HomeIcon />}
        label="Home"
        active={pathname === "/"}
        onClick={() => {
          router.push("/")
        }}
      />
      <FooterItem
        icon={<FolderIcon />}
        active={pathname.startsWith("/lists")}
        label="Minhas listas"
        onClick={() => {
          router.push("/lists")
        }}
      />
      <FooterItem
        icon={<CommunityIcon />}
        label="Comunidade"
        active={pathname.startsWith("/communities")}
        onClick={() => {
          router.push("/communities")
        }}
      />
      <FooterItem
        icon={<ProfileIcon />}
        active={pathname.startsWith("/profile")}
        label="Perfil"
        onClick={() => {
          router.push("/profile")
        }}
      />
    </nav>
  )
}

function FooterItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <div
      className={`
        flex flex-col items-center gap-1 text-xs
        ${active ? "text-pink-500" : "text-gray-500"}
      `}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </div>
  )
}
