"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emptyScope = Object.freeze({});
function evaluateAll(scope, args) {
    const rc = [];
    for (let i = 0; i < args.length; i++) {
        rc[i] = args[i].eval(scope);
    }
    return rc;
}
function isConstant(args) {
    for (let i = 0; i < args.length; i++) {
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
class BinaryBase {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
    isConstant() {
        return this.left.isConstant() && this.right.isConstant();
    }
}
exports.BinaryBase = BinaryBase;
class LiteralInstruction {
    constructor(value) {
        this.value = value;
    }
    eval(scope) {
        return this.value;
    }
    isConstant() {
        return true;
    }
}
exports.LiteralInstruction = LiteralInstruction;
class ScopedAccessorInstruction {
    constructor(name) {
        this.name = name;
    }
    eval(scope) {
        return scope[this.name];
    }
    isConstant() {
        return false;
    }
}
exports.ScopedAccessorInstruction = ScopedAccessorInstruction;
class MemberAccessorInstruction {
    constructor(object, property) {
        this.object = object;
        this.property = property;
    }
    eval(scope) {
        return this.object.eval(scope)[this.property.eval(scope)];
    }
    isConstant() {
        return false;
    }
}
exports.MemberAccessorInstruction = MemberAccessorInstruction;
class DirectMemberAccessorInstruction {
    constructor(object, propertyName) {
        this.object = object;
        this.propertyName = propertyName;
    }
    eval(scope) {
        return this.object.eval(scope)[this.propertyName];
    }
    isConstant() {
        return false;
    }
}
exports.DirectMemberAccessorInstruction = DirectMemberAccessorInstruction;
class ConditionalInstruction {
    constructor(test, consequent, alternate) {
        this.test = test;
        this.consequent = consequent;
        this.alternate = alternate;
    }
    eval(scope) {
        return this.test.eval(scope) ? this.consequent.eval(scope) : this.alternate.eval(scope);
    }
    isConstant() {
        return this.test.isConstant();
    }
}
exports.ConditionalInstruction = ConditionalInstruction;
class UnaryPlusInstruction {
    constructor(argument) {
        this.argument = argument;
    }
    eval(scope) {
        return +this.argument.eval(scope);
    }
    isConstant() {
        return this.argument.isConstant();
    }
}
exports.UnaryPlusInstruction = UnaryPlusInstruction;
class UnaryMinusInstruction {
    constructor(argument) {
        this.argument = argument;
    }
    eval(scope) {
        return -this.argument.eval(scope);
    }
    isConstant() {
        return this.argument.isConstant();
    }
}
exports.UnaryMinusInstruction = UnaryMinusInstruction;
class UnaryNotInstruction {
    constructor(argument) {
        this.argument = argument;
    }
    eval(scope) {
        return !this.argument.eval(scope);
    }
    isConstant() {
        return this.argument.isConstant();
    }
}
exports.UnaryNotInstruction = UnaryNotInstruction;
class MemberCallInstruction {
    constructor(callee, member, args) {
        this.callee = callee;
        this.member = member;
        this.args = args;
    }
    eval(scope) {
        const result = this.callee.eval(scope);
        return safeCall(result, this.member.eval(scope)).apply(result, evaluateAll(scope, this.args));
    }
    isConstant() {
        return isConstant(this.args);
    }
}
exports.MemberCallInstruction = MemberCallInstruction;
class MemberCall0Instruction {
    constructor(callee, member) {
        this.callee = callee;
        this.member = member;
    }
    eval(scope) {
        const result = this.callee.eval(scope);
        return safeCall(result, this.member.eval(scope)).call(result);
    }
    isConstant() {
        return true;
    }
}
exports.MemberCall0Instruction = MemberCall0Instruction;
class MemberCall1Instruction {
    constructor(callee, member, args) {
        this.callee = callee;
        this.member = member;
        this.a1 = args[0];
    }
    eval(scope) {
        const result = this.callee.eval(scope);
        return safeCall(result, this.member.eval(scope)).call(result, this.a1.eval(scope));
    }
    isConstant() {
        return this.a1.isConstant();
    }
}
exports.MemberCall1Instruction = MemberCall1Instruction;
class MemberCall2Instruction {
    constructor(callee, member, args) {
        this.callee = callee;
        this.member = member;
        this.a1 = args[0];
        this.a2 = args[1];
    }
    eval(scope) {
        const result = this.callee.eval(scope);
        return safeCall(result, this.member.eval(scope)).call(result, this.a1.eval(scope), this.a2.eval(scope));
    }
    isConstant() {
        return isConstant([this.a1, this.a2]);
    }
}
exports.MemberCall2Instruction = MemberCall2Instruction;
class MemberCall3Instruction {
    constructor(callee, member, args) {
        this.callee = callee;
        this.member = member;
        this.a1 = args[0];
        this.a2 = args[1];
        this.a3 = args[2];
    }
    eval(scope) {
        const result = this.callee.eval(scope);
        return safeCall(result, this.member.eval(scope)).call(result, this.a1.eval(scope), this.a2.eval(scope), this.a3.eval(scope));
    }
    isConstant() {
        return isConstant([this.a1, this.a2, this.a3]);
    }
}
exports.MemberCall3Instruction = MemberCall3Instruction;
class ScopeCallInstruction {
    constructor(callee, args) {
        this.callee = callee;
        this.args = args;
    }
    eval(scope) {
        return this.callee.eval(scope).apply(emptyScope, evaluateAll(scope, this.args));
    }
    isConstant() {
        return isConstant(this.args);
    }
}
exports.ScopeCallInstruction = ScopeCallInstruction;
class ScopeCall0Instruction {
    constructor(callee) {
        this.callee = callee;
    }
    eval(scope) {
        return this.callee.eval(scope).call(emptyScope);
    }
    isConstant() {
        return true;
    }
}
exports.ScopeCall0Instruction = ScopeCall0Instruction;
class ScopeCall1Instruction {
    constructor(callee, args) {
        this.callee = callee;
        this.a1 = args[0];
    }
    eval(scope) {
        return this.callee.eval(scope).call(emptyScope, this.a1.eval(scope));
    }
    isConstant() {
        return this.a1.isConstant();
    }
}
exports.ScopeCall1Instruction = ScopeCall1Instruction;
class ScopeCall2Instruction {
    constructor(callee, args) {
        this.callee = callee;
        this.a1 = args[0];
        this.a2 = args[1];
    }
    eval(scope) {
        return this.callee.eval(scope).call(emptyScope, this.a1.eval(scope), this.a2.eval(scope));
    }
    isConstant() {
        return isConstant([this.a1, this.a2]);
    }
}
exports.ScopeCall2Instruction = ScopeCall2Instruction;
class ScopeCall3Instruction {
    constructor(callee, args) {
        this.callee = callee;
        this.a1 = args[0];
        this.a2 = args[1];
        this.a3 = args[2];
    }
    eval(scope) {
        return this.callee.eval(scope).call(emptyScope, this.a1.eval(scope), this.a2.eval(scope), this.a3.eval(scope));
    }
    isConstant() {
        return isConstant([this.a1, this.a2, this.a3]);
    }
}
exports.ScopeCall3Instruction = ScopeCall3Instruction;
class ObjectInstruction {
    constructor(propertyNames, instructions) {
        this.propertyNames = propertyNames;
        this.instructions = instructions;
    }
    eval(scope) {
        let obj = {};
        for (let i = 0; i < this.propertyNames.length; i++) {
            obj[this.propertyNames[i]] = this.instructions[i].eval(scope);
        }
        return obj;
    }
    isConstant() {
        return isConstant(this.instructions);
    }
}
exports.ObjectInstruction = ObjectInstruction;
class ArrayInstruction {
    constructor(elements) {
        this.elements = elements;
    }
    eval(scope) {
        return evaluateAll(scope, this.elements);
    }
    isConstant() {
        return true;
    }
}
exports.ArrayInstruction = ArrayInstruction;
class LogicalOrInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) || this.right.eval(scope);
    }
}
exports.LogicalOrInstruction = LogicalOrInstruction;
class LogicalAndInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) && this.right.eval(scope);
    }
}
exports.LogicalAndInstruction = LogicalAndInstruction;
class BinaryEqualInstruction extends BinaryBase {
    eval(scope) {
        // tslint:disable-next-line
        return this.left.eval(scope) == this.right.eval(scope);
    }
}
exports.BinaryEqualInstruction = BinaryEqualInstruction;
class BinaryNotEqualInstruction extends BinaryBase {
    eval(scope) {
        // tslint:disable-next-line
        return this.left.eval(scope) != this.right.eval(scope);
    }
}
exports.BinaryNotEqualInstruction = BinaryNotEqualInstruction;
class BinaryAbsNotEqualInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) !== this.right.eval(scope);
    }
}
exports.BinaryAbsNotEqualInstruction = BinaryAbsNotEqualInstruction;
class BinaryAbsEqualInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) === this.right.eval(scope);
    }
}
exports.BinaryAbsEqualInstruction = BinaryAbsEqualInstruction;
class BinaryGreaterThanInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) > this.right.eval(scope);
    }
}
exports.BinaryGreaterThanInstruction = BinaryGreaterThanInstruction;
class BinaryLessThanInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) < this.right.eval(scope);
    }
}
exports.BinaryLessThanInstruction = BinaryLessThanInstruction;
class BinaryGreaterEqualThanInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) >= this.right.eval(scope);
    }
}
exports.BinaryGreaterEqualThanInstruction = BinaryGreaterEqualThanInstruction;
class BinaryLessEqualThanInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) <= this.right.eval(scope);
    }
}
exports.BinaryLessEqualThanInstruction = BinaryLessEqualThanInstruction;
class BinaryAddInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) + this.right.eval(scope);
    }
}
exports.BinaryAddInstruction = BinaryAddInstruction;
class BinarySubtractInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) - this.right.eval(scope);
    }
}
exports.BinarySubtractInstruction = BinarySubtractInstruction;
class BinaryMultiplyInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) * this.right.eval(scope);
    }
}
exports.BinaryMultiplyInstruction = BinaryMultiplyInstruction;
class BinaryDivideInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) / this.right.eval(scope);
    }
}
exports.BinaryDivideInstruction = BinaryDivideInstruction;
class BinaryModulusInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) % this.right.eval(scope);
    }
}
exports.BinaryModulusInstruction = BinaryModulusInstruction;
class ConcatenateInstruction {
    constructor(instructions) {
        this.instructions = instructions;
    }
    eval(scope) {
        let s = "";
        for (let e of this.instructions) {
            s += e[scope].toString();
        }
        return s;
    }
    isConstant() {
        return isConstant(this.instructions);
    }
}
exports.ConcatenateInstruction = ConcatenateInstruction;
