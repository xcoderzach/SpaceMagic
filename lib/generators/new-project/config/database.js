module.exports =
  { "development": 
    { "host": "localhost"
    , "port": 27017
    , "database": "{{projectName}}" }
  , "test":
    { "host": "localhost"
    , "port": 27017
    , "database": "test{{projectName}}" }
  }
