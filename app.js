// MODULES
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');


// USER ROUTES
const viewRouter = require('./routes/viewRouter');
const authRouter = require('./routes/api/authRouter');
const customerRouter = require('./routes/api/customerRouter');
const userRouter = require('./routes/api/userRouter');
const mailRouter = require('./routes/api/mailRouter');
const cloudflareRouter = require('./routes/api/cloudflareRouter');


const app = express(); // app constant

// TEMPLATE ENGINE
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// PUBLIC PATH
app.use(express.static(__dirname + '/public'));

//MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// ROUTER MOUNTS
app.use('/api/customer', customerRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/mail', mailRouter);
app.use('/api/cloudflare', cloudflareRouter);

app.use('/', viewRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

//EXPORTING APP
module.exports = app;