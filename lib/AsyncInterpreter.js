'use strict'
var extend = require('extend')

var types = {
  ArrayNode: require('./node/ArrayNode'),
  AssignmentNode: require('./node/AssignmentNode'),
  ConditionalNode: require('./node/ConditionalNode'),
  ConstantNode: require('./node/ConstantNode'),
  FunctionNode: require('./node/AsyncFunctionNode'),
  OperatorNode: require('./node/OperatorNode'),
  SymbolNode: require('./node/AsyncSymbolNode'),
  UnaryNode: require('./node/UnaryNode')
}

var AsyncInterpreter = function (owner, options) {
  this.owner = owner
  this.options = extend({
    factory: 'await ns.factory',
    raw: false,
    rawArrayExpressionElements: true,
    rawCallExpressionElements: false,
    applyFactoryToScope: false
  }, options)
}

extend(AsyncInterpreter.prototype, types)

// main method which decides which expression to call
AsyncInterpreter.prototype.next = function (node) {
  if (!(node.type in this)) {
    throw new TypeError('the node type ' + node.type + ' is not implemented')
  }
  return this[node.type](node)
}

AsyncInterpreter.prototype.rawify = function (test, fn) {
  var oldRaw = this.options.raw
  if (test) {
    this.options.raw = true
  }
  fn()
  if (test) {
    this.options.raw = oldRaw
  }
}

module.exports = AsyncInterpreter
