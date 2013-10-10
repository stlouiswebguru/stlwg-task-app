
/*
 * GET Routes
 */

exports.index = function(req, res){
  res.render('index', { page: 'index', title: 'log in' });
};

exports.signup = function(req, res){
  res.render('signup', { page: 'singup', title: 'sign up' });
};

exports.addtasks = function(req, res){
  res.render('addtasks', { page: 'addtasks', title: 'add tasks' });
};

exports.viewtasks = function(req, res){
  res.render('viewtasks', { page: 'viewtasks', title: 'your tasks' });
};

exports.notfound = function(req, res){
  res.render('notfound', { page: 'notfound', title: '404' });
};