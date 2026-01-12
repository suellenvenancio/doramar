import { HomeIcon } from "../icons/home"
import { FolderIcon } from "../icons/folder"
import { CommunityIcon } from "../icons/community"
import { ProfileIcon } from "../icons/profile"
import { useLocation, useNavigate } from "react-router-dom"
  
export function MobileFooterMenu() {
  const navigate = useNavigate()
  const location = useLocation() 
  
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
        active={location.pathname.startsWith("/home")}
        onClick={() => {
          navigate("/home")
        }}
      />
      <FooterItem
        icon={<FolderIcon />}
        active={location.pathname.startsWith("/lists")}
        label="Minhas listas"
        onClick={() => {
          navigate("/lists")
        }}
      />
      <FooterItem
        icon={<CommunityIcon />}
        label="Comunidade"
        active={location.pathname.startsWith("/communities")}
        onClick={() => {
          navigate("/communities")
        }}
      />
      <FooterItem
        icon={<ProfileIcon />}
        active={location.pathname.startsWith("/profile")}
        label="Perfil"
        onClick={() => {
          navigate("/profile")
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
