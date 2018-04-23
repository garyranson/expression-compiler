import {expect} from "chai";
import {Compiler} from "../src/compiler";

describe("Lexer Reader Tests 1.", () => {
  let compiler: Compiler;
  let scope: any;

  beforeEach(function () {
    compiler = new Compiler();
    scope    = {
      nv: null,
      val1: 1,
      val2: 2,
      arr:  [5, 4, 3, 2, 1],
      a:    {
        a1: 1,
        a2: 2,
        a3: 3
      },
      fn: function (a, b) {
        return "" + a + b;
      },
      fn0: function () {
        return 1;
      },
      fn1: function (a) {
        return 1+a;
      },
      fn2: function (a,b) {
        return 1+a+b;
      },
      fn3: function (a,b,c) {
        return 1+a+b+c;
      },
      fn4: function (a,b,c,d) {
        return 1+a+b+c+d;
      },
      b:    {
        fn: function (a, b) {
          return "" + a + b;
        },
        fn0: function () {
          return 0;
        },
        fn1: function (a) {
          return a;
        },
        fn2: function (a,b) {
          return a+b;
        },
        fn3: function (a,b,c) {
          return a+b+c;
        },
        fn4: function (a,b,c,d) {
          return a+b+c+d;
        },
      }
    };
  });
  it("parses literal primitives", function () {
    let tests = [
      {expression: "Math.round(1.53234)",value: 2},
      {expression: "Round(1.13234)",value: 1},
      {expression: "{a:1}",value: {a:1},alt:'{"a":1}'},
      {expression: "null",value: null},
      {expression: "undefined",value: undefined},
      {expression: "0",value: 0},
      {expression: "1",value: 1},
      {expression: "true",value: true},
      {expression: "false",value: false},
      {expression: "1&&2",value: 1&&2,alt:'2'},
      {expression: "null&&2",value: null&&2,alt:'null'},
      {expression: "2&&null",value: null&&2,alt:'null'},
      {expression: "val1&&val2",value: scope.val1&&scope.val2},
      {expression: "val1||val2",value: scope.val1||scope.val2},
      {expression: "val2&&val1",value: scope.val2&&scope.val1},
      {expression: "val2||val1",value: scope.val2||scope.val1},
      {expression: "b.fn(1,2).toString()", value: scope.b.fn(1, 2).toString()},
      {expression: "b.fn(1,2)", value: scope.b.fn(1, 2)},
      {expression: "b.fn0()", value: scope.b.fn0()},
      {expression: "b.fn1(11)", value: scope.b.fn1(11)},
      {expression: "b.fn2(11,22)", value: scope.b.fn2(11,22)},
      {expression: "b.fn3(11,22,33)", value: scope.b.fn3(11,22,33)},
      {expression: "b.fn4(11,22,33,44)", value: scope.b.fn4(11,22,33,44)},
      {expression: "fn0()", value: scope.fn0()},
      {expression: "fn1(11)", value: scope.fn1(11)},
      {expression: "fn2(11,22)", value: scope.fn2(11,22)},
      {expression: "fn3(11,22,33)", value: scope.fn3(11,22,33)},
      {expression: "fn4(11,22,33,44)", value: scope.fn4(11,22,33,44)},
      {expression: "b.fn", value: scope.b.fn},
      {expression: "a", value: scope.a},
      {expression: "!true", value: !true,alt: 'false'},
      {expression: "!false", value: !false,alt: 'true'},
      {expression: "!val1", value: !scope.val1,alt: '!val1'},
      {expression: "!val2", value: !scope.val2,alt: '!val2'},
      {expression: "a.a1", value: scope.a.a1},
      {expression: "a.a1+10/2", value: scope.a.a1 + 10 / 2,alt: 'a.a1+5'},
      {expression: "(a.a1)+10/2", value: (scope.a.a1) + 10 / 2,alt: 'a.a1+5'},
      {expression: "arr", value: scope.arr},
      {expression: "arr[1]", value: scope.arr[1]},
      {expression: "'foo'", value: "foo"},
      {expression: "'\\f'", value: "\f",alt: `'\f'`},
      {expression: "'\\n'", value: "\n",alt: `'\n'`},
      {expression: "'\\r'", value: "\r",alt: `'\r'`},
      {expression: "'\\t'", value: "\t",alt: `'\t'`},
      {expression: "'\\v'", value: "\v",alt: `'\v'`},
      {expression: "true", value: true},
      {expression: "false", value: false},
      {expression: "null", value: null},
      {expression: "undefined", value: undefined},
      {expression: "0", value: 0},
      {expression: "1>2", value: 1>2, alt: 'false'},
      {expression: "val1>val2", value: scope.val1>scope.val2},
      {expression: "val1<val2", value: scope.val1<scope.val2},
      {expression: "val1>=val2", value: scope.val1>=scope.val2},
      {expression: "val1<=val2", value: scope.val1<=scope.val2},
      {expression: "val1==val2", value: scope.val1==scope.val2},
      {expression: "val1===val2", value: scope.val1===scope.val2},
      {expression: "val1!=val2", value: scope.val1!=scope.val2},
      {expression: "val1!==val2", value: scope.val1!==scope.val2},
      {expression: "1", value: 1},
      {expression: "2.2", value: 2.2},
      {expression: "1+2", value: 3,alt: '3'},
      {expression: "1-2", value: -1, alt: '-1'},
      {expression: "10*3", value: 30,alt: '30'},
      {expression: "30/3", value: 10, alt: '10'},
      {expression: "15%10", value: 5, alt: '5'},
      {expression: "-3.141", value: -3.141},
      {expression: "-3+1", value: -2,alt: '-2'},
      {expression: "+3.141", value: 3.141, alt: '3.141'},
      {expression: "21||1", value: 21, alt: '21'},
      {expression: "null||21", value: 21, alt: '21'},
      {expression: "val1", value: scope.val1},
      {expression: "val1?val1+1:val1+2",value: scope.val1?scope.val1+1:scope.val1+2},
      {expression: "val1==1?val1+1:val1+2",value: scope.val1==1?scope.val1+1:scope.val1+2},
      {expression: "1==2?2:3",value: false ? 2 : 3, alt:'3'},
      {expression: "1?2:3",value: 1?2:3,alt:'2'},
      {expression: "{a:val2}",value: {a:scope.val2}},
      {expression: "{a:1,b:2}",value: {a:1,b:2},alt:'{"a":1,"b":2}'},
      {expression: "{a:1,b:2,c:'abc'}",value: {a:1,b:2,c:'abc'}, alt:`{"a":1,"b":2,"c":"abc"}`},
      {expression: "[1,2,3]",value: [1,2,3]},
      {expression: "[val2,2,3]",value: [scope.val2,2,3]},
      {expression: "[{a:1},2,3]",value: [{a:1},2,3],alt: `[{"a":1},2,3]`},
    ];

    for (let test of tests) {
      expect(compiler.eval(test.expression, scope)).deep.equals(test.value, test.expression);
    }

    for (let test of tests) {
      expect(compiler.eval(test.expression, scope)).deep.equals(test.value, test.expression);
    }

    for (let test of tests) {
      expect(compiler.compile(test.expression).toString()).equals(test.alt||test.expression, test.expression);
    }

  });

  it("parses multi", function () {
    let tests = [
      {expression: "-3.141", value: [-3.141]},
      {expression: "-3+1", value: [-2]},
      {expression: "+3.141", value: [3.141]},
      {expression: "21||1", value: [21||1]},
      {expression: "null||11", value: [null||11]},
      {expression: "nv", value: [null]},
      {expression: "nv||123", value: [123]},
      {expression: "val1", value: [scope.val1]},
      {expression: '1,2', value: [1,2]},
      {expression: 'val1,val1', value: [scope.val1,scope.val1]},
      {expression: 'val1+1,val1+2', value: [scope.val1+1,scope.val1+2]},
      {expression: 'val1+1,val1+2,1,2', value: [scope.val1+1,scope.val1+2,1,2]},
    ];

    for (let test of tests) {
      expect(compiler.meval(test.expression, scope)).deep.equals(test.value, test.expression);
    }

    for (let test of tests) {
      expect(compiler.mevalfn(test.expression, scope)).deep.equals(test.value, test.expression);
    }
  });
});
