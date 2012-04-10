Views API
=========

##View

###viewName

#####View.viewName()

Returns name of view.

###define

#####View.define(name [, constructor])

Defines new view class with name `name` and optional constructor `constructor`.

###template

#####View.template(template)

Loads a template into the view. `template` is a string containing the URL of the template.

###element

#####View.element(selector, callback)
#####View.element(callback)

When view is created, `callback` is called with first parameter element where element is the jQuery result of `selector`.

###action

#####View.action(actionSelector, callback)

`actionSelector` is a string containing an event followed by a selector. (e.g.
"click .close" or "keypress .nameField") `callback` is called when the action
is performed on the selector.

The first argument for callback is the event object, the second parameter is the element.

###title

#####View.title(title)

Changes the browser title to `title` when view is loaded.

###subView

#####View.subView(selector, view, opts)

Specifies a view class which will be loaded as a sub view with `selector` indicating the template.

##View Attributes

###this.model

Model that was passed into view.

###this.view

LiveView instance generated from template.

###this.parent

Parent view of the current view.

##SingleView

SingleView has all the methods of view but, in addition, binds all key in model to the view.

###map

#####SingleView.map(key, mapper)

When `key` is loaded or changes on the model, calls `mapper` with the key and the value associated with the key, then sets key in the view to the return value of mapper.
######TODO: make async.

##ListView

###beforeInsert

#####ListView.beforeInsert(fn)

Runs `fn` before a new item is added to the list.

`fn`'s arguments are: `model`, `view`, and `done`. Once `done` is called, `view` is appended to the DOM.

###beforeRemove

#####ListView.beforeRemove(fn)

Runs `fn` before a new item is removed from the list.

`fn`'s arguments are: `model`, `view`, and `done`. Once `done` is called, `view` is removed from the DOM.

###singleView

#####ListView.singleView(view)

`view` is the class to use for each view in the list.

##FormView

###beforeSave

#####FormView.beforeSave(fn)

Runs `fn` before form input is saved.

###afterSave

#####FormView.afterSave(fn)

Runs `fn` after form input is saved.

###saveOnChange

#####FormView.saveOnChange()

If called, this view will automatically save the model after any changes.

###error

#####FormView.error(field, errorMessages)

Displays an errorMessage when model invalidates the field `field`.

###autoSave

#####FormView.autoSave(timeout)

If called, this view will automatically save the model after `timeout` milliseconds without new changes.

