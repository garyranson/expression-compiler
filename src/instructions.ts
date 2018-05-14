const emptyScope = Object.freeze({});

export type CompiledFunction = (scope: any) => any;

export interface Instruction {
  eval(scope?: any): any;

  isConstant(): boolean;

  toString(): string;

  toFunction(): CompiledFunction;
}

function evaluateAll(scope: any, args: Instruction[]): any[] {
  return args.map(i => i.eval(scope));
}

function toStringAll(args: Instruction[]): string {
  return args.map(i => i.toString()).join(',');
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

  abstract getType(): string;

  toString(): string {
    return `${this.left.toString()}${this.getType()}${this.right.toString()}`;
  }

  abstract toFunction(): CompiledFunction;

}

export class TokenInstruction implements  Instruction {
  constructor(private value: any) {
  }

  eval(scope: any): any {
    return this.value;
  }

  isConstant(): boolean {
    return true;
  }

  toString(): string {
    return this.value;
  }

  toFunction(): CompiledFunction {
    return TokenFactory(this.value);
  }
}

function TokenFactory(value: any) {
  return () => {
    return value;
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

  toString(): string {
    switch (typeof this.value) {
      case 'string':
        return `'${this.value}'`;
      case 'number' :
        return this.value.toString();
      case 'boolean' :
        return this.value ? 'true' : 'false';
      case 'object' :
        return JSON.stringify(this.value);
      default:
        return this.value.toString();
    }
  }

  toFunction(): CompiledFunction {
    return LiteralFactory(this.value);
  }
}

function LiteralFactory(value: any) {
  return () => {
    return value;
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

  toString(): string {
    return this.name;
  }

  toFunction(): CompiledFunction {
    return ScopedAccessorFactory(this.name);
  }
}

function ScopedAccessorFactory(name: string): CompiledFunction {
  return (scope) => {
    return scope[name];
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

  toString(): string {
    return `${this.object.toString()}[${this.property.toString()}]`;
  }

  toFunction(): CompiledFunction {
    return MemberAccessorFactory(
      this.object.toFunction(),
      this.property.toFunction()
    )
  }
}

function MemberAccessorFactory(obj: CompiledFunction, property: CompiledFunction) {
  return (scope) => {
    return obj(scope)[property(scope)];
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

  toString(): string {
    return `${this.object.toString()}.${this.propertyName.toString()}`;
  }

  toFunction(): CompiledFunction {
    return DirectMemberAccessorFactory(
      this.object.toFunction(),
      this.propertyName
    )
  }
}

function DirectMemberAccessorFactory(obj: CompiledFunction, propertyName: string) {
  return (scope) => {
    return obj(scope)[propertyName];
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

  toString(): string {
    return `${this.test.toString()}?${this.consequent.toString()}:${this.alternate.toString()}`;
  }

  toFunction(): CompiledFunction {
    return ConditionalFactory(
      this.test.toFunction(),
      this.consequent.toFunction(),
      this.alternate.toFunction()
    );
  }
}

function ConditionalFactory(test: CompiledFunction, consequenct: CompiledFunction, alternate: CompiledFunction) {
  return (scope) => {
    return test(scope) ? consequenct(scope) : alternate(scope);
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

  toString(): string {
    return this.argument.toString();
  }

  toFunction(): CompiledFunction {
    return UnaryPlusFactory(
      this.argument.toFunction()
    );
  }
}

function UnaryPlusFactory(argument: CompiledFunction) {
  return (scope) => {
    return +argument(scope);
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

  toString(): string {
    return `-${this.argument.toString()}`;
  }

  toFunction(): CompiledFunction {
    return UnaryMinusFactory(
      this.argument.toFunction()
    );
  }
}

function UnaryMinusFactory(argument: CompiledFunction) {
  return (scope) => {
    return -argument(scope);
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

  toString(): string {
    return `!${this.argument.toString()}`;
  }

  toFunction(): CompiledFunction {
    return UnaryNotFactory(
      this.argument.toFunction()
    );
  }
}

function UnaryNotFactory(argument: CompiledFunction) {
  return (scope) => {
    return !argument(scope);
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

  toString(): string {
    return calcToString(this.callee,this.member,this.args);
  }

  toFunction(): CompiledFunction {
    return MemberCallFactory(
      this.callee.toFunction(),
      this.member.toFunction(),
      this.args.map(a => a.toFunction())
    );
  }
}

function calcToString(callee: Instruction, member: Instruction, args: Instruction[] ) {
  return member
    ? `${callee.toString()}.${member.toString()}(${args.map(e => e.toString()).join(',')})`
    : `${callee.toString()}(${args.map(e => e.toString()).join(',')})`;
}

function MemberCallFactory(callee: CompiledFunction, member: CompiledFunction, args: CompiledFunction[]) {
  return (scope) => {
    const result = callee(scope);
    return safeCall(result, member(scope)).apply(result, args.map(a => a(scope)));
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
    return false;
  }

  toString(): string {
    return calcToString(this.callee,this.member,[]);
  }

  toFunction(): CompiledFunction {
    return MemberCall0Factory(
      this.callee.toFunction(),
      this.member.toFunction()
    );
  }

}

function MemberCall0Factory(callee: CompiledFunction, member: CompiledFunction) {
  return (scope) => {
    const result = callee(scope);
    return safeCall(result, member(scope)).call(result);
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

  toString(): string {
    return calcToString(this.callee,this.member,[this.a1]);
  }

  toFunction(): CompiledFunction {
    return MemberCall1Factory(
      this.callee.toFunction(),
      this.member.toFunction(),
      this.a1.toFunction()
    );
  }
}

function MemberCall1Factory(callee: CompiledFunction, member: CompiledFunction, a1: CompiledFunction) {
  return (scope) => {
    const result = callee(scope);
    return safeCall(result, member(scope)).call(result, a1(scope));
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
    return false; //isConstant([this.a1, this.a2]);
  }

  toString(): string {
    return calcToString(this.callee,this.member,[this.a1,this.a2]);
  }

  toFunction(): CompiledFunction {
    return MemberCall2Factory(
      this.callee.toFunction(),
      this.member.toFunction(),
      this.a1.toFunction(),
      this.a2.toFunction()
    );
  }
}

function MemberCall2Factory(callee: CompiledFunction, member: CompiledFunction, a1: CompiledFunction, a2: CompiledFunction) {
  return (scope) => {
    const result = callee(scope);
    return safeCall(result, member(scope)).call(result, a1(scope), a2(scope));
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
    return false; //isConstant([this.a1, this.a2, this.a3]);
  }

  toString(): string {
    return calcToString(this.callee,this.member,[this.a1,this.a2,this.a3]);
  }

  toFunction(): CompiledFunction {
    return MemberCall3Factory(
      this.callee.toFunction(),
      this.member.toFunction(),
      this.a1.toFunction(),
      this.a2.toFunction(),
      this.a3.toFunction()
    );
  }
}

function MemberCall3Factory(callee: CompiledFunction, member: CompiledFunction, a1: CompiledFunction, a2: CompiledFunction, a3: CompiledFunction) {
  return (scope) => {
    const result = callee(scope);
    return safeCall(result, member(scope)).call(result, a1(scope), a2(scope), a3(scope));
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

  toString(): string {
    return calcToString(this.callee,null,this.args);
  }

  toFunction(): CompiledFunction {
    return ScopeCallFactory(
      this.callee.toFunction(),
      this.args.map(a => a.toFunction())
    );
  }
}

function ScopeCallFactory(callee: CompiledFunction, args: CompiledFunction[]) {
  return (scope) => {
    return callee(scope).apply(emptyScope, args.map(a => a(scope)));
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

  toString(): string {
    return `${this.callee.toString()}()`;
  }

  toFunction(): CompiledFunction {
    return ScopeCall0Factory(
      this.callee.toFunction()
    );
  }
}

function ScopeCall0Factory(callee: CompiledFunction) {
  return (scope) => {
    return callee(scope).call(emptyScope);
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

  toString(): string {
    return calcToString(this.callee,null,[this.a1]);
  }

  toFunction(): CompiledFunction {
    return ScopeCall1Factory(
      this.callee.toFunction(),
      this.a1.toFunction()
    );
  }
}

function ScopeCall1Factory(callee: CompiledFunction, a1: CompiledFunction) {
  return (scope) => {
    return callee(scope).call(emptyScope, a1(scope));
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

  toString(): string {
    return calcToString(this.callee,null,[this.a1,this.a2]);
  }

  toFunction(): CompiledFunction {
    return ScopeCall2Factory(
      this.callee.toFunction(),
      this.a1.toFunction(),
      this.a2.toFunction()
    );
  }
}

function ScopeCall2Factory(callee: CompiledFunction, a1: CompiledFunction, a2: CompiledFunction) {
  return (scope) => {
    return callee(scope).call(emptyScope, a1(scope), a2(scope));
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

  toString(): string {
    return calcToString(this.callee, null, [this.a1, this.a2, this.a3]);
  }

  toFunction(): CompiledFunction {
    return ScopeCall3Factory(
      this.callee.toFunction(),
      this.a1.toFunction(),
      this.a2.toFunction(),
      this.a3.toFunction()
    );
  }
}

function ScopeCall3Factory(callee: CompiledFunction, a1: CompiledFunction, a2: CompiledFunction, a3: CompiledFunction) {
  return (scope) => {
    return callee(scope).call(emptyScope, a1(scope), a2(scope), a3(scope));
  }
}

export class ObjectInstruction implements Instruction {

  objv: { name: string, expr: Instruction }[];

  constructor(propertyNames: Array<string>, instructions: Array<Instruction>) {
    this.objv = propertyNames.map((name, i) => ({name, expr: instructions[i]}));
  }

  eval(scope: any): any {
    const acc = {};
    for(const i of this.objv) {
      acc[i.name] = i.expr.eval(scope);
    }
    console.log(acc);
    return acc;
  }

  isConstant(): boolean {
    for (const v of this.objv) {
      if (!v.expr.isConstant()) {
        return false;
      }
    }
    return true;
  }

  toString(): string {
    return `{${this.objv.map(i => i.name + ':' + i.expr.toString()).join(',')}}`;
  }

  toFunction(): CompiledFunction {
    return ObjectFactory(
      this.objv.map(v => ({name: v.name, fn: v.expr.toFunction()}))
    );
  }
}

function ObjectFactory(objv: { name: string, fn: CompiledFunction }[]) {
  return (scope) => {
    return objv.reduce(
      (a, v) => {
        a[v.name] = v.fn(scope);
        return a;
      },
      {});
  }
}

export class ArrayInstruction implements Instruction {
  constructor(private elements: Instruction[]) {
  }

  eval(scope: any): any {
    return evaluateAll(scope, this.elements);
  }

  isConstant(): boolean {
    return true;
  }

  toString(): string {
    return `[${toStringAll(this.elements)}]`;
  }

  toFunction(): CompiledFunction {
    return ArrayFactory(
      this.elements.map(e => e.toFunction())
    );
  }
}

function ArrayFactory(elements: CompiledFunction[]): CompiledFunction {
  return (scope) => {
    return elements.map(e => e(scope));
  }
}

export class LogicalOrInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) || this.right.eval(scope);
  }

  getType(): string {
    return '||';
  }

  toFunction(): CompiledFunction {
    return LogicalOrFactory(
      this.left.toFunction(),
      this.right.toFunction()
    )
  }
}

function LogicalOrFactory(left: CompiledFunction, right: CompiledFunction) {
  return (scope) => {
    return left(scope) || right(scope);
  }
}

export class LogicalAndInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) && this.right.eval(scope);
  }

  getType(): string {
    return '&&';
  }

  toFunction(): CompiledFunction {
    return LogicalAndFactory(
      this.left.toFunction(),
      this.right.toFunction()
    )
  }
}

function LogicalAndFactory(left: CompiledFunction, right: CompiledFunction) {
  return (scope) => {
    return left(scope) || right(scope);
  }
}

export class BinaryEqualInstruction extends BinaryBase {
  eval(scope: any): any {
    // tslint:disable-next-line
    return this.left.eval(scope) == this.right.eval(scope);
  }

  getType(): string {
    return '==';
  }

  toFunction(): CompiledFunction {
    return BinaryEqualFactory(
      this.left.toFunction(),
      this.right.toFunction()
    )
  }
}

function BinaryEqualFactory(left: CompiledFunction, right: CompiledFunction) {
  return (scope) => {
    return left(scope) == right(scope);
  }
}

export class BinaryNotEqualInstruction extends BinaryBase {
  eval(scope: any): any {
    // tslint:disable-next-line
    return this.left.eval(scope) != this.right.eval(scope);
  }

  getType(): string {
    return '!=';
  }

  toFunction(): CompiledFunction {
    return BinaryNotEqualFactory(
      this.left.toFunction(),
      this.right.toFunction()
    )
  }
}

function BinaryNotEqualFactory(left: CompiledFunction, right: CompiledFunction) {
  return (scope) => {
    return left(scope) != right(scope);
  }
}

export class BinaryAbsNotEqualInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) !== this.right.eval(scope);
  }

  getType(): string {
    return '!==';
  }

  toFunction(): CompiledFunction {
    return BinaryAbsNotEqualFactory(
      this.left.toFunction(),
      this.right.toFunction()
    )
  }
}

function BinaryAbsNotEqualFactory(left: CompiledFunction, right: CompiledFunction) {
  return (scope) => {
    return left(scope) !== right(scope);
  }
}

export class BinaryAbsEqualInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) === this.right.eval(scope);
  }

  getType(): string {
    return '===';
  }

  toFunction(): CompiledFunction {
    return BinaryAbsEqualFactory(
      this.left.toFunction(),
      this.right.toFunction()
    )
  }
}

function BinaryAbsEqualFactory(left: CompiledFunction, right: CompiledFunction) {
  return (scope) => {
    return left(scope) === right(scope);
  }
}

export class BinaryGreaterThanInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) > this.right.eval(scope);
  }

  getType(): string {
    return '>';
  }

  toFunction(): CompiledFunction {
    return BinaryGreaterThanFactory(
      this.left.toFunction(),
      this.right.toFunction()
    )
  }
}

