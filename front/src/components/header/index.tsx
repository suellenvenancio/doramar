import doramar from "@/assets/doramar.png"
import { SearchInput } from "../searchInput"
import { IconButton } from "../button/iconButton"
import { FilterIcon } from "../icons/filter"
import { ButtonTypeEnum, type Genre, type Page } from "@/types"
import { PopUpMenu } from "../popup"

interface HeaderProps {
  search?: string
  setSearch?: (value: string) => void
  activePopup?: ButtonTypeEnum | null
  genres?: Genre[]
  selectedGenres?: string[]
  onSelectGenre?: (genreId: string) => void
  setActivePopUp?: () => void
  page?: Page
}
export function Header({
  search,
  setSearch,
  activePopup,
  genres,
  selectedGenres,
  onSelectGenre,
  setActivePopUp,
  page,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex flex-row justify-start bg-[#FEB5D0] p-2 w-full">
      <img className="h-12 w-25 md:w-36" src={doramar} />
      <div className="flex flex-row justify-start md:justify-between items-center w-full gap-2">
        {page === "Home" && (
          <div className="flex flex-row justify-start w-full items-center w- full">
            <SearchInput
              value={search ?? ""}
              onChange={setSearch ?? (() => {})}
              className="w-full md:w-[50%]"
            />
            <div className="relative">
              <IconButton
                icon={<FilterIcon />}
                onClick={setActivePopUp}
                className="text-[#e91e63] ml-4"
              />
              {activePopup === ButtonTypeEnum.FILTER && (
                <PopUpMenu
                
                  hasCheckBoxes={true}
                  type="Gêneros"
                  title="Gêneros"
                  items={
                    genres?.map((genre) => {
                      return { id: genre.id, label: genre.name }
                    }) ?? []
                  }
                  onClick={onSelectGenre ?? (() => {})}
                  className="absolute top-full right-0 mt-2"
                  selectedGenres={selectedGenres}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
