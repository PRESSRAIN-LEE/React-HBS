"use strict";

const express = require('express');
//const session = require('express-session');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//const secret = process.env.SESSION_SECRET || 'secret';

const router = express.Router();
const membersController = require('../controllers/membersController');

//세션
// router.use(session({
// 	//secret: process.env.SESSION_SECRET,
// 	secret: secret,
// 	resave: false,
// 	saveUninitialized: false,
// 	maxAge: 1000 * 60 * 60 * 24,		//1일
// 	cookie: {
// 		secure: false,
// 		maxAge: 1000 * 60 * 60 * 24		//1일
// 	}
// }));

//레이어 alert
// router.use(function(req, res, next){
// 	res.locals.flash = req.session.flash;
// 	delete req.session.flash;
// 	next();
// });

const isAuth = (req, res, next) => {
	if(req.session.isLogin){
		next();
	}else{
		//res.redirect('/member/login');
		res.render('../views/member/login');
	}
}


//로그인
router.get('/login', membersController.login);
router.post('/login', membersController.loginProc);

//아이디, 비번 분실
router.get('/forgotId', membersController.forgotId);
router.get('/forgotPw', membersController.forgotPw);

//로그아웃
router.get('/logout', membersController.logout);

//회원가입
router.get('/join', membersController.join);
router.post('/join', membersController.joinProc);

//회원가입 > 아이디 붕복 체크
router.post('/join/dupId', membersController.dupId);

//마이페이지 & 내정보 수정
router.get('/myPage', isAuth, membersController.myPage);

router.get('/myInfo', isAuth, membersController.myInfo);
router.post('/myInfo', isAuth, membersController.myInfoProc);

//회원탈퇴
router.get('/withdraw', membersController.withdraw);

module.exports = router;