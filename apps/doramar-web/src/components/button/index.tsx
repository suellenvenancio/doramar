import { mergeCn } from "@/utils/cn"

import { CircleIcon } from "../icons/circle"

interface customButtonProps {
  name: string
  loading: boolean
  className?: string
  onClick?: () => void
}

export function CustomButton({
  name,
  loading,
  className,
  onClick,
}: customButtonProps) {
  return (
    <button
      className={mergeCn(
        "bg-pink-600 text-white w-full rounded flex items-center justify-center disabled:bg-pink-300 p-4",
        className,
      )}
      onClick={onClick}
    >
      {loading ? <CircleIcon /> : name}
    </button>
  )
}
