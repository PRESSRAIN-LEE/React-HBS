"use strict";

//DB연결 설정
const mysqlConn = require('../../db/DbConn')();
const db = mysqlConn.init();

//파일 업로드 / 다운로드
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const uploadDir = path.join(__dirname, '../../upload/board');
var mime = require('mime');
const fs = require('fs');

//const express = require('express');
//const session = require('express-session');

const dotenv = require('dotenv');		//env
dotenv.config();
//const router = express.Router();

//게시판 기능 ########################################################//
//게시판 목록
exports.list = (req, res) => {
	//res.render('../views/board/boardList');
	//const sql2 = `SELECT COUNT(*) CNT FROM TBL_BOARD WHERE 1 = 1 AND board_state = 'Y'; `;
	console.log("authenticated: ", req.session);

	let {searchText, page} = req.query;
	searchText = searchText ? searchText : "";
	page = page ? page : 1;

	const pageSize = 10;		//한페이지에 보여줄 리스트 row수
	const pageBlock = 5;	//한페이지에 보여줄 페이징 갯수

	let startLimit = 0;
	if (page === "" || page === undefined || typeof page === "undefined" || page === null) {
		startLimit = 0 * pageSize; // 1페이지는 무조건 0부터 시작
	}else{
		startLimit = (page - 1) * pageSize; // 1페이지는 무조건 0부터 시작
	}

	let sql = "SELECT id, ref_level, ref_step, board_title, board_read, board_file1, board_file2, DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at";
	sql += ", M_ID, M_NAME ";
	sql += ", (SELECT COUNT(*) FROM TBL_BOARD_COMMENT WHERE B_SEQ = A.id) AS COMMENT_CNT ";
	sql += "FROM TBL_BOARD A INNER JOIN TBL_MEMBER B ON A.member_seq = B.M_SEQ "
	sql += "WHERE 1 = 1 ";
	sql += "AND board_state = 'Y' ";
	//if(searchText){
		sql += "AND INSTR(board_title, ?) > 0 "
	//}
	sql += "ORDER BY ref DESC, ref_level ASC, id DESC ";
	sql += "LIMIT ?, ? ";
	sql += "; ";
	sql += "SELECT COUNT(*) CNT ";
	sql += "FROM TBL_BOARD A INNER JOIN TBL_MEMBER B ON A.member_seq = B.M_SEQ  ";
	sql += "WHERE 1 = 1 ";
	sql += "AND board_state = 'Y' ";
	//if(searchText){
	sql += "AND INSTR(board_title, ?) > 0 "
	//}
	sql += "; ";

	//const sql2 = `SELECT COUNT(*) CNT FROM TBL_BOARD WHERE 1 = 1 AND board_state = 'Y'; `;
	//const sql3 = `SELECT COUNT(*) CNT FROM TBL_BOARD_COMMENR WHERE 1 = 1 AND B_SEQ = ''`
	db.query(sql, [searchText, startLimit, pageSize, searchText], (err, rows) => {
		if(!err){
			var boardNumList = [];
			let boardNum = rows[1][0].CNT;
			let boardNum1 = 0;
			for (var data of rows[0]){
				boardNum = (rows[1][0].CNT - (pageSize * (page - 1))) - boardNum1;
				//console.log("boardNumList : ", boardNum--);
				boardNumList.push(boardNum--);
				boardNum1++;
			};
			//console.log("boardNumList : ", boardNumList);
			const pageCount = Math.ceil(rows[1][0].CNT/pageSize);
			//let boardNum = (rows[1][0].CNT - (pageSize * (page - 1)))
			//console.log("pageCount: ", pageCount);
			//res.render('../views/board/boardList', { rows: rows[0], rowsCnt: rows[1][0].CNT, searchText: searchText, pageSize, pageBlock, pageCount, page, pageTitle: "게시판"});
			res.render('../views/board/boardList', { rows: rows[0], rowsCnt: rows[1][0].CNT, searchText: searchText
				, pagination: {
					pageSize: pageSize,
					pageBlock: pageBlock,
					pageCount: Number(pageCount),
					page: page,
					pageBlock: pageBlock,
				},
				boardNumList: boardNumList,
				pageTitle: "게시판"});
			//console.log("rows0: " , boardNumList);
			//console.log("rows1: " , rows[1][0]);
		}else{
			console.log(err);
		}
		//console.log("완료:", rows);
	});
};

