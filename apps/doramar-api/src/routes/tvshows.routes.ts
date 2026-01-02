import express from "express"
import {
  createTvShow,
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
  router.post("/", authenticate, createTvShow)
  router.get("/watched/user/:userId", authenticate, findWatchedTvShowsByUserId)
  router.post("/watched", authenticate, markTvShowAsWatched)
  router.get("/watched/status", authenticate, getWatchedStatus)

  return router
}
