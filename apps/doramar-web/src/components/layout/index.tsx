import React from "react"
import { Header } from "../header"
import { SideBar } from "../sidebar"
import { MobileFooterMenu } from "../mobileFooterMenu"
import { ButtonTypeEnum, type Genre, type Page } from "@/types"
import { mergeCn } from "@/utils/cn"

interface LayoutProps {
  children: React.ReactNode
  className?: string
  page: Page
  headerProps?: {
    search: string
    setSearch: (value: string) => void
    activePopup: ButtonTypeEnum | null
    genres: Genre[]
    selectedGenres: string[]
    onSelectGenre: (genreId: string) => void
    setActivePopUp: () => void
    page: Page
  }
}

export function Layout({
  children,
  className,
  headerProps,
  page,
}: LayoutProps) {
  return (
    <div
      className={mergeCn(
        `w-full h-full flex flex-col justify-between items-center relative`,
        className,
      )}
    >
      <Header {...{ page, ...headerProps && headerProps }} />
      <div className="flex md:flex-row w-full md:items-start items-center mt-4">
        <SideBar />
        <main className="mb-12 w-full">{children}</main>
      </div>
      <MobileFooterMenu />
    </div>
  )
}
