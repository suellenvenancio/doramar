import { StarIcon } from "@/components/icons/star"
import { mergeCn } from "@/utils/cn"
import { useState } from "react"

interface StarRatingProps {
  totalStars?: number
  initialRating?: number
  onRate: (tvShowId: string, scaleId: number) => void
  colorFilled?: string
  colorEmpty?: string
  size?: number
  tvShowId: string
  className?: string
  isMyProfilePage: boolean
}

export function StarRating({
  totalStars = 5,
  initialRating = 0,
  onRate,
  colorFilled = "#FFD700",
  colorEmpty = "#e4e5e9",
  tvShowId,
  className,
  isMyProfilePage,
}: StarRatingProps) {
  const [rating, setRating] = useState<number>(initialRating)
  const [hover, setHover] = useState<number | null>(null)

  const handleClick = async (ratingValue: number) => {
    if(!isMyProfilePage) return null
    setRating(ratingValue)

    await onRate(tvShowId, ratingValue)
  }

  return (
    <div className={mergeCn(`flex gap-1`, className)}>
      {[...Array(totalStars)].map((_, index) => {
        const ratingValue = index + 1

        const isFilled = (hover || rating) >= ratingValue

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(ratingValue)}
            onMouseEnter={() => isMyProfilePage && setHover(ratingValue)}
            onMouseLeave={() => isMyProfilePage && setHover(null)}
            className="bg-transparent border-none cursor-pointer p-0 outline-none transition-transform duration-100"
            aria-label={`Avaliar com ${ratingValue} estrelas`}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <StarIcon
              color={isFilled ? colorFilled : colorEmpty}
              isFilled={isFilled}
              className="h-7 w-7"
            />
          </button>
        )
      })}
    </div>
  )
}
