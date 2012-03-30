#!/usr/bin/env node

var program = require("commander")
  , exec = require('child_process').exec

program
  .version('0.0.1')

program
  .command('init <project>')
  .description('initialize a SpaceMagic project')
  .action(function(project) {
    console.log('cp -r ' + __dirname + '/../base/* ' + process.cwd())
    child = exec('cp -r ' + __dirname + '/../base/* ' + process.cwd(), function() {
      console.log(arguments)
      
    })
  })

program
  .command('server')
  .description('run the SpaceMagic server')
  .option('-p, --port [port]', Number, 3000)
  .action(function(program) {
    var app = require("../lib/server")                                                                                                                                                            
      .start(process.env.NODE_ENV || "development", program.port)
  })

program.parse(process.argv)

if(program.args.length === 0) {
  console.log(program.helpInformation())
}
