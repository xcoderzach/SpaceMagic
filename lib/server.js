var connect        = require("connect")
  , fs             = require("fs")
  , assets         = require("../config/assets")
  , io             = require("socket.io")
  , DocumentServer = require("./client/LiveDocument")
  , Mongolian      = require("mongolian")
  , dbConfig       = require("../config/database")
  , _              = require("underscore")
  , passport      = require("passport")
  , LocalStrategy = require('passport-local').Strategy
  , crypto        = require("crypto")
  , User          = require("../app/models/user")
  , MongoStore   = require("connect-mongolian")(connect)//connect.session.MemoryStore
  , timers        = require("timers")
  //Amount of simulated latency, if you want to see how your server is performing for slow people
  , latency = 0
  , server
  , db

function latentize(cb, time) {
  if(time !== 0) {
    timers.setTimeout(_(cb).bind(this), time)
  } else {
    cb.call(this)
  }
}

module.exports = {
  start: function(environment, port, done) {
    done = done || function() {}

      var db = new Mongolian(dbConfig[environment].host + ":" +
                             dbConfig[environment].port + "/" +
                             dbConfig[environment].database)

      , dbMethods = require("./client/LiveDocument/lib/server/database_methods")(db)
      , mongoStore = new MongoStore({server: db})

    var serveMainPage = function(req, res, next) {
      var mainpage = __dirname + "/../assets/templates/layouts/index.html"
      fs.readFile(mainpage, 'utf8', function(err, contents) {
        if(err) {
          next(err)
        } else {
          contents = contents.replace("<!--IS_SIGNED_IN-->", signedIn)
          contents = contents.replace("<!--SCRIPTTAGS-->", assets.scriptTags())
          res.setHeader('Content-Type', 'text/html;charset=utf-8')
          res.setHeader('Content-Length', contents.length)
          res.end(contents)
        }
      })
    }

    server = connect( function(req, res, next) {
                        latentize(function() { next() }, latency)
                      }
                    , assets.server.middleware()
                    , connect.cookieParser()
                    , connect.session({ secret: "herp1234derp"
                                      , store: mongoStore
                                      , cookie: { maxAge: 14400000 }})
                    , serveMainPage)

    io = io.listen(server)
    io.configure(function() {
      io.set('transports', ['websocket'])
      io.set('log level', 0)
    })
 
    server.listen(port)
    if(environment === "development") {
      assets.watchFiles(io.sockets)
    }
    io.sockets.on('connection', function(socket) {
      var oldOn = socket.on
      var documentServer = new DocumentServer(socket, db, __dirname + "/../app/models") 
      socket.on = function(event, callback) {
        oldOn.call(this, event, function() {
          var args = arguments
            , that = this
          latentize(function() {
            callback.apply(that, args)
          }, latency)
        })
      }
    })
    done()
  }

, stop: function() {
    server.close()
    db.server.close()
  }
}
