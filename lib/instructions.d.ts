export interface Instruction {
    eval(scope?: any): any;
    isConstant(): boolean;
}
export declare abstract class BinaryBase implements Instruction {
    protected left: Instruction;
    protected right: Instruction;
    constructor(left: Instruction, right: Instruction);
    abstract eval(scope: any): any;
    isConstant(): boolean;
}
export declare class LiteralInstruction implements Instruction {
    private value;
    constructor(value: any);
    eval(scope: any): any;
    isConstant(): boolean;
}
export declare class ScopedAccessorInstruction implements Instruction {
    private name;
    constructor(name: string);
    eval(scope: any): any;
    isConstant(): boolean;
}
export declare class MemberAccessorInstruction implements Instruction {
    private object;
    private property;
    constructor(object: Instruction, property: Instruction);
    eval(scope: any): any;
    isConstant(): boolean;
}
export declare class DirectMemberAccessorInstruction implements Instruction {
    private object;
    private propertyName;
    constructor(object: Instruction, propertyName: any);
    eval(scope: any): any;
    isConstant(): boolean;
}
export declare class ConditionalInstruction implements Instruction {
    private test;
    private consequent;
    private alternate;
    constructor(test: Instruction, consequent: Instruction, alternate: Instruction);
    eval(scope: any): any;
    isConstant(): boolean;
}
export declare class UnaryPlusInstruction implements Instruction {
    private argument;
    constructor(argument: Instruction);
    eval(scope: any): any;
    isConstant(): boolean;
}
export declare class UnaryMinusInstruction implements Instruction {
    private argument;
    constructor(argument: Instruction);
    eval(scope: any): any;
    isConstant(): boolean;
}
export declare class UnaryNotInstruction implements Instruction {
    private argument;
    constructor(argument: Instruction);
    eval(scope: any): any;
    isConstant(): boolean;
}
export declare class MemberCallInstruction implements Instruction {
    private callee;
    private member;
    private args;
    constructor(callee: Instruction, member: Instruction, args: Instruction[]);
    eval(scope: any): any;
    isConstant(): boolean;
}
export declare class MemberCall0Instruction implements Instruction {
    private callee;
    private member;
    constructor(callee: Instruction, member: Instruction);
    eval(scope: any): any;
    isConstant(): boolean;
}
export declare class MemberCall1Instruction implements Instruction {
    private callee;
    private member;
    a1: Instruction;
    constructor(callee: Instruction, member: Instruction, args: Instruction[]);
    eval(scope: any): any;
    isConstant(): boolean;
}
export declare class MemberCall2Instruction implements Instruction {
    private callee;
    private member;
    a1: Instruction;
    a2: Instruction;
    constructor(callee: Instruction, member: Instruction, args: Instruction[]);
    eval(scope: any): any;
    isConstant(): boolean;
}
export declare class MemberCall3Instruction implements Instruction {
    private callee;
    private member;
    a1: Instruction;
    a2: Instruction;
    a3: Instruction;
    constructor(callee: Instruction, member: Instruction, args: Instruction[]);
    eval(scope: any): any;
    isConstant(): boolean;
}
export declare class ScopeCallInstruction implements Instruction {
    private callee;
    private args;
    constructor(callee: Instruction, args: Array<Instruction>);
    eval(scope: any): any;
    isConstant(): boolean;
}
export declare class ScopeCall0Instruction implements Instruction {
    private callee;
    constructor(callee: Instruction);
    eval(scope: any): any;
    isConstant(): boolean;
}
export declare class ScopeCall1Instruction implements Instruction {
    private callee;
    a1: Instruction;
    constructor(callee: Instruction, args: Array<Instruction>);
    eval(scope: any): any;
    isConstant(): boolean;
}
export declare class ScopeCall2Instruction implements Instruction {
    private callee;
    a1: Instruction;
    a2: Instruction;
    constructor(callee: Instruction, args: Array<Instruction>);
    eval(scope: any): any;
    isConstant(): boolean;
}
export declare class ScopeCall3Instruction implements Instruction {
    private callee;
    a1: Instruction;
    a2: Instruction;
    a3: Instruction;
    constructor(callee: Instruction, args: Array<Instruction>);
    eval(scope: any): any;
    isConstant(): boolean;
}
export declare class ObjectInstruction implements Instruction {
    private propertyNames;
    private instructions;
    constructor(propertyNames: Array<string>, instructions: Array<Instruction>);
    eval(scope: any): any;
    isConstant(): boolean;
}
export declare class ArrayInstruction implements Instruction {
    private elements;
    constructor(elements: Array<Instruction>);
    eval(scope: any): any;
    isConstant(): boolean;
}
export declare class LogicalOrInstruction extends BinaryBase {
    eval(scope: any): any;
}
export declare class LogicalAndInstruction extends BinaryBase {
    eval(scope: any): any;
}
export declare class BinaryEqualInstruction extends BinaryBase {
    eval(scope: any): any;
}
export declare class BinaryNotEqualInstruction extends BinaryBase {
    eval(scope: any): any;
}
export declare class BinaryAbsNotEqualInstruction extends BinaryBase {
    eval(scope: any): any;
}
export declare class BinaryAbsEqualInstruction extends BinaryBase {
    eval(scope: any): any;
}
export declare class BinaryGreaterThanInstruction extends BinaryBase {
    eval(scope: any): any;
}
export declare class BinaryLessThanInstruction extends BinaryBase {
    eval(scope: any): any;
}
export declare class BinaryGreaterEqualThanInstruction extends BinaryBase {
    eval(scope: any): any;
}
export declare class BinaryLessEqualThanInstruction extends BinaryBase {
    eval(scope: any): any;
}
export declare class BinaryAddInstruction extends BinaryBase {
    eval(scope: any): any;
}
export declare class BinarySubtractInstruction extends BinaryBase {
    eval(scope: any): any;
}
export declare class BinaryMultiplyInstruction extends BinaryBase {
    eval(scope: any): any;
}
export declare class BinaryDivideInstruction extends BinaryBase {
    eval(scope: any): any;
}
export declare class BinaryModulusInstruction extends BinaryBase {
    eval(scope: any): any;
}