//게시판 검색
exports.search = (req, res) => {
	//const {searchText} = req.body;
	const {searchText} = req.query;
	//console.log("searchText: ", req.body);
	console.log("검색");
	console.log("searchText: ", req.query.searchText);

	const sql = `SELECT id, member_name, board_title, board_read, board_file1, board_file2, DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at, 
	(SELECT COUNT(*) FROM TBL_BOARD_COMMENT WHERE B_SEQ = TBL_BOARD.id) AS COMMENT_CNT 
	FROM TBL_BOARD
	WHERE 1 = 1 
	AND board_state = 'Y' 
	AND INSTR(board_title, ?) > 0 
	ORDER BY ref DESC, ref_level ASC, id DESC
	LIMIT 0, 10;
	`;
	const sql2 = `SELECT COUNT(*) CNT FROM TBL_BOARD WHERE 1 = 1 AND board_state = 'Y' AND INSTR(board_title, ?) > 0 ; `;
	//const sql3 = `SELECT COUNT(*) CNT FROM TBL_BOARD_COMMENR WHERE 1 = 1 AND B_SEQ = ''`
	db.query(sql + sql2, [searchText, searchText],  (err, rows, next) => {
		if(!err){
			// var data = {
			// 	boards : [
			// 		{ board_title : rows.board_title, member_name : rows.member_name },
			// 	]
			// };

			//res.render('../views/board/boardList', { rows: rows[0], rowsCnt: rows[1][0].CNT, searchText: searchText});
			//console.log("rows0: " , rows[0]);
			//console.log("rows1: " , rows[1][0]);
		}else{
			console.log(err);
		}
		//console.log("완료:", rows);
	});
};

//게시판 글 읽기
exports.view = (req, res) => {
	//res.send('../views/board/boardRead');
	const id = req.params.id;

	//게시판 글
	const sql = `SELECT *, DATE_FORMAT(created_at, '%Y-%m-%d %H:%1:%s') AS created_at 
	, REPLACE(board_content, '\r', '<BR>') AS board_content 
	, (SELECT COUNT(*) FROM TBL_BOARD_LIKE WHERE B_SEQ = A.id AND M_SEQ = ?) AS LIKE_CNT
	FROM TBL_BOARD A INNER JOIN TBL_MEMBER B ON A.member_seq = B.M_SEQ 
	WHERE id = ?; `;
	//좋아요
	//const sqlLike = `SELECT * FROM TBL_BOARD_LIKE WHERE B_SEQ = ? AND M_SEQ = ? ; `;

	//코멘트
	const sqlComment = `
						SELECT *, DATE_FORMAT(BC_DATE, '%y.%m.%d %H:%i:%s') AS BC_DATE 
						, REPLACE(BC_MEMO, CHAR(13), '<BR>') AS BC_MEMO 
						FROM TBL_BOARD_COMMENT A 
						INNER JOIN TBL_MEMBER B ON A.M_SEQ = B.M_SEQ 
						WHERE B_SEQ = ? AND BC_STATE = 'U'
						ORDER BY A.BC_SEQ DESC; `;
	db.query(sql, [req.session.M_SEQ, id], (err, results, next) => {
		if(err) throw err;
		db.query(sqlComment, [id], (err, rows, next) => {
			if(err) throw err;
			//console.log("rows++: ", JSON.stringify(rows));
			//console.log("results: ", results);
			res.render('../views/board/boardRead', { results, rows });
		});
	});
};


