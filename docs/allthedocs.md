Welcome to SpaceMagic
=====================

  SpaceMagic is a full-stack javascript web development framework which allows
you to build fast, real-time web applications.  SpaceMagic allows you to write only
one app and share it between the client and the server.

What does SpaceMagic do for me?
-------------------------------

  * SpaceMagic's oodm (Observable Object Document Mapper), LiveDocument, spans
    the client and the server, allowing users to write database code once, and
    interact with it on both the server and the client.

  * LiveDocument automatically keeps clients notified of changes to any
    documents or collections of documents they query.  This makes writing
    real-time client updating code unnecesary.  The real-time just happens, all the
    time, everywhere.

  * SpaceMagic's templating layer, LiveView allows for truely logicless views.
    simply write your semantic HTML5 and it's already a template.

  * SpaceMagic's views automatically keep everything up-to-date with all of the
    incoming real-time changes.  However all updates are overrideable, giving
    you flexibility of when, what, and how everything get's updated.

  * SpaceMagic's assetPipeline provides minifying, cacheing, and compressing of
    static assets.  It also pushes updated versions of static assets when they
    change in development mode.  Saving you from constantly refreshing pages.

  * SpaceMagic provides a commonjs module loader on the client so you can reuse
    your own code between the client and the server.

Installation
============

```
mkdir my_project
cd my_project
npm install spacemagic
space-magic init my_project
```

Configure
---------

  You need to have mongodb installed, if you don't, go here
