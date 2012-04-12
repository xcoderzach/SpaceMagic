/assets/templates/tasks/list.html
```html
<section>
  <ul class = "tasks">
    <li class = "task">
      <input type = "checkbox" class = "done">
      <div class = "title"></div>
      <div class = "votes">0</div>
      <div class = "upVote">U</div>
      <div class = "downVote">D</div>
    </li>
  </ul>
  <form id = "newTaskForm">
    <input type = "text" name = "task[title]" />
    <input type = "submit" />
  </form>
</section>  
```

/app/models/task.js
```javascript
var Document = require("LiveDocument/lib/document")

module.exports = Document.define("Task")
  .key("title")
  .key("votes")
  .key("done") 
```

/app/views/tasks/list.js

```javascript
var ListView = require("views/list_view") 
  , NewTaskView = require("../veiws/tasks/new")
 
var TaskView = ListView.define("TaskView")                                            
  .action("change input[type=checkbox]", function(event, element) {
    var done = element.is(":checked")
    this.model.set({ done: done })
    this.model.save()
  })
  .action("click .upVote", function(event, element) {
    var votes = this.model.get("votes")
    this.model.set({ votes: votes + 1 })
    this.model.save()
  }) 
  .action("click .downVote", function(event, element) {
    var votes = this.model.get("votes")
    this.model.set({ votes: votes - 1 })
    this.model.save()
  })

module.exports = ListView.define("TaskListView")                                            
  .template("/templates/tasks/list.html") 
  .subView("#newTaskView", NewTaskView)
  .singleView(TaskView)
```

/app/views/tasks/new.js

```javascript
var View = require("views/view") 
  , Task = require("../models/task")
  , _ = require("underscore")

module.exports = View.define("NewTaskView")
  .action("submit #newTaskForm", function(event, element) {

    var input = element.find("input[type=text]")
      , title = input.val()

    Task.create({ title: title, votes: 0, done: false })
  }) 
```

/app/controllers/application_controller.js

```javascript
var TaskListView = require("../views/tasks/list")
  , Task = require("../models/task")
  , Controller = require("LiveController/lib/live_controller").Controller 

Controller("/", function(app) {
  app.get(function() {
    var tasks = Task.find()
    tasks.sortBy("votes")
    this.view = new TaskListView(tasks)
  }) 
}) 
```
