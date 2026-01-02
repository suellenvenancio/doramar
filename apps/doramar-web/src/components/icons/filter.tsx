import { mergeCn } from "@/utils/cn"

export function FilterIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={mergeCn("h-5 w-5", className)}
    >
      <polygon points="22 3 2 3 10 12 10 19 14 21 14 12 22 3" />
    </svg>
  )
}
