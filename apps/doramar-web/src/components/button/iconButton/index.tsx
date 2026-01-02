interface IconButtonProps {
  icon: React.ReactNode
  onClick?: () => void
  className?: string
}
export function IconButton({ className, icon, onClick }: IconButtonProps) {
  return (
    <button className={className} onClick={onClick}>
      {icon}
    </button>
  )
}
