const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

require('./model/connect');
// require('./model/user');
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: 'test key',
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// 静态资源访问
app.use(express.static(path.join(__dirname, 'public')));
// 模板配置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'art');
app.engine('art', require('express-art-template'));

const admin = require('./route/admin');
const home = require('./route/home');

// 登录拦截
app.use('/admin', require('./middleware/loginGuard'));

// 后台管理相关的路由
app.use('/admin', admin);
// 前台展示相关的路由
app.use('/home', home);

// 统一错误信息的处理
app.use((err, req, res, next) => {
    const {path, message} = JSON.parse(err);
    res.redirect(`${path}?message=${message}`);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));