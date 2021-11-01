if (process.env.NODE_ENV === 'production') {
  module.exports = require('./matic-plasma.node.min.js')
} else {
  module.exports = require('./matic-plasma.node.js')
}
