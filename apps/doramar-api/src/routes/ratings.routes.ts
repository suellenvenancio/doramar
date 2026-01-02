import express from "express"

import {
  createRating,
  createRatingScale,
  getRatingById,
  getRatingsByUserId,
  getRatingScales,
} from "../controller/ratings.controller"
import { authenticate } from "../middleware"
import { validateData } from "../middleware/validation"
import { ratingSchema } from "../schemas/rating.schema"

export function ratingsRoutes() {
  const router = express.Router()

  router.get("/user/:userId", authenticate, getRatingsByUserId)
  router.get("/scale", authenticate, authenticate, getRatingScales)
  router.post("/", validateData(ratingSchema), authenticate, createRating)
  router.post("/scale", authenticate, createRatingScale)
  router.get("/:ratingId", authenticate, getRatingById)

  return router
}
