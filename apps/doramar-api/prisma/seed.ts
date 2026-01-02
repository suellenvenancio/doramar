import fs from "fs"
import path from "path"
import { prisma } from "../src/lib/prisma"
import { fileURLToPath } from "url"
import { NextFunction } from "express"

export interface CastMember {
  id: number
  name: string
  character: string
  image: string | null
}

export interface DramaSeedData {
  id: number
  title: string
  originalName: string
  synopsis: string
  poster: string | null
  premiereDate: string // Vem como string do JSON (ex: "2021-09-17")
  genres: string[]
  cast: CastMember[]
}
export interface CastMember {
  id: number
  name: string
  character: string
  image: string | null
}

export interface DramaSeedData {
  id: number
  title: string
  originalName: string
  synopsis: string
  poster: string | null
  premiereDate: string // Vem como string do JSON (ex: "2021-09-17")
  genres: string[]
  cast: CastMember[]
}

async function actorOnTvShows(dorama: DramaSeedData) {
  try {
    const tvShow = await prisma.tvShows.findFirst({
      where: { originalName: dorama.title },
    })

    if (!tvShow) {
      console.error(`❌ Dorama não encontrado: ${dorama.title}`)
      return null
    }

    const actors = dorama.cast

    for (const actor of actors) {
      const actorRecord = await prisma.actors.findFirst({
        where: { name: actor.name },
      })

      if (!actorRecord) {
        console.error(`Ator não encontrado: ${actor}`)
        continue
      }

      try {
        console.log(`Adicionando ator ${actor} ao dorama ${dorama.title}`)
        await prisma.actorsOnTvShows.create({
          data: {
            tvShowId: tvShow.id,
            actorId: actorRecord.id,
          },
        })
        console.log(`✅ Associado ator ${actor} ao dorama ${dorama.title}`)
        return
      } catch (err: Error | any) {
        console.error(
          `❌ Erro ao associar ator ${actor} ao dorama ${dorama.title}:`,
          err.message,
        )
        return
      }
    }
  } catch (error) {
    console.error("Error processing show:", error)
    return
  }
}

async function seedActorsOnTvShows(dramas: DramaSeedData[]) {
  try {
    for (const dorama of dramas) {
      await actorOnTvShows(dorama)
    }
    console.log("✅ Associação concluída!")
  } catch (error) {
    console.error("Error seeding actor-show relationships:", error)
  }
}

async function getTVShowGenres(tvShow: DramaSeedData) {
  try {
    const tvShowRecord = await prisma.tvShows.findFirst({
      where: { title: tvShow.title },
    })

    if (!tvShowRecord) {
      console.error(`❌ Dorama não encontrado: ${tvShow.title}`)
      return
    }

    // 1. Normaliza os gêneros: trata o "&" e remove espaços extras
    const normalizedGenres = tvShow.genres.flatMap((g) =>
      g.includes("&") ? g.split("&").map((sub) => sub.trim()) : g.trim(),
    )

    // 2. Remove duplicatas (usando a lógica que discutimos antes)
    const uniqueGenres = [...new Set(normalizedGenres)]

    for (const genreName of uniqueGenres) {
      // Busca o gênero no banco
      const genre = await prisma.genres.findFirst({
        where: { name: genreName },
      })

      if (!genre) {
        console.error(`❌ Gênero não cadastrado no banco: ${genreName}`)
        continue
      }

      try {
        await prisma.tvShowGenres.create({
          data: {
            tvShowId: tvShowRecord.id,
            genreId: genre.id,
          },
        })

        console.log(`✅ Gênero "${genreName}" associado a "${tvShow.title}"`)
      } catch (err: any) {
        console.error(`❌ Erro ao associar "${genreName}":`, err.message)
      }
    }
  } catch (error) {
    console.error("Erro ao processar gêneros:", error)
  }
}

async function seedTvShowGenres(dramas: DramaSeedData[]) {
  try {
    for (const drama of dramas) {
      await getTVShowGenres(drama)
    }
    console.log("✅ Associação de gêneros concluída!")
  } catch (error) {
    console.error("Error seeding genre relationships:", error)
  } finally {
    await prisma.$disconnect()
  }
}

function convertDateToUTCISO(dateOnlyString: string): string {
  try {
    // 1. Anexa T00:00:00Z para forçar a interpretação como meia-noite UTC
    const utcDate = new Date(`${dateOnlyString}T00:00:00Z`)

    // 2. Verifica se a data é válida
    // new Date('data-invalida') retorna 'Invalid Date',
    // e .getTime() retorna NaN.
    if (isNaN(utcDate.getTime())) {
      throw new Error("Data de entrada inválida.")
    }

    // 3. Converte para a string ISO 8601 padrão (que é sempre UTC)
    return utcDate.toISOString()
  } catch (error) {
    console.error(`Erro ao converter a data: ${dateOnlyString}`, error)
    throw new Error("Não foi possível processar a data fornecida.")
  }
}

export interface CastMember {
  id: number
  name: string
  character: string
  image: string | null
}

export interface DramaSeedData {
  id: number
  title: string
  originalName: string
  synopsis: string
  poster: string | null
  premiereDate: string // Vem como string do JSON (ex: "2021-09-17")
  genres: string[]
  cast: CastMember[]
}

async function seedTvShows() {
  try {
    const jsonPath = path.join(__dirname, "./final.json")

    const fileContent = fs.readFileSync(jsonPath, "utf-8")
    const tvShowsData: DramaSeedData[] = JSON.parse(fileContent)

    const genres = tvShowsData.flatMap((drama: DramaSeedData) => drama.genres)
    const allGenres: string[] = []
    genres.forEach((g) => {
      if (g.includes("&")) {
        const splitedStr = g.split("&")
        splitedStr.forEach((g) => allGenres.push(g.trim()))
        return
      }
      allGenres.push(g)
    })
    const uniqueGenres = new Set(allGenres)

    for (const genre of uniqueGenres) {
      await prisma.genres.create({
        data: { name: genre },
      })
    }

    console.log("Genres seeded successfully")

    for (const show of tvShowsData) {
      console.log(`Adicionando ${show.title} ao banco de dados!`)
      await prisma.tvShows.create({
        data: {
          title: show.title,
          originalName: show.originalName,
          synopsis: show.synopsis,
          premiereDate: convertDateToUTCISO(show.premiereDate ?? "2025-12-28"),
          poster: show.poster || "",
        },
      })
    }

    console.log("TV Shows seeded successfully")

    await seedTvShowGenres(tvShowsData)

    const actors = tvShowsData.flatMap((t) => t.cast)
    const uniqueCast = [
      ...new Map(actors.map((item) => [item.id, item])).values(),
    ]

    for (const actor of uniqueCast) {
      await prisma.actors.create({
        data: {
          name: actor.name,
          image: actor.image,
        },
      })
    }

    await seedActorsOnTvShows(tvShowsData)
    console.log("Banco de dados alimentado com sucesso1")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}

export async function seed(req: Request, res: Response, next: NextFunction) {
  try {
    seedTvShows()
    console.log("Doramas com linguagem em coreano deletados sucesso!")
  } catch (error) {
    console.error("Error seeding TV Shows:", error)
  }
}
