var LiveView = require("../LiveView/lib/live_view")
  , LiveController = require("../LiveController/lib/live_controller")
  , parseForm = require("../parse_form") 
  , View = require("./view")
  , _ = require("underscore")

function FormView(model, container) {
  FormView.__super__.constructor.call(this, model, container)
  this.confirmed = {}
}

var ctor = function() {}
ctor.prototype = View.prototype

FormView.__super__ = View.prototype
FormView.prototype = new ctor

_.extend(FormView, View)

FormView.prototype.afterTemplateLoad = function(view) {
  if(view) {
    this.view = view
  }
  var that = this
  FormView.__super__.afterTemplateLoad.call(this)

  var formId = "#" + that.constructor.formName() + "Form"

  if(this.view.context.is(formId)) {
    this.form = this.view.context
  } else {
    this.form = $(formId, that.view.context)
  }

  _(this.model.constructor.keys).each(function(key) {
    $("input." + key, that.form).on("keyup change", function() {
      that.model.set(key, $(this).val()) 
    })
  })
  that.model.on("change", function(model, changedFields) {
    _(changedFields).each(function(field) {
      that.view.set(field, model.get(field))
    })
  })

  this.setupErrors()
  this.setupConfirmFields()

  if(this.constructor.shouldSaveOnChange) {
    this.form.find("input, select").on("change", function() {
      that.saveForm()
    })
  }
  this.form.submit(function(e) {
    if(e) {
      e.preventDefault()
    }
    that.saveForm()
  }) 
}

FormView.prototype.setupErrors = function() {
  var that = this
  _(this.constructor.errors).each(function(errorMessages, field) {
    that.model.on("invalid:" + field, function(model, errors) {
      that.view.set(field + "Error", errorMessages[errors[0]])
      $("input." + field, that.form).addClass("error")
    }) 

    that.model.on("valid:" + field, function() {
      that.view.set(field + "Error", "")
      $("input." + field, that.form).removeClass("error")
    })
  }) 
}

FormView.prototype.setupConfirmFields = function() {
  var that = this
  _(this.constructor.confirmFields).each(function(errorMessage, field) {
    $("." + field + "Confirm, input."+ field, that.form).keyup(function() {

      if($("." + field + "Confirm", that.form).val() === $("." + field, that.form).val()) {
        that.confirmed[field] = true
        $("input." + field + "Confirm", that.form).removeClass("error")
        that.view.set(field + "ConfirmError", "")
      } else {
        that.confirmed[field] = false
        $("input." + field + "Confirm", that.form).addClass("error")
        that.view.set(field + "ConfirmError", errorMessage)
      }
    })
  })  
}

FormView.prototype.saveForm = function(e) {
  var that = this
  parseForm(that.form, function(userData) {
    var modelName = _.uncapitalize(that.model.constructor.modelName)

    _.each(that.constructor.confirmFields, function(val, name) {
      delete userData[modelName][name + "Confirm"]
    })

    that.model.set(userData[modelName])
    that.model.validate(function(model, errs) {
      allConfirmed = true
      _.each(that.confirmed, function(confirmed) {
        allConfirmed = allConfirmed && confirmed
        console.log(errs)
      })
      if(!errs && allConfirmed) {
        if(that.constructor.beforeSaves) {
          _(that.constructor.beforeSaves).each(function(fn) {
            fn.call(that)
          })
        }
        that.model.save(function() {
          if(that.constructor.afterSaves) {
            _(that.constructor.afterSaves).each(function(fn) {
              fn.call(that)
            })
          }
        })
      }
    })
  })
}

FormView.formName = function() {
  return _.uncapitalize(this.viewName).replace(/View$/, "")
} 

FormView.error = function(name, properties) {
  this.errors = this.errors || {}
  this.errors[name] = properties
  return this
}

FormView.autoSave = function(timeout) {
  this.saveTimeout = timeout || 3000
  return this
}

FormView.confirmField = function(field, error) {
  this.confirmFields = this.confirmFields || {}
  this.confirmFields[field] = error
  return this
}

FormView.afterSave = function(fn) {
  this.afterSaves = this.afterSaves || []
  this.afterSaves.push(fn)
  return this
}

FormView.beforeSave = function(fn) {
  this.beforeSaves = this.beforeSaves || []
  this.beforeSaves.push(fn)
  return this
}

FormView.saveOnChange = function() {
  this.shouldSaveOnChange = true
  return this
}

module.exports = FormView
