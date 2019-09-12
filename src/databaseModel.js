const MongoClient = require('mongodb').MongoClient

var state = {
    db: null,
  }
  
  exports.connect = (url, done) => {
    if (state.db) return done()
  
    MongoClient.connect(url, { useNewUrlParser: true , useUnifiedTopology: true}, function(err, db) {
      if (err) return done(err)
      state.db = db
      done()
    })
  }
  
  exports.get = () => {
    if (!state.db)
    {
      console.log("state is bad");
    }
    return state.db
  }
  
  exports.close = (done) => {
    if (state.db) {
      state.db.close((err, result) => {
        state.db = null
        state.mode = null
        done(err)
      })
    }
  }