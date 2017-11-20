"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compiler_visitor_1 = require("./compiler-visitor");
const expression_parser_1 = require("expression-parser");
class Compiler {
    constructor() {
        this.visitor = new compiler_visitor_1.CompileVisitor();
        this.parser = new expression_parser_1.Parser();
    }
    compile(code) {
        let expr = this.parser.parseExpression(code || "");
        console.log(expr.constructor);
        return expr.visit(this.visitor);
    }
    // noinspection JSUnusedGlobalSymbols
    compileMulti(code) {
        return this.parser.parseExpressions(code || "").map((c) => c.visit(this.visitor));
    }
    // noinspection JSUnusedGlobalSymbols
    compileContent(code) {
        return this.parser.parseContent(code || "").visit(this.visitor);
    }
    eval(code, scope) {
        return this.compile(code).eval(scope);
    }
}
exports.Compiler = Compiler;
