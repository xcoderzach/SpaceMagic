var AssetPipe             = require("AssetPipeline/lib/index")
  , ModuleProcessor       = require("AssetPipeline/lib/processors/module")
  , CoffeeScriptProcessor = require("AssetPipeline/lib/processors/coffeescript") 

module.exports = assetPipe = new AssetPipe()

var scriptPipeline = assetPipe.script()
var imagePipeline = assetPipe.image()
var stylesheetPipeline = assetPipe.stylesheet()
var htmlPipeline = assetPipe.html()

scriptPipeline
  .root(__dirname + "/..")
  .addFiles(__dirname + "/../app/")
  .addFiles("SpaceMagic/lib/client/events")
  .addFiles("moment/moment")
  .addFiles("SpaceMagic/lib/client/parse_form.js")
  .addFiles("underscore/underscore")
  .addFiles("underscore/index")
  .addFiles("SpaceMagic/lib/client/views/view")
  .addFiles("SpaceMagic/lib/client/views/single_view")
  .addFiles("SpaceMagic/lib/client/views/list_view")
  .addFiles("SpaceMagic/lib/client/views/form_view")
  .addFiles("LiveDocument/lib")
  .addFiles("LiveController/lib")
  .addFiles("LiveView/lib")
  .process(ModuleProcessor(__dirname + "/..", { "events": "SpaceMagic/lib/client/events" 
                                              , "views": "SpaceMagic/lib/client/views" 
                                              , "parse_form": "SpaceMagic/lib/client/parse_form" 
                                              , "moment": "moment/moment"
                                              }))

var globalScriptPipeline = assetPipe.script()
  .root(__dirname + "/..")
  .urlPrefix("/scripts")
  .addFiles("SpaceMagic/lib/client/jquery.js")

stylesheetPipeline
  .urlPrefix("/stylesheets") 
  .root(__dirname + "/../assets/stylesheets")
  .addFiles(__dirname + "/../assets/stylesheets")

imagePipeline
  .urlPrefix("/img") 
  .root(__dirname + "/../assets/img")
  .addFiles(__dirname + "/../assets/img")

htmlPipeline
  .urlPrefix("/templates") 
  .root(__dirname + "/../assets/templates")
  .addFiles(__dirname + "/../assets/templates")
