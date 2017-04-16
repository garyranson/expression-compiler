module.exports = function () {
    return {
        "files": [
            "src/**/*.ts"
        ],
        "tests": [
            "test/**/*.git statusnodespec.ts"
        ],
        "env": {
            type: "node"
        },
        testFramework: "mocha"
    }
};
