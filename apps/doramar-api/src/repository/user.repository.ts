import { prisma } from "../lib/prisma"
import { AppError } from "../utils/errors"
import { RegisterUserInput, User } from "../types"

async function validationUniqueEmail(email: string) {
  const user = await prisma.users.findUnique({
    where: { email },
  })

  if (user) {
    throw new AppError("Email already in use!", 409)
  }
  return true
}

async function validationUniqueUsername(username: string) {
  const user = await prisma.users.findFirst({
    where: { username },
  })

  if (user) {
    throw new AppError("Username already in use!", 409)
  }
  return true
}

async function findUserById(id: string) {
  const user = await prisma.users.findUnique({
    where: { id },
  })

  if (!user) {
    throw new AppError("User not found!", 404)
  }

  return user
}

async function findByEmail(email: string) {
  const user = await prisma.users.findUnique({
    where: { email },
  })

  if (!user) {
    throw new AppError("User not found!", 404)
  }

  return user
}

async function createUser(data: RegisterUserInput) {
  return await prisma.users.create({
    data: {
      ...data,
    },
  })
}

async function updateUser(
  id: string,
  data: Partial<Omit<User, "id" | "createdAt">>
) {
  const updatedUser = await prisma.users.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  })

  return {
    id: updatedUser.id,
    username: updatedUser.username,
    name: updatedUser.name,
    email: updatedUser.email,
    profilePicture: updatedUser.profilePicture,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  }
}

async function deleteUser(id: string) {
  await prisma.users.delete({
    where: { id },
  })
}

async function findUserByUsername(username: string) {
  return await prisma.users.findUnique({
    where: {
      username,
    },
  })
}

const userRepository = {
  createUser,
  updateUser,
  deleteUser,
  validationUniqueEmail,
  findUserById,
  validationUniqueUsername,
  findByEmail,
  findUserByUsername,
}

export default userRepository
