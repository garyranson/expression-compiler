import {expect} from "chai";
import {Compiler} from "../src/compiler";

describe("Lexer Reader Tests 1.", () => {
  let compiler: Compiler;
  let scope: any;

  beforeEach(function () {
    compiler = new Compiler();
    scope    = {
      val1: 1,
      arr:  [5, 4, 3, 2, 1],
      a:    {
        a1: 1,
        a2: 2,
        a3: 3
      },
      b:    {
        fn: function (a, b) {
          return "" + a + b;
        }
      }
    };
  });
  it("parses literal primitives", function () {
    let tests = [
      {expression: "b.fn(1,2).toString()", value: scope.b.fn(1, 2).toString()},
      {expression: "b.fn", value: scope.b.fn},
      {expression: "b.fn(1,2)", value: scope.b.fn(1, 2)},
      {expression: "a", value: scope.a},
      {expression: "a.a1", value: scope.a.a1},
      {expression: "a.a1+10/3", value: scope.a.a1 + 10 / 3},
      {expression: "(a.a1)+10/3", value: (scope.a.a1) + 10 / 3},
      {expression: "arr", value: scope.arr},
      {expression: "arr[1]", value: scope.arr[1]},
      {expression: "'foo'", value: "foo"},
      {expression: "'\\''", value: "'"},
      {expression: "'\"'", value: "\""},
      {expression: "'\\f'", value: "\f"},
      {expression: "'\\n'", value: "\n"},
      {expression: "'\\r'", value: "\r"},
      {expression: "'\\t'", value: "\t"},
      {expression: "'\\v'", value: "\v"},
      {expression: "true", value: true},
      {expression: "false", value: false},
      {expression: "null", value: null},
      {expression: "undefined", value: undefined},
      {expression: "0", value: 0},
      {expression: "1", value: 1},
      {expression: "2.2", value: 2.2},
      {expression: "1+2", value: 3},
      {expression: "val1", value: scope.val1}
    ];

    expect(compiler.eval("1+1", scope)).equals(2);

    for (let test of tests) {
      expect(compiler.eval(test.expression, scope)).equals(test.value, test.expression);
    }
  });
});
