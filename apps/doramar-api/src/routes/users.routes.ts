import express from "express"

import {
  createUser,
  deleteUserById,
  findUserByEmail,
  findUserById,
  updateUser,
  uploadProfilePicture,
} from "../controller/users.controller"
import { authenticate } from "../middleware"
import { validateData } from "../middleware/validation"
import { userSchema } from "../schemas/user.schema"
import { upload } from "../middleware/upload"

export function userRoutes() {
  const router = express.Router()

  router.get("/:userId", authenticate, findUserById)
  router.get("/", authenticate, findUserByEmail)
  router.post("/", validateData(userSchema), createUser)
  router.patch("/:userId", authenticate, updateUser)
  router.delete("/:userId", authenticate, deleteUserById)
  router.post(
    "/:userId/profilePicture",
    upload.single("file"),
    authenticate,
    uploadProfilePicture,
  )

  return router
}
