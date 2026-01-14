import Image from "next/image"

import { mergeCn } from "@/utils/cn"

interface AvatarProps {
  imageUrl?: string
  title: string
  className?: string
  onClick?: () => void
  width?: number
  height?: number
}

export function Avatar({
  imageUrl,
  title,
  className,
  onClick,
  width,
  height,
}: AvatarProps) {
  return (
    <>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          width={width ?? 60}
          height={height ?? 60}
          className={mergeCn("object-cover shadow-md", className)}
          onClick={onClick}
          unoptimized
        />
      ) : (
        <div
          className={mergeCn(
            `bg-pink-200 px-6 py-3 flex items-center justify-center text-pink-700 font-semibold text-4xl rounded-full`,
            className,
          )}
          onClick={onClick}
        >
          {title ? title.charAt(0).toUpperCase() : ""}
        </div>
      )}
    </>
  )
}
