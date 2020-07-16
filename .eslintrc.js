module.exports = {
  "extends": [
    "react-app",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  "rules": {
    "arrow-parens": ["error", "always"],
    "comma-dangle": ["error", {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "always-multiline",
        "exports": "always-multiline",
        "functions": "always-multiline"
    }],
    "semi": ["error", "always"],
    "semi-style": ["error", "last"],
    "no-trailing-spaces": ["error", {
      "skipBlankLines": false,
      "skipBlankLines": false,
      "ignoreComments": false
    }],
    "prettier/prettier": ["error", {
      "arrowParens": "always",
      "trailingComma": "all"
    }]
  }
}