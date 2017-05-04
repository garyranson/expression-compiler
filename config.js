System.config({
  baseURL: "./",
  defaultJSExtensions: true,
  transpiler: false,
  paths: {
    "github:*": "jspm_packages/github/*"
  },

  packages: {
    "lib": {
      "defaultExtension": "js",
      "format": "system"
    }
  },

  meta: {
    "jspm_packages/github/garyranson/*": {
      "format": "system"
    }
  },

  map: {
    "expression-parser": "github:garyranson/expression-parser@master"
  }
});
