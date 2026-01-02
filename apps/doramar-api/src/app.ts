import morgan from "morgan"
import express, { Request, Response, NextFunction } from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"

import { actorsRoutes } from "./routes/actors.routes"
import { ratingsRoutes } from "./routes/ratings.routes"
import { listsRoutes } from "./routes/lists.routes"
import { tvShowsRoutes } from "./routes/tvshows.routes"
import { communitiesRoutes } from "./routes/communities.routes"
import { initializeFirebase } from "./lib/firebase"
import { genresRoutes } from "./routes/genres.routes"
import { userRoutes } from "./routes/user.routes"

dotenv.config()

initializeFirebase()
const app = express()

const corsOptions: cors.CorsOptions = {
  origin: "http://localhost:5173", // NÃO pode ser "*"
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}

app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())

app.use(morgan(process.env.NODE_ENV === "production" ? "common" : "dev"))

app.use(`/tvShows`, tvShowsRoutes())
app.use(`/lists`, listsRoutes())
app.use(`/users`, userRoutes())
app.use(`/ratings`, ratingsRoutes())
app.use(`/actors`, actorsRoutes())
app.use(`/genres`, genresRoutes())
app.use(`/communities`, communitiesRoutes())

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)

  res.status(500).json({
    message: "Algo deu errado no servidor.",
    error: process.env.NODE_ENV === "production" ? undefined : err.message,
  })
})

export default app
