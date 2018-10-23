"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const instructions_1 = require("./instructions");
const compiler_visitor_1 = require("./compiler-visitor");
const expression_parser_1 = require("expression-parser");
class Compiler {
    constructor() {
        this.visitor = new compiler_visitor_1.CompileVisitor();
        this.parser = new expression_parser_1.Parser();
        console.log('creating compiler');
    }
    compile(code) {
        let expr = this.parser.parseExpression(code || "");
        return expr.visit(this.visitor);
    }
    // noinspection JSUnusedGlobalSymbols
    compileMulti(code) {
        return new instructions_1.ArrayInstruction(this.parser.parseExpressions(code || "").map(e => e.visit(this.visitor)));
    }
    // noinspection JSUnusedGlobalSymbols
    compileList(code) {
        return this.parser.parseExpressions(code || "").map(e => e.visit(this.visitor));
    }
    // noinspection JSUnusedGlobalSymbols
    compileContent(code) {
        return this.parser.parseContent(code || "").visit(this.visitor);
    }
    evaluate(code, scope) {
        return this.compile(code).eval(scope);
    }
    evaluateFn(code, scope) {
        return this.compile(code).toFunction()(scope);
    }
    meval(code, scope) {
        return this.compileMulti(code).eval(scope);
    }
    mevalfn(code, scope) {
        return this.compileMulti(code).toFunction()(scope);
    }
}
exports.Compiler = Compiler;
