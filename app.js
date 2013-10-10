/* Module dependencies
======================================== */
var express   = require('express')
  , routes    = require('./routes')
  , http      = require('http')
  , path      = require('path')
  , mongoUrl  = 'mongodb://stlwgdbadmin:!!stlwg@ds049858.mongolab.com:49858/stlwg-task-app'
  , userFname
  , userLname;


/* Create app instance and configure
======================================== */
var app = express();

app.configure(function(){
  app.set('port', 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session( {secret: 'supersecretkeygoeshere'} ));
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var server = app.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

/* API Methods
======================================== */
var requireAuth = function (req, res, next) {
  if(!req.session.user_id) {
    res.redirect('/');
  } else {
    next();
  }
};

var signUp = function(data, req, res) {
  require('mongodb').connect(mongoUrl, function(err, db) {
    if(!err) {
      db.createCollection('users', function(err, collection) {});
      db.collection('users', function(err, collection) {
        var doc = data;
        collection.insert(doc, {safe:true}, function(err, result) { 
          if(!err) {
            res.redirect('/');
          } else {
            res.send('opps let\'s try that again');
          }
          db.close();
        });
      });
    } else {
      return (err);
    }
  });
};

var logIn = function(doc, req, res) {
  require('mongodb').connect(mongoUrl, function(err, db) {
    if(!err) {
      db.createCollection('users', function(err, collection) {});
      db.collection('users', function(err, collection) {
        collection.findOne({ username : doc.username }, function(err, item) {
          if (item === null) { 
            res.send('no user found');
          } else if (doc.username === item.username && doc.password === item.password) {
            req.session.user_id = item.username;
            userFname = item.firstname;
            userLname = item.lastname;
            res.redirect('/tasks');
          } else {
            res.send('bad user/pass');
          }
          db.close();
        });
      });
    } else {
      return (err);
    }
  });
};

var addTask = function(doc, req, res) {
  require('mongodb').connect(mongoUrl, function(err, db) {
    if(!err) {
      db.createCollection(req.session.user_id, function(err, collection) {});
      db.collection(req.session.user_id, function(err, collection) {
        collection.insert(doc, {safe:true}, function(err, result) { 
          if(!err) {
            res.redirect('/');
          } else {
            res.send('opps let\'s try that again');
          }
          db.close();
        });
      });
    } else {
      return (err);
    }
  });
};

var getTasks = function(req, res) {
  require('mongodb').connect(mongoUrl, function(err, db) {
    if(!err) {
      db.collection(req.session.user_id, function(err, collection) {
        collection.find().toArray(function(err, items) {
          if(!err) {
          res.send(items);
        } else {
          console.log(err);
        }
        });
      });
    } else {
      return (err);
    }
  });
};

var updateTask = function (doc, req, res) {
  require('mongodb').connect(mongoUrl, function(err, db) {
    if(!err) {
      db.collection(req.session.user_id, function(err, collection) {
        var id = require('mongodb').ObjectID(doc._id);

        collection.update({_id: id}, {
            
            priority:     doc.priority,
            title:        doc.title,
            date:         doc.date,
            description:  doc.description 

          }, function(err, item) {
          if(!err) {
            res.redirect('/viewtasks')
          } else {
            console.log(err);
          }
        });
      });
    }
  });
};

var deleteTask = function (doc, req, res) {
  require('mongodb').connect(mongoUrl, function(err, db) {
    if(!err) {
      db.collection(req.session.user_id, function(err, collection) {
        var id = require('mongodb').ObjectID(doc._id);

        collection.remove({_id: id}, function(err, item) {
          if(!err) {
            res.redirect('/viewtasks')
          } else {
            console.log(err);
          }
        });
      });
    }
  });
};


/* App Routes
======================================== */
// Landing page routes
app.get('/', function (req, res, next) {
  if (req.session.user_id) {
    res.redirect('/tasks');
  } else {
    next();
  }
}, routes.index);

app.get('/signup', routes.signup);
app.get('/tasks', requireAuth, function (req, res) {
  res.render('tasks', {
    title: 'tasks',
    page: 'tasks', 
    fname: userFname
  });
});
app.get('/addtasks', requireAuth, routes.addtasks);
app.get('/viewtasks', requireAuth, routes.viewtasks);
app.get('/logout', function (req, res) {
  req.session.user_id = null;
  res.redirect('/');
});
// DB Posts
app.post('/login', function (req, res) {
  var data = req.body;
  logIn(data, req, res);
});

app.post('/signup', function (req, res) {
  var data = req.body;
  signUp(data, req, res);
});

app.post('/addtask', function (req, res){
  var data = req.body;
  addTask(data, req, res);
});

app.post('/updatetask', function (req, res){
  var data = req.body;
  updateTask(data, req, res);
});

app.post('/deletetask', function (req, res){
  var data = req.body;
  deleteTask(data, req, res);
});

// Ajax requests
app.get('/gettasks', requireAuth, function(req, res) {
  getTasks(req, res);
});

// 404
app.get('*', routes.notfound);