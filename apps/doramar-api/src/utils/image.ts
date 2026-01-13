import { put } from "@vercel/blob"

import dotenv from "dotenv"
import sharp from "sharp"
dotenv.config()
const token = process.env.BLOB_VERCEL_READ_WRITE_TOKEN

export async function uploadImage(file: Express.Multer.File) {
  return await put(`images/${Date.now()}-${file.originalname}`, file.buffer, {
    access: "public",
    token,
  })
}

export async function compressIfNeeded(file: Express.Multer.File): Promise<Buffer> {
  const FIVE_MB = 5 * 1024 * 1024

  if (file.size <= FIVE_MB) {
    return file.buffer
  }

  return await sharp(file.buffer)
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer()
}