function BinaryGreaterThanFactory(left: CompiledFunction, right: CompiledFunction) {
  return (scope) => {
    return left(scope) > right(scope);
  }
}

export class BinaryLessThanInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) < this.right.eval(scope);
  }

  getType(): string {
    return '<';
  }

  toFunction(): CompiledFunction {
    return BinaryLessThanFactory(
      this.left.toFunction(),
      this.right.toFunction()
    )
  }
}

function BinaryLessThanFactory(left: CompiledFunction, right: CompiledFunction) {
  return (scope) => {
    return left(scope) < right(scope);
  }
}

export class BinaryGreaterEqualThanInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) >= this.right.eval(scope);
  }

  getType(): string {
    return '>=';
  }

  toFunction(): CompiledFunction {
    return BinaryGreaterEqualThanFactory(
      this.left.toFunction(),
      this.right.toFunction()
    )
  }
}

function BinaryGreaterEqualThanFactory(left: CompiledFunction, right: CompiledFunction) {
  return (scope) => {
    return left(scope) >= right(scope);
  }
}

export class BinaryLessEqualThanInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) <= this.right.eval(scope);
  }

  getType(): string {
    return '<=';
  }

  toFunction(): CompiledFunction {
    return BinaryLessEqualThanFactory(
      this.left.toFunction(),
      this.right.toFunction()
    )
  }
}