//게시판 글 읽기 조회 증가
exports.readCnt = (req, res) => {
	const id = req.params.id;
	const sql = `UPDATE TBL_BOARD SET board_read = board_read + 1 
	WHERE 1 = 1 
	AND id = ?`;
	db.query(sql, [id], (err, rows, next) => {
		if(!err){
			res.redirect(`/board/view/${id}`);
		}else{
			res.redirect(`/board/view/${id}`);
			console.log(err);
		}
	});
};

//파일 다운로드
exports.fileDownload = (req, res) => {
	//res.send("fileDownload");
	const { id, order } = req.params;
	const upload_folder = 'upload/board/';
	var getDownloadFilename = require('../../lib/getDownloadFilename').getDownloadFilename;
	
	//테이블에서 seq로 파일 검색
	const sql = `SELECT board_file1, board_file1_ori, board_file2, board_file2_ori FROM TBL_BOARD WHERE id = ? `
	db.query(sql, [id], (err, results) => {
		//if(err) throw err;
		try {
			let file1 = upload_folder + results[0].board_file1;
			let file1Ori = upload_folder + results[0].board_file1_ori;
			let file2 = upload_folder + results[0].board_file2;
			let file2Ori = upload_folder + results[0].board_file2_ori;

			let file = "";
			let fileOri = "";
			switch(order){
				case "1":
					file = file1;
					fileOri = file1Ori;
					break;
				case "2":
					file = file2;
					fileOri = file2Ori;
					break;
			}
			if (fs.existsSync(file)) { // 파일이 존재하는지 체크
				var filename = path.basename(fileOri);	// 파일 경로에서 파일명(확장자포함)만 추출
				var mimetype = mime.getType(file);		// 파일의 타입(형식)을 가져옴

				//res.setHeader('Content-disposition', 'attachment; filename=' + filename1Ori); // 다운받아질 파일명 설정
				res.setHeader('Content-disposition', 'attachment; filename=' + getDownloadFilename(req, filename)); // 다운받아질 파일명 설정
				res.setHeader('Content-type', mimetype); // 파일 형식 지정

				var filestream = fs.createReadStream(file);
				filestream.pipe(res);
			}else{
				res.send('해당 파일이 없습니다.');  
				return;
			}
		}catch(e){
			console.log(e);
			res.send('파일을 다운로드하는 중에 에러가 발생하였습니다.');
			return;
		}
	});
};

//파일 삭제
exports.fileDelete = (req, res) => {
	const { id, order } = req.params;
	const upload_folder = 'upload/board/';
	let delFile = "";
	const sql = `SELECT board_file1, board_file2 FROM TBL_BOARD WHERE id = ? `;
	db.query(sql, [id], (err, results) => {
		switch(order){
			case "1":
				delFile = results[0].board_file1;
				break;
			case "2":
				delFile = results[0].board_file2;
				break;
		}
		
		fs.unlink(`${uploadDir}/${delFile}`, function(err) {
			// if(err) {
			// 	res.json({isDeleted:"false"});
			// }
			// res.json({isDeleted:"true"});
		})
	});

	let sqlUpdate = "UPDATE TBL_BOARD SET ";
	switch(order){
		case "1":
			sqlUpdate += "board_file1 = '', board_file1_ori = '' ";
			break;
		case "2":
			sqlUpdate += "board_file2 = '', board_file2_ori = '' ";
			break;
	}
	sqlUpdate += "WHERE id = ? ";
	db.query(sqlUpdate, [id], (err, results) => {
		console.log("err: ", err);
		if(!err){
			req.session.alertMsg = {
				type: 'danger',
				intro: '[파일 삭제 성공]',
				message: '파일이 삭제되었습니다.',
			};

			res.redirect(`/board/edit/${id}`);
		}else{
			res.redirect(`/board/edit/${id}`);
			console.log(err);
		}
	});
};

