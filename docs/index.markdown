Welcome to SpaceMagic
=====================

  SpaceMagic is a full-stack javascript web development framework which allows
you to build fast, real-time web applications.  It allows you to write only
one app and share it between the client and the server.

Installation
------------

```
npm install -g spacemagic
spacemagic init myProject
cd myProject
npm install
```

Configure
---------

  You need to have mongodb installed, if you don't, go here
[MongoDB QuickStart Guide](http://www.mongodb.org/display/DOCS/Quickstart)

  If you're already running MongoDB on localhost on the default port, you're done.
But if you need to configure your database connection info goto the file:

```
vim config/database.js

```

Next Steps
----------

  * Checkout our Basic Todo Tutorial
  * or the Chat Tutorial
  * or the Micro Blogging tutorial
  * or checkout the Guides
  * or dive into the API documentation

High-level Overview
===================

SpaceMagic is an MV* framework. Its main components are:

  * [LiveView](https://github.com/xcoderzach/LiveView) - A pure, semantic HTML-based templating language.
  * [LiveDocument](https://github.com/xcoderzach/LiveDocument) - A real-time client-server isomorphic ODM.
  * [LiveController](https://github.com/xcoderzach/LiveController) - A tiny, client-side, pushState router. 
  * [AssetPipeline](https://github.com/xcoderzach/AssetPipeline) - A static asset provider with support for minification, javascript modules, and caching.

