'use strict'

var Parser = require('mr-parser').Parser
var AsyncInterpreter = require('./AsyncInterpreter')
var extend = require('extend')

function AsyncCodeGenerator (options, defs) {
  this.statements = []
  this.defs = defs || {}
  this.interpreter = new AsyncInterpreter(this, options)
}

AsyncCodeGenerator.prototype.setDefs = function (defs) {
  this.defs = extend(this.defs, defs)
  return this
}

AsyncCodeGenerator.prototype.compile = function (namespace) {
  var self = this
  if (!namespace || !(typeof namespace === 'object' || typeof namespace === 'function')) {
    throw TypeError('namespace must be an object')
  }
  if (typeof namespace.factory !== 'function') {
    throw TypeError('namespace.factory must be a function')
  }

  // definitions available in the function
  // each property under this.defs is mapped to local variables
  // e.g
  //
  //  function (defs) {
  //    var ns = defs['ns']
  //    // code generated for the expression
  //  }
  this.defs.ns = namespace
  this.defs.$$mathCodegen = {
    getProperty: async function (symbol, scope, ns) {
      function applyFactoryIfNeeded (value) {
        if (self.interpreter.options.applyFactoryToScope && typeof value !== 'function') {
          return ns.factory(value)
        }
        return value
      }

      if (symbol in scope) {
        return applyFactoryIfNeeded(scope[symbol])
      }
      if (symbol in ns) {
        return applyFactoryIfNeeded(ns[symbol])
      }
      throw SyntaxError('symbol "' + symbol + '" is undefined')
    },
    functionProxy: function (fn, name) {
      if (typeof fn !== 'function') {
        throw SyntaxError('symbol "' + name + '" must be a function')
      }
      return fn
    }
  }
  this.defs.$$processScope = this.defs.$$processScope || function () {}

  var defsCode = Object.keys(this.defs).map(function (name) {
    return 'var ' + name + ' = defs["' + name + '"]'
  })

  // statement join
  if (!this.statements.length) {
    throw Error('there are no statements saved in this generator, make sure you parse an expression before compiling it')
  }

  // last statement is always a return statement
  this.statements[this.statements.length - 1] = 'return ' + this.statements[this.statements.length - 1]

  var code = this.statements.join(';')
  var factoryCode = defsCode.join('\n') + '\n' + [
    'return {',
    '  eval: async function (scope) {',
    '    scope = scope || {}',
    '    $$processScope(scope)',
    '    ' + code,
    '  },',
    "  code: '" + code + "'",
    '}'
  ].join('\n')

  /* eslint-disable */
  var factory = new Function('defs', factoryCode)
  return factory(this.defs)
  /* eslint-enable */
}

AsyncCodeGenerator.prototype.parse = function (code) {
  var self = this
  var program = new Parser().parse(code)
  this.statements = program.blocks.map(function (statement) {
    return self.interpreter.next(statement)
  })
  return this
}

module.exports = AsyncCodeGenerator
