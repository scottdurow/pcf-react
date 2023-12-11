module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  testMatch: ["**/__tests__/**/*test.ts"],
  transform: {
    '^.+\\.tsx?$': ["ts-jest", { tsconfig: "tsconfig.json"}]
  },
};
