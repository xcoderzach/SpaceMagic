var LiveView = require("../LiveView/lib/live_view")
  , LiveController = require("../LiveController/lib/live_controller")
  , parseForm = require("../parse_form") 
  , View = require("./view") 
  , SingleView = require("./single_view") 
  , _ = require("underscore")

function ListView(model, container, opts) {
  View.call(this, model, container, opts)
  this.itemViews = []
}

ListView.prototype.constructor = ListView

var ctor = function() {}
ctor.prototype = View.prototype

ListView.__super__ = View.prototype
ListView.prototype = new ctor

_.extend(ListView, View)
 
ListView.prototype.afterTemplateLoad = function() {
  ListView.__super__.afterTemplateLoad.call(this)

  this.SingleView = this.constructor.SingleViewClass || SingleView

  this.loadModel(this.model)

  this.view.set(this.model.collectionName + "Count", this.model.length)
  if (!this.model.loaded) {
    this.viewCollection.showLoading()
    var that = this
    this.model.load(function () {
      that.viewCollection.hideLoading()
    })
  }
}

ListView.prototype.loadModel = function(model) {
  var that = this
  this.model = model

  this.view.set(this.constructor.collectionName || this.model.collectionName, [])
  this.viewCollection = this.view.col(this.constructor.collectionName || this.model.collectionName)

  for(i = 0 ; i < this.model.length ; i++) {
    itemModel = this.model.at(i)
    this.setupItemView(itemModel)
  }
   
  this.model.on("remove", function(oldDoc) {
    var doRemove = function() {
      that.viewCollection.remove(oldDoc.id)
      that.view.set(that.model.collectionName + "Count", that.model.length)
    }
    if(that.constructor.beforeRemoveFn) {
      (that.constructor.beforeRemoveFn).call(that, doRemove)
    } else {
      doRemove()
    }
  })

  this.model.on("insert", function(newDoc) {
    var doInsert = function() {
      that.setupItemView(newDoc)
      that.view.set(that.model.collectionName + "Count", that.model.length)
    }
    if(that.constructor.beforeInsertFn) {
      (that.constructor.beforeInsertFn).call(that, newDoc, doInsert)
    } else {
      doInsert()
    }
  }) 
}

ListView.beforeInsert = function(fn) {
  this.beforeInsertFn = fn
  return this
}

ListView.beforeRemove = function(fn) {
  this.beforeRemoveFn = fn
  return this
}

ListView.prototype.setupItemView = function(itemModel) {
  //append a blank document, we'll set it in SingleView
  new this.SingleView(itemModel, this.viewCollection, { append: true, parent: this })
}

ListView.singleView = function(singleView) {
  this.SingleViewClass = singleView
  return this
}

ListView.map = function() {
  throw new Error("ListViews can't have mappers, since they have no properties!")
}

module.exports = ListView

