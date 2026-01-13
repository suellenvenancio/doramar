import userRepository from "../repository/user.repository"
import { RegisterUserInput, User } from "../types"
import { AppError } from "../utils/errors"
import { getAuth } from "firebase-admin/auth"

import { compressIfNeeded, uploadImage } from "../utils/image"

async function findUserByEmail(email: string) {
  const foundedUser = await userRepository.findByEmail(email)

  if (!foundedUser) {
    throw new AppError("User not found!", 404)
  }

  return {
    id: foundedUser?.id,
    username: foundedUser?.username,
    name: foundedUser?.name,
    email: foundedUser?.email,
    profilePicture: foundedUser?.profilePicture,
    createdAt: foundedUser?.createdAt,
    updatedAt: foundedUser?.updatedAt,
  }
}

async function findUserById(id: string) {
  const foundedUser = await userRepository.findUserById(id)

  return {
    id,
    username: foundedUser.username,
    name: foundedUser.name,
    email: foundedUser.email,
    profilePicture: foundedUser.profilePicture,
    createdAt: foundedUser.createdAt,
    updatedAt: foundedUser.updatedAt,
  }
}

async function createUser(data: RegisterUserInput) {
  try {
    return await getAuth()
      .createUser({
        email: data.email,
        password: data.password,
        displayName: data.name,
      })
      .then(async (user) => {
        user.uid
        return await validateAndCreateUser(data)
      })
      .catch(async (error) => {
        if (
          error.message ===
          "The email address is already in use by another account."
        ) {
          return await validateAndCreateUser(data)
        }
        console.error("Error creating user in Firebase:", error)
        throw error
      })
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}
async function validateAndCreateUser({
  email,
  username,
  name,
  password,
  id,
}: {
  email: string
  username: string
  name: string
  password: string
  id: string
}) {
  try {
    await userRepository.validationUniqueEmail(email)
    await userRepository.validationUniqueUsername(username)

    return await userRepository.createUser({
      email,
      username,
      name,
      password,
      id,
    })
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

async function updateUser(
  id: string,
  data: Partial<Omit<User, "id" | "createdAt">>,
) {
  try {
    const foundedUser = await userRepository.findUserById(id)

    if (data.email && data.email !== foundedUser.email) {
      await userRepository.validationUniqueEmail(data.email)
    }

    if (data.username && data.username !== foundedUser.username) {
      await userRepository.validationUniqueUsername(data.username)
    }

    return userRepository.updateUser(id, data)
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

async function deleteUser(id: string) {
  try {
    await userRepository.findUserById(id)

    await userRepository.deleteUser(id)
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}

async function uploadProfilePicture(userId: string, file: Express.Multer.File) {
  try {
    const user = await userRepository.findUserById(userId)

    if (!user) {
      throw new AppError("User not found!", 404)
    }

    const compressedBuffer = await compressIfNeeded(file)

    const fileToUpload = {
      ...file,
      buffer: compressedBuffer,
      size: compressedBuffer.length,
    }

    const blob = await uploadImage(fileToUpload)

    return await userRepository.updateUser(userId, {
      profilePicture: blob.url,
    })
  } catch (error) {
    console.error("Error uploading avatar:", error)
    throw error
  }
}

async function findUserByUsername(username: string) {
  try {
    return await userRepository.findUserByUsername(username)
  } catch (error) {
    console.error("Error on search user by username:", error)
    throw error
  }
}

const userService = {
  uploadProfilePicture,
  findUserByEmail,
  createUser,
  deleteUser,
  updateUser,
  findUserById,
  findUserByUsername,
}

export default userService
