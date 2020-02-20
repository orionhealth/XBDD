module.exports = {
  plugins: ["@typescript-eslint", "import", "import", "jsx-a11y", "prettier", "react-hooks"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
    project: ["./tsconfig.json"],
  },
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/react",
    "plugin:import/typescript",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:prettier/recommended",
    "prettier/react",
    "prettier/@typescript-eslint",
  ],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
    jest: true,
    node: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "class-methods-use-this": 0,
    "import/named": "off",
    "import/newline-after-import": "warn",
    "import/no-named-as-default": "off",
    "import/order": ["warn", { "newlines-between": "always", groups: ["builtin", "external"] }],
    "jsx-a11y/no-static-element-interactions": "off",
    "no-plusplus": 0,
    "no-underscore-dangle": ["error", { allow: ["_t", "_raw", "_id"] }],
    "prettier/prettier": "error",
    "react/prop-types": "off",
    "react/sort-comp": ["error", { order: ["static-methods", "lifecycle", "/^on.+$/", "everything-else", "/^render.+$/", "render"] }],
  },
};
