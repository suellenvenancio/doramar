import { mergeCn } from "@/utils/cn";

export function LaughtIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={mergeCn("h-5 w-5", className)}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8 10C8.83 10 9.5 9.33 9.5 8.5C9.5 7.67 8.83 7 8 7C7.17 7 6.5 7.67 6.5 8.5C6.5 9.33 7.17 10 8 10Z"
        fill="currentColor"
      />
      <path
        d="M16 10C16.83 10 17.5 9.33 17.5 8.5C17.5 7.67 16.83 7 16 7C15.17 7 14.5 7.67 14.5 8.5C14.5 9.33 15.17 10 16 10Z"
        fill="currentColor"
      />
      <path
        d="M7 14C8.5 16 15.5 16 17 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}