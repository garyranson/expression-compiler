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
      "format": "cjs"
    }
  },

  meta: {
    "jspm_packages/github/garyranson/*": {
      "format": "cjs"
    }
  }
});
