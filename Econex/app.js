var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var models = require('./models');
var passport = require('passport');
var session = require('express-session');
var cors = require('cors');
var authService = require('./services/auth');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { sequelize } = require('./models');
var imageUploadRouter = require('./routes/imageUpload');
var categoriesRouter = require('./routes/categories');

var app = express();
app.use(cors());
 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next)=>{
  const header = req.headers.authorization;

  if (!header){
       return next();
  }

  const token = header.split(' ')[1];
  
  const user = await authService.verifyUser(token);

  req.user = user;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/imageUpload', imageUploadRouter);
app.use('/categories', categoriesRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     next(createError(404));
//   });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    // res.locals.message = err.message;
    // res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    // res.status(err.status || 500);
    // res.render('error');\
    // console.log(err.message);
    throw err;
  });
  
  models.sequelize.sync().then(function() {
    console.log("DB All Sync'd Up")
  });
  

module.exports = app;
