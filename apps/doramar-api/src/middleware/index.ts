import { getAuth } from "firebase-admin/auth"
import { Request, Response, NextFunction } from "express"

declare global {
  namespace Express {
    interface Request {
      user_uid: string
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Acesso negado Token ausente.")
  }

  const idToken = authHeader.split("Bearer ")[1]
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken)
    req.user_uid = decodedToken.uid

    next()
  } catch (error) {
    return res.status(403).send("Token inválido ou expirado.")
  }
}
