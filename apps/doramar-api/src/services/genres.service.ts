import genresRepository from "../repository/genres.repository"

async function getAllGenres() {
  return await genresRepository.getAllGenres()
}

const genresService = {
  getAllGenres,
}

export default genresService
