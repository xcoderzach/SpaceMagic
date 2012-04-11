Build A Todo App
================

  We're going to go through the steps to build a Todo App with up and downvotes.

  You can see a demo of the finished product here: [Todo Example]()

  We'll assume you have mongodb, node, and npm installed already and have mongo
running on the default port on localhost.

  First we need to get SpaceMagic installed, so we just run:

```
npm install -g spacemagic
```

w00t, that's it, now we'll initialize a new SpaceMagic app.

```
spacemagic init todo-app
cd todo-app
npm install
```

  This will create a barebones spacemagic application, and install all of the
npm modules we need to get our app up and running.

  If you go to localhost:3000 you should see the welcome to spacemagic screen.
If the thing is green that means bootstrap is up and running. w00t.

  Lets start out by mocking up our application in html.  Since we're using LiveView
all we have to do in order to have working templates is to write the semantic html
we would have written anyway.

```javascript
<section>
  <ul class = "tasks">
    <li class = "task">
      <input type = "checkbox" class = "done">
      <div class = "title"></div>
      <div class = "votes">0</div>
      <div class = "upVote"></div>
      <div class = "downVote"></div>
    </li>
  </ul>
  <form id = "newTaskForm">
    <input type = "text" name = "task[title]" />
  </form>
</section>
```
  That should probably be enough html to get our app started.

  Now, that we know what data our app is going to need to persist, we can defin
a model for our tasks.  The only type of document we need is a `Task`, which
has three properties:

  * `title`
  * `votes`
  * `done`

  To define these properties on a model we use the `key` method. 

```javascript
var Document = require("LiveDocument/lib/document")

module.exports = Document.define("Task")
  .key("title")
  .key("votes")
  .key("done")
```

  For the sake of simplicity we won't do any validation, so this is all there is to 
making a model.

  Next, we need to set up a view.  We'll use one of the built in view
controllers which handles syncing the model to the template, the particular
view we'll use is the list view, since we need to show a list of tasks.

```javascript
var ListView = require("views/list_view") 

module.exports = ListView.define("TaskListView")                                            
  .template("/templates/tasks/list.html")
```

Now we just need to connect the two together, so in application_controller.js we'll setup 
the route "/" to load our view, 

```javascript
var TaskListView = require("../views/tasks/list")
  , Task = require("../models/task")
  , Controller = require("LiveController/lib/live_controller").Controller 

Controller("/", function(app) {
  app.get(function() {
    var tasks = Task.find()
    tasks.load(function() {
      tasks.sortBy("votes")
    })
    this.view = new TaskListView(tasks)
  }) 
}) 
```

Now, when a user visits "/" they will see the list of tasks, which is currently
empty.

To check that it's working, we can add a task via firebug/webkit inspector console like
so:

```javascript
var Task = require("/app/models/task")
Task.create({ title: "This is a task", votes: 0, done: false })
```

You should have seen it live update in on the page if it worked.
