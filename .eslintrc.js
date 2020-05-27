module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/react",
  ],
  plugins: ["deprecation", "react", "@typescript-eslint", "prettier"],
  parserOptions: {
    project: "./tsconfig.json",
  },
  settings: {
    react: {
      pragma: "React",
      version: "detect",
    },
  },
  env: {
    browser: true,
    jasmine: true,
    jest: true,
    es6: true
  },
  overrides: [
    {
      files: ["*.ts"],
      rules: {
        "deprecation/deprecation": "warn",
        camelcase: [2, { properties: "never" }],
      },
    },
  ],
};
