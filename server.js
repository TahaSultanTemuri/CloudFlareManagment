// MODULES
const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // SETTING ENV VARIABLE

//USER MODULES
//const app = express();

//USER MODULES
const app = require('./app');
const http = require('http').Server(app);
const port = process.env.PORT || 3000;
const DB = process.env.DATABASE_LOCAL || 'mongodb://admin:BDIzvi07012@10.101.4.116:27017/nodeProject?authSource=admin';

//const online = process.env.ONLINE;

if (DB) {
  console.log('Working Online...');

 // DB = process.env.DATABASE_ONLINE.replace('<PASSWORD>', process.env.PASSWORD);
} else {
  console.log('Working Offline...');

 // DB = process.env.DATABASE_LOCAL;
}

//CONNECTING TO DATABASE
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    ignoreUndefined: true,
  })
  .then(() =>
    process.env.NODE_ENV == 'development'
      ? console.log(`Connected to DB at ${DB}`)
      : console.log(`Connection Successful`)
  )
  .catch((err) => console.log(err));

//const port = process.env.PORT; //PORT VARIABLE



//app.use(express.static(__dirname + '/public'));

//STARTING THE SERVER
http.listen(port, () => console.log(`App running on port http://127.0.0.1:${port}....`));