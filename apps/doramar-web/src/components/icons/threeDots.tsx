import { mergeCn } from "@/utils/cn"

export function ThreeDots({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="6"
      viewBox="0 0 24 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={mergeCn("h-5 w-5", className)}
    >
      <circle cx="3" cy="3" r="2" fill="#9CA3AF" />
      <circle cx="12" cy="3" r="2" fill="#9CA3AF" />
      <circle cx="21" cy="3" r="2" fill="#9CA3AF" />
    </svg>
  )
}
