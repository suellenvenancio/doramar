import { mergeCn } from "@/utils/cn"

export function MovieIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      className={mergeCn("h-5 w-5", className)}
    >
      <path d="M448 80c0-26.5-21.5-48-48-48H112C85.5 32 64 53.5 64 80v352c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V80zM128 432H96v-64h32v64zm0-96H96v-64h32v64zm0-96H96v-64h32v64zm0-96H96V80h32v64zm160 224H192V144h96v224zm128 64h-32v-64h32v64zm0-96h-32v-64h32v64zm0-96h-32v-64h32v64zm0-96h-32V80h32v64z" />
    </svg>
  )
}