function BinaryLessEqualThanFactory(left: CompiledFunction, right: CompiledFunction) {
  return (scope) => {
    return left(scope) <= right(scope);
  }
}

export class BinaryAddInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) + this.right.eval(scope);
  }

  getType(): string {
    return '+';
  }

  toFunction(): CompiledFunction {
    return BinaryAddFactory(
      this.left.toFunction(),
      this.right.toFunction()
    )
  }
}

function BinaryAddFactory(left: CompiledFunction, right: CompiledFunction) {
  return (scope) => {
    return left(scope) + right(scope);
  }
}

export class BinarySubtractInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) - this.right.eval(scope);
  }

  getType(): string {
    return '-';
  }

  toFunction(): CompiledFunction {
    return BinarySubtractFactory(
      this.left.toFunction(),
      this.right.toFunction()
    )
  }
}

function BinarySubtractFactory(left: CompiledFunction, right: CompiledFunction) {
  return (scope) => {
    return left(scope) - right(scope);
  }
}

export class BinaryMultiplyInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) * this.right.eval(scope);
  }

  getType(): string {
    return '*';
  }

  toFunction(): CompiledFunction {
    return BinaryMultiplyFactory(
      this.left.toFunction(),
      this.right.toFunction()
    )
  }
}

function BinaryMultiplyFactory(left: CompiledFunction, right: CompiledFunction) {
  return (scope) => {
    return left(scope) * right(scope);
  }
}

