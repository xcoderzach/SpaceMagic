var cache = require("/templates/cache")

module.exports = function(template) {
  this.template = cache[template]
  console.log(this.template)
  $("#main").html(this.template)
}
