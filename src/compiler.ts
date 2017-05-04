import {Instruction} from "./instructions";
import {CompileVisitor} from "./compiler-visitor";
import {Parser, Visitor} from "expression-parser";

export class Compiler {
  visitor: Visitor<Instruction> = new CompileVisitor();
  parser: Parser                = new Parser();

  compile(code: string): Instruction {
    return this.parser.parseExpression(code || "").visit(this.visitor);
  }

  compileMulti(code: string): Instruction[] {
    return this.parser.parseExpressions(code || "").map((c) => c.visit(this.visitor));
  }

  compileContent(code: string): Instruction {
    return this.parser.parseContent(code || "").visit(this.visitor);
  }

  eval(code: string, scope: any): any {
    return this.compile(code).eval(scope);
  }
}