//게시판 글 쓰기
exports.write = (req, res) => {
	res.render('../views/board/boardWrite');
};


//게시판 글 쓰기 저장
exports.writeProc = (req, res) => {
	if(!req.files || Object.keys(req.files).length === 0 ){
		//return res.status(400).send("파일 없음");
	}

	let saveFileName1, saveFileName2;
	let oriFileName1, oriFileName2;

	if(req.files){
		//console.log("files1: ", req.files.boardFile1);
		//console.log("files2: ", req.files.boardFile2);
	
		if (req.files.boardFile1) {
			const boardFile1 = req.files.boardFile1;
			//console.log("boardFile1: ", req.files.boardFile1.name);
			saveFileName1 = `${uuidv4()}${path.extname(boardFile1.name)}`;
			oriFileName1 = boardFile1.name;
			boardFile1.mv(path.join(uploadDir, saveFileName1));
		}
		if (req.files.boardFile2) {
			const boardFile2 = req.files.boardFile2;
			//console.log("boardFile1: ", req.files.boardFile2.name);
			saveFileName2 = `${uuidv4()}${path.extname(boardFile2.name)}`;
			oriFileName2 = boardFile2.name;
			boardFile2.mv(path.join(uploadDir, saveFileName2));
		}
	}

	//let newFileName = new Date().getTime();
	//https://velog.io/@okko8522/%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%97%85%EB%A1%9C%EB%93%9C%EB%A7%8C-%ED%95%A0-%EC%88%98-%EC%9E%88%EB%8A%94-%EC%9E%84%EC%8B%9C%EC%84%9C%EB%B2%84-Node.JS%EB%A1%9C-%EB%A7%8C%EB%93%A4%EA%B8%B0
	//const fileExt = `${path.extname(boardFile1.name)}`;
	//console.log("uploadDir1: " , uploadDir);
	//console.log("oriFileName1: " , oriFileName1);
	//console.log("saveFileName1: " , saveFileName1);
	//console.log("boardFile3: " , fileExt);
	//console.log("uuidv4: " , uuidv4());

	// uploadPath = __dirname + '/../../upload/' + boardFile1.name;
	// uploadPath = __dirname + '/../../upload/' + saveFileName;
	// console.log("uploadPath: " , uploadPath);

	/*
	boardFile1.mv(path.join(uploadDir, saveFileName), (err) => {
	//boardFile1.mv(uploadPath, function (err){
		if(err) return res.status(500).send(err);
		res.send("파일 업로드 완료");
	});
	*/

	const { memberName, boardTitle, boardMemo } = req.body;
	const memberSeq = req.session.M_SEQ;
	let maxRef = 0;
	const sqlMax = "SELECT IFNULL(MAX(ref), 0) + 1 AS MAX_REF FROM TBL_BOARD";
	db.query(sqlMax, (err, result, next) => {
		//console.log("완료:", result[0].MAX_REF);
		if(!err){
		maxRef = result[0].MAX_REF;
		//res.send(maxRef);
		//console.log("완료1:", maxRef);
		}
	});
	
	const sql = `INSERT INTO TBL_BOARD SET ref = 0, ref_level = 0, ref_step = 0
				, member_seq = ?, member_name = ?
				, board_title = ?, board_content = ?
				, board_file1 = ?, board_file1_ori = ?
				, board_file2 = ?, board_file2_ori = ? `

	//const sql = `INSERT INTO TBL_BOARD ( ref, ref_level, ref_step, member_seq, member_name, board_title, board_content )
	//							SELECT IFNULL(MAX(ref), 0) + 1, 0, 0, ?, ?, ?, ? FROM TBL_BOARD
	//`;
	
	db.query(sql, [memberSeq, memberName, boardTitle, boardMemo, saveFileName1, oriFileName1, saveFileName2, oriFileName2], (err, rows, next) => {
		if(!err){
			//console.log("완료2:", rows.insertId);
			const sqlUpdate = `UPDATE TBL_BOARD SET ref = ?
			WHERE id = ? `
			db.query(sqlUpdate, [maxRef, rows.insertId], (err, result) => {
				//if(err) throw err;
			});

			req.session.alertMsg = {
				type: 'success',
				intro: '[글 등록 성공]',
				message: '글이 등록되었습니다.',
			};

			res.redirect(303, '/board');
		}else{
			console.log(err);
		}
	});
};


