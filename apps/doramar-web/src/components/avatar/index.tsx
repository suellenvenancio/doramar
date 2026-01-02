import { mergeCn } from "@/utils/cn"
 
interface AvatarProps {
  imageUrl?: string
  title: string
  className?: string
  onClick?: () => void
}

export function Avatar({ imageUrl, title, className, onClick }: AvatarProps) { 
  return (
    <>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className={mergeCn("object-cover shadow-md", className)}
          onClick={onClick}
        />
      ) : (
        <div
          className={mergeCn(
            `bg-pink-200 w-15 h-15 flex items-center justify-center text-pink-700 font-semibold text-4xl`,
            className
          )}
          onClick={onClick}
        >
          {title ? title.charAt(0).toUpperCase() : ""}
        </div>
      )}
    </>
  )
}
