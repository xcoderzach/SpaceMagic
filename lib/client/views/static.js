var cache = require("/templates/cache")

module.exports = function(template) {
  this.template = cache[template]
  $("#main").html(this.template)
}
