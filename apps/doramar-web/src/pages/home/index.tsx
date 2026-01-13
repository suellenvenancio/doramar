import { useTvShow } from "@/hooks/use-tv-shows"

import { useList } from "@/hooks/use-list"
import { TVShowItem } from "@/components/tvShowItem"
import { useCallback, useEffect, useState } from "react"
import { CreateListModal } from "@/components/modal/createListModal"
import { useUser } from "@/hooks/use-user"
import { useRating } from "@/hooks/use-rating"
import {
  ButtonTypeEnum,
  type Actor,
  type List,
  type TvShow,
  type WatchedTvShow,
} from "@/types"
import { CastModal } from "@/components/modal/castModal"
import { useActor } from "@/hooks/use-actor"
import { useGenres } from "@//hooks/use-genres"
import { Layout } from "@/components/layout"
import { mergeCn } from "@/utils/cn"
import { CircleIcon } from "@/components/icons/circle"

export function HomePage() {
  const {
    tvShows,
    watchedStatus,
    markTvShowAsWatched,
    watchedTvShows,
    tvShowsByPage,
    fetchTvShowsByPage,
    isLoadingTvShowsByPage,
    markTvShowAsFavorite,
    favoriteTvShow
  } = useTvShow()
  const { lists, addTvShowToList, createList } = useList()
  const { user } = useUser()
  const { ratings, createRating } = useRating()
  const { markActorAsFavorite, favoriteActors } = useActor()
  const { genres } = useGenres()

  const [showCreateListModal, setShowCreateListModal] = useState(false)
  const [showCastModal, setShowCastModal] = useState(false)
  const [selectedTvShow, setSelectedTvShow] = useState<TvShow>()
  const [search, setSearch] = useState("")
  const [activePopup, setActivePopup] = useState<ButtonTypeEnum | null>(null)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [tvShowsToRender, setTvShowsToRender] = useState<TvShow[]>([])
  const [currentPage, setCurrentPage] = useState<number>()
  const totalPages = tvShowsByPage?.totalPages

  useEffect(() => {
    setTvShowsToRender(tvShowsByPage?.results ?? [])
    setCurrentPage(tvShowsByPage?.page ?? 1)
  }, [tvShowsByPage])

 
  const getStatusColor = useCallback(
    (watchedTvShows: WatchedTvShow[], tvShowId: string) => {
      const status = watchedTvShows.find(
        (tv) => tv.id === tvShowId,
      )?.watchStatus
      switch (status) {
        case "Finalizado":
          return "green"
        case "Assistindo":
          return "yellow"
        case "Abandonei":
          return "red"
        default:
          return "gray"
      }
    },
    [watchedTvShows],
  )

  const handleWatchStatusChange = async ({
    tvShow,
    watchedStatusId,
  }: {
    tvShow: TvShow
    watchedStatusId: string
  }) => {
    await markTvShowAsWatched(tvShow, watchedStatusId)
  }

  const handleAddTvShowToList = async ({
    list,
    tvShow,
  }: {
    list: List
    tvShow: TvShow
  }) => {
    await addTvShowToList(list, tvShow)
  }

  const onCreateList = async (name: string) => {
    await createList(name)
  }

  const handleCastModalButton = (tvShow: TvShow) => {
    setSelectedTvShow(tvShow)
    setShowCastModal(!showCastModal)
  }

  const handleMakeActorFavorite = async (actor: Actor) => {
    await markActorAsFavorite(actor.id)
  }

  const onSelectGenre = useCallback(
    (genreId: string) => {
      const nextGenres = selectedGenres.includes(genreId)
        ? selectedGenres.filter((id) => id !== genreId)
        : [...selectedGenres, genreId]

      setSelectedGenres(nextGenres)

      if (nextGenres.length > 0) {
        const showsToFilter = tvShows.filter((tvShow) =>
          tvShow.genres?.some((tvGenre) => nextGenres.includes(tvGenre.id)),
        )
        setTvShowsToRender(showsToFilter)
      } else {
        setTvShowsToRender(tvShowsByPage?.results ?? [])
      }
    },
    [selectedGenres, tvShows, setSelectedGenres, setTvShowsToRender], //
  )

  const onActivePopUp = () => {
    setActivePopup((prev) =>
      prev === ButtonTypeEnum.FILTER ? null : ButtonTypeEnum.FILTER,
    )
  }

  const onChange = useCallback(
    (value: string) => {
      setSearch(value)

      let filteredResults = [...tvShows]

      const searchQuery = value.trim().toLowerCase()
      if (searchQuery) {
        filteredResults = filteredResults.filter((show) =>
          show.title.toLowerCase().includes(searchQuery),
        )
      } else { 
        filteredResults = tvShowsByPage?.results ?? []
      }

      if (selectedGenres.length > 0) {
        filteredResults = filteredResults.filter((show) =>
          show.genres?.some((genre) => selectedGenres.includes(genre.id)),
        )
      }

      setTvShowsToRender(filteredResults)
    },
    [tvShows, tvShowsByPage, selectedGenres],
  )  
  
  const onPageChange = useCallback(
    async (newPage: number) => {
      setCurrentPage(newPage)

      await fetchTvShowsByPage(newPage, 20)
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    },
    [setCurrentPage, currentPage],
  )

  const checkTheFavoriteTvShow = useCallback((tvShowId: string) => {
    return favoriteTvShow?.id === tvShowId
  }, [favoriteTvShow])

  return (
    <Layout
      page="Home"
      headerProps={{
        search: search,
        setSearch: onChange,
        activePopup: activePopup,
        genres: genres,
        selectedGenres: selectedGenres,
        onSelectGenre: onSelectGenre,
        setActivePopUp: onActivePopUp,
        page: "Home",
      }}
    >
      <div className="w-full mt-6 flex flex-col md:flex-row md:flex-wrap md:items-start md:justify-evenly p-6">
        {isLoadingTvShowsByPage ? (
          <div className="flex flex-col items-center justify-center w-full py-24">
            <CircleIcon className="h-12 w-12 text-pink-600" />
            <p className="mt-4 text-pink-600 font-medium">
              Carregando doramas...
            </p>
          </div>
        ) : tvShowsToRender.length > 0 ? (
          tvShowsToRender.map((show) => {
            const watchedStatusColor = getStatusColor(watchedTvShows, show.id)
            const isFavorite = checkTheFavoriteTvShow(show.id)

            return (
              <TVShowItem
                key={show.id}
                show={show}
                watchedStatus={watchedStatus}
                watchedStatusColor={watchedStatusColor}
                lists={lists}
                handleWatchStatusChange={handleWatchStatusChange}
                handleAddTvShowToList={handleAddTvShowToList}
                setShowCreateListModal={setShowCreateListModal}
                initialRating={
                  ratings.find((r) => r.tvShow.id === show.id)?.scaleId ?? 0
                }
                isFavorite={isFavorite}
                onMakeTvShowFavoriteFavorite={markTvShowAsFavorite}
                onRate={createRating}
                onClickShowCastModalButton={() => handleCastModalButton(show)}
              />
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center m-2">
            <p className="text-lg font-semibold text-[#6E5A6B]">
              Não existe nenhum dorama disponível!
            </p>
            
          </div>
        )}
      </div>
      {tvShowsToRender.length > 0 && (
        <Pagination
          currentPage={currentPage ?? 1}
          totalPages={totalPages ?? 0}
          onPageChange={onPageChange}
        />
      )}

      <CastModal
        isOpen={showCastModal}
        onClose={() => setShowCastModal(false)}
        actors={selectedTvShow?.actors ?? []}
        onClick={handleMakeActorFavorite}
        favoriteActors={favoriteActors ?? []}
      />

      <CreateListModal
        isOpen={showCreateListModal}
        onClose={() => setShowCreateListModal(false)}
        onCreate={onCreateList}
      />
    </Layout>
  )
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (newPage: number) => void
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex flex-row gap-2.5 mt-5 items-center justify-center text-pink-600 mb-14 md:mb-0">
      <button
        className={mergeCn("font-bold", {
          hidden: currentPage === 1,
        })}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Anterior
      </button>

      <span>
        Página {currentPage} de {totalPages}
      </span>

      <button
        className="font-bold"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Próximo
      </button>
    </div>
  )
}
