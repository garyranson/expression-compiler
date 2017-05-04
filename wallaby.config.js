module.exports = function () {
    return {
        "files": [
            "src/**/*.ts"
        ],
        "tests": [
            "test/**/*.nodespec.ts"
        ],
        "env": {
            type: "node"
        },
        testFramework: "mocha"
    }
};
