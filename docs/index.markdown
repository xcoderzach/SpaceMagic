Welcome to SpaceMagic
=====================

SpaceMagic is a full-stack javascript web development framework which allows
you to build fast, real-time web applications.  It allows you to write only
one app and share it between the client and the server.

Disclaimer
----------

SpaceMagic is not yet production-ready. We are working very hard to get it
there, but the API is unstable and subject to change without notice.

Sorry, IE users. Support for your browser is coming very soon.

Installation
------------

```
npm install -g SpaceMagic
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

  * Check out our [http://spacemagic.io/tutorials/](To-do Tutorial)
  * Dive into the Documentation
  * Follow us on Twitter

High-level Overview
-------------------

SpaceMagic is an MV* framework. Its main components are:

  * [LiveView](https://github.com/xcoderzach/LiveView) - A pure, semantic HTML-based templating language.
  * [LiveDocument](https://github.com/xcoderzach/LiveDocument) - A real-time client-server isomorphic ODM.
  * [LiveController](https://github.com/xcoderzach/LiveController) - A tiny, client-side, pushState router. 
  * [AssetPipeline](https://github.com/xcoderzach/AssetPipeline) - A static asset provider with support for minification, javascript modules, and caching.

