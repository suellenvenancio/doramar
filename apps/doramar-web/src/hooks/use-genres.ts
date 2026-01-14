import { useEffect, useState } from "react"

import { genreService } from "@/services/genres.service"
import type { Genre } from "@/types"

export function useGenres() {
  const [genres, setGenres] = useState<Genre[]>([])

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const fetchedGenres = await genreService.fetchGenre()
        setGenres(fetchedGenres)
      } catch (error) {
        console.error("Failed to fetch ratings:", error)
      }
    }
    fetchGenres()
  }, [])

  return {
    genres,
  }
}
