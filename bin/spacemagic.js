#!/usr/bin/env node

var program = require("commander")
  , exec = require('child_process').exec
  , generator = require('../lib/generators/generator')
  , fs = require('fs')
  , app = require("../lib/server")                                                                                                                                                            

 
if(!process.env.NODE_ENV) {
  process.env.NODE_ENV = "DEVELOPMENT"
}
 

program
  .version('0.0.1')

program
  .command('init <project>')
  .description('initialize a SpaceMagic project')
  .action(function(project) { 
    console.log("Building new project + " + project) 
    fs.mkdirSync(process.cwd() + "/" + project)
    generator.copyAndReplace( __dirname + "/../lib/generators/new-project"
                            , process.cwd() + "/" + project
                            , { projectName: project }
                            , function() {
                                console.log(project + " built successfully") 
                              })
  })

program
  .command('server')
  .description('run the SpaceMagic server')
  .option('-p, --port [port]', Number, 3000)
  .action(function(program) {
     app.start(program.port, process.cwd())
  })

program.parse(process.argv)

if(program.args.length === 0) {
  console.log(program.helpInformation())
}