//게시판 글 수정
exports.edit = (req, res) => {
	const id = req.params.id;
	const sql = `SELECT * FROM TBL_BOARD
	WHERE 1 = 1 
	AND id = ?`;
	db.query(sql, [id], (err, rows, next) => {
		if(!err){
			res.render('../views/board/boardEdit', { rows });
		}else{
			console.log(err);
		}
	});
};


//게시판 글 수정 저장
exports.editProc = (req, res) => {
	const { memberSeq, memberName, boardTitle, boardMemo } = req.body;
	const { id } = req.params;

	let saveFileName1, saveFileName2;
	let oriFileName1, oriFileName2;

	if(req.files){
		//console.log("files1: ", req.files.boardFile1);
		//console.log("files2: ", req.files.boardFile2);
	
		if (req.files.boardFile1) {
			const boardFile1 = req.files.boardFile1;
			//console.log("boardFile1: ", req.files.boardFile1.name);
			saveFileName1 = `${uuidv4()}${path.extname(boardFile1.name)}`;
			oriFileName1 = boardFile1.name;
			boardFile1.mv(path.join(uploadDir, saveFileName1));

			//첨부파일이 있는 상태에서 첨부파일을 업로드 하면 기존의 첨부파일을 삭제 후 새로운 파일로 업데이트
			const sqlFile = `SELECT board_file1 FROM TBL_BOARD WHERE id = ?`;
			db.query(sqlFile, [id], (err, results) => {
				const delFile1 = results[0].board_file1;
				fs.unlink(`${uploadDir}/${delFile1}`, function(err) {
					// if(err) {
					// 	res.json({isDeleted:"false"});
					// }
					// res.json({isDeleted:"true"});
				})
			});
		}

		if (req.files.boardFile2) {
			const boardFile2 = req.files.boardFile2;
			//console.log("boardFile1: ", req.files.boardFile2.name);
			saveFileName2 = `${uuidv4()}${path.extname(boardFile2.name)}`;
			oriFileName2 = boardFile2.name;
			boardFile2.mv(path.join(uploadDir, saveFileName2));

			//첨부파일이 있는 상태에서 첨부파일을 업로드 하면 기존의 첨부파일을 삭제 후 새로운 파일로 업데이트
			const sqlFile = `SELECT board_file2 FROM TBL_BOARD WHERE id = ?`;
			db.query(sqlFile, [id], (err, results) => {
				const delFile2 = results[0].board_file2;

				fs.unlink(`${uploadDir}/${delFile2}`, function(err) {
					// if(err) {
					// 	res.json({isDeleted:"false"});
					// }
					// res.json({isDeleted:"true"});
				})
			});
		}
	}

	const sql = `UPDATE TBL_BOARD SET member_seq = ?, member_name = ?
				, board_title = ?, board_content = ?
				, board_file1 = ?, board_file1_ori = ?
				, board_file2 = ?, board_file2_ori = ? 
				WHERE id = ?`;
	
	db.query(sql, [memberSeq, memberName, boardTitle, boardMemo, saveFileName1, oriFileName1, saveFileName2, oriFileName2, id], (err, rows, next) => {
		if(!err){
			req.session.alertMsg = {
				type: 'success',
				intro: '[글 수정 성공]',
				message: '글이 수정되었습니다.',
			};

			res.redirect(303, '/board');
		}else{
			console.log(err);
		}
		//console.log("완료:", rows);
	});
};


