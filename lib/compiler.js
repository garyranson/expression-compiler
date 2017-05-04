System.register(["./compiler-visitor", "expression-parser"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var compiler_visitor_1, expression_parser_1, Compiler;
    return {
        setters: [
            function (compiler_visitor_1_1) {
                compiler_visitor_1 = compiler_visitor_1_1;
            },
            function (expression_parser_1_1) {
                expression_parser_1 = expression_parser_1_1;
            }
        ],
        execute: function () {
            Compiler = (function () {
                function Compiler() {
                    this.visitor = new compiler_visitor_1.CompileVisitor();
                    this.parser = new expression_parser_1.Parser();
                }
                Compiler.prototype.compile = function (code) {
                    return this.parser.parseExpression(code || "").visit(this.visitor);
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
            exports_1("Compiler", Compiler);
        }
    };
});
