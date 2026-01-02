import { mergeCn } from "@/utils/cn"

export function StarIcon({
  color,
  isFilled,
  className,
}: {
  color: string
  isFilled: boolean
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={color}
      stroke={isFilled ? color : "#000000"}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={mergeCn(`transition-all duration-200`, className, {
        "stroke-black": !isFilled,
      })}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
