import express from "express"
import {
  addActorToFavorites,
  findFavoriteActorsByUserId,
  getAllActors,
} from "../controller/actors.controller"
import { authenticate } from "../middleware"

export function actorsRoutes() {
  const router = express.Router()

  router.get("/", authenticate, getAllActors)
  router.get("/favorite/user/:userId", authenticate, findFavoriteActorsByUserId)
  router.post("/user/:userId/favorite", addActorToFavorites)

  return router
}
