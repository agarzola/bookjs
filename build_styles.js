var stylus = require('stylus')
var fs = require('fs')
var book = fs.readFileSync('./styles/book.styl')
var navigation = fs.readFileSync('./styles/navigator.styl')
var next_prev = fs.readFileSync('./styles/next_prev.styl')
var pages = fs.readFileSync('./styles/pages.styl')

var styles = book + navigation + next_prev + pages

stylus.render(styles, { compress: true }, function (err, css) {
  if (err) { throw err }
  var data = 'module.exports = \'' + css.replace(/'/g, '"') + '\';'
  fs.writeFileSync('./lib/styles.js', data)
  console.log('All done!')
})
