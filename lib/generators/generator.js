var mu = require("mu2")
  , fs = require("fs")
  , path = require("path")
  , util = require("util")

/*
 * Copies a file, applying filter to its contents and calling fn
 * when it completes
 */
var copy = module.exports.copy = function(src, dest, fn, filter) {
  filter = filter || function(content, done) { 
    done(content) 
  } 
  filter(fs.readFileSync(src, 'utf8'), function(content) {
    fs.writeFileSync(dest, content, 'utf8')
    fn()
  })
}
/*
 * Recursively copies a file or directory, applying filter all files and calling fn
 * when it completes.
 */ 
var copyR = module.exports.copyR = function(src, dest, fn, filter) {

  var stat = fs.statSync(src)

  if(stat.isFile()) {

    copy(src, dest, fn, filter)

  } else if(stat.isDirectory()) {
    var children = fs.readdirSync(src)
      , numDone = children.length

    if(!path.existsSync(dest)) {
      fs.mkdirSync(dest)
    }
    children.forEach(function(child) {

      copyR(path.join(src, child), path.join(dest, child), function() {

        if(--numDone === 0) {
          fn()
        }
      }, filter)
    })
  }
}
/*
 * same as recursive copy, except replaces contents of file with values as a mustache template
 */
var copyAndReplace = module.exports.copyAndReplace = function(src, dest, values, fn) {

  copyR(src, dest, fn, function(content, done) {
    mu.compileText("template", content, function(err, parsed) {

      var stream = mu.render("template", values)
        , result = ""

      stream.on('data', function(data) {
        if(data) {
          result += data.toString()
        }
      })
      stream.on('end', function() {
        done(result)
      })
    })
  })
}
