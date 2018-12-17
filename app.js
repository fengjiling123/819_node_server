import express from 'express';
import FileStreamRotator from 'file-stream-rotator';
import fs from 'fs';
import db from './mongodb/db';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import morgan from 'morgan';
import chalk from 'chalk';
import router from './routes/index';

var config = require('config-lite')(__dirname);

var app = express();

//设置跨域
app.all('*', (req, res, next) => {
  const { origin, Origin, referer, Referer } = req.headers;
  const allowOrigin = origin || Origin || referer || Referer || '*';
  res.header("Access-Control-Allow-Origin", allowOrigin);
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true); //可以带cookies
  res.header("X-Powered-By", 'Express');
  if (req.method == 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //打印日志到控制台
} else {
  //生产环境日志目录 ensure log directory exists 
  let logDirectory = __dirname + '/log';
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

  //create a rotating write stream
  let accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: logDirectory + '/%DATE%.log',
    frequency: 'daily',
    verbose: false
  });

  //打印日志到log文件夹下
  app.use(morgan(function (tokens, req, res) {
    if (tokens.url(req, res) !== '/favicon.ico') {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
      ].join(' ')
    };
  }, { stream: accessLogStream }));
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const MongoStore = connectMongo(session);
app.use(cookieParser());
app.use(session({
  name: config.session.name,
  secret: config.session.secret,
  resave: true,
  saveUninitialized: false,
  cookie: config.session.cookie,
  store: new MongoStore({
    url: config.url
  })
}));

app.use(express.static(path.join(__dirname, 'public')));
router(app);
app.listen(config.port, () => {
  console.log(
    chalk.green(`成功监听端口：${config.port}`)
  )
});

module.exports = app;
