"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emptyScope = Object.freeze({});
function evaluateAll(scope, args) {
    return args.map(i => i.eval(scope));
}
function toStringAll(args) {
    return args.map(i => i.toString()).join(',');
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
    toString() {
        return `${this.left.toString()}${this.getType()}${this.right.toString()}`;
    }
}
exports.BinaryBase = BinaryBase;
class TokenInstruction {
    constructor(value) {
        this.value = value;
    }
    eval(scope) {
        return this.value;
    }
    isConstant() {
        return true;
    }
    toString() {
        return this.value;
    }
    toFunction() {
        return TokenFactory(this.value);
    }
}
exports.TokenInstruction = TokenInstruction;
function TokenFactory(value) {
    return () => {
        return value;
    };
}
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
    toString() {
        switch (typeof this.value) {
            case 'string':
                return `'${this.value}'`;
            case 'number':
                return this.value.toString();
            case 'boolean':
                return this.value ? 'true' : 'false';
            case 'object':
                return JSON.stringify(this.value);
            default:
                return this.value.toString();
        }
    }
    toFunction() {
        return LiteralFactory(this.value);
    }
}
exports.LiteralInstruction = LiteralInstruction;
function LiteralFactory(value) {
    return () => {
        return value;
    };
}
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
    toString() {
        return this.name;
    }
    toFunction() {
        return ScopedAccessorFactory(this.name);
    }
}
exports.ScopedAccessorInstruction = ScopedAccessorInstruction;
function ScopedAccessorFactory(name) {
    return (scope) => {
        return scope[name];
    };
}
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
    toString() {
        return `${this.object.toString()}[${this.property.toString()}]`;
    }
    toFunction() {
        return MemberAccessorFactory(this.object.toFunction(), this.property.toFunction());
    }
}
exports.MemberAccessorInstruction = MemberAccessorInstruction;
function MemberAccessorFactory(obj, property) {
    return (scope) => {
        return obj(scope)[property(scope)];
    };
}
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
    toString() {
        return `${this.object.toString()}.${this.propertyName.toString()}`;
    }
    toFunction() {
        return DirectMemberAccessorFactory(this.object.toFunction(), this.propertyName);
    }
}
exports.DirectMemberAccessorInstruction = DirectMemberAccessorInstruction;
function DirectMemberAccessorFactory(obj, propertyName) {
    return (scope) => {
        return obj(scope)[propertyName];
    };
}
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
    toString() {
        return `${this.test.toString()}?${this.consequent.toString()}:${this.alternate.toString()}`;
    }
    toFunction() {
        return ConditionalFactory(this.test.toFunction(), this.consequent.toFunction(), this.alternate.toFunction());
    }
}
exports.ConditionalInstruction = ConditionalInstruction;
function ConditionalFactory(test, consequenct, alternate) {
    return (scope) => {
        return test(scope) ? consequenct(scope) : alternate(scope);
    };
}
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
    toString() {
        return this.argument.toString();
    }
    toFunction() {
        return UnaryPlusFactory(this.argument.toFunction());
    }
}
exports.UnaryPlusInstruction = UnaryPlusInstruction;
function UnaryPlusFactory(argument) {
    return (scope) => {
        return +argument(scope);
    };
}
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
    toString() {
        return `-${this.argument.toString()}`;
    }
    toFunction() {
        return UnaryMinusFactory(this.argument.toFunction());
    }
}
exports.UnaryMinusInstruction = UnaryMinusInstruction;
function UnaryMinusFactory(argument) {
    return (scope) => {
        return -argument(scope);
    };
}
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
    toString() {
        return `!${this.argument.toString()}`;
    }
    toFunction() {
        return UnaryNotFactory(this.argument.toFunction());
    }
}
exports.UnaryNotInstruction = UnaryNotInstruction;
function UnaryNotFactory(argument) {
    return (scope) => {
        return !argument(scope);
    };
}
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
    toString() {
        return calcToString(this.callee, this.member, this.args);
    }
    toFunction() {
        return MemberCallFactory(this.callee.toFunction(), this.member.toFunction(), this.args.map(a => a.toFunction()));
    }
}
exports.MemberCallInstruction = MemberCallInstruction;
function calcToString(callee, member, args) {
    return member
        ? `${callee.toString()}.${member.toString()}(${args.map(e => e.toString()).join(',')})`
        : `${callee.toString()}(${args.map(e => e.toString()).join(',')})`;
}
function MemberCallFactory(callee, member, args) {
    return (scope) => {
        const result = callee(scope);
        return safeCall(result, member(scope)).apply(result, args.map(a => a(scope)));
    };
}
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
        return false;
    }
    toString() {
        return calcToString(this.callee, this.member, []);
    }
    toFunction() {
        return MemberCall0Factory(this.callee.toFunction(), this.member.toFunction());
    }
}
exports.MemberCall0Instruction = MemberCall0Instruction;
function MemberCall0Factory(callee, member) {
    return (scope) => {
        const result = callee(scope);
        return safeCall(result, member(scope)).call(result);
    };
}
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
    toString() {
        return calcToString(this.callee, this.member, [this.a1]);
    }
    toFunction() {
        return MemberCall1Factory(this.callee.toFunction(), this.member.toFunction(), this.a1.toFunction());
    }
}
exports.MemberCall1Instruction = MemberCall1Instruction;
function MemberCall1Factory(callee, member, a1) {
    return (scope) => {
        const result = callee(scope);
        return safeCall(result, member(scope)).call(result, a1(scope));
    };
}
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
        return false; //isConstant([this.a1, this.a2]);
    }
    toString() {
        return calcToString(this.callee, this.member, [this.a1, this.a2]);
    }
    toFunction() {
        return MemberCall2Factory(this.callee.toFunction(), this.member.toFunction(), this.a1.toFunction(), this.a2.toFunction());
    }
}
exports.MemberCall2Instruction = MemberCall2Instruction;
function MemberCall2Factory(callee, member, a1, a2) {
    return (scope) => {
        const result = callee(scope);
        return safeCall(result, member(scope)).call(result, a1(scope), a2(scope));
    };
}
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
        return false; //isConstant([this.a1, this.a2, this.a3]);
    }
    toString() {
        return calcToString(this.callee, this.member, [this.a1, this.a2, this.a3]);
    }
    toFunction() {
        return MemberCall3Factory(this.callee.toFunction(), this.member.toFunction(), this.a1.toFunction(), this.a2.toFunction(), this.a3.toFunction());
    }
}
exports.MemberCall3Instruction = MemberCall3Instruction;
function MemberCall3Factory(callee, member, a1, a2, a3) {
    return (scope) => {
        const result = callee(scope);
        return safeCall(result, member(scope)).call(result, a1(scope), a2(scope), a3(scope));
    };
}
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
    toString() {
        return calcToString(this.callee, null, this.args);
    }
    toFunction() {
        return ScopeCallFactory(this.callee.toFunction(), this.args.map(a => a.toFunction()));
    }
}
exports.ScopeCallInstruction = ScopeCallInstruction;
function ScopeCallFactory(callee, args) {
    return (scope) => {
        return callee(scope).apply(emptyScope, args.map(a => a(scope)));
    };
}
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
    toString() {
        return `${this.callee.toString()}()`;
    }
    toFunction() {
        return ScopeCall0Factory(this.callee.toFunction());
    }
}
exports.ScopeCall0Instruction = ScopeCall0Instruction;
function ScopeCall0Factory(callee) {
    return (scope) => {
        return callee(scope).call(emptyScope);
    };
}
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
    toString() {
        return calcToString(this.callee, null, [this.a1]);
    }
    toFunction() {
        return ScopeCall1Factory(this.callee.toFunction(), this.a1.toFunction());
    }
}
exports.ScopeCall1Instruction = ScopeCall1Instruction;
function ScopeCall1Factory(callee, a1) {
    return (scope) => {
        return callee(scope).call(emptyScope, a1(scope));
    };
}
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
    toString() {
        return calcToString(this.callee, null, [this.a1, this.a2]);
    }
    toFunction() {
        return ScopeCall2Factory(this.callee.toFunction(), this.a1.toFunction(), this.a2.toFunction());
    }
}
exports.ScopeCall2Instruction = ScopeCall2Instruction;
function ScopeCall2Factory(callee, a1, a2) {
    return (scope) => {
        return callee(scope).call(emptyScope, a1(scope), a2(scope));
    };
}
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
    toString() {
        return calcToString(this.callee, null, [this.a1, this.a2, this.a3]);
    }
    toFunction() {
        return ScopeCall3Factory(this.callee.toFunction(), this.a1.toFunction(), this.a2.toFunction(), this.a3.toFunction());
    }
}
exports.ScopeCall3Instruction = ScopeCall3Instruction;
function ScopeCall3Factory(callee, a1, a2, a3) {
    return (scope) => {
        return callee(scope).call(emptyScope, a1(scope), a2(scope), a3(scope));
    };
}
class ObjectInstruction {
    constructor(propertyNames, instructions) {
        this.objv = propertyNames.map((name, i) => ({ name, expr: instructions[i] }));
    }
    eval(scope) {
        const acc = {};
        for (const i of this.objv) {
            acc[i.name] = i.expr.eval(scope);
        }
        console.log(acc);
        return acc;
    }
    isConstant() {
        for (const v of this.objv) {
            if (!v.expr.isConstant()) {
                return false;
            }
        }
        return true;
    }
    toString() {
        return `{${this.objv.map(i => i.name + ':' + i.expr.toString()).join(',')}}`;
    }
    toFunction() {
        return ObjectFactory(this.objv.map(v => ({ name: v.name, fn: v.expr.toFunction() })));
    }
}
exports.ObjectInstruction = ObjectInstruction;
function ObjectFactory(objv) {
    return (scope) => {
        return objv.reduce((a, v) => {
            a[v.name] = v.fn(scope);
            return a;
        }, {});
    };
}
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
    toString() {
        return `[${toStringAll(this.elements)}]`;
    }
    toFunction() {
        return ArrayFactory(this.elements.map(e => e.toFunction()));
    }
}
exports.ArrayInstruction = ArrayInstruction;
function ArrayFactory(elements) {
    return (scope) => {
        return elements.map(e => e(scope));
    };
}
class LogicalOrInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) || this.right.eval(scope);
    }
    getType() {
        return '||';
    }
    toFunction() {
        return LogicalOrFactory(this.left.toFunction(), this.right.toFunction());
    }
}
exports.LogicalOrInstruction = LogicalOrInstruction;
function LogicalOrFactory(left, right) {
    return (scope) => {
        return left(scope) || right(scope);
    };
}
class LogicalAndInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) && this.right.eval(scope);
    }
    getType() {
        return '&&';
    }
    toFunction() {
        return LogicalAndFactory(this.left.toFunction(), this.right.toFunction());
    }
}
exports.LogicalAndInstruction = LogicalAndInstruction;
function LogicalAndFactory(left, right) {
    return (scope) => {
        return left(scope) || right(scope);
    };
}
class BinaryEqualInstruction extends BinaryBase {
    eval(scope) {
        // tslint:disable-next-line
        return this.left.eval(scope) == this.right.eval(scope);
    }
    getType() {
        return '==';
    }
    toFunction() {
        return BinaryEqualFactory(this.left.toFunction(), this.right.toFunction());
    }
}
exports.BinaryEqualInstruction = BinaryEqualInstruction;
function BinaryEqualFactory(left, right) {
    return (scope) => {
        return left(scope) == right(scope);
    };
}
class BinaryNotEqualInstruction extends BinaryBase {
    eval(scope) {
        // tslint:disable-next-line
        return this.left.eval(scope) != this.right.eval(scope);
    }
    getType() {
        return '!=';
    }
    toFunction() {
        return BinaryNotEqualFactory(this.left.toFunction(), this.right.toFunction());
    }
}
exports.BinaryNotEqualInstruction = BinaryNotEqualInstruction;
function BinaryNotEqualFactory(left, right) {
    return (scope) => {
        return left(scope) != right(scope);
    };
}
class BinaryAbsNotEqualInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) !== this.right.eval(scope);
    }
    getType() {
        return '!==';
    }
    toFunction() {
        return BinaryAbsNotEqualFactory(this.left.toFunction(), this.right.toFunction());
    }
}
exports.BinaryAbsNotEqualInstruction = BinaryAbsNotEqualInstruction;
function BinaryAbsNotEqualFactory(left, right) {
    return (scope) => {
        return left(scope) !== right(scope);
    };
}
class BinaryAbsEqualInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) === this.right.eval(scope);
    }
    getType() {
        return '===';
    }
    toFunction() {
        return BinaryAbsEqualFactory(this.left.toFunction(), this.right.toFunction());
    }
}
exports.BinaryAbsEqualInstruction = BinaryAbsEqualInstruction;
function BinaryAbsEqualFactory(left, right) {
    return (scope) => {
        return left(scope) === right(scope);
    };
}
class BinaryGreaterThanInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) > this.right.eval(scope);
    }
    getType() {
        return '>';
    }
    toFunction() {
        return BinaryGreaterThanFactory(this.left.toFunction(), this.right.toFunction());
    }
}
exports.BinaryGreaterThanInstruction = BinaryGreaterThanInstruction;
function BinaryGreaterThanFactory(left, right) {
    return (scope) => {
        return left(scope) > right(scope);
    };
}
class BinaryLessThanInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) < this.right.eval(scope);
    }
    getType() {
        return '<';
    }
    toFunction() {
        return BinaryLessThanFactory(this.left.toFunction(), this.right.toFunction());
    }
}
exports.BinaryLessThanInstruction = BinaryLessThanInstruction;
function BinaryLessThanFactory(left, right) {
    return (scope) => {
        return left(scope) < right(scope);
    };
}
class BinaryGreaterEqualThanInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) >= this.right.eval(scope);
    }
    getType() {
        return '>=';
    }
    toFunction() {
        return BinaryGreaterEqualThanFactory(this.left.toFunction(), this.right.toFunction());
    }
}
exports.BinaryGreaterEqualThanInstruction = BinaryGreaterEqualThanInstruction;
function BinaryGreaterEqualThanFactory(left, right) {
    return (scope) => {
        return left(scope) >= right(scope);
    };
}
class BinaryLessEqualThanInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) <= this.right.eval(scope);
    }
    getType() {
        return '<=';
    }
    toFunction() {
        return BinaryLessEqualThanFactory(this.left.toFunction(), this.right.toFunction());
    }
}
exports.BinaryLessEqualThanInstruction = BinaryLessEqualThanInstruction;
function BinaryLessEqualThanFactory(left, right) {
    return (scope) => {
        return left(scope) <= right(scope);
    };
}
class BinaryAddInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) + this.right.eval(scope);
    }
    getType() {
        return '+';
    }
    toFunction() {
        return BinaryAddFactory(this.left.toFunction(), this.right.toFunction());
    }
}
exports.BinaryAddInstruction = BinaryAddInstruction;
function BinaryAddFactory(left, right) {
    return (scope) => {
        return left(scope) + right(scope);
    };
}
class BinarySubtractInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) - this.right.eval(scope);
    }
    getType() {
        return '-';
    }
    toFunction() {
        return BinarySubtractFactory(this.left.toFunction(), this.right.toFunction());
    }
}
exports.BinarySubtractInstruction = BinarySubtractInstruction;
function BinarySubtractFactory(left, right) {
    return (scope) => {
        return left(scope) - right(scope);
    };
}
class BinaryMultiplyInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) * this.right.eval(scope);
    }
    getType() {
        return '*';
    }
    toFunction() {
        return BinaryMultiplyFactory(this.left.toFunction(), this.right.toFunction());
    }
}
exports.BinaryMultiplyInstruction = BinaryMultiplyInstruction;
function BinaryMultiplyFactory(left, right) {
    return (scope) => {
        return left(scope) * right(scope);
    };
}
class BinaryDivideInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) / this.right.eval(scope);
    }
    getType() {
        return '/';
    }
    toFunction() {
        return BinaryDivideFactory(this.left.toFunction(), this.right.toFunction());
    }
}
exports.BinaryDivideInstruction = BinaryDivideInstruction;
function BinaryDivideFactory(left, right) {
    return (scope) => {
        return left(scope) / right(scope);
    };
}
class BinaryModulusInstruction extends BinaryBase {
    eval(scope) {
        return this.left.eval(scope) % this.right.eval(scope);
    }
    getType() {
        return '%';
    }
    toFunction() {
        return BinaryModulusFactory(this.left.toFunction(), this.right.toFunction());
    }
}
exports.BinaryModulusInstruction = BinaryModulusInstruction;
function BinaryModulusFactory(left, right) {
    return (scope) => {
        return left(scope) % right(scope);
    };
}
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
    toString() {
        return this.instructions.map(i => i.toString()).join('+');
    }
    toFunction() {
        return BinaryConcatenateFactory(this.instructions.map(i => i.toFunction()));
    }
}
exports.ConcatenateInstruction = ConcatenateInstruction;
function BinaryConcatenateFactory(args) {
    return (scope) => {
        return args.reduce((a, b) => a + b(scope), '');
    };
}
