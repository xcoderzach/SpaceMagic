var generator = require("../lib/generators/generator.js")
  , fs = require("fs")
  , rmrf = require("rimraf")


describe("the generator", function() {
  beforeEach(function() {
    var files = fs.readdirSync(__dirname + "/dest/")
    files.forEach(function(file) {
      rmrf.sync(__dirname + "/dest/" + file)
    })
  })
  it("should copy files", function(done) {
    generator.copy(__dirname + "/src/test.js", __dirname + "/dest/test.js", function() {
      fs.readFileSync(__dirname + "/src/test.js", 'utf8').should.equal(fs.readFileSync(__dirname + "/dest/test.js", 'utf8'))
      done()
    })
  })
  it("should recursivly copy directories", function(done) {
    generator.copyR(__dirname + "/src/adir", __dirname + "/dest/adir", function() {
      fs.readFileSync(__dirname + "/src/adir/file/test.js", 'utf8').should.equal(fs.readFileSync(__dirname + "/dest/adir/file/test.js", 'utf8'))
      fs.readFileSync(__dirname + "/src/adir/file/test2.js", 'utf8').should.equal(fs.readFileSync(__dirname + "/dest/adir/file/test2.js", 'utf8'))
      done()
    })
  }) 
  it("should copy directories and replace variables in files", function(done) {
    generator.copyAndReplace(__dirname + "/src/adir", __dirname + "/dest/adir", { projectName: "SpaceMagic" }, function() {
      fs.readFileSync(__dirname + "/dest/adir/file/test.js", 'utf8').should.equal("SpaceMagic\n")
      fs.readFileSync(__dirname + "/dest/adir/file/test2.js", 'utf8').should.equal("SpaceMagic\n")
      done()
    })
  })  


})
