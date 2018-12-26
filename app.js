import express from 'express';
import fs from 'fs';
import db from './mongodb/db';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import morgan from 'morgan';
import chalk from 'chalk';
import router from './routes/index';

import graphqlHTTP from 'express-graphql';
import Schema from './contraller/graphql';

var config = require('config-lite')(__dirname);

var app = express();

//设置跨域
app.all('*', (req, res, next) => {
  const { origin, Origin, referer, Referer } = req.headers;
  const allowOrigin = origin || Origin || referer || Referer || 'http://localhost:3001'; //确定的访问者+前端{.withCredentials ：true}发送cookies  做跨域时的seesion存取
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


app.use(express.json()); // parsing application/json
app.use(express.urlencoded({ extended: false })); //parsing application/x-www-form-urlencoded

const MongoStore = connectMongo(session);
app.use(cookieParser());

app.use(session({
  name: config.session.name,
  secret: config.session.secret, // 对session id 相关的cookie 进行签名
  resave: false, // 是否每次都重新保存会话，建议false
  saveUninitialized: false, // 是否保存未初始化的会话
  cookie: config.session.cookie,
  store: new MongoStore({  // session 保存到 MongoDB 数据库
    url: config.url
  })
}));

app.use(express.static(path.join(__dirname, 'public')));
router(app);

//启动garphql服务器
app.use('/graphql', graphqlHTTP({
  schema: Schema,
  graphiql: true //是否可视化
}));


app.listen(config.port, () => {
  console.log(
    chalk.green(`成功监听端口：${config.port}`)
  )
});

module.exports = app;
