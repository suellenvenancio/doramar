"use client"

import {
  type Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form"

import { mergeCn } from "@/utils/cn"
export interface CustomInputProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  errorMessage?: string
  type: string
  className?: string
  placeholder?: string
  value?: PathValue<T, Path<T>>
}

export function CustomInput<T extends FieldValues>({
  control,
  name,
  className,
  placeholder,
  type,
  errorMessage,
  value,
}: CustomInputProps<T>) {
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
