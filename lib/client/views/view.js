var LiveView = require("../LiveView/lib/live_view")
  , LiveController = require("../LiveController/lib/live_controller")
  , parseForm = require("../parse_form")
  , _ = require("underscore")
window.changes = 0

function View(model, container, opts) {
  opts = opts || {}
  var that = this
  this.subViews = []
  this.model = model
  this.parent = opts.parent
  this.view = opts.view
  this.mappers = this.constructor.mappers || {}

  var index = opts.index || false
  var scope
    , modelName = _(this.model.collectionName).singularize()
  if(this.parent) {
    scope = this.parent.view.scope.concat(modelName)
  } else {
    scope = [modelName]
  }
  
  if(!container && !this.constructor.templateUrl) {
    throw new Error("You need to provide a .template()")
  }
  this.container = container || $("#main")

  if(this.constructor.pageTitle) {
    window.document.title = this.constructor.pageTitle
  }
  init = { id: this.model.id } //If we have a template to use, use that
  if(this.constructor.templateUrl) {
    this.replace = true
    this.view = new LiveView(this.constructor.templateUrl, init, scope)
    // if the container is a jQuery thing
  } else if(this.container instanceof $) {
    this.view = new LiveView(this.container, init, scope) 
    // otherwise just use the contents of the container as the view
  } else {
    if(index !== false) {
      this.view = this.container.insert(init, index)
    } else {
      this.view = this.container.append(init)
    }
  }

  this.afterTemplateLoad() 

  if(this.model.modelType !== "collection") {
    _(this.model.keys()).each(function(key) {
      that.changeValue(key)
      that.model.on("change:" + key, function() {
        that.changeValue(key)
      }) 
    })
    _(this.model.assocs()).each(function(assoc) {
      that.loadImplicitSubView(assoc)
    })
  }
}

View.prototype.constructor = View

View.prototype.loadImplicitSubView = function(assoc) {
  //load these here since they're actually subclasses of View
  var ListView = require("./list_view")
    , FormView = require("./form_view")
  //get the element that we'll attach the subview to
  var assocContainers = this.view.getElementFromName(assoc)
    , assocModel = this.model.assoc(assoc)
    , that = this

   if(assocModel.modelType === "collection") {
     var updateCount = function(inserted, coll) {
       that.view.set(assoc + "Count", assocModel.length)
     }
     assocModel.on("insert", updateCount)
     assocModel.on("remove", updateCount)
     updateCount()
   }

  if(assocContainers.length) {
    assocContainers.each(function(index, element) {
      // check if the element is already a subview, 
      // i.e. someone explicitly defined it as one
      if(assocModel.modelType === "collection") {
        that.subViews.push(new ListView(assocModel, $(element), {parent: that}))
      } else if(element.tagName.toLowerCase() === "form") {
        that.subViews.push(new FormView(assocModel, $(element), {parent: that}))
      } else {
        that.subViews.push(new View(assocModel, $(element), {parent: that}))
      }
    })
  }
}

View.prototype.changeValue = function(key) {
  var that = this
    , mapper = this.mappers[key]
  if(mapper) { 
    mapper.call(this, key, this.model.get(key), function(k, v) {
      that.view.set(k, v)
    })
  } else {
    this.view.set(key, this.model.get(key)) 
  }
  window.changes++
}

View.prototype.afterTemplateLoad = function() {
  var that = this

  if(this.replace) {
    this.container.html(this.view.context)
  }

  this.setupSubViews() 

  if(this.constructor.closeSelector) {
    _(this.constructor.closeSelector).each(function(closeSelector) {
      eventSelector = closeSelector.split(" ", 2)
      $(eventSelector[1]).on(eventSelector[0], function() {
        that.view.context.remove()
      })
    })
  } 

  _(this.constructor.elementGetters || {}).each(function(callbacks, selector) {
    var element
    if(selector === "") {
      element = that.view.allContexts
    } else {
      element = that.view.find(selector)
    }
    _(callbacks).each(function(callback) {
      callback.call(that, element)
    })
  })
}

View.formName = function() {
  return _.uncapitalize(this.viewName).replace(/View$/, "")
} 

