import {
  cert,
  initializeApp,
  ServiceAccount,
  getApps,
} from "firebase-admin/app"
import dotenv from "dotenv"

dotenv.config()

export function initializeFirebase() {
  if (getApps().length) {
    return
  }

  const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!serviceAccountEnv) {
    console.error("Variável de ambiente FIREBASE_SERVICE_ACCOUNT não definida.")
    return
  }

  try {
    const serviceAccountJson = Buffer.from(
      serviceAccountEnv,
      "base64",
    ).toString("ascii")

    const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount

    initializeApp({
      credential: cert(serviceAccount),
    })
    console.log("Firebase Admin inicializado com sucesso.")
  } catch (e: any) {
    console.error("Erro ao inicializar Firebase Admin:", e.message)
  }
}
