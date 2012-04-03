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
LiveDocument
============

  LiveDocument is a client and server side MongoDB object document mapper.  The
client and server components work seamlessly together to allow you to build
your app without having to write all of your model code twice.

Install
=======

```zsh
npm install LiveDocument
```

Requirements
============

  * Connect (or express)
  * AssetPipeline
  * Socket.io

Getting Started
===============

LiveDocument is still in alpha and hasn't been optimized for use
by itself, it requires the asset provider to serve it's assets
as well as the require function for module support.

Setting up the Server
=====================

  Here are the basics, without the asset Provider stuff
  On the server:

```javascript
var DocumentServer = require("live_document").Server
  , connect        = require("connect")
  , io             = require("socket.io")
  , paths          = require("paths")
  , app

app = connect()
app.use(DocumentServer())
app.listen(3000)

io.listen(app)

// Define the models that we want to serve

// The socket.io object
DocumentServer.socket(io)
```

Defining your Models
====================

  Define a model:
```javascript
// this should be the file /app/models/blog_post.js
var Document = require("live_document")

module.exports = Document("BlogPost")
  .key("title", { length: [3, 10], required: true })
  .key("description", { required: false })
  .key("content")
  .key("upvotes")
```
```coffeescript
Document = require "live_document"

class BlogPost extends Document
  @key "title", length: [3, 10], required: true
  @key "description", required: false
  @key "content"
  @key "upvotes"
```

  The key method defines the properties your document will have and any
[validations](./validations.html) for those properties.  You can also
describe any [associations](./associations.html) here too.

The Basics
==========

Creating Things
===============

```javascript
//path should be relative to your current file
var BlogPost = require("./app/models/blog_post")

var post = BlogPost.create({ title: "Space Magic is magic"
                           , description: "This Space Magic framework is totally boss bro."
                           , content: "So many words about how awesome this is.  SO MANY WORDS" })
```
```coffeescript
BlogPost = require "./app/models/blog_post"
post = BlogPost.create title: "SpaceMagic is magic"
                     , description: "This Space Magic framework is totally boss bro."
                     , content: "So many words about how awesome this is.  SO MANY WORDS"
```
  
  An important thing to note is that the post is populated and ready to go
right away.  The [id](./about_ids) is generated on the client, and the instance
is ready to be handed to your view right away.  This makes your app much more
responsive.  Also, since validation was handled client side, just assume that
everything is going to work out and notify the user of any errors later, if
they happen. [Read more about how ids work here](./about_ids)

