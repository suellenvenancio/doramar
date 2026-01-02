import { mergeCn } from "@/utils/cn"
import type { ChangeEvent } from "react"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function SearchInput({ value, onChange, className }: SearchInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }
  return (
    <input
      id="search"
      type="search"
      placeholder="Buscar..."
      autoFocus
      value={value}
      onChange={handleChange}
      className={mergeCn(
        `px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 border-pink-500 outline-none transition-all ml-12`,
        className
      )}
    />
  )
}
