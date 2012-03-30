var View = require("./view")
  , _    = require("underscore")

function SingleView(model, container, opts) {
  SingleView.__super__.constructor.call(this, model, container, opts)
}

var ctor = function() {}
ctor.prototype = View.prototype

SingleView.__super__ = View.prototype
SingleView.prototype = new ctor

_.extend(SingleView, View)

SingleView.prototype.afterTemplateLoad = function() {
  var that = this
  SingleView.__super__.afterTemplateLoad.call(this)
  this.view.context.find(".delete").click(function() { 
    that.model.remove() 
  }) 
}

module.exports = SingleView

