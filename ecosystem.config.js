import dotenv from "dotenv"
dotenv.config()

module.exports = {
  apps: [
    {
      name: "doramar-api",
      script: "./dist/server.js",
      instances: 2,
      exec_mode: "cluster",
      env: {
        DATABASE_URL: process.env.DATABASE_URL,
      },
    },
  ],
}
