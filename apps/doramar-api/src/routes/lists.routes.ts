import express from "express"
import {
  addTvShowToList,
  createList,
  getListsByUserId,
  getListsByUserEmail,
  updateListOrder,
  deleteList,
  removeTvShowFromTheList,
} from "../controller/lists.controller"
import { authenticate } from "../middleware"
import { validateData } from "../middleware/validation"
import { listSchema } from "../schemas/list.schema"

export function listsRoutes() {
  const router = express.Router()

  router.get("/user/:userId", authenticate, getListsByUserId)
  router.get("/user", authenticate, getListsByUserEmail)
  router.post("/", validateData(listSchema), authenticate, createList)
  router.post("/:listId/tvShow/:tvShowId", authenticate, addTvShowToList)
  router.delete(
    "/:listId/tvShow/:tvShowId/user/:userId",
    authenticate,
    removeTvShowFromTheList,
  )
  router.post("/:listId", authenticate, updateListOrder)
  router.delete("/:listId", authenticate, deleteList)

  return router
}
