import { mergeCn } from "@/utils/cn";

export function LikeIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={mergeCn("h-5 w-5", className)}
    >
      <path
        d="M7 10V20H3V10H7ZM21 11C21 9.9 20.1 9 19 9H13.31L14.26 4.43L14.29 4.11C14.29 3.7 14.12 3.32 13.85 3.05L12.78 2L6.59 8.19C6.22 8.56 6 9.07 6 9.6V19C6 20.1 6.9 21 8 21H17C17.83 21 18.54 20.5 18.84 19.78L20.96 14.78C21 14.64 21 14.52 21 14.4V11Z"
        fill="currentColor"
      />
    </svg>
  )
}