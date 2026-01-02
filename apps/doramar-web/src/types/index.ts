export interface createUser {
  name: string
  email: string
  username: string
  password: string
}

interface FavoriteTvShow {
  id: string
  createdAt: Date
  title: string
  synopsis: string
  cast: string
  poster: string
  premiereDate: Date
  originalName: string
}

export interface User {
  id: string
  name: string
  email: string
  profilePicture: string
  username: string
  favoriteActors: Actor[]
  favoriteTvShow?: FavoriteTvShow
  createdAt: Date
  updatedAt: Date
}

export interface TvShowWithPagination {
  results: TvShow[]
  limit: number
  total: number
  page: number
  totalPages: number
}

export interface TvShow {
  id: string
  title: string
  synopsis: string
  cast: string
  poster: string
  premiereDate: string
  originalName: string
  createdAt: Date
  actors: Actor[]
  genres: Genre[]
}

export const ButtonTypeEnum = {
  EYE: "eye",
  PLUS: "plus",
  FILTER: "filter",
} as const

export type ButtonTypeEnum =
  (typeof ButtonTypeEnum)[keyof typeof ButtonTypeEnum]

export interface List {
  id: string
  name: string
  tvShows: TvShow[]
  createdAt: Date
  updatedAt: Date
}

export interface WatchedTvShow {
  tvShowId: string
  watchStatus: string
  id: string
  title: string
  synopsis: string
  cast: string
  poster: string
  premiereDate: Date
  originalName: string
  createdAt: Date
}

export const WatchedStatusEnum = {
  ABANDONEI: "Abandonei",
  ASSISTINDO: "Assistindo",
  FINALIZADO: "Finalizado",
}

export interface ListWithTvShows {
  tvShows: TvShow[]
  userId?: string | undefined
  name?: string | undefined
  id?: string | undefined
  createdAt?: Date | undefined
  updatedAt?: Date | undefined
}

export interface ResponseType<T> {
  message: string
  statusCode: number
  data: T
}

export interface Rating {
  userId: string
  tvShowId: string
  scaleId: number
  id: string
  comment: string | null
}

export interface RatingWithTvShow {
  tvShow: {
    id: string
    createdAt: Date
    title: string
    synopsis: string
    cast: string
    poster: string
    premiereDate: Date
    originalName: string
  }
  scale: {
    id: number
    label: string
  }
  userId: string
  tvShowId: string
  scaleId: number
  id: string
  comment: string | null
}

export interface Actor {
  id: string
  image: string
  name: string
}

export interface Genre {
  id: string
  name: string
}

export interface Post {
  id: string
  createdAt: string
  updatedAt: Date
  userId: string
  communityId: string
  title: string | null
  content: string
  type: PostType
  isPinned: boolean
  isLocked: boolean
  author: User
}

export interface Community {
  owner: {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    email: string
    username: string
    profilePicture: string | null
  }
  members: Member[]
  name: string
  description?: string
  visibility?: CommunityVisibility
  avatarUrl?: string
  rules?: string
  createdAt: Date
  id: string
}

export interface Member {
  id: string
  userId: string
  communityId: bigint
  role: CommunityRole
  status: string
  joinedAt: Date | null
  user: User
}

export interface Comment {
  id: string
  createdAt: Date
  updatedAt: Date
  userId: string
  content: string
  postId: string
  parentId: string
  author: User
}

export type Page = "Home" | "Profile" | "Lists" | "Communities"

export enum CommunityVisibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  SECRET = "SECRET",
}

export enum CommunityRole {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  MEMBER = "MEMBER",
}

export enum MemberStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  BANNED = "BANNED",
}

export enum PostType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  LINK = "LINK",
  POLL = "POLL",
}

export enum ReactionTargetType {
  POST = "POST",
  COMMENT = "COMMENT",
}

export enum ReactionType {
  LIKE = "LIKE",
  LOVE = "LOVE",
  LAUGH = "LAUGH",
  ANGRY = "ANGRY",
}

export interface Reaction {
  id: string
  createdAt: Date
  userId: string
  type: ReactionType
  postId: string | null
  targetType: ReactionTargetType
  commentId: string | null
}
