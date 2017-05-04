System.register([], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __moduleName = context_1 && context_1.id;
    function evaluateAll(scope, args) {
        var rc = [];
        for (var i = 0; i < args.length; i++) {
            rc[i] = args[i].eval(scope);
        }
        return rc;
    }
    function isConstant(args) {
        for (var i = 0; i < args.length; i++) {
            if (!args[i].isConstant()) {
                return false;
            }
        }
        return true;
    }
    function failSafe() {
        throw "cannot call";
    }
    function safeCall(fn, method) {
        return (fn && fn[method]) || failSafe;
    }
    var emptyScope, BinaryBase, LiteralInstruction, ScopedAccessorInstruction, MemberAccessorInstruction, DirectMemberAccessorInstruction, ConditionalInstruction, UnaryPlusInstruction, UnaryMinusInstruction, UnaryNotInstruction, MemberCallInstruction, MemberCall0Instruction, MemberCall1Instruction, MemberCall2Instruction, MemberCall3Instruction, ScopeCallInstruction, ScopeCall0Instruction, ScopeCall1Instruction, ScopeCall2Instruction, ScopeCall3Instruction, ObjectInstruction, ArrayInstruction, LogicalOrInstruction, LogicalAndInstruction, BinaryEqualInstruction, BinaryNotEqualInstruction, BinaryAbsNotEqualInstruction, BinaryAbsEqualInstruction, BinaryGreaterThanInstruction, BinaryLessThanInstruction, BinaryGreaterEqualThanInstruction, BinaryLessEqualThanInstruction, BinaryAddInstruction, BinarySubtractInstruction, BinaryMultiplyInstruction, BinaryDivideInstruction, BinaryModulusInstruction, ConcatenateInstuction;
    return {
        setters: [],
        execute: function () {
            emptyScope = Object.freeze({});
            BinaryBase = (function () {
                function BinaryBase(left, right) {
                    this.left = left;
                    this.right = right;
                }
                BinaryBase.prototype.isConstant = function () {
                    return this.left.isConstant() && this.right.isConstant();
                };
                return BinaryBase;
            }());
            exports_1("BinaryBase", BinaryBase);
            LiteralInstruction = (function () {
                function LiteralInstruction(value) {
                    this.value = value;
                }
                LiteralInstruction.prototype.eval = function (scope) {
                    return this.value;
                };
                LiteralInstruction.prototype.isConstant = function () {
                    return true;
                };
                return LiteralInstruction;
            }());
            exports_1("LiteralInstruction", LiteralInstruction);
            ScopedAccessorInstruction = (function () {
                function ScopedAccessorInstruction(name) {
                    this.name = name;
                }
                ScopedAccessorInstruction.prototype.eval = function (scope) {
                    return scope[this.name];
                };
                ScopedAccessorInstruction.prototype.isConstant = function () {
                    return false;
                };
                return ScopedAccessorInstruction;
            }());
            exports_1("ScopedAccessorInstruction", ScopedAccessorInstruction);
            MemberAccessorInstruction = (function () {
                function MemberAccessorInstruction(object, property) {
                    this.object = object;
                    this.property = property;
                }
                MemberAccessorInstruction.prototype.eval = function (scope) {
                    return this.object.eval(scope)[this.property.eval(scope)];
                };
                MemberAccessorInstruction.prototype.isConstant = function () {
                    return false;
                };
                return MemberAccessorInstruction;
            }());
            exports_1("MemberAccessorInstruction", MemberAccessorInstruction);
            DirectMemberAccessorInstruction = (function () {
                function DirectMemberAccessorInstruction(object, propertyName) {
                    this.object = object;
                    this.propertyName = propertyName;
                }
                DirectMemberAccessorInstruction.prototype.eval = function (scope) {
                    return this.object.eval(scope)[this.propertyName];
                };
                DirectMemberAccessorInstruction.prototype.isConstant = function () {
                    return false;
                };
                return DirectMemberAccessorInstruction;
            }());
            exports_1("DirectMemberAccessorInstruction", DirectMemberAccessorInstruction);
            ConditionalInstruction = (function () {
                function ConditionalInstruction(test, consequent, alternate) {
                    this.test = test;
                    this.consequent = consequent;
                    this.alternate = alternate;
                }
                ConditionalInstruction.prototype.eval = function (scope) {
                    return this.test.eval(scope) ? this.consequent.eval(scope) : this.alternate.eval(scope);
                };
                ConditionalInstruction.prototype.isConstant = function () {
                    return this.test.isConstant();
                };
                return ConditionalInstruction;
            }());
            exports_1("ConditionalInstruction", ConditionalInstruction);
            UnaryPlusInstruction = (function () {
                function UnaryPlusInstruction(argument) {
                    this.argument = argument;
                }
                UnaryPlusInstruction.prototype.eval = function (scope) {
                    return +this.argument.eval(scope);
                };
                UnaryPlusInstruction.prototype.isConstant = function () {
                    return this.argument.isConstant();
                };
                return UnaryPlusInstruction;
            }());
            exports_1("UnaryPlusInstruction", UnaryPlusInstruction);
            UnaryMinusInstruction = (function () {
                function UnaryMinusInstruction(argument) {
                    this.argument = argument;
                }
                UnaryMinusInstruction.prototype.eval = function (scope) {
                    return -this.argument.eval(scope);
                };
                UnaryMinusInstruction.prototype.isConstant = function () {
                    return this.argument.isConstant();
                };
                return UnaryMinusInstruction;
            }());
            exports_1("UnaryMinusInstruction", UnaryMinusInstruction);
            UnaryNotInstruction = (function () {
                function UnaryNotInstruction(argument) {
                    this.argument = argument;
                }
                UnaryNotInstruction.prototype.eval = function (scope) {
                    return !this.argument.eval(scope);
                };
                UnaryNotInstruction.prototype.isConstant = function () {
                    return this.argument.isConstant();
                };
                return UnaryNotInstruction;
            }());
            exports_1("UnaryNotInstruction", UnaryNotInstruction);
            MemberCallInstruction = (function () {
                function MemberCallInstruction(callee, member, args) {
                    this.callee = callee;
                    this.member = member;
                    this.args = args;
                }
                MemberCallInstruction.prototype.eval = function (scope) {
                    var result = this.callee.eval(scope);
                    return safeCall(result, this.member.eval(scope)).apply(result, evaluateAll(scope, this.args));
                };
                MemberCallInstruction.prototype.isConstant = function () {
                    return isConstant(this.args);
                };
                return MemberCallInstruction;
            }());
            exports_1("MemberCallInstruction", MemberCallInstruction);
            MemberCall0Instruction = (function () {
                function MemberCall0Instruction(callee, member) {
                    this.callee = callee;
                    this.member = member;
                }
                MemberCall0Instruction.prototype.eval = function (scope) {
                    var result = this.callee.eval(scope);
                    return safeCall(result, this.member.eval(scope)).call(result);
                };
                MemberCall0Instruction.prototype.isConstant = function () {
                    return true;
                };
                return MemberCall0Instruction;
            }());
            exports_1("MemberCall0Instruction", MemberCall0Instruction);
            MemberCall1Instruction = (function () {
                function MemberCall1Instruction(callee, member, args) {
                    this.callee = callee;
                    this.member = member;
                    this.a1 = args[0];
                }
                MemberCall1Instruction.prototype.eval = function (scope) {
                    var result = this.callee.eval(scope);
                    return safeCall(result, this.member.eval(scope)).call(result, this.a1.eval(scope));
                };
                MemberCall1Instruction.prototype.isConstant = function () {
                    return this.a1.isConstant();
                };
                return MemberCall1Instruction;
            }());
            exports_1("MemberCall1Instruction", MemberCall1Instruction);
            MemberCall2Instruction = (function () {
                function MemberCall2Instruction(callee, member, args) {
                    this.callee = callee;
                    this.member = member;
                    this.a1 = args[0];
                    this.a2 = args[1];
                }
                MemberCall2Instruction.prototype.eval = function (scope) {
                    var result = this.callee.eval(scope);
                    return safeCall(result, this.member.eval(scope)).call(result, this.a1.eval(scope), this.a2.eval(scope));
                };
                MemberCall2Instruction.prototype.isConstant = function () {
                    return isConstant([this.a1, this.a2]);
                };
                return MemberCall2Instruction;
            }());
            exports_1("MemberCall2Instruction", MemberCall2Instruction);
            MemberCall3Instruction = (function () {
                function MemberCall3Instruction(callee, member, args) {
                    this.callee = callee;
                    this.member = member;
                    this.a1 = args[0];
                    this.a2 = args[1];
                    this.a3 = args[2];
                }
                MemberCall3Instruction.prototype.eval = function (scope) {
                    var result = this.callee.eval(scope);
                    return safeCall(result, this.member.eval(scope)).call(result, this.a1.eval(scope), this.a2.eval(scope), this.a3.eval(scope));
                };
                MemberCall3Instruction.prototype.isConstant = function () {
                    return isConstant([this.a1, this.a2, this.a3]);
                };
                return MemberCall3Instruction;
            }());
            exports_1("MemberCall3Instruction", MemberCall3Instruction);
            ScopeCallInstruction = (function () {
                function ScopeCallInstruction(callee, args) {
                    this.callee = callee;
                    this.args = args;
                }
                ScopeCallInstruction.prototype.eval = function (scope) {
                    return this.callee.eval(scope).apply(emptyScope, evaluateAll(scope, this.args));
                };
                ScopeCallInstruction.prototype.isConstant = function () {
                    return isConstant(this.args);
                };
                return ScopeCallInstruction;
            }());
            exports_1("ScopeCallInstruction", ScopeCallInstruction);
            ScopeCall0Instruction = (function () {
                function ScopeCall0Instruction(callee) {
                    this.callee = callee;
                }
                ScopeCall0Instruction.prototype.eval = function (scope) {
                    return this.callee.eval(scope).call(emptyScope);
                };
                ScopeCall0Instruction.prototype.isConstant = function () {
                    return true;
                };
                return ScopeCall0Instruction;
            }());
            exports_1("ScopeCall0Instruction", ScopeCall0Instruction);
            ScopeCall1Instruction = (function () {
                function ScopeCall1Instruction(callee, args) {
                    this.callee = callee;
                    this.a1 = args[0];
                }
                ScopeCall1Instruction.prototype.eval = function (scope) {
                    return this.callee.eval(scope).call(emptyScope, this.a1.eval(scope));
                };
                ScopeCall1Instruction.prototype.isConstant = function () {
                    return this.a1.isConstant();
                };
                return ScopeCall1Instruction;
            }());
            exports_1("ScopeCall1Instruction", ScopeCall1Instruction);
            ScopeCall2Instruction = (function () {
                function ScopeCall2Instruction(callee, args) {
                    this.callee = callee;
                    this.a1 = args[0];
                    this.a2 = args[1];
                }
                ScopeCall2Instruction.prototype.eval = function (scope) {
                    return this.callee.eval(scope).call(emptyScope, this.a1.eval(scope), this.a2.eval(scope));
                };
                ScopeCall2Instruction.prototype.isConstant = function () {
                    return isConstant([this.a1, this.a2]);
                };
                return ScopeCall2Instruction;
            }());
            exports_1("ScopeCall2Instruction", ScopeCall2Instruction);
            ScopeCall3Instruction = (function () {
                function ScopeCall3Instruction(callee, args) {
                    this.callee = callee;
                    this.a1 = args[0];
                    this.a2 = args[1];
                    this.a3 = args[2];
                }
                ScopeCall3Instruction.prototype.eval = function (scope) {
                    return this.callee.eval(scope).call(emptyScope, this.a1.eval(scope), this.a2.eval(scope), this.a3.eval(scope));
                };
                ScopeCall3Instruction.prototype.isConstant = function () {
                    return isConstant([this.a1, this.a2, this.a3]);
                };
                return ScopeCall3Instruction;
            }());
            exports_1("ScopeCall3Instruction", ScopeCall3Instruction);
            ObjectInstruction = (function () {
                function ObjectInstruction(propertyNames, instructions) {
                    this.propertyNames = propertyNames;
                    this.instructions = instructions;
                }
                ObjectInstruction.prototype.eval = function (scope) {
                    var obj = {};
                    for (var i = 0; i < this.propertyNames.length; i++) {
                        obj[this.propertyNames[i]] = this.instructions[i].eval(scope);
                    }
                    return obj;
                };
                ObjectInstruction.prototype.isConstant = function () {
                    return isConstant(this.instructions);
                };
                return ObjectInstruction;
            }());
            exports_1("ObjectInstruction", ObjectInstruction);
            ArrayInstruction = (function () {
                function ArrayInstruction(elements) {
                    this.elements = elements;
                }
                ArrayInstruction.prototype.eval = function (scope) {
                    return evaluateAll(scope, this.elements);
                };
                ArrayInstruction.prototype.isConstant = function () {
                    return true;
                };
                return ArrayInstruction;
            }());
            exports_1("ArrayInstruction", ArrayInstruction);
            LogicalOrInstruction = (function (_super) {
                __extends(LogicalOrInstruction, _super);
                function LogicalOrInstruction() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                LogicalOrInstruction.prototype.eval = function (scope) {
                    return this.left.eval(scope) || this.right.eval(scope);
                };
                return LogicalOrInstruction;
            }(BinaryBase));
            exports_1("LogicalOrInstruction", LogicalOrInstruction);
            LogicalAndInstruction = (function (_super) {
                __extends(LogicalAndInstruction, _super);
                function LogicalAndInstruction() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                LogicalAndInstruction.prototype.eval = function (scope) {
                    return this.left.eval(scope) && this.right.eval(scope);
                };
                return LogicalAndInstruction;
            }(BinaryBase));
            exports_1("LogicalAndInstruction", LogicalAndInstruction);
            BinaryEqualInstruction = (function (_super) {
                __extends(BinaryEqualInstruction, _super);
                function BinaryEqualInstruction() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                BinaryEqualInstruction.prototype.eval = function (scope) {
                    // tslint:disable-next-line
                    return this.left.eval(scope) == this.right.eval(scope);
                };
                return BinaryEqualInstruction;
            }(BinaryBase));
            exports_1("BinaryEqualInstruction", BinaryEqualInstruction);
            BinaryNotEqualInstruction = (function (_super) {
                __extends(BinaryNotEqualInstruction, _super);
                function BinaryNotEqualInstruction() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                BinaryNotEqualInstruction.prototype.eval = function (scope) {
                    // tslint:disable-next-line
                    return this.left.eval(scope) != this.right.eval(scope);
                };
                return BinaryNotEqualInstruction;
            }(BinaryBase));
            exports_1("BinaryNotEqualInstruction", BinaryNotEqualInstruction);
            BinaryAbsNotEqualInstruction = (function (_super) {
                __extends(BinaryAbsNotEqualInstruction, _super);
                function BinaryAbsNotEqualInstruction() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                BinaryAbsNotEqualInstruction.prototype.eval = function (scope) {
                    return this.left.eval(scope) !== this.right.eval(scope);
                };
                return BinaryAbsNotEqualInstruction;
            }(BinaryBase));
            exports_1("BinaryAbsNotEqualInstruction", BinaryAbsNotEqualInstruction);
            BinaryAbsEqualInstruction = (function (_super) {
                __extends(BinaryAbsEqualInstruction, _super);
                function BinaryAbsEqualInstruction() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                BinaryAbsEqualInstruction.prototype.eval = function (scope) {
                    return this.left.eval(scope) === this.right.eval(scope);
                };
                return BinaryAbsEqualInstruction;
            }(BinaryBase));
            exports_1("BinaryAbsEqualInstruction", BinaryAbsEqualInstruction);
            BinaryGreaterThanInstruction = (function (_super) {
                __extends(BinaryGreaterThanInstruction, _super);
                function BinaryGreaterThanInstruction() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                BinaryGreaterThanInstruction.prototype.eval = function (scope) {
                    return this.left.eval(scope) > this.right.eval(scope);
                };
                return BinaryGreaterThanInstruction;
            }(BinaryBase));
            exports_1("BinaryGreaterThanInstruction", BinaryGreaterThanInstruction);
            BinaryLessThanInstruction = (function (_super) {
                __extends(BinaryLessThanInstruction, _super);
                function BinaryLessThanInstruction() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                BinaryLessThanInstruction.prototype.eval = function (scope) {
                    return this.left.eval(scope) < this.right.eval(scope);
                };
                return BinaryLessThanInstruction;
            }(BinaryBase));
            exports_1("BinaryLessThanInstruction", BinaryLessThanInstruction);
            BinaryGreaterEqualThanInstruction = (function (_super) {
                __extends(BinaryGreaterEqualThanInstruction, _super);
                function BinaryGreaterEqualThanInstruction() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                BinaryGreaterEqualThanInstruction.prototype.eval = function (scope) {
                    return this.left.eval(scope) >= this.right.eval(scope);
                };
                return BinaryGreaterEqualThanInstruction;
            }(BinaryBase));
            exports_1("BinaryGreaterEqualThanInstruction", BinaryGreaterEqualThanInstruction);
            BinaryLessEqualThanInstruction = (function (_super) {
                __extends(BinaryLessEqualThanInstruction, _super);
                function BinaryLessEqualThanInstruction() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                BinaryLessEqualThanInstruction.prototype.eval = function (scope) {
                    return this.left.eval(scope) <= this.right.eval(scope);
                };
                return BinaryLessEqualThanInstruction;
            }(BinaryBase));
            exports_1("BinaryLessEqualThanInstruction", BinaryLessEqualThanInstruction);
            BinaryAddInstruction = (function (_super) {
                __extends(BinaryAddInstruction, _super);
                function BinaryAddInstruction() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                BinaryAddInstruction.prototype.eval = function (scope) {
                    return this.left.eval(scope) + this.right.eval(scope);
                };
                return BinaryAddInstruction;
            }(BinaryBase));
            exports_1("BinaryAddInstruction", BinaryAddInstruction);
            BinarySubtractInstruction = (function (_super) {
                __extends(BinarySubtractInstruction, _super);
                function BinarySubtractInstruction() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                BinarySubtractInstruction.prototype.eval = function (scope) {
                    return this.left.eval(scope) - this.right.eval(scope);
                };
                return BinarySubtractInstruction;
            }(BinaryBase));
            exports_1("BinarySubtractInstruction", BinarySubtractInstruction);
            BinaryMultiplyInstruction = (function (_super) {
                __extends(BinaryMultiplyInstruction, _super);
                function BinaryMultiplyInstruction() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                BinaryMultiplyInstruction.prototype.eval = function (scope) {
                    return this.left.eval(scope) * this.right.eval(scope);
                };
                return BinaryMultiplyInstruction;
            }(BinaryBase));
            exports_1("BinaryMultiplyInstruction", BinaryMultiplyInstruction);
            BinaryDivideInstruction = (function (_super) {
                __extends(BinaryDivideInstruction, _super);
                function BinaryDivideInstruction() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                BinaryDivideInstruction.prototype.eval = function (scope) {
                    return this.left.eval(scope) / this.right.eval(scope);
                };
                return BinaryDivideInstruction;
            }(BinaryBase));
            exports_1("BinaryDivideInstruction", BinaryDivideInstruction);
            BinaryModulusInstruction = (function (_super) {
                __extends(BinaryModulusInstruction, _super);
                function BinaryModulusInstruction() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                BinaryModulusInstruction.prototype.eval = function (scope) {
                    return this.left.eval(scope) % this.right.eval(scope);
                };
                return BinaryModulusInstruction;
            }(BinaryBase));
            exports_1("BinaryModulusInstruction", BinaryModulusInstruction);
            ConcatenateInstuction = (function () {
                function ConcatenateInstuction(evals) {
                    this.evals = evals;
                }
                ConcatenateInstuction.prototype.eval = function (scope) {
                    var s = "";
                    for (var _i = 0, _a = this.evals; _i < _a.length; _i++) {
                        var e = _a[_i];
                        s += e[scope].toString();
                    }
                    return s;
                };
                ConcatenateInstuction.prototype.isConstant = function () {
                    return isConstant(this.evals);
                };
                return ConcatenateInstuction;
            }());
            exports_1("ConcatenateInstuction", ConcatenateInstuction);
        }
    };
});
