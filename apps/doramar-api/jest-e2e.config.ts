import jestConfig from "./jest.config"

/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "./prisma/prisma.test.enviroment.ts",
  testRegex: "./tests/e2e/.*.e2e.spec.ts$",
  verbose: true,
  roots: ["<rootDir>/tests/e2e"],
  clearMocks: true,
  forceExit: true,
  detectOpenHandles: true,
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
}
