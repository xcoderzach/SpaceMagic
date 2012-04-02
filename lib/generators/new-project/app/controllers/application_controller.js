var LiveController = require("LiveController/lib/live_controller")
  , StaticView = require("views/static")

LiveController.Controller("/", function(app) {
  app.get(function() {
    var view = new StaticView("/templates/pages/start.html")
  })
})
