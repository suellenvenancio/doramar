export interface TvShow {
  id: string
  title: string
  synopsis: string
  poster: string
  premiereDate: Date
  originalName: string
  createdAt: Date
}

export interface RegisterUserInput {
  name: string
  username: string
  email: string
  password: string
  id: string
}

export interface User {
  id: string
  name: string
  email: string
  username: string
  profilePicture?: string
  createdAt: Date
  updatedAt: Date
}

export interface UserResponse {
  id: string
  name: string
  email: string
  username: string
  createdAt: Date
  updatedAt: Date
}
