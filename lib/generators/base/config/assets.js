var AssetPipe             = require("../lib/AssetPipeline/lib/index")
  , ModuleProcessor       = require("../lib/AssetPipeline/lib/processors/module")
  , StylusProcessor       = require("../lib/AssetPipeline/lib/processors/stylus") 
  , CoffeeScriptProcessor = require("../lib/AssetPipeline/lib/processors/coffeescript") 

module.exports = assetPipe = new AssetPipe()

var scriptPipeline = assetPipe.script()
var imagePipeline = assetPipe.image()
var stylesheetPipeline = assetPipe.stylesheet()
var htmlPipeline = assetPipe.html()

scriptPipeline
  .root(__dirname + "/..")
  .addFiles(__dirname + "/../app/")
  .addFiles(__dirname + "/../lib/client/events.js")
  .addFiles(__dirname + "/../lib/client/moment.js")
  .addFiles(__dirname + "/../lib/client/jquery.js")
  .addFiles("underscore/underscore")
  .addFiles("underscore/index")
  .addFiles(__dirname + "/../lib/client/parse_form.js")
  .addFiles(__dirname + "/../lib/client/views")
  .addFiles(__dirname + "/../lib/client/LiveDocument/lib", { recursive: false })
  .addFiles(__dirname + "/../lib/client/LiveController/lib")
  .addFiles(__dirname + "/../lib/client/LiveView/lib")
  .process(ModuleProcessor(__dirname + "/..", { "events": "/lib/client/events"
                                              , "moment": "/lib/client/moment"
                                              , "jquery": "/lib/client/jquery"

                                              }))

var globalScriptPipeline = assetPipe.script()
  .root(__dirname + "/..")
  .urlPrefix("/scripts")
  .addFiles(__dirname + "/../lib/client/jquery.js")

stylesheetPipeline
  .fileExtension(".styl")
  .urlPrefix("/stylesheets") 
  .root(__dirname + "/../assets/stylesheets")
  .addFiles(__dirname + "/../assets/stylesheets")
  .process(StylusProcessor) 

imagePipeline
  .urlPrefix("/images") 
  .root(__dirname + "/../assets/images")
  .addFiles(__dirname + "/../assets/images")

htmlPipeline
  .urlPrefix("/templates") 
  .root(__dirname + "/../assets/templates")
  .addFiles(__dirname + "/../assets/templates")
