import { Instruction } from "./instructions";
import { Parser, Visitor } from "expression-parser";
export declare class Compiler {
    visitor: Visitor<Instruction>;
    parser: Parser;
    constructor();
    compile(code: string): Instruction;
    compileMulti(code: string): Instruction;
    compileList(code: string): Instruction[];
    compileContent(code: string): Instruction;
    evaluate(code: string, scope: any): any;
    evaluateFn(code: string, scope: any): any;
    meval(code: string, scope: any): any;
    mevalfn(code: string, scope: any): any;
}
