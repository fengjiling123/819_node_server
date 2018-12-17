'use strict';

import mongoose from 'mongoose';
import chalk from 'chalk';

let config = require('config-lite')(__dirname);

mongoose.connect(config.url, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on('open', () => {
    console.log(
        chalk.green('数据库连接成功')
    )
});

db.on('error', () => {
    console.error(
        chalk.red('数据库连接失败')
    );
    mongoose.disconnect();
});

db.on('close', () => {
    console.log(
        chalk.red('数据库断开，请重新连接')
    );
    mongoose.connect(config.url, { useNewUrlParser: true });
});

export default db;