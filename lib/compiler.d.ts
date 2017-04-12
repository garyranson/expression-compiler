import { Instruction } from "./instructions";
import { Parser, Visitor } from "expression-parser";
export declare class Compiler {
    visitor: Visitor<Instruction>;
    parser: Parser;
    compile(code: string): Instruction;
    eval(code: string, scope: any): any;
}
