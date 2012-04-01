var AssetPipe             = require("AssetPipeline/lib/index")
  , ModuleProcessor       = require("AssetPipeline/lib/processors/module")
  , CoffeeScriptProcessor = require("AssetPipeline/lib/processors/coffeescript") 

module.exports = assetPipe = new AssetPipe()

var scriptPipeline = assetPipe.script()
  , defaultScriptPipeline = assetPipe.script()
  , imagePipeline = assetPipe.image()
  , stylesheetPipeline = assetPipe.stylesheet()
  , htmlPipeline = assetPipe.html()
  , defaultScriptPipeline = assetPipe.script()
  , defaultStylesheetPipeline = assetPipe.stylesheet()
  , defaultImagePipeline = assetPipe.image()
 

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

defaultScriptPipeline
  .root(__dirname + "/..")
  .urlPrefix("/scripts")
  .addFiles("AssetProvider/assets/js")

stylesheetPipeline
  .urlPrefix("/css") 
  .root(__dirname + "/../assets/stylesheets")
  .addFiles(__dirname + "/../assets/stylesheets")
  .addFiles("AssetProvider/assets/js")

imagePipeline
  .urlPrefix("/img") 
  .root(__dirname + "/../assets/img")
  .addFiles(__dirname + "/../assets/img")

defaultImagePipeline
  .urlPrefix("/img")
  .serveDefault()

defaultStylesheetPipeline
  .urlPrefix("/css")
  .serveDefault()
 
htmlPipeline
  .urlPrefix("/templates") 
  .root(__dirname + "/../assets/templates")
  .addFiles(__dirname + "/../assets/templates")