Furthur reading:
[Great article by Alex MacCaw about async UIs](http://alexmaccaw.com/posts/async_ui)

Finding Things
==============

```javascript
//path should be relative to your current file
var BlogPost = require("./app/models/blog_post")

var popularPosts = BlogPost.find({ upvotes: $gt: 100 })
//once the posts load, log their titles

popularPosts.loaded.each(function(post) { 
  console.log(post.get("title")) 
}) 
```
```coffeescript
# path should be relative to your current file
BlogPost = require "./app/models/blog_post"

popularPosts = BlogPost.find upvotes: { $gt: 100 }

popularPosts.loaded.each (post) ->
  console.log post.get("title")
```

  The [find method](./collections.html#find) returns a
[collection](./collections.html) of documents based on your
[query](./collections.html#query).  The collection returned is ready to be
passed to a view, but will in many cases be empty.  Unless the contents have
already been retrieved or we have a cache of the documents.

  You can use the method [collection.loaded](./collections.html#loaded) which
will not be invoked until the method has loaded, if the method was already
loaded it will be invoked immediately, loaded can also take a function, that
will execute once the collection loads, or fire immediately if the collection
has already loaded.  

  All of the underscore collection methods are also available on the collection
and on collection.loaded.

Further Reading
[Collection Events](./collections.html#events)
[Collection Methods](./collections.html#methods)

Finding One Thing
=================

```javascript
var BlogPost = require("./app/models/blog_post")

var postByTitle = BlogPost.findOne({title: "SpaceMagic is magic"})
var postById    = BlogPost.findOne(id)
```

  Now we have a thing, again, we should use this object right away, and display
anything we have as soon as possible, rather than waiting for the post to load
before setting up the view.  

Further reading:
[Document Events](./documents.html#events)
[Document Methods](./documents.html#methods)

Updating Things
===============

```javascript
var BlogPost = require("./app/models/blog_post")

var post = BlogPost.findOne(id)
post.set({ title: "The new title for this blog post" })
post.save()
``` 

  Pretty simple, you can set any of the keys defined in your model, and then
the save method persists the changes to the database.  The "saving" event is
fired when the document starts saving and "saved" is fired when it is complete.

Deleting Things
===============

```javascript
var BlogPost = require("./app/models/blog_post")

var post = BlogPost.findOne(id)
post.destroy()
``` 

  Thats all it takes to delete something.  It fires the "destroying" event
when it starts deleting and the "destroyed" event when it completes.  

Real-Time
=========

  Enough with the boring object document mapping stuff lets make our app 
real-time.

  I'll break all the code into two sections, client 1 and client 2.  Clients 
1 and 2 could be on the same page, in two different tabs in the same browser,
in two different browsers on the same computer, or on two seperate computers.
It doesn't really matter.  

Real-Time Collections
=====================

```javascript
//client 1 finds all of the blog posts
var posts = BlogPost.find({upvotes: { $gt:10 }})

posts.on("insert", function(post) {
  console.log("inserted: " + post.get("title")) 
})

posts.on("remove", function(post) {
  console.log("removed: " + post.get("title")) 
})
//client 2
var post1 = BlogPost.create({ title: "A new blog post"
                            , content: "post content" 
                            , upvotes: 9 })

var post2 = BlogPost.create({ title: "A blog post with 11 upvotes"
                            , content: "post content" 
                            , upvotes: 11 })
```
  Client 1 will log "inserted: A blog post with 11 updates" but will not log "inserted: A new blog
post" since it las less than 10 upvotes.

  Going off the previous example
```javascript
//client 2
post1.set({upvotes: 100})
post2.set({upvotes: 9})
```

  If we give post one more upvotes and give post two some downvotes client 1
will log the following:

  "inserted: A new blog post"
  "removed: A blog post with 11 upvotes"

since post2 no longer fits the criterion client 1 is interested in

Real-Time Documents
===================

  Lets assume we have a blog post in the database with the title "A Title"
```javascript
//client 1
var post = BlogPost.find({title: "A title"})
post.on("change", function(post, changedFields) {
  _(changedFields).each(function(field) {
    console.log(field + " changed to: " + post.get(field))
  })
})
//client 2
var post = BlogPost.find({title: "A title"})
post.set({description: "describe"})
post.save()
```

  This will log "description changed to: describe" on client 1.  If two users
update the same property at the same time, the last one will overwrite the
other.  It's possible that they will momentarily have inconsistant states, but
eventually a message will be broadcast to all users who are currently
"interested" in the document what the final state is, and the clients will
converge.  

  For many things this behavior will work just fine.  However, if you do not
want updates to just overwrite, you should read the section on
[collaboration](./collaboration.html).

  If we were to delete either of the posts a "destroyed" event would be fired.

Further reading;
[collaboration](./collaboration.html)
Associations
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
Live Controller v0.0.1
======================

Table of Contents
-----------------
  * [Introduction](#introduction)
  * [API docs](#api)
  * [Experimental API docs](#experimental)
  * [Examples](#examples)
  * [Tests](#tests)
  * [Contributing](#contributing)
  * [Contributors](#contributors)
  * [License](#license)

<a name="introduction"></a>

Introduction
------------

Live Controller is a tiny, client-side router that uses window.pushState and falls back to regular page refreshes when pushState is not available.

<a name="api"></a>

API docs
--------

You can find the API docs in the docs folder.

<a name="experimental"></a>

Experimental API docs
---------------------

Expelrimental API docs will be made available when any part of the project isn't experimental.

<a name="examples"></a>

Examples
--------

###Here's an example

  var controller = new Controller("/things", function(thing) {

    thing.get(function(params) {

    }) 

    thing.get("/:id", function(params) {

    }) 

    thing.delete("/:id", function(params) {

    })

    thing.put("/:id", function(params) {

    })

    thing.post(function(params) {

    })

  }) 

###And here's how you send invoke them

  Controller.get("/things")

  Controller.get("/things/12")

  Controller.delete("/things/42")

  Controller.put("/things/42", {"title: "w00t"})

  Controller.post("/things", {"title: "w00t"})

Contributing
------------

Ideas, feature requests, bug reports, etc are very welcome.

### TODO before releasing this,
  * Can we use something better by someone else?
  * Get rid of http verbs, they dumb
  * fallback for shitty browsers with #!

<a name="contributors"></a>

Contributors
------------

  * Zach Smith @xcoderzach
  * Eugene Butler @EButlerIV

<a name = "license"></a>
 
License
-------

MIT Licensed (see LICENSE.txt)
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
LiveDocument
============

  LiveDocument is a client and server side MongoDB object document mapper.  The
client and server components work seamlessly together to allow you to build
your app without having to write all of your model code twice.

Install
=======

```zsh
npm install LiveDocument
```

Requirements
============

  * Connect (or express)
  * AssetPipeline
  * Socket.io

Getting Started
===============

LiveDocument is still in alpha and hasn't been optimized for use
by itself, it requires the asset provider to serve it's assets
as well as the require function for module support.

Setting up the Server
=====================

  Here are the basics, without the asset Provider stuff
  On the server:

```javascript
var DocumentServer = require("live_document").Server
  , connect        = require("connect")
  , io             = require("socket.io")
  , paths          = require("paths")
  , app

app = connect()
app.use(DocumentServer())
app.listen(3000)

io.listen(app)

// Define the models that we want to serve

// The socket.io object
DocumentServer.socket(io)
```

Defining your Models
====================

  Define a model:
```javascript
// this should be the file /app/models/blog_post.js
var Document = require("live_document")

module.exports = Document("BlogPost")
  .key("title", { length: [3, 10], required: true })
  .key("description", { required: false })
  .key("content")
  .key("upvotes")
```
```coffeescript
Document = require "live_document"

class BlogPost extends Document
  @key "title", length: [3, 10], required: true
  @key "description", required: false
  @key "content"
  @key "upvotes"
```

  The key method defines the properties your document will have and any
[validations](./validations.html) for those properties.  You can also
describe any [associations](./associations.html) here too.

The Basics
==========

Creating Things
===============

```javascript
//path should be relative to your current file
var BlogPost = require("./app/models/blog_post")

var post = BlogPost.create({ title: "Space Magic is magic"
                           , description: "This Space Magic framework is totally boss bro."
                           , content: "So many words about how awesome this is.  SO MANY WORDS" })
```
```coffeescript
BlogPost = require "./app/models/blog_post"
post = BlogPost.create title: "SpaceMagic is magic"
                     , description: "This Space Magic framework is totally boss bro."
                     , content: "So many words about how awesome this is.  SO MANY WORDS"
```
  
  An important thing to note is that the post is populated and ready to go
right away.  The [id](./about_ids) is generated on the client, and the instance
is ready to be handed to your view right away.  This makes your app much more
responsive.  Also, since validation was handled client side, just assume that
everything is going to work out and notify the user of any errors later, if
they happen. [Read more about how ids work here](./about_ids)

Furthur reading:
[Great article by Alex MacCaw about async UIs](http://alexmaccaw.com/posts/async_ui)

Finding Things
==============

```javascript
//path should be relative to your current file
var BlogPost = require("./app/models/blog_post")

var popularPosts = BlogPost.find({ upvotes: $gt: 100 })
//once the posts load, log their titles

popularPosts.loaded.each(function(post) { 
  console.log(post.get("title")) 
}) 
```
```coffeescript
# path should be relative to your current file
BlogPost = require "./app/models/blog_post"

popularPosts = BlogPost.find upvotes: { $gt: 100 }

popularPosts.loaded.each (post) ->
  console.log post.get("title")
```

  The [find method](./collections.html#find) returns a
[collection](./collections.html) of documents based on your
[query](./collections.html#query).  The collection returned is ready to be
passed to a view, but will in many cases be empty.  Unless the contents have
already been retrieved or we have a cache of the documents.

  You can use the method [collection.loaded](./collections.html#loaded) which
will not be invoked until the method has loaded, if the method was already
loaded it will be invoked immediately, loaded can also take a function, that
will execute once the collection loads, or fire immediately if the collection
has already loaded.  

  All of the underscore collection methods are also available on the collection
and on collection.loaded.

Further Reading
[Collection Events](./collections.html#events)
[Collection Methods](./collections.html#methods)

Finding One Thing
=================

```javascript
var BlogPost = require("./app/models/blog_post")

var postByTitle = BlogPost.findOne({title: "SpaceMagic is magic"})
var postById    = BlogPost.findOne(id)
```

  Now we have a thing, again, we should use this object right away, and display
anything we have as soon as possible, rather than waiting for the post to load
before setting up the view.  

Further reading:
[Document Events](./documents.html#events)
[Document Methods](./documents.html#methods)

Updating Things
===============

```javascript
var BlogPost = require("./app/models/blog_post")

var post = BlogPost.findOne(id)
post.set({ title: "The new title for this blog post" })
post.save()
``` 

  Pretty simple, you can set any of the keys defined in your model, and then
the save method persists the changes to the database.  The "saving" event is
fired when the document starts saving and "saved" is fired when it is complete.

Deleting Things
===============

```javascript
var BlogPost = require("./app/models/blog_post")

var post = BlogPost.findOne(id)
post.destroy()
``` 

  Thats all it takes to delete something.  It fires the "destroying" event
when it starts deleting and the "destroyed" event when it completes.  

Real-Time
=========

  Enough with the boring object document mapping stuff lets make our app 
real-time.

  I'll break all the code into two sections, client 1 and client 2.  Clients 
1 and 2 could be on the same page, in two different tabs in the same browser,
in two different browsers on the same computer, or on two seperate computers.
It doesn't really matter.  

Real-Time Collections
=====================

```javascript
//client 1 finds all of the blog posts
var posts = BlogPost.find({upvotes: { $gt:10 }})

posts.on("insert", function(post) {
  console.log("inserted: " + post.get("title")) 
})

posts.on("remove", function(post) {
  console.log("removed: " + post.get("title")) 
})
//client 2
var post1 = BlogPost.create({ title: "A new blog post"
                            , content: "post content" 
                            , upvotes: 9 })

var post2 = BlogPost.create({ title: "A blog post with 11 upvotes"
                            , content: "post content" 
                            , upvotes: 11 })
```
  Client 1 will log "inserted: A blog post with 11 updates" but will not log "inserted: A new blog
post" since it las less than 10 upvotes.

  Going off the previous example
```javascript
//client 2
post1.set({upvotes: 100})
post2.set({upvotes: 9})
```

  If we give post one more upvotes and give post two some downvotes client 1
will log the following:

  "inserted: A new blog post"
  "removed: A blog post with 11 upvotes"

since post2 no longer fits the criterion client 1 is interested in

Real-Time Documents
===================

  Lets assume we have a blog post in the database with the title "A Title"
```javascript
//client 1
var post = BlogPost.find({title: "A title"})
post.on("change", function(post, changedFields) {
  _(changedFields).each(function(field) {
    console.log(field + " changed to: " + post.get(field))
  })
})
//client 2
var post = BlogPost.find({title: "A title"})
post.set({description: "describe"})
post.save()
```

  This will log "description changed to: describe" on client 1.  If two users
update the same property at the same time, the last one will overwrite the
other.  It's possible that they will momentarily have inconsistant states, but
eventually a message will be broadcast to all users who are currently
"interested" in the document what the final state is, and the clients will
converge.  

  For many things this behavior will work just fine.  However, if you do not
want updates to just overwrite, you should read the section on
[collaboration](./collaboration.html).

  If we were to delete either of the posts a "destroyed" event would be fired.

Further reading;
[collaboration](./collaboration.html)
Associations
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
Live Controller v0.0.1
======================

Table of Contents
-----------------
  * [Introduction](#introduction)
  * [API docs](#api)
  * [Experimental API docs](#experimental)
  * [Examples](#examples)
  * [Tests](#tests)
  * [Contributing](#contributing)
  * [Contributors](#contributors)
  * [License](#license)

<a name="introduction"></a>

Introduction
------------

Live Controller is a tiny, client-side router that uses window.pushState and falls back to regular page refreshes when pushState is not available.

<a name="api"></a>

API docs
--------

You can find the API docs in the docs folder.

<a name="experimental"></a>

Experimental API docs
---------------------

Expelrimental API docs will be made available when any part of the project isn't experimental.

<a name="examples"></a>

Examples
--------

###Here's an example

  var controller = new Controller("/things", function(thing) {

    thing.get(function(params) {

    }) 

    thing.get("/:id", function(params) {

    }) 

    thing.delete("/:id", function(params) {

    })

    thing.put("/:id", function(params) {

    })

    thing.post(function(params) {

    })

  }) 

###And here's how you send invoke them

  Controller.get("/things")

  Controller.get("/things/12")

  Controller.delete("/things/42")

  Controller.put("/things/42", {"title: "w00t"})

  Controller.post("/things", {"title: "w00t"})

Contributing
------------

Ideas, feature requests, bug reports, etc are very welcome.

### TODO before releasing this,
  * Can we use something better by someone else?
  * Get rid of http verbs, they dumb
  * fallback for shitty browsers with #!

<a name="contributors"></a>

Contributors
------------

  * Zach Smith @xcoderzach
  * Eugene Butler @EButlerIV

<a name = "license"></a>
 
License
-------

MIT Licensed (see LICENSE.txt)
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
LiveDocument
============

  LiveDocument is a client and server side MongoDB object document mapper.  The
client and server components work seamlessly together to allow you to build
your app without having to write all of your model code twice.

Install
=======

```zsh
npm install LiveDocument
```

Requirements
============

  * Connect (or express)
  * AssetPipeline
  * Socket.io

Getting Started
===============

LiveDocument is still in alpha and hasn't been optimized for use
by itself, it requires the asset provider to serve it's assets
as well as the require function for module support.

Setting up the Server
=====================

  Here are the basics, without the asset Provider stuff
  On the server:

```javascript
var DocumentServer = require("live_document").Server
  , connect        = require("connect")
  , io             = require("socket.io")
  , paths          = require("paths")
  , app

app = connect()
app.use(DocumentServer())
app.listen(3000)

io.listen(app)

// Define the models that we want to serve

// The socket.io object
DocumentServer.socket(io)
```

Defining your Models
====================

  Define a model:
```javascript
// this should be the file /app/models/blog_post.js
var Document = require("live_document")

module.exports = Document("BlogPost")
  .key("title", { length: [3, 10], required: true })
  .key("description", { required: false })
  .key("content")
  .key("upvotes")
```
```coffeescript
Document = require "live_document"

class BlogPost extends Document
  @key "title", length: [3, 10], required: true
  @key "description", required: false
  @key "content"
  @key "upvotes"
```

  The key method defines the properties your document will have and any
[validations](./validations.html) for those properties.  You can also
describe any [associations](./associations.html) here too.

The Basics
==========

Creating Things
===============

```javascript
//path should be relative to your current file
var BlogPost = require("./app/models/blog_post")

var post = BlogPost.create({ title: "Space Magic is magic"
                           , description: "This Space Magic framework is totally boss bro."
                           , content: "So many words about how awesome this is.  SO MANY WORDS" })
```
```coffeescript
BlogPost = require "./app/models/blog_post"
post = BlogPost.create title: "SpaceMagic is magic"
                     , description: "This Space Magic framework is totally boss bro."
                     , content: "So many words about how awesome this is.  SO MANY WORDS"
```
  
  An important thing to note is that the post is populated and ready to go
right away.  The [id](./about_ids) is generated on the client, and the instance
is ready to be handed to your view right away.  This makes your app much more
responsive.  Also, since validation was handled client side, just assume that
everything is going to work out and notify the user of any errors later, if
they happen. [Read more about how ids work here](./about_ids)

Furthur reading:
[Great article by Alex MacCaw about async UIs](http://alexmaccaw.com/posts/async_ui)

Finding Things
==============

```javascript
//path should be relative to your current file
var BlogPost = require("./app/models/blog_post")

var popularPosts = BlogPost.find({ upvotes: $gt: 100 })
//once the posts load, log their titles

popularPosts.loaded.each(function(post) { 
  console.log(post.get("title")) 
}) 
```
```coffeescript
# path should be relative to your current file
BlogPost = require "./app/models/blog_post"

popularPosts = BlogPost.find upvotes: { $gt: 100 }

popularPosts.loaded.each (post) ->
  console.log post.get("title")
```

  The [find method](./collections.html#find) returns a
[collection](./collections.html) of documents based on your
[query](./collections.html#query).  The collection returned is ready to be
passed to a view, but will in many cases be empty.  Unless the contents have
already been retrieved or we have a cache of the documents.

  You can use the method [collection.loaded](./collections.html#loaded) which
will not be invoked until the method has loaded, if the method was already
loaded it will be invoked immediately, loaded can also take a function, that
will execute once the collection loads, or fire immediately if the collection
has already loaded.  

  All of the underscore collection methods are also available on the collection
and on collection.loaded.

Further Reading
[Collection Events](./collections.html#events)
[Collection Methods](./collections.html#methods)

Finding One Thing
=================

```javascript
var BlogPost = require("./app/models/blog_post")

var postByTitle = BlogPost.findOne({title: "SpaceMagic is magic"})
var postById    = BlogPost.findOne(id)
```

  Now we have a thing, again, we should use this object right away, and display
anything we have as soon as possible, rather than waiting for the post to load
before setting up the view.  

Further reading:
[Document Events](./documents.html#events)
[Document Methods](./documents.html#methods)

Updating Things
===============

```javascript
var BlogPost = require("./app/models/blog_post")

var post = BlogPost.findOne(id)
post.set({ title: "The new title for this blog post" })
post.save()
``` 

  Pretty simple, you can set any of the keys defined in your model, and then
the save method persists the changes to the database.  The "saving" event is
fired when the document starts saving and "saved" is fired when it is complete.

Deleting Things
===============

```javascript
var BlogPost = require("./app/models/blog_post")

var post = BlogPost.findOne(id)
post.destroy()
``` 

  Thats all it takes to delete something.  It fires the "destroying" event
when it starts deleting and the "destroyed" event when it completes.  

Real-Time
=========

  Enough with the boring object document mapping stuff lets make our app 
real-time.

  I'll break all the code into two sections, client 1 and client 2.  Clients 
1 and 2 could be on the same page, in two different tabs in the same browser,
in two different browsers on the same computer, or on two seperate computers.
It doesn't really matter.  

Real-Time Collections
=====================

```javascript
//client 1 finds all of the blog posts
var posts = BlogPost.find({upvotes: { $gt:10 }})

posts.on("insert", function(post) {
  console.log("inserted: " + post.get("title")) 
})

posts.on("remove", function(post) {
  console.log("removed: " + post.get("title")) 
})
//client 2
var post1 = BlogPost.create({ title: "A new blog post"
                            , content: "post content" 
                            , upvotes: 9 })

var post2 = BlogPost.create({ title: "A blog post with 11 upvotes"
                            , content: "post content" 
                            , upvotes: 11 })
```
  Client 1 will log "inserted: A blog post with 11 updates" but will not log "inserted: A new blog
post" since it las less than 10 upvotes.

  Going off the previous example
```javascript
//client 2
post1.set({upvotes: 100})
post2.set({upvotes: 9})
```

  If we give post one more upvotes and give post two some downvotes client 1
will log the following:

  "inserted: A new blog post"
  "removed: A blog post with 11 upvotes"

since post2 no longer fits the criterion client 1 is interested in

Real-Time Documents
===================

  Lets assume we have a blog post in the database with the title "A Title"
```javascript
//client 1
var post = BlogPost.find({title: "A title"})
post.on("change", function(post, changedFields) {
  _(changedFields).each(function(field) {
    console.log(field + " changed to: " + post.get(field))
  })
})
//client 2
var post = BlogPost.find({title: "A title"})
post.set({description: "describe"})
post.save()
```

  This will log "description changed to: describe" on client 1.  If two users
update the same property at the same time, the last one will overwrite the
other.  It's possible that they will momentarily have inconsistant states, but
eventually a message will be broadcast to all users who are currently
"interested" in the document what the final state is, and the clients will
converge.  

  For many things this behavior will work just fine.  However, if you do not
want updates to just overwrite, you should read the section on
[collaboration](./collaboration.html).

  If we were to delete either of the posts a "destroyed" event would be fired.

Further reading;
[collaboration](./collaboration.html)
Associations
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
Live Controller v0.0.1
======================

Table of Contents
-----------------
  * [Introduction](#introduction)
  * [API docs](#api)
  * [Experimental API docs](#experimental)
  * [Examples](#examples)
  * [Tests](#tests)
  * [Contributing](#contributing)
  * [Contributors](#contributors)
  * [License](#license)

<a name="introduction"></a>

Introduction
------------

Live Controller is a tiny, client-side router that uses window.pushState and falls back to regular page refreshes when pushState is not available.

<a name="api"></a>

API docs
--------

You can find the API docs in the docs folder.

<a name="experimental"></a>

Experimental API docs
---------------------

Expelrimental API docs will be made available when any part of the project isn't experimental.

<a name="examples"></a>

Examples
--------

###Here's an example

  var controller = new Controller("/things", function(thing) {

    thing.get(function(params) {

    }) 

    thing.get("/:id", function(params) {

    }) 

    thing.delete("/:id", function(params) {

    })

    thing.put("/:id", function(params) {

    })

    thing.post(function(params) {

    })

  }) 

###And here's how you send invoke them

  Controller.get("/things")

  Controller.get("/things/12")

  Controller.delete("/things/42")

  Controller.put("/things/42", {"title: "w00t"})

  Controller.post("/things", {"title: "w00t"})

Contributing
------------

Ideas, feature requests, bug reports, etc are very welcome.

### TODO before releasing this,
  * Can we use something better by someone else?
  * Get rid of http verbs, they dumb
  * fallback for shitty browsers with #!

<a name="contributors"></a>

Contributors
------------

  * Zach Smith @xcoderzach
  * Eugene Butler @EButlerIV

<a name = "license"></a>
 
License
-------

MIT Licensed (see LICENSE.txt)
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
LiveDocument
============

  LiveDocument is a client and server side MongoDB object document mapper.  The
client and server components work seamlessly together to allow you to build
your app without having to write all of your model code twice.

Install
=======

```zsh
npm install LiveDocument
```

Requirements
============

  * Connect (or express)
  * AssetPipeline
  * Socket.io

Getting Started
===============

LiveDocument is still in alpha and hasn't been optimized for use
by itself, it requires the asset provider to serve it's assets
as well as the require function for module support.

Setting up the Server
=====================

  Here are the basics, without the asset Provider stuff
  On the server:

```javascript
var DocumentServer = require("live_document").Server
  , connect        = require("connect")
  , io             = require("socket.io")
  , paths          = require("paths")
  , app

app = connect()
app.use(DocumentServer())
app.listen(3000)

io.listen(app)

// Define the models that we want to serve

// The socket.io object
DocumentServer.socket(io)
```

Defining your Models
====================

  Define a model:
```javascript
// this should be the file /app/models/blog_post.js
var Document = require("live_document")

module.exports = Document("BlogPost")
  .key("title", { length: [3, 10], required: true })
  .key("description", { required: false })
  .key("content")
  .key("upvotes")
```
```coffeescript
Document = require "live_document"

class BlogPost extends Document
  @key "title", length: [3, 10], required: true
  @key "description", required: false
  @key "content"
  @key "upvotes"
```

  The key method defines the properties your document will have and any
[validations](./validations.html) for those properties.  You can also
describe any [associations](./associations.html) here too.

The Basics
==========

Creating Things
===============

```javascript
//path should be relative to your current file
var BlogPost = require("./app/models/blog_post")

var post = BlogPost.create({ title: "Space Magic is magic"
                           , description: "This Space Magic framework is totally boss bro."
                           , content: "So many words about how awesome this is.  SO MANY WORDS" })
```
```coffeescript
BlogPost = require "./app/models/blog_post"
post = BlogPost.create title: "SpaceMagic is magic"
                     , description: "This Space Magic framework is totally boss bro."
                     , content: "So many words about how awesome this is.  SO MANY WORDS"
```
  
  An important thing to note is that the post is populated and ready to go
right away.  The [id](./about_ids) is generated on the client, and the instance
is ready to be handed to your view right away.  This makes your app much more
responsive.  Also, since validation was handled client side, just assume that
everything is going to work out and notify the user of any errors later, if
they happen. [Read more about how ids work here](./about_ids)

Furthur reading:
[Great article by Alex MacCaw about async UIs](http://alexmaccaw.com/posts/async_ui)

Finding Things
==============

```javascript
//path should be relative to your current file
var BlogPost = require("./app/models/blog_post")

var popularPosts = BlogPost.find({ upvotes: $gt: 100 })
//once the posts load, log their titles

popularPosts.loaded.each(function(post) { 
  console.log(post.get("title")) 
}) 
```
```coffeescript
# path should be relative to your current file
BlogPost = require "./app/models/blog_post"

popularPosts = BlogPost.find upvotes: { $gt: 100 }

popularPosts.loaded.each (post) ->
  console.log post.get("title")
```

  The [find method](./collections.html#find) returns a
[collection](./collections.html) of documents based on your
[query](./collections.html#query).  The collection returned is ready to be
passed to a view, but will in many cases be empty.  Unless the contents have
already been retrieved or we have a cache of the documents.

  You can use the method [collection.loaded](./collections.html#loaded) which
will not be invoked until the method has loaded, if the method was already
loaded it will be invoked immediately, loaded can also take a function, that
will execute once the collection loads, or fire immediately if the collection
has already loaded.  

  All of the underscore collection methods are also available on the collection
and on collection.loaded.

Further Reading
[Collection Events](./collections.html#events)
[Collection Methods](./collections.html#methods)

Finding One Thing
=================

```javascript
var BlogPost = require("./app/models/blog_post")

var postByTitle = BlogPost.findOne({title: "SpaceMagic is magic"})
var postById    = BlogPost.findOne(id)
```

  Now we have a thing, again, we should use this object right away, and display
anything we have as soon as possible, rather than waiting for the post to load
before setting up the view.  

Further reading:
[Document Events](./documents.html#events)
[Document Methods](./documents.html#methods)

Updating Things
===============

```javascript
var BlogPost = require("./app/models/blog_post")

var post = BlogPost.findOne(id)
post.set({ title: "The new title for this blog post" })
post.save()
``` 

  Pretty simple, you can set any of the keys defined in your model, and then
the save method persists the changes to the database.  The "saving" event is
fired when the document starts saving and "saved" is fired when it is complete.

Deleting Things
===============

```javascript
var BlogPost = require("./app/models/blog_post")

var post = BlogPost.findOne(id)
post.destroy()
``` 

  Thats all it takes to delete something.  It fires the "destroying" event
when it starts deleting and the "destroyed" event when it completes.  

Real-Time
=========

  Enough with the boring object document mapping stuff lets make our app 
real-time.

  I'll break all the code into two sections, client 1 and client 2.  Clients 
1 and 2 could be on the same page, in two different tabs in the same browser,
in two different browsers on the same computer, or on two seperate computers.
It doesn't really matter.  

Real-Time Collections
=====================

```javascript
//client 1 finds all of the blog posts
var posts = BlogPost.find({upvotes: { $gt:10 }})

posts.on("insert", function(post) {
  console.log("inserted: " + post.get("title")) 
})

posts.on("remove", function(post) {
  console.log("removed: " + post.get("title")) 
})
//client 2
var post1 = BlogPost.create({ title: "A new blog post"
                            , content: "post content" 
                            , upvotes: 9 })

var post2 = BlogPost.create({ title: "A blog post with 11 upvotes"
                            , content: "post content" 
                            , upvotes: 11 })
```
  Client 1 will log "inserted: A blog post with 11 updates" but will not log "inserted: A new blog
post" since it las less than 10 upvotes.

  Going off the previous example
```javascript
//client 2
post1.set({upvotes: 100})
post2.set({upvotes: 9})
```

  If we give post one more upvotes and give post two some downvotes client 1
will log the following:

  "inserted: A new blog post"
  "removed: A blog post with 11 upvotes"

since post2 no longer fits the criterion client 1 is interested in

Real-Time Documents
===================

  Lets assume we have a blog post in the database with the title "A Title"
```javascript
//client 1
var post = BlogPost.find({title: "A title"})
post.on("change", function(post, changedFields) {
  _(changedFields).each(function(field) {
    console.log(field + " changed to: " + post.get(field))
  })
})
//client 2
var post = BlogPost.find({title: "A title"})
post.set({description: "describe"})
post.save()
```

  This will log "description changed to: describe" on client 1.  If two users
update the same property at the same time, the last one will overwrite the
other.  It's possible that they will momentarily have inconsistant states, but
eventually a message will be broadcast to all users who are currently
"interested" in the document what the final state is, and the clients will
converge.  

  For many things this behavior will work just fine.  However, if you do not
want updates to just overwrite, you should read the section on
[collaboration](./collaboration.html).

  If we were to delete either of the posts a "destroyed" event would be fired.

Further reading;
[collaboration](./collaboration.html)
Associations
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
Live Controller v0.0.1
======================

Table of Contents
-----------------
  * [Introduction](#introduction)
  * [API docs](#api)
  * [Experimental API docs](#experimental)
  * [Examples](#examples)
  * [Tests](#tests)
  * [Contributing](#contributing)
  * [Contributors](#contributors)
  * [License](#license)

<a name="introduction"></a>

Introduction
------------

Live Controller is a tiny, client-side router that uses window.pushState and falls back to regular page refreshes when pushState is not available.

<a name="api"></a>

API docs
--------

You can find the API docs in the docs folder.

<a name="experimental"></a>

Experimental API docs
---------------------

Expelrimental API docs will be made available when any part of the project isn't experimental.

<a name="examples"></a>

Examples
--------

###Here's an example

  var controller = new Controller("/things", function(thing) {

    thing.get(function(params) {

    }) 

    thing.get("/:id", function(params) {

    }) 

    thing.delete("/:id", function(params) {

    })

    thing.put("/:id", function(params) {

    })

    thing.post(function(params) {

    })

  }) 

###And here's how you send invoke them

  Controller.get("/things")

  Controller.get("/things/12")

  Controller.delete("/things/42")

  Controller.put("/things/42", {"title: "w00t"})

  Controller.post("/things", {"title: "w00t"})

Contributing
------------

Ideas, feature requests, bug reports, etc are very welcome.

### TODO before releasing this,
  * Can we use something better by someone else?
  * Get rid of http verbs, they dumb
  * fallback for shitty browsers with #!

<a name="contributors"></a>

Contributors
------------

  * Zach Smith @xcoderzach
  * Eugene Butler @EButlerIV

<a name = "license"></a>
 
License
-------

MIT Licensed (see LICENSE.txt)
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
LiveDocument
============

  LiveDocument is a client and server side MongoDB object document mapper.  The
client and server components work seamlessly together to allow you to build
your app without having to write all of your model code twice.

Install
=======

```zsh
npm install LiveDocument
```

Requirements
============

  * Connect (or express)
  * AssetPipeline
  * Socket.io

Getting Started
===============

LiveDocument is still in alpha and hasn't been optimized for use
by itself, it requires the asset provider to serve it's assets
as well as the require function for module support.

Setting up the Server
=====================

  Here are the basics, without the asset Provider stuff
  On the server:

```javascript
var DocumentServer = require("live_document").Server
  , connect        = require("connect")
  , io             = require("socket.io")
  , paths          = require("paths")
  , app

app = connect()
app.use(DocumentServer())
app.listen(3000)

io.listen(app)

// Define the models that we want to serve

// The socket.io object
DocumentServer.socket(io)
```

Defining your Models
====================

  Define a model:
```javascript
// this should be the file /app/models/blog_post.js
var Document = require("live_document")

module.exports = Document("BlogPost")
  .key("title", { length: [3, 10], required: true })
  .key("description", { required: false })
  .key("content")
  .key("upvotes")
```
```coffeescript
Document = require "live_document"

class BlogPost extends Document
  @key "title", length: [3, 10], required: true
  @key "description", required: false
  @key "content"
  @key "upvotes"
```

  The key method defines the properties your document will have and any
[validations](./validations.html) for those properties.  You can also
describe any [associations](./associations.html) here too.

The Basics
==========

Creating Things
===============

```javascript
//path should be relative to your current file
var BlogPost = require("./app/models/blog_post")

var post = BlogPost.create({ title: "Space Magic is magic"
                           , description: "This Space Magic framework is totally boss bro."
                           , content: "So many words about how awesome this is.  SO MANY WORDS" })
```
```coffeescript
BlogPost = require "./app/models/blog_post"
post = BlogPost.create title: "SpaceMagic is magic"
                     , description: "This Space Magic framework is totally boss bro."
                     , content: "So many words about how awesome this is.  SO MANY WORDS"
```
  
  An important thing to note is that the post is populated and ready to go
right away.  The [id](./about_ids) is generated on the client, and the instance
is ready to be handed to your view right away.  This makes your app much more
responsive.  Also, since validation was handled client side, just assume that
everything is going to work out and notify the user of any errors later, if
they happen. [Read more about how ids work here](./about_ids)

Furthur reading:
[Great article by Alex MacCaw about async UIs](http://alexmaccaw.com/posts/async_ui)

Finding Things
==============

```javascript
//path should be relative to your current file
var BlogPost = require("./app/models/blog_post")

var popularPosts = BlogPost.find({ upvotes: $gt: 100 })
//once the posts load, log their titles

popularPosts.loaded.each(function(post) { 
  console.log(post.get("title")) 
}) 
```
```coffeescript
# path should be relative to your current file
BlogPost = require "./app/models/blog_post"

popularPosts = BlogPost.find upvotes: { $gt: 100 }

popularPosts.loaded.each (post) ->
  console.log post.get("title")
```

  The [find method](./collections.html#find) returns a
[collection](./collections.html) of documents based on your
[query](./collections.html#query).  The collection returned is ready to be
passed to a view, but will in many cases be empty.  Unless the contents have
already been retrieved or we have a cache of the documents.

  You can use the method [collection.loaded](./collections.html#loaded) which
will not be invoked until the method has loaded, if the method was already
loaded it will be invoked immediately, loaded can also take a function, that
will execute once the collection loads, or fire immediately if the collection
has already loaded.  

  All of the underscore collection methods are also available on the collection
and on collection.loaded.

Further Reading
[Collection Events](./collections.html#events)
[Collection Methods](./collections.html#methods)

Finding One Thing
=================

```javascript
var BlogPost = require("./app/models/blog_post")

var postByTitle = BlogPost.findOne({title: "SpaceMagic is magic"})
var postById    = BlogPost.findOne(id)
```

  Now we have a thing, again, we should use this object right away, and display
anything we have as soon as possible, rather than waiting for the post to load
before setting up the view.  

Further reading:
[Document Events](./documents.html#events)
[Document Methods](./documents.html#methods)

Updating Things
===============

```javascript
var BlogPost = require("./app/models/blog_post")

var post = BlogPost.findOne(id)
post.set({ title: "The new title for this blog post" })
post.save()
``` 

  Pretty simple, you can set any of the keys defined in your model, and then
the save method persists the changes to the database.  The "saving" event is
fired when the document starts saving and "saved" is fired when it is complete.

Deleting Things
===============

```javascript
var BlogPost = require("./app/models/blog_post")

var post = BlogPost.findOne(id)
post.destroy()
``` 

  Thats all it takes to delete something.  It fires the "destroying" event
when it starts deleting and the "destroyed" event when it completes.  

Real-Time
=========

  Enough with the boring object document mapping stuff lets make our app 
real-time.

  I'll break all the code into two sections, client 1 and client 2.  Clients 
1 and 2 could be on the same page, in two different tabs in the same browser,
in two different browsers on the same computer, or on two seperate computers.
It doesn't really matter.  

Real-Time Collections
=====================

```javascript
//client 1 finds all of the blog posts
var posts = BlogPost.find({upvotes: { $gt:10 }})

posts.on("insert", function(post) {
  console.log("inserted: " + post.get("title")) 
})

posts.on("remove", function(post) {
  console.log("removed: " + post.get("title")) 
})
//client 2
var post1 = BlogPost.create({ title: "A new blog post"
                            , content: "post content" 
                            , upvotes: 9 })

var post2 = BlogPost.create({ title: "A blog post with 11 upvotes"
                            , content: "post content" 
                            , upvotes: 11 })
```
  Client 1 will log "inserted: A blog post with 11 updates" but will not log "inserted: A new blog
post" since it las less than 10 upvotes.

  Going off the previous example
```javascript
//client 2
post1.set({upvotes: 100})
post2.set({upvotes: 9})
```

  If we give post one more upvotes and give post two some downvotes client 1
will log the following:

  "inserted: A new blog post"
  "removed: A blog post with 11 upvotes"

since post2 no longer fits the criterion client 1 is interested in

Real-Time Documents
===================

  Lets assume we have a blog post in the database with the title "A Title"
```javascript
//client 1
var post = BlogPost.find({title: "A title"})
post.on("change", function(post, changedFields) {
  _(changedFields).each(function(field) {
    console.log(field + " changed to: " + post.get(field))
  })
})
//client 2
var post = BlogPost.find({title: "A title"})
post.set({description: "describe"})
post.save()
```

  This will log "description changed to: describe" on client 1.  If two users
update the same property at the same time, the last one will overwrite the
other.  It's possible that they will momentarily have inconsistant states, but
eventually a message will be broadcast to all users who are currently
"interested" in the document what the final state is, and the clients will
converge.  

  For many things this behavior will work just fine.  However, if you do not
want updates to just overwrite, you should read the section on
[collaboration](./collaboration.html).

  If we were to delete either of the posts a "destroyed" event would be fired.

Further reading;
[collaboration](./collaboration.html)
Associations
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
Live Controller v0.0.1
======================

Table of Contents
-----------------
  * [Introduction](#introduction)
  * [API docs](#api)
  * [Experimental API docs](#experimental)
  * [Examples](#examples)
  * [Tests](#tests)
  * [Contributing](#contributing)
  * [Contributors](#contributors)
  * [License](#license)

<a name="introduction"></a>

Introduction
------------

Live Controller is a tiny, client-side router that uses window.pushState and falls back to regular page refreshes when pushState is not available.

<a name="api"></a>

API docs
--------

You can find the API docs in the docs folder.

<a name="experimental"></a>

Experimental API docs
---------------------

Expelrimental API docs will be made available when any part of the project isn't experimental.

<a name="examples"></a>

Examples
--------

###Here's an example

  var controller = new Controller("/things", function(thing) {

    thing.get(function(params) {

    }) 

    thing.get("/:id", function(params) {

    }) 

    thing.delete("/:id", function(params) {

    })

    thing.put("/:id", function(params) {

    })

    thing.post(function(params) {

    })

  }) 

###And here's how you send invoke them

  Controller.get("/things")

  Controller.get("/things/12")

  Controller.delete("/things/42")

  Controller.put("/things/42", {"title: "w00t"})

  Controller.post("/things", {"title: "w00t"})

Contributing
------------

Ideas, feature requests, bug reports, etc are very welcome.

### TODO before releasing this,
  * Can we use something better by someone else?
  * Get rid of http verbs, they dumb
  * fallback for shitty browsers with #!

<a name="contributors"></a>

Contributors
------------

  * Zach Smith @xcoderzach
  * Eugene Butler @EButlerIV

<a name = "license"></a>
 
License
-------

MIT Licensed (see LICENSE.txt)
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
LiveDocument
============

  LiveDocument is a client and server side MongoDB object document mapper.  The
client and server components work seamlessly together to allow you to build
your app without having to write all of your model code twice.

Install
=======

```zsh
npm install LiveDocument
```

Requirements
============

  * Connect (or express)
  * AssetPipeline
  * Socket.io

Getting Started
===============

LiveDocument is still in alpha and hasn't been optimized for use
by itself, it requires the asset provider to serve it's assets
as well as the require function for module support.

Setting up the Server
=====================

  Here are the basics, without the asset Provider stuff
  On the server:

```javascript
var DocumentServer = require("live_document").Server
  , connect        = require("connect")
  , io             = require("socket.io")
  , paths          = require("paths")
  , app

app = connect()
app.use(DocumentServer())
app.listen(3000)

io.listen(app)

// Define the models that we want to serve

// The socket.io object
DocumentServer.socket(io)
```

Defining your Models
====================

  Define a model:
```javascript
// this should be the file /app/models/blog_post.js
var Document = require("live_document")

module.exports = Document("BlogPost")
  .key("title", { length: [3, 10], required: true })
  .key("description", { required: false })
  .key("content")
  .key("upvotes")
```
```coffeescript
Document = require "live_document"

class BlogPost extends Document
  @key "title", length: [3, 10], required: true
  @key "description", required: false
  @key "content"
  @key "upvotes"
```

  The key method defines the properties your document will have and any
[validations](./validations.html) for those properties.  You can also
describe any [associations](./associations.html) here too.

The Basics
==========

Creating Things
===============

```javascript
//path should be relative to your current file
var BlogPost = require("./app/models/blog_post")

var post = BlogPost.create({ title: "Space Magic is magic"
                           , description: "This Space Magic framework is totally boss bro."
                           , content: "So many words about how awesome this is.  SO MANY WORDS" })
```
```coffeescript
BlogPost = require "./app/models/blog_post"
post = BlogPost.create title: "SpaceMagic is magic"
                     , description: "This Space Magic framework is totally boss bro."
                     , content: "So many words about how awesome this is.  SO MANY WORDS"
```
  
  An important thing to note is that the post is populated and ready to go
right away.  The [id](./about_ids) is generated on the client, and the instance
is ready to be handed to your view right away.  This makes your app much more
responsive.  Also, since validation was handled client side, just assume that
everything is going to work out and notify the user of any errors later, if
they happen. [Read more about how ids work here](./about_ids)

Furthur reading:
[Great article by Alex MacCaw about async UIs](http://alexmaccaw.com/posts/async_ui)

Finding Things
==============

```javascript
//path should be relative to your current file
var BlogPost = require("./app/models/blog_post")

var popularPosts = BlogPost.find({ upvotes: $gt: 100 })
//once the posts load, log their titles

popularPosts.loaded.each(function(post) { 
  console.log(post.get("title")) 
}) 
```
```coffeescript
# path should be relative to your current file
BlogPost = require "./app/models/blog_post"

popularPosts = BlogPost.find upvotes: { $gt: 100 }

popularPosts.loaded.each (post) ->
  console.log post.get("title")
```

  The [find method](./collections.html#find) returns a
[collection](./collections.html) of documents based on your
[query](./collections.html#query).  The collection returned is ready to be
passed to a view, but will in many cases be empty.  Unless the contents have
already been retrieved or we have a cache of the documents.

  You can use the method [collection.loaded](./collections.html#loaded) which
will not be invoked until the method has loaded, if the method was already
loaded it will be invoked immediately, loaded can also take a function, that
will execute once the collection loads, or fire immediately if the collection
has already loaded.  

  All of the underscore collection methods are also available on the collection
and on collection.loaded.

Further Reading
[Collection Events](./collections.html#events)
[Collection Methods](./collections.html#methods)

Finding One Thing
=================

```javascript
var BlogPost = require("./app/models/blog_post")

var postByTitle = BlogPost.findOne({title: "SpaceMagic is magic"})
var postById    = BlogPost.findOne(id)
```

  Now we have a thing, again, we should use this object right away, and display
anything we have as soon as possible, rather than waiting for the post to load
before setting up the view.  

Further reading:
[Document Events](./documents.html#events)
[Document Methods](./documents.html#methods)

Updating Things
===============

```javascript
var BlogPost = require("./app/models/blog_post")

var post = BlogPost.findOne(id)
post.set({ title: "The new title for this blog post" })
post.save()
``` 

  Pretty simple, you can set any of the keys defined in your model, and then
the save method persists the changes to the database.  The "saving" event is
fired when the document starts saving and "saved" is fired when it is complete.

Deleting Things
===============

```javascript
var BlogPost = require("./app/models/blog_post")

var post = BlogPost.findOne(id)
post.destroy()
``` 

  Thats all it takes to delete something.  It fires the "destroying" event
when it starts deleting and the "destroyed" event when it completes.  

Real-Time
=========

  Enough with the boring object document mapping stuff lets make our app 
real-time.

  I'll break all the code into two sections, client 1 and client 2.  Clients 
1 and 2 could be on the same page, in two different tabs in the same browser,
in two different browsers on the same computer, or on two seperate computers.
It doesn't really matter.  

Real-Time Collections
=====================

```javascript
//client 1 finds all of the blog posts
var posts = BlogPost.find({upvotes: { $gt:10 }})

posts.on("insert", function(post) {
  console.log("inserted: " + post.get("title")) 
})

posts.on("remove", function(post) {
  console.log("removed: " + post.get("title")) 
})
//client 2
var post1 = BlogPost.create({ title: "A new blog post"
                            , content: "post content" 
                            , upvotes: 9 })

var post2 = BlogPost.create({ title: "A blog post with 11 upvotes"
                            , content: "post content" 
                            , upvotes: 11 })
```
  Client 1 will log "inserted: A blog post with 11 updates" but will not log "inserted: A new blog
post" since it las less than 10 upvotes.

  Going off the previous example
```javascript
//client 2
post1.set({upvotes: 100})
post2.set({upvotes: 9})
```

  If we give post one more upvotes and give post two some downvotes client 1
will log the following:

  "inserted: A new blog post"
  "removed: A blog post with 11 upvotes"

since post2 no longer fits the criterion client 1 is interested in

Real-Time Documents
===================

  Lets assume we have a blog post in the database with the title "A Title"
```javascript
//client 1
var post = BlogPost.find({title: "A title"})
post.on("change", function(post, changedFields) {
  _(changedFields).each(function(field) {
    console.log(field + " changed to: " + post.get(field))
  })
})
//client 2
var post = BlogPost.find({title: "A title"})
post.set({description: "describe"})
post.save()
```

  This will log "description changed to: describe" on client 1.  If two users
update the same property at the same time, the last one will overwrite the
other.  It's possible that they will momentarily have inconsistant states, but
eventually a message will be broadcast to all users who are currently
"interested" in the document what the final state is, and the clients will
converge.  

  For many things this behavior will work just fine.  However, if you do not
want updates to just overwrite, you should read the section on
[collaboration](./collaboration.html).

  If we were to delete either of the posts a "destroyed" event would be fired.

Further reading;
[collaboration](./collaboration.html)
Associations
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
Live Controller v0.0.1
======================

Table of Contents
-----------------
  * [Introduction](#introduction)
  * [API docs](#api)
  * [Experimental API docs](#experimental)
  * [Examples](#examples)
  * [Tests](#tests)
  * [Contributing](#contributing)
  * [Contributors](#contributors)
  * [License](#license)

<a name="introduction"></a>

Introduction
------------

Live Controller is a tiny, client-side router that uses window.pushState and falls back to regular page refreshes when pushState is not available.

<a name="api"></a>

API docs
--------

You can find the API docs in the docs folder.

<a name="experimental"></a>

Experimental API docs
---------------------

Expelrimental API docs will be made available when any part of the project isn't experimental.

<a name="examples"></a>

Examples
--------

###Here's an example

  var controller = new Controller("/things", function(thing) {

    thing.get(function(params) {

    }) 

    thing.get("/:id", function(params) {

    }) 

    thing.delete("/:id", function(params) {

    })

    thing.put("/:id", function(params) {

    })

    thing.post(function(params) {

    })

  }) 

###And here's how you send invoke them

  Controller.get("/things")

  Controller.get("/things/12")

  Controller.delete("/things/42")

  Controller.put("/things/42", {"title: "w00t"})

  Controller.post("/things", {"title: "w00t"})

Contributing
------------

Ideas, feature requests, bug reports, etc are very welcome.

### TODO before releasing this,
  * Can we use something better by someone else?
  * Get rid of http verbs, they dumb
  * fallback for shitty browsers with #!

<a name="contributors"></a>

Contributors
------------

  * Zach Smith @xcoderzach
  * Eugene Butler @EButlerIV

<a name = "license"></a>
 
License
-------

MIT Licensed (see LICENSE.txt)
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
