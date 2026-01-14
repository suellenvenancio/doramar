"use client";

import { Avatar } from "@/components/avatar"
import { HeartIcon } from "@/components/icons/heart"
import { MovieIcon } from "@/components/icons/movie"
import { StarIcon } from "@/components/icons/star"
import { Layout } from "@/components/layout"
import { SessionTitle } from "@/components/sessonTitle"
import { toast } from "@/components/toast"
import { WatchedTvShowComponent } from "@/components/watchedTvshow"
import { useActor } from "@/hooks/use-actor"
import { useList } from "@/hooks/use-list"
import { useRating } from "@/hooks/use-rating"
import { useTvShow } from "@/hooks/use-tv-shows"
import { useUser } from "@/hooks/use-user"
import { Actor, TvShow, type List, type Rating, type User, type WatchedTvShow } from "@/types"
import { mergeCn } from "@/utils/cn"
import { useState, useRef, type ChangeEvent, useEffect } from "react"
import { useParams } from "next/navigation"

export default function ProfilePage() {
  const [user, setUser] = useState<User | undefined>()
  const [watchedTvShows, setWatchedTvShows] = useState<WatchedTvShow[]>([])
  const [lists, setLists] = useState<List[]>([])
  const [ratings, setRatings] = useState<Rating[]>([])
  const [favoriteTvShows, setFavoriteTvShows] = useState<TvShow | undefined>()
  const [favoriteActors, setFavoriteActors] = useState<Actor[]>([])
  
  const { findUserById } = useUser()
  const { getWatchedTvShowsByUserId, findFavoriteTvShowByUserId } = useTvShow()
  const { getRatingsByUserId, createRating } = useRating()
  const { getListsByUserId } = useList() 
  const {  findFavoriteActorsByUserId } = useActor()
  const params = useParams()
  const userId = params.userId as string
  
  const fetchUserData = async (userId: string) => {
    try {
        const [
          user,
          watchedTvShowsFetched,
          fetchedLists,
          fetchedRatings,
          favTvShow,
          favActors,
        ] = await Promise.all([
          findUserById(userId),
          getWatchedTvShowsByUserId(userId),
          getListsByUserId(userId),
          getRatingsByUserId(userId),
          findFavoriteTvShowByUserId(userId),
          findFavoriteActorsByUserId(userId),
        ])

        setUser(user)
        setWatchedTvShows(watchedTvShowsFetched ?? [])
        setLists(fetchedLists ?? [])
        setRatings(fetchedRatings ?? [])
        setFavoriteTvShows(favTvShow || undefined)
        setFavoriteActors(favActors)
    } catch (error) {
      console.error(`Erro aos buscar dados do usuário: ${error}`)
    }
  }
  
  useEffect(() => {
    if (!userId) return

    fetchUserData(userId)
   
  }, [userId])

   return (
    <Layout page="Profile">
      <div className="w-full p-6 bg-[#FDFFFE] min-h-full rounded-3xl">
        <UserResume
          profilePicture={user?.profilePicture}
          name={user?.name ?? ""}
          username={user?.username ?? ""}
          watchedTvShowsQtty={watchedTvShows.length}
          ratingsQtty={ratings.length}
          listQtty={lists.length}
          isMyProfilePage={false}
        />
        <div className="h-px bg-gray-200 my-6 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2  gap-8 w-full mb-8 items-start">
          <div className="flex flex-col justify-start items-start w-full">
            <SessionTitle
              title="Dorama Favorito"
              icon={<HeartIcon className="text-pink-600" />}
            />
            <FavoriteDrama
              poster={favoriteTvShows?.poster}
              title={favoriteTvShows?.title ?? ""}
              synopsis={favoriteTvShows?.synopsis ?? ""}
            />
          </div>

          <div className="flex flex-col items-start gap-3 w-full">
            <SessionTitle
              title="Atores Favoritos"
              icon={
                <StarIcon
                  className="text-pink-600 w-6 h-6"
                  color={"#e91e63"}
                  isFilled={true}
                />
              }
            />
            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-4">
              {favoriteActors?.length ? (
                favoriteActors.map((actor) => (
                  <div
                    className="flex flex-col items-center w-20"
                    key={actor.id ?? actor.name}
                  >
                    <Avatar
                      imageUrl={actor.image}
                      title={actor.name}
                      className="h-18 w-18 rounded-full"
                    />
                    <p className="text-xs text-center mt-1 line-clamp-2">
                      {actor.name}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 col-span-4">
                  Nenhum ator favorito cadastrado.
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <SessionTitle
            icon={<MovieIcon className="text-pink-600 w-6 h-6 -rotate-45" />}
            title="Doramas assistidos"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {watchedTvShows.length ? (
              watchedTvShows.map((drama) => {
                const tvShowRating =
                  ratings.find((rating) => rating.tvShowId === drama.id)
                    ?.scaleId ?? 0

                return (
                  <WatchedTvShowComponent
                    key={drama.id}
                    image={drama.poster}
                    rating={tvShowRating}
                    status={drama.watchStatus}
                    title={drama.title}
                    tvShowId={drama.id}
                    onRate={createRating}
                    isMyProfilePage={false}
                  />
                )
              })
            ) : (
              <p className="text-gray-400 col-span-full">
                Nenhum dorama assistido ainda.
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

type UserResumeProps = {
  profilePicture?: string
  name: string
  username: string
  watchedTvShowsQtty: number
  ratingsQtty: number
  listQtty: number
  uploadProfilePicture?: (data: FormData) => void
  isMyProfilePage: boolean
}


function UserResume({
  profilePicture,
  name,
  username,
  watchedTvShowsQtty,
  ratingsQtty,
  listQtty,
  uploadProfilePicture,
  isMyProfilePage,
}: UserResumeProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    if(!isMyProfilePage) return
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)
    try {
      setIsUploading(true)

      await uploadProfilePicture!(formData)
    } catch (error) {
      console.error(error)
      toast("Erro ao fazer upload da imagem")
    } finally {
      setIsUploading(false)

      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div
        className={mergeCn(
          `relative cursor-pointer hover:opacity-80 transition-all ${
            isUploading ? "animate-pulse" : ""
          }`,
            
        )}
        onClick={handleAvatarClick}
        title="Clique para alterar a foto"
      >
        <Avatar
          imageUrl={profilePicture}
          title={name}
          className="rounded-full w-24 h-24 mb-2 object-cover border-2 border-pink-500"
        />
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
            <span className="text-white text-xs font-bold">...</span>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      <p className="text-2xl font-bold">{name}</p>
      <p className="text-gray-500 mb-2">{`@${username}`}</p>
      <p className="text-base text-center px-4">
        {`${watchedTvShowsQtty} assistido(s) | ${ratingsQtty} avaliado(s) | ${listQtty} lista(s)`}
      </p>
    </div>
  )
}

type FavoriteDramaProps = {
  poster?: string
  title: string
  synopsis: string
}

function FavoriteDrama({ poster, title, synopsis }: FavoriteDramaProps) {
  if (!title && !synopsis) {
    return <p className="text-gray-400">Nenhum dorama favorito cadastrado.</p>
  }
  return (
    <div className="flex flex-row w-full justify-start gap-4 items-start">
      <div className="flex-shrink-0 w-32 md:w-40">
        <Avatar
          imageUrl={poster}
          title={title}
          className="w-full h-auto aspect-[2/3] object-cover rounded-lg shadow-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-bold text-gray-800 text-lg leading-tight">{title}</p>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-6 md:line-clamp-none">
          {synopsis}
        </p>
      </div>
    </div>
  )
}