//게시판 글 답변
exports.reply = (req, res) => {
	//res.render('../views/board/boardReply');

	const id = req.params.id;
	const sql = `SELECT * FROM TBL_BOARD
	WHERE 1 = 1 
	AND id = ?`;
	db.query(sql, [id], (err, rows, next) => {
		if(err) throw err;
		// if(err){
		// 	res.type('text/plain');
		// 	res.status(500);
		// 	res.send('500 - Server Error');
		// 	console.log("error: ", err.sqlMessage);
		// }
		
		//if(err) console.error("error: ", err); res.status(500).send(err.message);
		//if(!err){
			res.render('../views/board/boardReply', { rows, writeMode: "REPLY" });
			//console.log("rows: ", rows);
		//}else{
			//console.log(err);
			//res.status(500).send(err.message);
		//}
	});
};


//게시판 글 답변 저장
exports.replyProc = (req, res) => {
	let saveFileName1, saveFileName2;
	let oriFileName1, oriFileName2;

	if(req.files){
		//console.log("files1: ", req.files.boardFile1);
		//console.log("files2: ", req.files.boardFile2);
	
		if (req.files.boardFile1) {
			const boardFile1 = req.files.boardFile1;
			//console.log("boardFile1: ", req.files.boardFile1.name);
			saveFileName1 = `${uuidv4()}${path.extname(boardFile1.name)}`;
			oriFileName1 = boardFile1.name;
			boardFile1.mv(path.join(uploadDir, saveFileName1));
		}
		if (req.files.boardFile2) {
			const boardFile2 = req.files.boardFile2;
			//console.log("boardFile1: ", req.files.boardFile2.name);
			saveFileName2 = `${uuidv4()}${path.extname(boardFile2.name)}`;
			oriFileName2 = boardFile2.name;
			boardFile2.mv(path.join(uploadDir, saveFileName2));
		}
	}

	const { memberName, boardTitle, boardMemo, ref, ref_level, ref_step } = req.body;
	//const { id } = req.params;
	const memberSeq = req.session.M_SEQ;
	// const sqlRef = "SELECT IFNULL(ref, 0) AS ref, IFNULL(ref_level, 0) AS ref_level, IFNULL(ref_step, 0) AS ref_step FROM TBL_BOARD WHERE id = ?";
	// db.query(sqlRef, [id], (err, result, next) => {
	// 	if(err) throw err;
	// 	ref = result[0].ref;
	// 	ref_level = result[0].ref_level;
	// 	ref_step = result[0].ref_step;
	// });
	
	//console.log("ref_level: ", Number(ref_level) + 1);

	const sql = `
				UPDATE TBL_BOARD SET ref_step = ref_step + 1 WHERE ref = ? AND ref_step > ?;

				INSERT INTO TBL_BOARD SET ref = ?, ref_level = ?, ref_step = ?
				, member_seq = ?, member_name = ?
				, board_title = ?, board_content = ?
				, board_file1 = ?, board_file1_ori = ?
				, board_file2 = ?, board_file2_ori = ?
				`;
	db.query(sql, [ref, ref_step, ref, Number(ref_level) + 1, Number(ref_level) + 1, memberSeq, memberName, boardTitle, boardMemo, saveFileName1, oriFileName1, saveFileName2, oriFileName2], (err, rows, next) => {
	//db.query(sql, [ref, ref_step, ref, Number(ref_level) + 1, Number(ref_level) + 1, memberSeq, memberName, boardTitle, boardMemo], (err, results, next) => {
		//if(err) throw err;
		if(!err){
			req.session.alertMsg = {
				type: 'success',
				intro: '[글 등록 성공]',
				message: '글이 등록되었습니다.',
			};
			
			console.log(req.session.alertMsg);

			res.redirect(303, '/board');
			//console.log("results: ", results)
		}else{
			console.log(err);
		}
	});
};


