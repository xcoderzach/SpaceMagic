Getting Started
===============

  If you're new to SpaceMagic and don't even know what it is go to http://spacemagic.io.

Installation
------------

To install SpaceMagic:

```
npm install -g SpaceMagic
spacemagic init my_project
mkdir my_project
cd my_project
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

[Chat App](https://github.com/xcoderzach/SpaceMagicChatExample)

[Todo List App](https://github.com/xcoderzach/SpaceMagicTodoExample)

Licence
=======

The MIT License

Copyright (c) 2012 Zach Smith

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Contributions
=============

Any and all contributions are welcome. Bug reports, feature requests, or
anything else. Fork away!
