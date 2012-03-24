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

