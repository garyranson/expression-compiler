"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Instructions = require("./instructions");
class CompileVisitor {
    visitConcatenate(expr) {
        let instructions = this.resolveArgs(expr);
        return instructions.length === 1
            ? instructions[0]
            : new Instructions.ConcatenateInstruction(instructions);
    }
    visitBinary(operator, left, right) {
        const instruction = new (getBinaryInstruction(operator))(left.visit(this), right.visit(this));
        return instruction.isConstant()
            ? new Instructions.LiteralInstruction(instruction.eval())
            : instruction;
    }
    visitLogicalOr(left, right) {
        const leftIns = left.visit(this);
        return leftIns.isConstant()
            ? leftIns.eval()
                ? leftIns
                : right.visit(this)
            : new Instructions.LogicalOrInstruction(leftIns, right.visit(this));
    }
    visitLogicalAnd(left, right) {
        const ins = new Instructions.LogicalAndInstruction(left.visit(this), right.visit(this));
        return ins.isConstant()
            ? new Instructions.LiteralInstruction(ins.eval(null))
            : ins;
    }
    visitLogical(operator, left, right) {
        switch (operator) {
            case "||":
                return this.visitLogicalOr(left, right);
            case "&&":
                return this.visitLogicalAnd(left, right);
        }
    }
    visitLiteral(value, raw) {
        return new Instructions.LiteralInstruction(value);
    }
    visitScopedAccessor(name) {
        return new Instructions.ScopedAccessorInstruction(name);
    }
    visitMember(object, property, computed) {
        const p = property.visit(this);
        return p.isConstant()
            ? new Instructions.MemberAccessorInstruction(object.visit(this), property.visit(this))
            : new Instructions.DirectMemberAccessorInstruction(object.visit(this), p.eval());
    }
    visitMemberCall(object, expression, args) {
        return new (getMemberCallInstruction(args.length))(object.visit(this), expression.visit(this), this.resolveArgs(args));
    }
    visitCall(callee, args) {
        return new (getCallInstruction(args.length))(callee.visit(this), this.resolveArgs(args));
    }
    visitConditional(test, consequent, alternate) {
        const testIns = test.visit(this);
        return testIns.isConstant()
            ? testIns.eval()
                ? consequent.visit(this)
                : alternate.visit(this)
            : new Instructions.ConditionalInstruction(testIns, consequent.visit(this), alternate.visit(this));
    }
    visitUnary(operator, argument) {
        const ctor = getUnaryInstruction(operator);
        const instruction = new ctor(argument.visit(this));
        return instruction.isConstant() ? new Instructions.LiteralInstruction(instruction.eval()) : instruction;
    }
    visitArray(elements) {
        return new Instructions.ArrayInstruction(this.resolveArgs(elements));
    }
    visitObject(propertyNames, expressions) {
        const inst = new Instructions.ObjectInstruction(propertyNames, this.resolveArgs(expressions));
        return inst.isConstant()
            ? new Instructions.LiteralInstruction(inst.eval(null))
            : inst;
    }
    resolveArgs(args) {
        return args.map((arg) => arg.visit(this));
    }
}
exports.CompileVisitor = CompileVisitor;
function getUnaryInstruction(operator) {
    switch (operator) {
        case "+":
            return Instructions.UnaryPlusInstruction;
        case "-":
            return Instructions.UnaryMinusInstruction;
        case "!":
            return Instructions.UnaryNotInstruction;
    }
}
function getCallInstruction(length) {
    switch (length) {
        case 0:
            return Instructions.ScopeCall0Instruction;
        case 1:
            return Instructions.ScopeCall1Instruction;
        case 2:
            return Instructions.ScopeCall2Instruction;
        case 3:
            return Instructions.ScopeCall3Instruction;
        default:
            return Instructions.ScopeCallInstruction;
    }
}
function getMemberCallInstruction(length) {
    switch (length) {
        case 0:
            return Instructions.MemberCall0Instruction;
        case 1:
            return Instructions.MemberCall1Instruction;
        case 2:
            return Instructions.MemberCall2Instruction;
        case 3:
            return Instructions.MemberCall3Instruction;
        default:
            return Instructions.MemberCallInstruction;
    }
}
function getBinaryInstruction(operator) {
    switch (operator) {
        case "==":
            return Instructions.BinaryEqualInstruction;
        case "!=":
            return Instructions.BinaryNotEqualInstruction;
        case "===":
            return Instructions.BinaryAbsEqualInstruction;
        case "!==":
            return Instructions.BinaryAbsNotEqualInstruction;
        case "<":
            return Instructions.BinaryLessThanInstruction;
        case ">":
            return Instructions.BinaryGreaterThanInstruction;
        case "<=":
            return Instructions.BinaryLessEqualThanInstruction;
        case ">=":
            return Instructions.BinaryGreaterEqualThanInstruction;
        case "+":
            return Instructions.BinaryAddInstruction;
        case "-":
            return Instructions.BinarySubtractInstruction;
        case "*":
            return Instructions.BinaryMultiplyInstruction;
        case "/":
            return Instructions.BinaryDivideInstruction;
        case "%":
            return Instructions.BinaryModulusInstruction;
    }
}
