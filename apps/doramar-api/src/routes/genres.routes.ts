import express from "express"
import { getAllGenres } from "../controller/genres.controller"
import { authenticate } from "../middleware"

export function genresRoutes() {
  const router = express.Router()

  router.get("/", authenticate, getAllGenres)
  return router
}
