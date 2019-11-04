'use strict'

var assert = require('assert')

var CodeGenerators = require('../')
var AsyncCodeGenerator = CodeGenerators.AsyncCodeGenerator

var mocha = require('mocha')
var it = mocha.it
var describe = mocha.describe
var beforeEach = mocha.beforeEach
var SymbolNode = require('../lib/node/SymbolNode')

function cleanAssert (a, b) {
  a = a.replace(/\s/g, '')
  b = b.replace(/\s/g, '')
  assert(a === b)
}

function statement (instance, test) {
  // console.log('statement:')
  // console.log(instance.statements[0])
  // console.log(test)
  cleanAssert(instance.statements[0], test)
}

function statements (instance, tests) {
  var statements = instance.statements
  for (var i = 0; i < statements.length; i += 1) {
    cleanAssert(statements[i], tests[i])
  }
}

function id (name) {
  var args = Array.prototype.slice.call(arguments, 1)
  /* eslint-disable new-cap */
  var identifier = SymbolNode({
    name: name
  })
  /* eslint-enable new-cap */
  if (args.length) {
    identifier = '$$mathCodegen.functionProxy(' + identifier + ', "' + name + '")'
    identifier += '(' + args.join(',') + ')'
  }

  return identifier
}

describe('math-codegen', function () {
  var cg

  // describe('definitions', function () {
  //   beforeEach(function () {
  //     cg = new CodeGenerator()
  //   })

  //   it('should be sent to the constructor', function () {
  //     cg = new CodeGenerator(null, {ns: 1})
  //     assert(cg.defs.ns === 1)
  //   })

  //   it('should be updated', function () {
  //     cg.setDefs({ns: 1})
  //     assert(cg.defs.ns === 1)

  //     cg.setDefs({ns: null})
  //     assert(!cg.defs.ns)
  //   })
  // })

  // describe('parser', function () {
  //   describe('with default options', function () {
  //     beforeEach(function () {
  //       cg = new CodeGenerator()
  //     })

  //     it('should parse a constant', function () {
  //       statement(cg.parse('1'), 'ns.factory(1)')
  //       statement(cg.parse('1e18'), 'ns.factory(1e18)')
  //     })

  //     it('should parse unary expressions', function () {
  //       statement(cg.parse('-1'), id('negative', 'ns.factory(1)'))
  //       statement(cg.parse('+1'), id('positive', 'ns.factory(1)'))
  //       statement(cg.parse('-+1'), id('negative', id('positive', 'ns.factory(1)')))
  //     })

  //     it('should parse an array', function () {
  //       // rawArrayElements is set to true by default
  //       statement(cg.parse('[1,2]'), 'ns.factory([1, 2])')
  //       statement(cg.parse('[+1,-2]'), 'ns.factory([+1, -2])')
  //     })

  //     it('should parse symbols', function () {
  //       statement(cg.parse('PI'), id('PI'))
  //       statement(cg.parse('sin'), id('sin'))
  //     })

  //     it('should parse function calls', function () {
  //       statement(cg.parse('sin()'), id('sin', ''))
  //       statement(cg.parse('sin(1)'), id('sin', 'ns.factory(1)'))
  //       statement(cg.parse('sin(1, 2)'), id('sin', 'ns.factory(1)', 'ns.factory(2)'))
  //     })

  //     it('should parse binary expression calls', function () {
  //       statement(cg.parse('1 + 2'), id('add', 'ns.factory(1)', 'ns.factory(2)'))
  //       statement(cg.parse('1 - 2'), id('sub', 'ns.factory(1)', 'ns.factory(2)'))
  //       statement(cg.parse('1 * 2'), id('mul', 'ns.factory(1)', 'ns.factory(2)'))
  //       statement(cg.parse('1 / 2'), id('div', 'ns.factory(1)', 'ns.factory(2)'))
  //       statement(cg.parse('1 ^ 2'), id('pow', 'ns.factory(1)', 'ns.factory(2)'))
  //       statement(cg.parse('1 % 2'), id('mod', 'ns.factory(1)', 'ns.factory(2)'))
  //       statement(cg.parse('1 < 2'), id('lessThan', 'ns.factory(1)', 'ns.factory(2)'))
  //       statement(
  //         cg.parse('(1 + 2) * (2 + 3)'),
  //         id('mul', id('add', 'ns.factory(1)', 'ns.factory(2)'), id('add', 'ns.factory(2)', 'ns.factory(3)'))
  //       )
  //       statement(cg.parse('1 + 3 ^ 2'), id('add', 'ns.factory(1)', id('pow', 'ns.factory(3)', 'ns.factory(2)')))
  //       statement(cg.parse('x!'), id('factorial', id('x')))
  //     })

  //     it('should parse a conditional expression', function () {
  //       statement(
  //         cg.parse('1 < 2 ? 1 : 2'),
  //         '(!!(' + id('lessThan', 'ns.factory(1)', 'ns.factory(2)') + ') ? ' +
  //         '( ns.factory(1) ) : ( ns.factory(2) ) )'
  //       )
  //     })

  //     it('should parse an assignment expression', function () {
  //       statement(cg.parse('x = 1'), 'scope["x"] = ns.factory(1)')
  //     })

  //     it('should parse multiple statements', function () {
  //       statements(
  //         cg.parse('sin(1);x = 1'),
  //         [id('sin', 'ns.factory(1)'), 'scope["x"] = ns.factory(1)']
  //       )
  //     })

  //     it('should throw on expressions not implemented', function () {
  //       assert.throws(function () {
  //         cg.parse('var y = 1')
  //       })
  //     })
  //   })

  //   describe('with raw set to true', function () {
  //     beforeEach(function () {
  //       cg = new CodeGenerator({
  //         raw: true
  //       })
  //     })

  //     it('should parse a constant', function () {
  //       statement(cg.parse('1'), '1')
  //       statement(cg.parse('1e18'), '1e18')
  //     })

  //     it('should parse unary expressions', function () {
  //       statement(cg.parse('-1'), '-1')
  //       statement(cg.parse('+1'), '+1')
  //       statement(cg.parse('-+1'), '-+1')
  //     })

  //     it('should parse an array', function () {
  //       // rawArrayElements is set to true by default
  //       statement(cg.parse('[1,2]'), '[1, 2]')
  //       statement(cg.parse('[+1,-2]'), '[+1, -2]')
  //     })

  //     it('should parse literals', function () {
  //       statement(cg.parse('PI'), id('PI'))
  //       statement(cg.parse('sin'), id('sin'))
  //     })

  //     it('should parse function calls', function () {
  //       statement(cg.parse('sin()'), id('sin', ''))
  //       statement(cg.parse('sin(1)'), id('sin', '1'))
  //       statement(cg.parse('sin(1, 2)'), id('sin', '1', '2'))
  //     })

  //     it('should parse binary expression calls', function () {
  //       statement(cg.parse('1 + 2'), '(1 + 2)')
  //       statement(cg.parse('1 - 2'), '(1 - 2)')
  //       statement(cg.parse('1 * 2'), '(1 * 2)')
  //       statement(cg.parse('1 / 2'), '(1 / 2)')
  //       statement(cg.parse('1 ^ 2'), '(1 ^ 2)')
  //       statement(cg.parse('1 % 2'), '(1 % 2)')
  //       statement(cg.parse('1 < 2'), '(1 < 2)')
  //       statement(
  //         cg.parse('(1 + 2) * (2 + 3)'),
  //         '((1 + 2) * (2 + 3))'
  //       )
  //     })

  //     it('should not throw on a not implemented binary operator', function () {
  //       statement(cg.parse('1 & 2'), '(1 & 2)')
  //     })

  //     it('should parse a conditional expression', function () {
  //       statement(
  //         cg.parse('1 < 2 ? 1 : 2'),
  //         '(!!((1 < 2)) ? ( 1 ) : ( 2 ) )'
  //       )
  //     })

  //     it('should parse an assignment expression', function () {
  //       statement(cg.parse('x = 1'), 'scope["x"] = 1')
  //     })

  //     it('should parse multiple statements', function () {
  //       statements(
  //         cg.parse('sin(1); x = 1'),
  //         [id('sin', '1'), 'scope["x"] = 1']
  //       )
  //     })
  //   })

  //   describe('with rawArrayExpressionElements set to false', function () {
  //     beforeEach(function () {
  //       cg = new CodeGenerator({
  //         rawArrayExpressionElements: false
  //       })
  //     })

  //     it('should parse an array', function () {
  //       statement(cg.parse('[1,2]'), 'ns.factory([ns.factory(1), ns.factory(2)])')
  //     })
  //   })

  //   describe('with rawCallExpressionElements set to true', function () {
  //     beforeEach(function () {
  //       cg = new CodeGenerator({
  //         rawCallExpressionElements: true
  //       })
  //     })

  //     it('should use raw parameters', function () {
  //       statement(cg.parse('sin()'), id('sin', ''))
  //       statement(cg.parse('sin(1)'), id('sin', '1'))
  //       statement(cg.parse('sin(1, 2)'), id('sin', '1', '2'))
  //     })
  //   })

  // })

  // describe('compile', function () {
  //   var ns = { factory: function () {} }

  //   beforeEach(function () {
  //     cg = new CodeGenerator()
  //   })

  //   it('should throw when ns is not defined or it\'s different from an object/function', function () {
  //     cg = new CodeGenerator()
  //     assert.throws(function () {
  //       cg.parse('1 + 2').compile()
  //     })
  //     assert.throws(function () {
  //       cg.parse('1 + 2').compile(1)
  //     })
  //   })

  //   it('should compile successfully when the namespace is a object/function', function () {
  //     var fn = function () { }
  //     fn.factory = function (a) { return a }
  //     fn.add = function (a, b) { return a + b }
  //     assert.doesNotThrow(function () {
  //       cg.parse('1 + x').compile(ns)
  //       cg.parse('1 + x').compile(fn)
  //     })
  //   })

  //   it('should throw when there are no statements', function () {
  //     assert.throws(function () {
  //       cg.compile({})
  //     })
  //   })

  //   it('should have a return statement in the eval method', function () {
  //     var code = cg.parse('1 + 2').compile(ns)
  //     assert(code.eval.toString().indexOf('return ') > 0)
  //   })

  //   it('should compile correctly under a ns', function () {
  //     assert.doesNotThrow(function () {
  //       cg.parse('1 + 2').compile(ns)
  //       cg.parse('x = 1').compile(ns)
  //       cg.parse('x = 1; y = 1').compile(ns)
  //       cg.parse('x = 1; y + 1').compile(ns)
  //     })
  //   })

  //   it('should throw if a method is not defined in the scope or in the ns', function () {
  //     var code = cg.parse('1 + 2').compile(ns)
  //     assert.throws(function () {
  //       // `add` is not defined
  //       code.eval()
  //     }, /symbol "add" is undefined/)
  //   })

  //   it('should throw if a method is expected to be a function in the scope or in the ns', function () {
  //     var code = cg.parse('1 + 2').compile({
  //       factory: function (n) { return n },
  //       add: 3
  //     })
  //     assert.throws(function () {
  //       // `add` is not defined
  //       code.eval()
  //     }, /symbol "add" must be a function/)
  //   })

  //   it('should compile addition if .add is in the namespace', function () {
  //     var code = cg.parse('1 + 2').compile({
  //       factory: function (n) { return n },
  //       add: function (x, y) { return x + y }
  //     })
  //     assert(code.eval() === 3)
  //   })
  // })

  describe('eval', function () {
    var ns = {
      factory: async function (a) { return a; },
      add: async function (a, b) {
        return Promise.resolve(a + b)
      },
      mul: async function (a, b) { return a * b }
    }

    beforeEach(function () {
      cg = new AsyncCodeGenerator()
    })

    it('should eval async an operation successfully', async function (done) {
      var code = cg.parse('1 + x').compile(ns);
      console.log(code.code);

      assert(await code.eval({ x: 2 }) === 3);
      assert(await code.eval({ x: 0 }) === 1);
      done();
    })

    it('should make assignment to the scope', async function (done) {
      var scope = {x: 2}
      var code = cg.parse('y = x; 1 + x').compile(ns)
      assert(await code.eval(scope) === 3)
      assert(scope.y === 2)
      done();
    })


    // it('should throw if a variable is not defined in the scope or the namespace', async function (done) {
    //   var code = cg.parse('1 + x').compile(ns)
    //   assert.throws(function () {
    //     code.eval({}).than()
    //     done();
    //   }, /symbol "x" is undefined/)
    //
    // })
    //
    // it('should throw if a function is not defined in the scope or the namespace', async function (done) {
    //   var code = cg.parse('1 + x(1)').compile(ns)
    //   assert.throws(function () {
    //     code.eval({
    //       x: 3
    //     })
    //     done();
    //   }, /symbol "x" must be a function/)
    //
    // })



    it('should call the factory on context values', async function (done) {
      function Decimal (v) {
        this.v = v
      }
      var decimalNamespace = {
        factory:  function (v) {
          if (typeof v === Decimal) return v
          return new Decimal(v)
        },
        add:  function (a, b) {
          return a.v + b.v
        }
      }
      const codeGenerator = new AsyncCodeGenerator({
        applyFactoryToScope: true
      })
      var code = codeGenerator.parse('x + y')
        .compile(decimalNamespace)
      assert(await code.eval({
        x: 1,
        y: 2
      }) === 3)
      done();
    })
  })
})