//게시판 삭제(update)
exports.deleteProc = (req, res) => {
	//const { id } = req.params;
	console.log("id: ", req.params.id);
	const sql = `UPDATE TBL_BOARD SET board_state = 'N' 
	WHERE 1 = 1 
	AND id = ?`;
	db.query(sql, [req.params.id], (err, rows, next) => {
		if(!err){
			//console.log(rows);

			//let delResult = [
			//	({ deleteSuccess: true, message: "삭제되었습니다." })
				//return [{
				//	deleteSuccess: true,
				//	message: "삭제되었습니다."
			//}]
			//];
			next = "/board";
			//console.log((delResult));

			req.session.alertMsg = {
				type: 'danger',
				//intro: 'Validation error!',
				message: '삭제되었습니다.',
			};

			res.redirect(303, '/board');
			//res.redirect(303, next);
		}else{
			console.log(err);
		}
	});
};

//좋아요 기능
exports.goodLike = (req, res) => {
	const id = req.params.id;
	//const sql = `UPDATE TBL_BOARD SET board_good = board_good + 1 WHERE 1 = 1 AND id = ?`;
	const sql = `INSERT INTO TBL_BOARD_LIKE SET B_SEQ = ?, M_SEQ = ? `;
	db.query(sql, [id, req.session.M_SEQ], (err, rows, next) => {
	//db.query(sql, [id], (err, rows, next) => {
		if(err) throw err;
		req.session.alertMsg = {
			type: 'success',
			intro: '[좋아요 성공]',
			message: '좋아요가 추가되었습니다.',
		};
		res.redirect(303, `/board/view/${id}`);

		// if(!err){
		// 	res.redirect(`/board/view/${id}`);
		// }else{
		// 	res.redirect(`/board/view/${id}`);
		// 	console.log(err);
		// }
	});
};
//좋아요 취소 기능
exports.goodLikeCancel = (req, res) => {
	const id = req.params.id;
	const sql = `DELETE FROM TBL_BOARD_LIKE WHERE B_SEQ = ? AND M_SEQ = ? `;
	db.query(sql, [id, req.session.M_SEQ], (err, rows, next) => {
	//db.query(sql, [id], (err, rows, next) => {
		if(err) throw err;
		req.session.alertMsg = {
			type: 'success',
			intro: '[좋아요 취소 성공]',
			message: '좋아요가 취소되었습니다.',
		};
		res.redirect(303, `/board/view/${id}`);
	});
};
//게시판 기능 ########################################################//


//comment 기능 ########################################################//
//코멘트 저장
exports.commentWriteProc = (req, res) => {
	const { memberSeq, commentMemo } = req.body;
	const boardSeq = req.params.seq;
	const sql = `INSERT INTO TBL_BOARD_COMMENT SET B_SEQ = ?, M_SEQ = ?, BC_MEMO = ?`;
	db.query(sql, [boardSeq, memberSeq, commentMemo], (err, results, next) => {
		if(err) throw err;
		req.session.alertMsg = {
			type: 'success',
			intro: '[Comment등록 성공]',
			message: 'Comment 등록되었습니다.',
		};
		res.redirect(303, `/board/view/${boardSeq}`);
	});
};

//코멘트 삭제
exports.commentDeleteProc = (req, res) => {
	const commentSeq = req.params.seq;
	const boardSeq = req.params.id;
	const sql = `UPDATE TBL_BOARD_COMMENT SET BC_STATE = 'D' WHERE BC_SEQ = ?`;
	db.query(sql, [commentSeq], (err, results, next) => {
		if(err) throw err;
		req.session.alertMsg = {
			type: 'danger',
			intro: '[Comment삭제 성공]',
			message: 'Comment가 삭제되었습니다.',
		};
		res.redirect(303, `/board/view/${boardSeq}`);
	});
}
//comment 기능 ########################################################//