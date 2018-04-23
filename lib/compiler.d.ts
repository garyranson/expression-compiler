import { Instruction } from "./instructions";
import { Parser, Visitor } from "expression-parser";
export declare class Compiler {
    visitor: Visitor<Instruction>;
    parser: Parser;
    compile(code: string): Instruction;
    compileMulti(code: string): Instruction;
    compileContent(code: string): Instruction;
    eval(code: string, scope: any): any;
    evalfn(code: string, scope: any): any;
    meval(code: string, scope: any): any;
    mevalfn(code: string, scope: any): any;
}
