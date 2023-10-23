"use strict";

const express = require('express');
const exphbs = require('express-handlebars');	//hbs
const helpers = require('./helpers/helpers')(exphbs);	//helper
const Handlebars  = require('handlebars');
const bodyParser = require('body-parser');
const paginate = require('handlebars-paginate');
const session = require('express-session');
const fileupload = require('express-fileupload');
const fs = require('fs');
//const mysql = require("mysql");
const dotenv = require('dotenv');		//env

dotenv.config();

//공통모듈 테스트
//const common = require('./common');
const {add, mult, div, forSpase} = require('./helpers/commonHelpers');
//const result1 = common.add(3,2);
//const result2 = common.mult(3,2);
//const result3 = common.div(3,2);
//const result4 = minus(3,2);
//console.log("result1: ", common.add(3,2));
//console.log("result2: ", common.mult(3,2));
//console.log("result3: ", common.div(3,2));
//console.log("result4: ", common.minus(3,2));
//console.log("result5: ", common.mean([1, 2, 3, 4, 5]));
//공통모듈 테스트

const app = express();

const port = process.env.PORT || 5000;
const secret = process.env.SESSION_SECRET || 'secret';

//파일 업로드
//app.use(fileupload());
app.use(fileupload({
	defCharset: 'utf8',
    defParamCharset: 'utf8'
	//safeFileNames: true,
	//preserveExtension: true
}));

//세션
app.use(session({
	//secret: process.env.SESSION_SECRET,
	secret: secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		secure: false,
		maxAge: 1000 * 60 * 60 * 24		//1일
	}
}));

//전역 세션
app.use(function (req, res, next) {
	//console.log("req.session.isLogin : ", req.session.isLogin);
	res.locals.isLogin = false;
	res.locals.M_SEQ = "";
	res.locals.M_NAME = "";
	if(req.session.isLogin){
		res.locals.isLogin = req.session.isLogin;
		res.locals.M_SEQ = req.session.loginInfo.M_SEQ;
		res.locals.M_NAME = req.session.loginInfo.M_NAME;
	}
	
	res.locals.session = req.session;

	//메시지 창
	res.locals.alertMsg = req.session.alertMsg;
	delete req.session.alertMsg;
	next();
});

//페이지네이션
Handlebars.registerHelper('paginate', paginate);

Handlebars.registerHelper('boardNum', function (v1, v2, v3, v4, v5, options) {
	return (v1 - (v2 * (v3 - v4))) - v5;
});

Handlebars.registerHelper('calc', function (v1, operator, v2, options) {
	//return v1 operator v2;
	switch (operator) {
        case '+':
            return (v1 + v2);
		case '-':
			return (v1 - v2);
		case '/':
			return (v1 / v2);
		case '*':
			return (v1 * v2);
		default:
			return (v1 + v2);
	}
});

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
	if (v1 === v2) {
		return options.fn(this);
	}
	return options.inverse(this);
});

//앱 세팅 - Templatye Engine
var hbs = exphbs.create({
	helpers: {
		add, mult, forSpase
	},
	extname: '.hbs',
	defaultLayout: 'layout',			//이 부분이 없으면 main.hbs가 작동 (index 또는 기타 다른 이름으로 설정 가능)
	//layoutDir: __dirname + '/views/layouts',
	//partialDir: __dirname + '/views/partials',
	// partialsDir: [
    //     'shared/templates/',
    //     'views/partials/'
    // ]
});
app.engine('hbs', hbs.engine);
app.set("view engine", "hbs");


//console.log("__dirname", __dirname);
//app.set("views", __dirname + "/views");
//app.set("view engine", "ejs");

/*미들웨어*/
//app.use('/api', require('./routes/router-member'));

/*Parse application/json */
app.use(bodyParser.json());

/*Parse application/x-www-form-urlencoded */
app.use(bodyParser.urlencoded({extended: true}));

/*Static files */
//app.use(express.static(__dirname + 'public'));
app.use(express.static('public'));
app.use(express.static('upload'));

//DB연결 설정
const mysqlConn = require('./db/DbConn')();
const db = mysqlConn.init();

// const pool = mysql.createPool({
// 	connectionLimit: 100,
// 	host: process.env.DB_HOST,
// 	user: process.env.DB_USER,
// 	password: process.env.DB_PASS,
// 	database: process.env.DB_NAME
// });

db.connect((err) =>{
	if(err) throw err;
	// if (err) {
	// 	console.error("[MYSQL] Error on Connection: " + err);
	// 	return;
	// }
	console.log('Connected as ID ' + db.threadId);
});

//로그인 체크
const isAuth = (req, res, next) => {
	if(req.session.isAuth){
		console.log("A");
		//next();
	}else{
		console.log("B");
		//res.redirect('/member/login');
		res.render('../views/member/login', {originalUrl: req.originalUrl});
	}
}

const mainRouter = require('./server/routes/index');
const userRouter = require('./server/routes/user');
const boardRouter = require('./server/routes/boards');
const memberRouter = require('./server/routes/members');

//app.use('/', mainRouter);
app.use('/user', userRouter);
app.use('/board', boardRouter);
app.use('/member', memberRouter);

//Router
app.get('/', (req, res) => {
	res.render('home');
	//req.session.isAuth = true;
	//console.log("session: ", req.session);
	//console.log("session.id: ", req.session.id);
	//console.log("req.session.loginInfo: ", req.session.loginInfo);
});

app.use((req, res) => {
	res.render("404");
});

// 커스텀 404 페이지(404 핸들러)
// app.use(function(req, res, next){
// 	res.type('text/plain');
// 	res.status(404);
// 	res.send('404 - Not Found');
// });

// 커스텀 500 페이지
// app.use(function(err, req, res, next){
// 	console.error(err.stack);
// 	res.type('text/plain');
// 	res.status(500);
// 	res.send('500 - Server Error');
// });

//db.end();

app.listen(port, () => console.log(`서버 시작 port ${port}`));