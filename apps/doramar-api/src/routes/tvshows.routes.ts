import express from "express"
import {
  addTVShowToFavorites,
  findFavoriteTvShowByUserId,
  findWatchedTvShowsByUserId,
  getAllTvShows,
  getTvShowsByPage,
  getWatchedStatus,
  markTvShowAsWatched,
} from "../controller/tvShows.controller"
import { authenticate } from "../middleware"

export function tvShowsRoutes() {
  const router = express.Router()

  router.get("/all", authenticate, getAllTvShows)
  router.get("/", authenticate, getTvShowsByPage)
  router.get("/watched/user/:userId", authenticate, findWatchedTvShowsByUserId)
  router.post("/watched", authenticate, markTvShowAsWatched)
  router.get("/watched/status", authenticate, getWatchedStatus)
  router.get("/favorite/user/:userId", authenticate, findFavoriteTvShowByUserId)
  router.post(
    "/user/:userId/favoriteTvShow",
    authenticate,
    addTVShowToFavorites,
  )

  return router
}
