import { Expression, Visitor } from "expression-parser";
import { Instruction } from "./instructions";
export declare class CompileVisitor implements Visitor<Instruction> {
    visitConcatenate(expr: Expression[]): Instruction;
    visitBinary(operator: string, left: Expression, right: Expression): Instruction;
    visitLogicalOr(left: Expression, right: Expression): Instruction;
    visitLogicalAnd(left: Expression, right: Expression): Instruction;
    visitLogical(operator: string, left: Expression, right: Expression): Instruction;
    visitLiteral(value: any, raw: string): Instruction;
    visitToken(value: string): Instruction;
    visitScopedAccessor(name: string): Instruction;
    visitMember(object: Expression, property: Expression, computed: boolean): Instruction;
    visitMemberCall(object: Expression, expression: Expression, args: Expression[]): Instruction;
    visitCall(callee: Expression, args: Array<Expression>): Instruction;
    visitConditional(test: Expression, consequent: Expression, alternate: Expression): Instruction;
    visitUnary(operator: string, argument: Expression): Instruction;
    visitArray(elements: Array<Expression>): Instruction;
    visitObject(propertyNames: Array<string>, expressions: Array<Expression>): Instruction;
    resolveArgs(args: Expression[]): Instruction[];
}
