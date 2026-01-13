import type { Actor } from "@/types"
import { HeartIcon } from "../icons/heart"
import { Avatar } from "../avatar" 
import { IconButton } from "../button/iconButton"

interface CastModalProps {
  isOpen: boolean
  onClose: () => void
  actors: Actor[]
  onClick: (actor: Actor) => void
  favoriteActors: Actor[]
}

export function CastModal({
  isOpen,
  onClose,
  actors,
  onClick,
  favoriteActors,
}: CastModalProps) {
  if (!isOpen) return null 
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Elenco</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            Fechar
          </button>
        </div> 
        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {actors.map((actor) => {
            const isFavorite = favoriteActors.some(fav => fav.id === actor.id)

            return (
              <div
                key={actor.id}
                className="flex items-center justify-between bg-gray-50 rounded-xl p-3 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <Avatar
                    imageUrl={actor.image}
                    title={actor.name}
                    className="w-15 h-15 rounded-full"
                  />

                  <div>
                    <p className="font-semibold text-gray-800">{actor.name}</p>
                  </div>
                </div>
                <IconButton
                  icon={
                    <HeartIcon
                      className={`transition-colors ${
                        isFavorite
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400 hover:text-red-400"
                      }`}
                    />
                  }
                  onClick={() => onClick(actor)}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
