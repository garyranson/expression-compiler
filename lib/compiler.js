"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_visitor_1 = require("./compiler-visitor");
var expression_parser_1 = require("expression-parser");
var Compiler = (function () {
    function Compiler() {
        this.visitor = new compiler_visitor_1.CompileVisitor();
        this.parser = new expression_parser_1.Parser();
    }
    Compiler.prototype.compile = function (code) {
        var expr = this.parser.parseExpression(code || "");
        console.log(expr.constructor);
        return expr.visit(this.visitor);
    };
    Compiler.prototype.compileMulti = function (code) {
        var _this = this;
        return this.parser.parseExpressions(code || "").map(function (c) { return c.visit(_this.visitor); });
    };
    Compiler.prototype.compileContent = function (code) {
        return this.parser.parseContent(code || "").visit(this.visitor);
    };
    Compiler.prototype.eval = function (code, scope) {
        return this.compile(code).eval(scope);
    };
    return Compiler;
}());
exports.Compiler = Compiler;