export class BinaryDivideInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) / this.right.eval(scope);
  }

  getType(): string {
    return '/';
  }

  toFunction(): CompiledFunction {
    return BinaryDivideFactory(
      this.left.toFunction(),
      this.right.toFunction()
    )
  }
}

function BinaryDivideFactory(left: CompiledFunction, right: CompiledFunction) {
  return (scope) => {
    return left(scope) / right(scope);
  }
}

export class BinaryModulusInstruction extends BinaryBase {
  eval(scope: any): any {
    return this.left.eval(scope) % this.right.eval(scope);
  }

  getType(): string {
    return '%';
  }

  toFunction(): CompiledFunction {
    return BinaryModulusFactory(
      this.left.toFunction(),
      this.right.toFunction()
    )
  }
}

function BinaryModulusFactory(left: CompiledFunction, right: CompiledFunction) {
  return (scope) => {
    return left(scope) % right(scope);
  }
}

export class ConcatenateInstruction implements Instruction {
  constructor(private instructions: Instruction[]) {
  }

  eval(scope: any): any {
    let s = "";
    for (let e of this.instructions) {
      s += e[scope].toString();
    }
    return s;
  }

  isConstant(): boolean {
    return isConstant(this.instructions);
  }

  toString(): string {
    return this.instructions.map(i => i.toString()).join('+');
  }

  toFunction(): CompiledFunction {
    return BinaryConcatenateFactory(
      this.instructions.map(i => i.toFunction())
    )
  }
}

function BinaryConcatenateFactory(args: CompiledFunction[]) {
  return (scope) => {
    return args.reduce((a,b)=> a+b(scope), '');
  }
}