View.define = function(name, constructor) {
  var that = this
  var SubClass = constructor || function() {
    that.apply(this, arguments)
  }
    , ctor = function() {}
  _.extend(SubClass, this)

  ctor.prototype = this.prototype

  SubClass.prototype = new ctor
  SubClass.prototype.constructor = SubClass
  SubClass.prototype.__super__ = this.prototype
  SubClass.viewName = name

  return SubClass 
}  

View.prototype.setupSubViews = function() {
  var that = this
  _(that.constructor.subViews).each(function(options, selector) {
    var View = options.view
      , action = options.action
      , assoc = options.assoc
      , model = options.model || that.model
      , attachPointElement = $()
      , actions
      , actionsMatched

    attachPointElement = that.view.find(selector)

    if(assoc) {
      model = model.assoc(assoc)
    }

    if(action) {
      actionsMatched = false
      actions = action.split(",")

      _(actions).each(function(action) {
        action = action.split(" ", 2)
        var event = action[0]
        var elementSelector = action[1]  
        var element = $(elementSelector, that.view.context)
        if(element.length !== 0) {
          actionsMatched = true
        }
        attachPointElement.each(function(index, attach) {
          element.on(event, function() {
            that.subViews.push(new View(model, $(attach), {parent: that}))
          })
        })
      })
      if(!actionsMatched) {
        throw new Error("SubView attach event (action) selectors " + action + " did not match any elements")
      }
      
    } else {
      attachPointElement.each(function(index, element) {
        that.subViews.push(new View(model, $(element), {parent: that}))
      })
    }
  })
}

View.close = function(selector) {
  this.closeSelector = this.closeSelector || []
  this.closeSelector.push(selector)
  return this

}

View.template = function(template) {
  this.templateUrl = template
  return this
}
/**
 * Parse options objects for correctness, handy for debugging, but 
 * we should turn this off in production
 **/
parseOptions = function(options, defaultOptions, allowed) {
  options = options || {}
  _(options).each(function(val, key) {
    if(_(allowed).indexOf(key) === -1) {
      throw new Error("Unrecognized option " + key + ".")
    }
  })
  return _(options).defaults(defaultOptions)
}
/**
 * Adds a subview to the current view appended to selector
 *
 * The following options can be passed to subView:
 *   * assoc - the associated model to create the subview with
 *   * action - user action (an event plus a selector) which triggers the 
 *   view being appended
 *
 * @param {String} selector of element to which we append the view
 * @param {Constructor} subView to add
 * @param {Object} options for the subview
 */
View.subView = function(selector, view, opts) {
  opts = parseOptions(opts, {}, ["assoc", "action", "model"])
  var action = opts.action
  var assoc = opts.assoc
  var model = opts.model

  this.subViews = this.subViews || {}
  this.subViews[selector] = { action: action, view: view, assoc: assoc, model: model }
  return this
}

/** 
 * .element() method calls the callback with the element that matches
 * _selector_ when the view is loaded, if no selector is passed, then it
 * selects the view's root element.
 **/

View.element = function(selector, callback) {
  if(callback && !selector) {
    selector = ""
  }
  if(!callback && selector) {
    callback = selector 
    selector = ""
  }
  this.elementGetters = this.elementGetters || {}
  this.elementGetters[selector] = this.elementGetters[selector] || []
  this.elementGetters[selector].push(callback)
  return this
}

/** 
 * .action calls callback when action happens to selector, the first
 * parameter is "event selector"
 **/
View.action = function(actionSelector, callback) {
  var action = actionSelector.split(" ")
    , event = action[0]
    , selector = _(action).rest().join(" ")

  this.element(selector, function(el) {
    var that = this
    el.on(event, function(e) {
      callback.call(that, e, $(this))
    })
  })
  return this
}

View.map = function(keys, mapper) {
  var that = this
  if(!_.isArray(keys)) {
    keys = [keys]
  }
  _(keys).each(function(key) {
    that.mappers = that.mappers || {}
    that.mappers[key] = mapper
  })
  return this
}

View.title = function(title) {
  this.pageTitle = title
  return this
}
 
module.exports = View
