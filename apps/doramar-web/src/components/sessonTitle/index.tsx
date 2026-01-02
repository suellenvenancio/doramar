import type { ReactElement } from "react"

type SessionTitleProps = {
  title: string
  icon?: ReactElement
}

export function SessionTitle({ icon, title }: SessionTitleProps) {
  return (
    <div className="flex flex-row items-center gap-2 pb-4">
      {icon}
      <p className="text-pink-600 font-semibold text-xl">{title}</p>
    </div>
  )
}
