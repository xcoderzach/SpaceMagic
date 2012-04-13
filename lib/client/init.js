var _ = require("underscore")

require.register("jquery", function(module) { module.exports = $ })

window.socket = io.connect("http://" + document.location.hostname)

window.socket.on("StylesheetChange", function() {
  var rand = '?d=' + (new Date).getTime()
    , oldTag = $('link[href*="/stylesheets/style.css"]')
    , newTag = $('<link rel="stylesheet" href="/stylesheets/style.css' + rand + '">')
  newTag.insertAfter(oldTag)
  newTag.on("load", function() {
    oldTag.remove()
  })
})

var navigate = require("LiveController/lib/live_controller").navigate

var url = document.location.pathname
_(require.modules).each(function(module, path) {
  if(path.match(/\/app\/controllers\//i)) {
    //load them for their side effects
    require(path)
  }
})

navigate(url, {push: false}) 
