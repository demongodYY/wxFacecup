'use strict';

const path = require('path');

const AV = require('leanengine');
const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const statics = require('koa-static');
const bodyParser = require('koa-bodyparser');


// 加载云函数定义，你可以将云函数拆分到多个文件方便管理，但需要在主文件中加载它们
require('./cloud');

const app = new Koa();

// 设置模版引擎
app.use(views(path.join(__dirname, 'views')));

// 设置静态资源目录
app.use(statics(path.join(__dirname, 'public')));

const router = new Router();
app.use(router.routes());

// 加载云引擎中间件
app.use(AV.koa());

app.use(bodyParser());
// app.use(koaBody({multipart: true}));

router.get('/', async function(ctx) {
  ctx.state.currentTime = new Date();
  await ctx.render('./index.ejs');
});

// 可以将一类的路由单独保存在一个文件中
app.use(require('./routes/images').routes());

module.exports = app;
