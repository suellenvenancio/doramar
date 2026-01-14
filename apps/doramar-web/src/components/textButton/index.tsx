import { mergeCn } from "@/utils/cn"

interface textButtonProps {
  name: string
  onClick?: () => void
  className?: string
}

export function TextButton({ name, onClick, className }: textButtonProps) {
  return (
    <button
      className={mergeCn(`text-[#e91e63] font-bold underline m-2`, className)}
      onClick={onClick}
    >
      {name}
    </button>
  )
}
