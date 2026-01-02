import type { Config } from "jest"

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  clearMocks: true,
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/tests/e2e"],
}

export default config
