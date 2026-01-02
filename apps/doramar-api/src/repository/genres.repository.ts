import { prisma } from "../lib/prisma"

async function getAllGenres() {
  return await prisma.genres.findMany()
}

const genresRepository = {
  getAllGenres,
}

export default genresRepository
