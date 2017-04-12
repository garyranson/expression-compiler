const emptyScope = Object.freeze({ });

export interface Instruction {
  eval(scope?: any): any;
  isConstant(): boolean;
}

function evaluateAll(scope: any, args: Instruction[]): any[] {
  const rc = [];
  for (let i = 0; i < args.length; i++) {
    rc[i] = args[i].eval(scope);
  }
  return rc;
}
function isConstant(args: Instruction[]): boolean {
  for (let i = 0; i < args.length; i++) {
    if (!args[i].isConstant()) {
      return false;
    }
  }
  return true;
}

function failSafe(): never {
  throw "cannot call";
}

function safeCall(fn: any, method: any): any {
  return (fn && fn[method]) || failSafe;
}

export abstract class BinaryBase implements Instruction {
  constructor(protected left: Instruction, protected right: Instruction) {
  }

  abstract eval(scope: any): any;

  isConstant(): boolean {
    return this.left.isConstant() && this.right.isConstant();
  }
}
export class LiteralInstruction implements Instruction {
  constructor(private value: any) {
  }

  eval(scope: any): any {
    return this.value;
  }

  isConstant(): boolean {
    return true;
  }
}
export class ScopedAccessorInstruction implements Instruction {
  constructor(private name: string) {
  }

  eval(scope: any): any {
    return scope[this.name];
  }

  isConstant(): boolean {
    return false;
  }
}
export class MemberAccessorInstruction implements Instruction {
  constructor(private object: Instruction, private property: Instruction) {
  }

  eval(scope: any): any {
    return this.object.eval(scope)[this.property.eval(scope)];
  }

  isConstant(): boolean {
    return false;
  }
}
export class DirectMemberAccessorInstruction implements Instruction {
  constructor(private object: Instruction, private propertyName: any) {
  }

  eval(scope: any): any {
    return this.object.eval(scope)[this.propertyName];
  }

  isConstant(): boolean {
    return false;
  }
}
export class ConditionalInstruction implements Instruction {
  constructor(private test: Instruction, private consequent: Instruction, private alternate: Instruction) {
  }

  eval(scope: any): any {
    return this.test.eval(scope) ? this.consequent.eval(scope) : this.alternate.eval(scope);
  }

  isConstant(): boolean {
    return this.test.isConstant();
  }
}
export class UnaryPlusInstruction implements Instruction {
  constructor(private argument: Instruction) {
  }

  eval(scope: any): any {
    return +this.argument.eval(scope);
  }

  isConstant(): boolean {
    return this.argument.isConstant();
  }
}
export class UnaryMinusInstruction implements Instruction {
  constructor(private argument: Instruction) {
  }

  eval(scope: any): any {
    return -this.argument.eval(scope);
  }

  isConstant(): boolean {
    return this.argument.isConstant();
  }
}
export class UnaryNotInstruction implements Instruction {
  constructor(private argument: Instruction) {
  }

  eval(scope: any): any {
    return !this.argument.eval(scope);
  }

  isConstant(): boolean {
    return this.argument.isConstant();
  }
}
export class MemberCallInstruction implements Instruction {
  constructor(private callee: Instruction, private member: Instruction, private args: Instruction[]) {
  }

  eval(scope: any): any {
    const result = this.callee.eval(scope);
    return safeCall(result, this.member.eval(scope)).apply(result, evaluateAll(scope, this.args));
  }

  isConstant(): boolean {
    return isConstant(this.args);
  }
}
export class MemberCall0Instruction implements Instruction {
  constructor(private callee: Instruction, private member: Instruction) {
  }

  eval(scope: any): any {
    const result = this.callee.eval(scope);
    return safeCall(result, this.member.eval(scope)).call(result);
  }

  isConstant(): boolean {
    return true;
  }
}
export class MemberCall1Instruction implements Instruction {
  a1: Instruction;

  constructor(private callee: Instruction, private member: Instruction, args: Instruction[]) {
    this.a1 = args[0];
  }

  eval(scope: any): any {
    const result = this.callee.eval(scope);
    return safeCall(result, this.member.eval(scope)).call(result, this.a1.eval(scope));
  }

  isConstant(): boolean {
    return this.a1.isConstant();
  }
}
export class MemberCall2Instruction implements Instruction {
  a1: Instruction;
  a2: Instruction;

  constructor(private callee: Instruction, private member: Instruction, args: Instruction[]) {
    this.a1 = args[0];
    this.a2 = args[1];
  }

  eval(scope: any): any {
    const result = this.callee.eval(scope);
    return safeCall(result, this.member.eval(scope)).call(result, this.a1.eval(scope), this.a2.eval(scope));
  }

  isConstant(): boolean {
    return isConstant([this.a1, this.a2]);
  }
}
export class MemberCall3Instruction implements Instruction {
  a1: Instruction;
  a2: Instruction;
  a3: Instruction;

