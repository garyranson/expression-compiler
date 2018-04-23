import {Expression, Visitor} from "expression-parser";
import * as Instructions from "./instructions";
import {Instruction} from "./instructions";

const rootScope = new Map<string, Instruction>([
  [
    "Math", {
    eval: () => Math, toString: () => 'Math', isConstant: () => false, toFunction: () => () => Math
  }
  ],
  ["Round", {
    eval: () => Math.round, toString: () => 'Round', isConstant: () => false, toFunction: () => () => Math.round
  }
  ]
]);

const literalMap = new Map<any, Instruction>([
    [null, {
      eval: () => null, toString: () => 'null', isConstant: () => true, toFunction: () => () => null
    }],
    [undefined, {
      eval: () => undefined,
      toString: () => 'undefined',
      isConstant: () => true,
      toFunction: () => () => undefined
    }],
    [0, {
      eval: () => 0, toString: () => '0', isConstant: () => true, toFunction: () => () => 0
    }],
    [1, {
      eval: () => 1, toString: () => '1', isConstant: () => true, toFunction: () => () => 1
    }],
    [true, {
      eval: () => true, toString: () => 'true', isConstant: () => true, toFunction: () => () => true
    }],
    [false, {
      eval: () => false, toString: () => 'false', isConstant: () => true, toFunction: () => () => false
    }]
  ]
);

const tokenMap = new Map<string, Instruction>();

function getLiteral(value: any): Instruction {
  let instruction = literalMap.get(value);
  if (instruction) return instruction;

  instruction = new Instructions.LiteralInstruction(value);

  switch (typeof value) {
    case 'number':
    case 'string':
      literalMap.set(value, instruction);
  }

  return instruction;

}

export class CompileVisitor implements Visitor<Instruction> {
  visitConcatenate(expr: Expression[]): Instruction {
    let instructions = this.resolveArgs(expr);
    return instructions.length === 1
      ? instructions[0]
      : new Instructions.ConcatenateInstruction(instructions);
  }

  visitBinary(operator: string, left: Expression, right: Expression): Instruction {
    const instruction = new (getBinaryInstruction(operator))(left.visit(this), right.visit(this));
    return instruction.isConstant()
      ? getLiteral(instruction.eval())
      : instruction;
  }

  visitLogicalOr(left: Expression, right: Expression): Instruction {
    const leftIns = left.visit(this);
    return leftIns.isConstant()
      ? leftIns.eval()
        ? leftIns
        : right.visit(this)
      : new Instructions.LogicalOrInstruction(leftIns, right.visit(this));
  }

  visitLogicalAnd(left: Expression, right: Expression): Instruction {
    const ins = new Instructions.LogicalAndInstruction(left.visit(this), right.visit(this));
    return ins.isConstant()
      ? getLiteral(ins.eval(null))
      : ins;
  }

  visitLogical(operator: string, left: Expression, right: Expression): Instruction {
    switch (operator) {
      case "||" :
        return this.visitLogicalOr(left, right);
      case "&&" :
        return this.visitLogicalAnd(left, right);
    }
  }

  visitLiteral(value: any, raw: string): Instruction {
    return getLiteral(value);
  }

  visitToken(value: string): Instruction {
    let i = tokenMap.get(value);
    if (!i) {
      i = new Instructions.TokenInstruction(value);
      tokenMap.set(value, i);
    }
    return i;
  }

  visitScopedAccessor(name: string): Instruction {
    return rootScope.get(name) || new Instructions.ScopedAccessorInstruction(name);
  }

  visitMember(object: Expression, property: Expression, computed: boolean): Instruction {
    const p = property.visit(this);
    return computed
      ? new Instructions.MemberAccessorInstruction(object.visit(this), p)
      : new Instructions.DirectMemberAccessorInstruction(object.visit(this), p.eval());
  }

  visitMemberCall(object: Expression, expression: Expression, args: Expression[]): Instruction {
    return new (getMemberCallInstruction(args.length))(object.visit(this), expression.visit(this), this.resolveArgs(args));
  }

  visitCall(callee: Expression, args: Array<Expression>): Instruction {
    return new (getCallInstruction(args.length))(callee.visit(this), this.resolveArgs(args));
  }

  visitConditional(test: Expression, consequent: Expression, alternate: Expression): Instruction {
    const testIns = test.visit(this);
    console.log(testIns.toString(), testIns.isConstant())
    return testIns.isConstant()
      ? testIns.eval()
        ? consequent.visit(this)
        : alternate.visit(this)
      : new Instructions.ConditionalInstruction(testIns, consequent.visit(this), alternate.visit(this));
  }

  visitUnary(operator: string, argument: Expression): Instruction {
    const ctor = getUnaryInstruction(operator);
    const instruction = new ctor(argument.visit(this));
    return instruction.isConstant() ? new Instructions.LiteralInstruction(instruction.eval()) : instruction;
  }

  visitArray(elements: Array<Expression>): Instruction {
    return new Instructions.ArrayInstruction(this.resolveArgs(elements));
  }

  visitObject(propertyNames: Array<string>, expressions: Array<Expression>): Instruction {
    const inst = new Instructions.ObjectInstruction(propertyNames, this.resolveArgs(expressions))
    return inst.isConstant()
      ? new Instructions.LiteralInstruction(inst.eval(null))
      : inst;
  }

  resolveArgs(args: Expression[]): Instruction[] {
    return args.map((arg) => arg.visit(this));
  }
}

function getUnaryInstruction(operator: string): new (argument: Instruction) => Instruction {
  switch (operator) {
    case "+":
      return Instructions.UnaryPlusInstruction;
    case "-":
      return Instructions.UnaryMinusInstruction;
    case "!":
      return Instructions.UnaryNotInstruction;
  }
}

function getCallInstruction(length: number): new (callee: Instruction, args: Array<Instruction>) => Instruction {
  switch (length) {
    case 0:
      return Instructions.ScopeCall0Instruction;
    case 1:
      return Instructions.ScopeCall1Instruction;
    case 2:
      return Instructions.ScopeCall2Instruction;
    case 3:
      return Instructions.ScopeCall3Instruction;
    default :
      return Instructions.ScopeCallInstruction;
  }
}

function getMemberCallInstruction(length: number): new (callee: Instruction, accessor: Instruction, args: Array<Instruction>) => Instruction {
  switch (length) {
    case 0:
      return Instructions.MemberCall0Instruction;
    case 1:
      return Instructions.MemberCall1Instruction;
    case 2:
      return Instructions.MemberCall2Instruction;
    case 3:
      return Instructions.MemberCall3Instruction;
    default :
      return Instructions.MemberCallInstruction;
  }
}

function getBinaryInstruction(operator: string): new (left: Instruction, right: Instruction) => Instruction {
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
    case "+" :
      return Instructions.BinaryAddInstruction;
    case "-" :
      return Instructions.BinarySubtractInstruction;
    case "*" :
      return Instructions.BinaryMultiplyInstruction;
    case "/" :
      return Instructions.BinaryDivideInstruction;
    case "%" :
      return Instructions.BinaryModulusInstruction;
  }
}
