module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  testMatch: ["**/__tests__/**/*test.ts"],
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json",
    },
  },
};
