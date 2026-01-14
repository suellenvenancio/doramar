import Image from "next/image"

import doramar from "@/assets/doramar.png"
import { ButtonTypeEnum, type Genre, type Page } from "@/types"

import { IconButton } from "../button/iconButton"
import { FilterIcon } from "../icons/filter"
import { PopUpMenu } from "../popup"
import { SearchInput } from "../searchInput"

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
    <header className="sticky top-0 z-50 grid grid-cols-3 bg-[#FEB5D0] p-2 w-full">
      <Image className="h-12 w-25 md:w-36" src={doramar} alt="logo" />

      {page === "Home" && (
        <div className="grid grid-cols-[180px_1fr] md:grid-cols-[90%_1fr] items-center w-full col-span-2">
          <SearchInput
            value={search ?? ""}
            onChange={setSearch ?? (() => {})}
            className="md:w-[70%] m-0"
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
                className="top-full right-0 mt-2"
                selectedGenres={selectedGenres}
              />
            )}
          </div>
        </div>
      )}
    </header>
  )
}
