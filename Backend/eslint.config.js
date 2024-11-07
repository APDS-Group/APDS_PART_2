import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    settings: {
      react: {
        version: "detect", // or specify a specific version, e.g., "17.0"
      },
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];