[http://www.mongodb.org/display/DOCS/Quickstart](MongoDB QuickStart Guide)

  If you're already running MongoDB on localhost on the default port, you're done.
But if you need to configure your database connection info goto the file:

```
vim config/database.js

```

Next Steps
==========

checkout our Basic Todo Tutorial
or the Chat Tutorial
or the Micro Blogging tutorial
or checkout the Guides
or dive into the API documentation

LiveView API Documentation 
==========================

###LiveView Constructor

#####LiveView(template, data, callback, scope)

Constructs a new live view from a template. The `template` may be a template
url, css selector, or html.  `data` refers to the data with which the live view
is initialized.  The `set` method is used to update the live view.  `scope` is
an array of strings that describes the scope, the elements over which the live
view can act, of the live view. If omitted, LiveView will assume the default
scope, "main."

###changeTemplate

#####LiveView.changeTemplate(template) 

Changes the template used by the live view to the one specified.

###find

#####LiveView.find(selector)

Returns elements of a certain type from polymorphic subviews.

###set

#####LiveView.set(name, value)

Sets the value or values of an element `name` to `value`.

###remove

#####LiveView.remove()

Removes the live view, as well as all associated events, from the document.

###detach

#####LiveView.detach()

Removes the live view from the document while leaving events intact.

###attach

#####LiveView.attach(element)

Attaches live view to a particular element.

###attach

#####LiveView.attach(container)

Attaches live view to a particular container.

###LiveViewCollection Constructor

#####LiveViewCollection(container, data, name, scope)

Constructs a new live view collection. Constructor requires a `container`
within the template to contain the view, `data`, a name for the collection, and
an optional `scope`.

###showLoading

#####LiveViewCollection.showLoading() 

Appends a special loading element to the end of the collection if one exists.

###hideLoading

#####LiveViewCollection.hideLoading()

Removes the special loading element from the collection.

###get

#####LiveViewCollection.get(id)

Returns the view at index `id`. If two arguments are used, function returns the
first element with data where key arg1 === arg2

###length

#####LiveViewCollection.length()

Returns the number of LiveViews in the collection.

###remove

#####LiveViewCollection.remove(id)

Removes a live view from the collection. Appends special empty view (if one is
defined) if last view is removed.

###removeAll

#####LiveViewCollection.removeAll()

Removes all live views from the collection, appends special empty view if one
exists.


###insert

#####LiveViewCollection.insert(document, index)

Inserts a new view at the `index` or, if no `index` is specified, the end of
the live view collection.  Returns a new live view when completed.

###append

#####LiveViewCollection.append(data)

Inserts each of an array of views into the live view collection.
LiveDocument Associations
============

  LiveDocument supports three types of associations
many, one, and belongsTo.

One
---

  A _one_ association defines a relationship where one document maps to one
other document.

```javascript
// app/models/user.js
module.exports = Document("User")
  .key("name") 
  .one("profile")
// app/models/profile.js
module.exports = Document("Profile")
  .key("jobTitle") 
  .one("user")
```

  To use this, you can just use the assoc method like this:

```javascript
var user = User.findOne(id)
var profile = user.assoc("profile")
```

  The associated document returned can be used just like any other
document and is not necessarily loaded.

Many
----

  A _many_ association defines a relationship where a one document has 0 or
more related documents.

  To define a _many_ association, you simply call the many method with the name
of the association.

```javascript
// app/models/blog_post.js
module.exports = Document("BlogPost")
  .key("title")
  .many("comments")
// app/models/comment.js
module.exports = Document("Comment")
  .key("body")
  .belongsTo("blogPost")
```

  Now to use the associations
```javascript
var post = BlogPost.findOne(id)
var comments = post.assoc("comments")
```
  This will find the model with the name Comment and return the comments with
a blogPostId equal to the blogPost's _id.  The comments can be interacted with
like any other collection.  So you can do things that won't happen until they're
loaded with the .loaded method.

  Many associations can also map to [embedded]() documents.

BelongsTo
---------

  The document with the belongsTo association is the document which actually has the
foreign key in it.  It can be used to access the document it belongs to exactly like
the other two associations.  Using the blog post example from above, we can access
the post to which a comment belongs like this:    

```javascript
var comment = Comment.findOne(id)
var post = comment.assoc("blogPost")
```
LiveDocument API
================

Document Definition Methods
---------------------------

  Model Definition Methods are the methods that you use to define the schema
and other properties of your documents.   These methods allow you to describe
keys on your documents, as well as validations and associations.

###key 

####Document.key(name, [properties])

  To add properties to your document, use the `key` method.  The `name` is a
`String` which describes a property that will exist in instances of this
`Document`.

```javascript
module.exports = Document("Post")
  .key("title")
  .key("body", {required: false})
```

The following are the optional properties of a key

  * `required`: Determines whether a user must set a value for this key in
order for the document to save.

  * `default`: The default value of this key if none is set.

You can also specify validations for a key.  To see a list of validations, and
how to make your own custom validations, see the
[validations](/validations.html) page.

###timestamps

####Document.timestamps()

  The `timestamps` method will give your document createdAt and updatedAt
timestamps.  The timestamps will be created and updated automatically.
The format of a timestamp is a unix timestamp, specifically the result
of calling `(new Date).getTime()`

To access the timestamps you can call [get("createdAt") or get("updatedAt")](/api.html#get)

```javascript
module.exports = Document("Post")
  //define the rest of your keys
  .timestamps()
``` 

###getKey

####Document.getKey(name, watchFields, valueFn)
  
  The `getKey` method defines a dynamic key, whose value is determined by the
return value of valueFn.

  A change event "change:name" will be called when any of the fields listed in
watchFields changes.

`valueFn`

###setKey

####Document.setKey(name, fn) 

  The setKey method allows you to define behavior when a key is set.

  The following example sets the first and last name property when
a user calls the `.set` method.


```javascript
module.exports = Document("Post")
  //define the rest of your keys
  .setKey("name", function(name) {
    name = name.split(" ")      
    this.set("first", name[0])
    this.set("last", name[1])
  })
```

Document Hook Methods
---------------------

  These methods registers a handler to be called before or after
some action is performed on a document.

In each of these methods, `fn` takes two arguments:

  * `instance` - The instance of the document

  * `done` - A function to call when your handler is finished.  If anything is
passed to done in a before filter, the document will not save and whatever was
passed to done will be emitted as the first argument to the `"error"` event.

```javascript
module.exports = Document("Post")
  .beforeSave(function(post, done) {
    post.isUnique("title", function(isUnique) {
      if(!isUnique) {
        done(new Error("title isn't unique"))
      } else {
        done()
      }
    })
  })
``` 
 
###beforeSave

####Document.beforeSave(fn) 

  This is called before updating or creating a document.  It is
called on the client and the server.

###serverBeforeSave

####Document.serverBeforeSave(fn)  

  This is called before updating or creating a document.  It is
called on the server.

###clientBeforeSave

####Document.clientBeforeSave(fn)  

  This is called before updating or creating a document.  It is
called on the client.

###beforeCreate

####Document.beforeCreate(fn) 

  This is called before creating a document on the both client and the server.

###serverBeforeCreate

####Document.serverBeforeCreate(fn)   

  This is called before creating a document on the the server.

###clientBeforeCreate

####Document.clientBeforeCreate(fn)   

  This is called before creating a document on the the client.

###afterSave

####Document.afterSave(fn) 

  This is called after creating or updating a document on the both client and the server.

###serverAfterSave

####Document.serverAfterSave(fn)   

  This is called after creating or updating a document on the server.
 
###afterRemove

####Document.afterRemove(fn) 

  This is called after removing a document on the client or server.

###serverAfterRemove

####Document.serverAfterRemove(fn)   

  This is called after removing a document on the server.

Associations
------------

  Associations provide a way to model relationships between your documents.
For example, `blogPosts` might have many `comments` and a `blogPost` might
belongTo an `author` or an `author` might have one `profile`.

  NOTE: A quick note about cyclic dependencies.  If two documents have each
other as associations, i.e. one belongs to another, then we need to do
the following:

```javascript

//comment.js
var Comment = Document("Comment")
  , Post = require("./post")

Comment
  .belongsTo(Post)

var Post = Document("Post")
  , Comment = require("./comment")

Post
  .many(Comment)
```

###many

####Document.many(associatedModel[, opts])

  A `many` association describes a one-to-many association between
documents.

  The `associatedModel` argument is the Document which we are associating.

```javascript
var Comment = require("./comment")

module.exports = Document("Post")
  .many(Comment)
```

Opts accepts the following options: 

  * `dependent` - Specifies whether the associated document should be
deleted when this document is deleted, defaults to `false`

  * `foreignKey` - The foreignKey on the associated document.  Defaults
to `documentNameId` (e.g. a comment with a post will have the key, postId) 

  * `as` - The name of the association, if you want to refer to a post's
comments as `messages`, you would pass `{ as: "message" }`.

  * `conditions` - An list of conditions the associated documents will be
queried with.

###one

####Document.one(associatedModel[, opts])

  A `one` association describes a one-to-one association between two
documents.

  associatedModel is the Document which we are associating.

```javascript
var Profile = require("./profile")

module.exports = Document("User")
  .one(Profile)
```

Opts accepts the following options: 

  * `dependent` - Specifies whether the associated document should be
deleted when this document is deleted, defaults to `false`

  * `foreignKey` - The foreignKey on the associated document.  Defaults
to `documentNameId` (e.g. an author with a profile will have the key, authorId) 

  * `as` - The name of the association, if you want to refer to a user's
profile as `bio`, you would pass `{ as: "bio" }`.
 
###belongsTo

####Document.belongsTo(associatedModel[, opts])

  A `belongsTo` association describes a one-to-one or one-to-many association
where the document belongs to (has the foriegn key of) another document.  For
example, `comments` belong to a `blogPost`, a `profile` belongs to a `user`.

  It specifies the reverse association of `one` and `many`.
 
```javascript
var Post = require("./post")
module.exports = Document("Comment")
  .belongsTo(Post)
```

Document Helper Methods
-----------------------

###find

####Document.find(query[, callback]) 

  The `find` method takes in a query and returns a `Collection`.
A query is simply a mongodb query object.

See [this page](http://www.mongodb.org/display/DOCS/Advanced+Queries) for more on queries.
 

  Here is an example that will find all posts with 100 or more votes.
```javascript
//post.js
module.exports = Document("Post")
  .key("votes")

var post = Post.find({votes: { $gt: 100 })
```
 
###findOne

####Document.findOne(id[, callback])  

  Find one takes in an _id, and finds a document with that id.  The document is
returned immediatly, however none of it's properties are actually set.  However
you can, and should, pass it to the view immediatly.  The document will fire
[events](/document-events) as it's state changes (i.e. when it loads, or

  If you do for some reason need to wait for the post to load first, you can

pass in a callback as the second argument to findOne, or pass a callback to the
`.load` method on the returned instance.  

```javascript
//post.js
module.exports = Document("Post")

//myCode.js
var Post = require("./post")

var post = Post.findOne("4f7580a64e822029b7000001") 
```

###findByKey

####Document.findByKey(key, value[, callback])   

Finds the document `key` equals `value`, there should
only be one document where `key` equals `value`. i.e. value
should be unique.

```javascript
//user.js
module.exports = Document("User")
  .key("email")

var user = User.findByKey("email", "x.coder.zach[At]gmail.com") 
``` 

This example finds a user by email address.

###create

####Document.create(document[, callback])

This is simply a utility method for the following:

```javascript
module.exports = Document("User")
  .key("name")
  .key("email")

var user = User.create({ name: "Zach", email: "x.coder.zach[At]gmail.com" })

//this is equivelent to 

var user = new User({ name: "Zach", email: "x.coder.zach[At]gmail.com" })
user.save()
```

Document Instance Methods
-----------------------
 
  Now that you've found or created document, and now you want to do things with it.

  You can Define your own instance methods like so:
```javascript
  //Every type of document will get this method
  Document.prototype.myMethod = function() {

  }

  //Just Posts will get this method
  Post.prototype.myMethod = function() {

  }
```
###constructor
####Document(jsonDocument[, options])

###set
####Document.prototype.set(properies[, options])
####Document.prototype.set(key, value[, options])


###get
####Document.prototype.get(key)

###assoc
####Document.prototype.get(name[, callback])

###keys
####Document.prototype.keys()

  Returns a list of the keys this document has.

###save
####Document.prototype.save([callback])

###remove
####Document.prototype.remove([callback])

###manyAssocs
####Document.prototype.manyAssocs()

  Returns a list of the many associations this document has.

```javascript
module.exports = Document("Post")
  .many("comments")


var post = new Post()
post.manyAssocs() // ["comments"]
``` 

###oneAssocs
####Document.prototype.oneAssocs()

  This is the names of one assocs, as well as belongsTo assocs, since they both
point to one document.

```javascript
module.exports = Document("Post")
  .one("thing")
  .belongsTo("author")


var post = new Post()
post.oneAssocs() // ["thing", "author"]
``` 

###assocs
####Document.prototype.assocs()
  Returns a list of the names of all associations for this document.

```javascript
module.exports = Document("Post")
  .many("comments")
  .belongsTo("author")


var post = new Post()
post.assocs() // ["comments", "author"]

```

###validate
####Document.prototype.validate([callback, opts])

  Forces the document to validate.  This method is called automatically
everytime a value is changed with .set().  This will emit `valid` or
`invalid` events.

```javascript
var post = new Post()
post.on("invalid", function() {

})
post.validate(function(post, invalidFields) {
                         
})

```

###validateField
####Document.prototype.validateField(field[, callback, opts])

###isUnique
####Document.prototype.isUnique(field, value, callback)

  Calls callback with `true` as the first argument if the field is
unique, otherwise it calls it with `false`

```javascript
  Post.isUnique("email", "x.coder.zach{At}gmail.com", function(isUnique) {
    isUnique //true if is unique, false otherwise.            
  })
```

Document Instance Events
------------------------

  There are a lot of events a document can emit as it's state changes.
Here's a list of all of them in one place, so you don't have to hunt around.

  The first argument for all event callbacks is the instance itself, all event
  handlers are bound to the instance.

### "saving"
 
  Emitted when the document starts saving.
  
### "saved"

  Emitted when the document finishes saving.

### "load"

  Emitted once the document has loaded.

### "change"

  Emitted when a field on the document changes.
  The second parameter is a list of fields that changed.

### "change:field"

  Emitted when field, `field`, on the document changes.
  The second parameter is the new value of the field,
  the third parameter is the old value.

### "delete"

  Emitted when the document is deleted.

### "notExist"

  Emitted when the document in the database that this document refers to
doesn't actually exist.

### "invalid"

  Emitted when a document becomes invalid, this happens as soon as set is
called with invalid data, in order to do responsive real-time error reporting.

### "invalid:field"

  Emitted when a field, `field` in the document becomes invalid, this happens
  as soon as set is called with invalid data, in order to do responsive
  real-time error reporting.

### "valid"
  
  Emitted when new data is validated and is in fact valid.

### "valid:field"

  Emitted when a particular field is validated and is in fact valid.

### "error"
 
  Emitted when there is an error with the document, right now this only
happens when an error is passed into the done method of after save.
LiveController API Documentation
================================

###Controller

#####LiveController.Controller(base, scope)

`base` is a string the URL over which the controller acts. (ex. "/posts")
`scope` is a function in which routes are defined.

###navigate

#####LiveController.navigate(url, opts)

Navigates to the specified `url`. 
`opts` determines whether the navigation is done through `refresh`
(document.location) or `push` (history.pushState, not supported on older
browsers). Optional. Defaults to `push`.


###get

#####scope.get(route, callback)

`route` is the route for a particular view. `callback` is the function in which
the view is created.

###before

#####scope.before(fn)

`fn` is run before the controller gets a route.

###after

#####scope.after(fn)

`fn` is run after the controller gets a route.
