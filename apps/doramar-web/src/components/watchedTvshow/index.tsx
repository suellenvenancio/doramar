import { StarRating } from "../button/starRating"

interface TvShowCardProps {
  tvShowId: string
  title: string
  image: string
  rating: number
  status: string
  className?: string
  onRate: (tvShowId: string, scaleId: number) => Promise<void>
  isMyProfilePage: boolean
}

export function WatchedTvShowComponent({
  tvShowId,
  title,
  image,
  rating,
  status,
  className,
  onRate,
  isMyProfilePage,
}: TvShowCardProps) {
  const getBadgeColor = (status: string) => {
    switch (status) {
      case "Assistindo":
        return "bg-[#E67E22]"
      case "Finalizado":
        return "bg-[#1ABC9C]"
      case "Abandonei":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex-shrink-0 w-40 flex flex-col gap-2 group cursor-pointer  ">
      <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
        <img src={image} alt={title} className="w-full h-full object-cover" /> 
        <div
          className={`
          absolute top-2 right-2 
          ${getBadgeColor(status)} 
          text-white text-[10px] font-bold 
          px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm
          flex items-center gap-1
        `}
        >
          {status === "" && (
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
          )}
          {status}
          {status !== "LARGUEI" && <span className="text-[8px]">▶</span>}
        </div>
      </div>

      <div className="px-1">
        <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 min-h-[2.5em]">
          {title}
        </h3>

        <StarRating
          onRate={onRate}
          tvShowId={tvShowId}
          className="w-2"
          initialRating={rating}
          isMyProfilePage={isMyProfilePage}
        />
      </div>
    </div>
  )
}
