"use strict";

const express = require('express');
//const session = require('express-session');
const dotenv = require('dotenv');		//env
const boardsController = require('../controllers/boardsController');

const router = express.Router();

//const secret = process.env.SESSION_SECRET || 'secret';

//세션
// router.use(session({
// 	//secret: process.env.SESSION_SECRET,
// 	secret: secret,
// 	resave: false,
// 	saveUninitialized: false,
// 	cookie: {
// 		secure: false,
// 		maxAge: 1000 * 60 * 60 * 24		//1일
// 	}
// }));

//레이어 alert
// router.use(function(req, res, next){
// 	// if there's a flash message, transfer
// 	// it to the context, then clear it
// 	res.locals.flash = req.session.flash;
// 	delete req.session.flash;
// 	next();
// });

//로그인 체크 ########################################################//
const isAuth = (req, res, next) => {
	if(req.session.isLogin){
		next();
	}else{
		//console.log("로그인 페이지로 이동");
		//res.redirect('/member/login');
		res.render('../views/member/login', {originalUrl: req.originalUrl});
	}
}
//로그인 체크 ########################################################//

//게시판 기능 ########################################################//
//리스트
router.get('/', boardsController.list);			//목록
//router.get('/search', boardsController.search);	//검색
// router.get('/search', (req, res) => {
// 	console.log("검색");
// 	console.log("searchText: ", req.query.searchText);
// });	//검색

//읽기
router.get('/read/:id', isAuth, boardsController.readCnt);	//읽기
router.get('/view/:id', isAuth, boardsController.view);		//읽기 카운트 증가

//첨부파일 다운로드, 첨부파일 삭제
router.get('/attach/:id/:order', boardsController.fileDownload);	//첨부파일 다운로드
router.get('/fileDelete/:id/:order', boardsController.fileDelete);	//첨부파일 다운로드

//쓰기
router.get('/write', isAuth, boardsController.write);
router.post('/write', isAuth, boardsController.writeProc);

//답변
router.get('/reply/:id', isAuth, boardsController.reply);
router.post('/reply/:id', isAuth, boardsController.replyProc);

//수정
router.get('/edit/:id', isAuth, boardsController.edit);
router.post('/edit/:id', isAuth, boardsController.editProc);

//삭제
//router.delete('/', (req, res) => {
//	console.log(req.body);
//});
router.get('/delete/:id', isAuth, boardsController.deleteProc);

//좋아요 기능 저장
router.get('/good/:id', boardsController.goodLike);
router.get('/goodCancel/:id', boardsController.goodLikeCancel);
//게시판 기능 ########################################################//


//comment 기능 ########################################################//
//comment write 저장
router.post('/commentWrite/:seq', boardsController.commentWriteProc);

//comment delete 처리
router.get('/commentDelete/:seq/:id', boardsController.commentDeleteProc);
//comment 기능 ########################################################//

module.exports = router;