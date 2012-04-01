var connect        = require("connect")
  , fs             = require("fs")
  , io             = require("socket.io")
  , Mongolian      = require("mongolian")
  , _              = require("underscore")
  , passport      = require("passport")
  , crypto        = require("crypto")
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
  start: function(environment, port, appDirectory) {

  var dbConfig       = require(appDirectory + "/config/database")
    , assets         = require(appDirectory + "/config/assets")
    , db = new Mongolian(dbConfig[environment].host + ":" +
                           dbConfig[environment].port + "/" +
                           dbConfig[environment].database)

  , DocumentServer = require(appDirectory + "/node_modules/LiveDocument")

    var serveMainPage = function(req, res, next) {
      var mainpage = appDirectory + "/assets/templates/layouts/index.html"
      fs.readFile(mainpage, 'utf8', function(err, contents) {
        if(err) {
          next(err)
        } else {
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
                                      , store: new MongoStore({server: db})
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
      var documentServer = new DocumentServer(socket, db, appDirectory + "/app/models") 
      socket.on = function(event, callback) {
        oldOn.call(this, event, function() {
          var args = arguments
            , that = this
          latentize(function() {
            callback.apply(that, args)
          }, latency)
        })
      }
      socket.on("disconnect", function() {
        console.log("wat")
        documentServer.cleanup()
      })
    })
  }

, stop: function() {
    server.close()
    db.server.close()
  }
}
