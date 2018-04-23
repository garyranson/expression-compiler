import {ArrayInstruction, Instruction} from "./instructions";
import {CompileVisitor} from "./compiler-visitor";
import {Parser, Visitor} from "expression-parser";

export class Compiler {
  visitor: Visitor<Instruction> = new CompileVisitor();
  parser: Parser                = new Parser();

  compile(code: string): Instruction {
    let expr = this.parser.parseExpression(code || "");
    console.log(expr.constructor);
    return expr.visit(this.visitor);
  }

  // noinspection JSUnusedGlobalSymbols
  compileMulti(code: string): Instruction {
    return new ArrayInstruction(
      this.parser.parseExpressions(code || "").map(e => e.visit(this.visitor))
    );
  }

  // noinspection JSUnusedGlobalSymbols
  compileContent(code: string): Instruction {
    return this.parser.parseContent(code || "").visit(this.visitor);
  }

  eval(code: string, scope: any): any {
    return this.compile(code).eval(scope);
  }
  evalfn(code: string, scope: any): any {
    return this.compile(code).toFunction()(scope);
  }

  meval(code: string, scope: any): any {
    return this.compileMulti(code).eval(scope);
  }
  mevalfn(code: string, scope: any): any {
    return this.compileMulti(code).toFunction()(scope);
  }


}
