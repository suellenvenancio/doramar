import { put } from "@vercel/blob"

import dotenv from "dotenv"
dotenv.config()
const token = process.env.BLOB_VERCEL_READ_WRITE_TOKEN

export async function uploadImage(file: Express.Multer.File) {
  return await put(`images/${Date.now()}-${file.originalname}`, file.buffer, {
    access: "public",
    token,
  })
}
