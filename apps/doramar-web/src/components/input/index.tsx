"use client"

import { mergeCn } from "@/utils/cn"
import { Controller, type Control } from "react-hook-form"
export interface customInputProps {
  name: string
  control: Control<any>
  errorMessage?: string
  value?: string | number | Date
  type: string
  className?: string
  placeholder?: string
}

export function CustomInput({
  name,
  control,
  value,
  type,
  className,
  errorMessage,
  placeholder,
}: customInputProps) {
  return (
    <>
      <Controller
        render={({ field: { onChange } }) => (
          <input
            className={mergeCn(
              "border-2 border-solid rounded-md border-black p-3 w-92   text-black",
              className,
            )}
            placeholder={placeholder}
            onChange={onChange}
            type={type}
            autoFocus
          />
        )}
        name={name}
        control={control}
        defaultValue={value}
      />
      <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
    </>
  )
}
