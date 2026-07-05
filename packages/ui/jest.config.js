/** @type {import('jest').Config} */
module.exports = {
  projects: [
    {
      displayName: "web",
      testEnvironment: "jsdom",
      testMatch: ["<rootDir>/src/**/*.web.test.{ts,tsx}"],
      transform: {
        "^.+\\.(js|ts|tsx)$": "babel-jest",
      },
      moduleNameMapper: {
        "\\.module\\.css$": "identity-obj-proxy",
      },
      setupFilesAfterEnv: ["<rootDir>/jest.setup.web.ts"],
    },
    {
      preset: "react-native",
      displayName: "native",
      testMatch: ["<rootDir>/src/**/*.native.test.tsx"],
    },
  ],
};