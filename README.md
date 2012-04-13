Getting Started
===============

  If you're new to SpaceMagic and don't even know what it is, read the
introductory blog post here.

Installation
------------

To install SpaceMagic:

```
mkdir my_project
cd my_project
npm install SpaceMagic
spacemagic init my_project
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

Running your App
================

  To start your app server just run 

```
spacemagic server
```

  * `--port` specifies the port

Examples
========

[https://github.com/xcoderzach/SpaceMagicChatExample](Chat App)
[https://github.com/xcoderzach/SpaceMagicTodoExample](Todo List App)

Contributions
=============

Any and all contributions are welcome. Bug reports, feature requests, or
anything else. Fork away!
