System.register(["./compiler"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters: [
            function (compiler_1_1) {
                exportStar_1(compiler_1_1);
            }
        ],
        execute: function () {
            /*
            "devDependencies": {
              "expression-parser": "git+https://github.com/garyranson/expression-parser.git",
                "@types/chai": "^3.4.35",
                "@types/gulp": "^4.0.2",
                "@types/mocha": "^2.2.40",
                "babel-preset-es2015": "^6.24.1",
                "babelify": "^7.3.0",
                "browserify": "^14.3.0",
                "chai": "^3.5.0",
                "gulp": "^3.9.1",
                "gulp-sourcemaps": "^2.5.1",
                "gulp-typescript": "^3.1.6",
                "gulp-uglify": "^2.1.2",
                "mocha": "^3.2.0",
                "ts-node": "^3.0.2",
                "tsify": "^3.0.1",
                "typescript": "^2.2.2",
                "vinyl-buffer": "^1.0.0",
                "vinyl-source-stream": "^1.1.0"
            },
            */ 
        }
    };
});