  constructor(private callee: Instruction, private member: Instruction, args: Instruction[]) {
    this.a1 = args[0];
    this.a2 = args[1];
    this.a3 = args[2];
  }

  eval(scope: any): any {
    const result = this.callee.eval(scope);
    return safeCall(result, this.member.eval(scope)).call(result, this.a1.eval(scope), this.a2.eval(scope), this.a3.eval(scope));
  }

  isConstant(): boolean {
    return isConstant([this.a1, this.a2, this.a3]);
  }
}
export class ScopeCallInstruction implements Instruction {
  constructor(private callee: Instruction, private args: Array<Instruction>) {
  }

  eval(scope: any): any {
    return this.callee.eval(scope).apply(emptyScope, evaluateAll(scope, this.args));
  }

  isConstant(): boolean {
    return isConstant(this.args);
  }
}
export class ScopeCall0Instruction implements Instruction {
  constructor(private callee: Instruction) {
  }

  eval(scope: any): any {
    return this.callee.eval(scope).call(emptyScope);
  }

  isConstant(): boolean {
    return true;
  }
}
export class ScopeCall1Instruction implements Instruction {
  a1: Instruction;

  constructor(private callee: Instruction, args: Array<Instruction>) {
    this.a1 = args[0];
  }

  eval(scope: any): any {
    return this.callee.eval(scope).call(emptyScope, this.a1.eval(scope));
  }

  isConstant(): boolean {
    return this.a1.isConstant();
  }
}
export class ScopeCall2Instruction implements Instruction {
  a1: Instruction;
  a2: Instruction;

  constructor(private callee: Instruction, args: Array<Instruction>) {
    this.a1 = args[0];
    this.a2 = args[1];
  }

  eval(scope: any): any {
    return this.callee.eval(scope).call(emptyScope, this.a1.eval(scope), this.a2.eval(scope));
  }

  isConstant(): boolean {
    return isConstant([this.a1, this.a2]);
  }
}
export class ScopeCall3Instruction implements Instruction {
  a1: Instruction;
  a2: Instruction;
  a3: Instruction;

  constructor(private callee: Instruction, args: Array<Instruction>) {
    this.a1 = args[0];
    this.a2 = args[1];
    this.a3 = args[2];
  }

  eval(scope: any): any {
    return this.callee.eval(scope).call(emptyScope, this.a1.eval(scope), this.a2.eval(scope), this.a3.eval(scope));
  }

  isConstant(): boolean {
    return isConstant([this.a1, this.a2, this.a3]);
  }
}

interface StringMap<T> {
  [index: string]: T;
}
export class ObjectInstruction implements Instruction {
  constructor(private propertyNames: Array<string>, private instructions: Array<Instruction>) {
  }
  eval(scope: any): any {
    let obj = <StringMap<any>>{};

    for (let i = 0; i < this.propertyNames.length; i++) {
      obj[this.propertyNames[i]] = this.instructions[i].eval(scope);
    }
    return obj;
  }

  isConstant(): boolean {
    return isConstant(this.instructions);
  }
}
export class ArrayInstruction implements Instruction {
  constructor(private elements: Array<Instruction>) {
  }

  eval(scope: any): any {
    return evaluateAll(scope, this.elements);
  }

  isConstant(): boolean {
    return true;
  }
}
export class LogicalOrInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) || this.right.eval(scope);
  }
}
export class LogicalAndInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) && this.right.eval(scope);
  }
}
export class BinaryEqualInstruction extends BinaryBase {
  eval(scope: any): any {
    // tslint:disable-next-line
    return this.left.eval(scope) == this.right.eval(scope);
  }
}
export class BinaryNotEqualInstruction extends BinaryBase {
  eval(scope: any): any {
    // tslint:disable-next-line
    return this.left.eval(scope) != this.right.eval(scope);
  }
}
export class BinaryAbsNotEqualInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) !== this.right.eval(scope);
  }
}
export class BinaryAbsEqualInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) === this.right.eval(scope);
  }
}
export class BinaryGreaterThanInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) > this.right.eval(scope);
  }
}
export class BinaryLessThanInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) < this.right.eval(scope);
  }
}
export class BinaryGreaterEqualThanInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) >= this.right.eval(scope);
  }
}
export class BinaryLessEqualThanInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) <= this.right.eval(scope);
  }
}
export class BinaryAddInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) + this.right.eval(scope);
  }
}
export class BinarySubtractInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) - this.right.eval(scope);
  }
}
export class BinaryMultiplyInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) * this.right.eval(scope);
  }
}
export class BinaryDivideInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) / this.right.eval(scope);
  }
}
export class BinaryModulusInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) % this.right.eval(scope);
  }
}