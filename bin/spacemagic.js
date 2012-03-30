#!/usr/bin/env node

program = require("commander")

program
  .version('0.0.1')

program
  .command('init <project>')
  .description('initialize a SpaceMagic project')
  .action(function(project) {
     console.log(project)
  })

program
  .command('server')
  .description('run the SpaceMagic server')
  .option('-p, --port [port]', Number, 3000)
  .action(function(program) {
    var app = require("./lib/server")                                                                                                                                                            
      .start(process.env.NODE_ENV || "development", program.port)
  })

program.parse(process.argv)

if(program.args.length === 0) {
  console.log(program.helpInformation())
}
