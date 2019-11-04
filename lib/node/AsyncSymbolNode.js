'use strict'

module.exports = function (node) {
  var id = node.name
  return 'await $$mathCodegen.getProperty("' + id + '", scope, ns)'
}
