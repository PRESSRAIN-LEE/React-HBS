"use strict";

//DB연결 설정
const mysqlConn = require('../../db/DbConn')();
const db = mysqlConn.init();

//View Users
exports.view = (req, res) => {
	const sql = `SELECT * 
	FROM TBL_MEMBER
	WHERE 1 = 1 
	AND M_AUTH > 0 `;
	db.query(sql, (err, rows, next) => {
		if(!err){
			res.render('home', { rows });
			//console.log(rows);
		}else{
			console.log(err);
		}
		//console.log("완료:", rows);
	});
	// db.connect((err) =>{
	// 	//if(err) throw err;
	// 	 if (err) {
	// 	 	console.error("[MYSQL] Error on Connection: " + err);
	// 	 	return;
	// 	 }
	// 	console.log('Connected as ID ' + db.threadId);
	// });
};

//검색
exports.find = (req, res) => {
	let searchTerm = req.body.search;

	const sql = `SELECT * 
	FROM TBL_MEMBER
	WHERE 1 = 1 
	AND M_ID LIKE ? 
	OR M_NAME LIKE ?  `;
	db.query(sql, ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows, next) => {
		if(!err){
			res.render('home', { rows });
			//console.log(rows);
		}else{
			console.log(err);
		}
		//console.log("완료:", rows);
	});
};


//사용자 등록폼
exports.form = (req, res) => {
	res.render('add-user');
};

	//사용자 저장
exports.create = (req, res) => {
	const { M_ID, M_NAME } = req.body;

	const sql = `INSERT INTO TBL_MEMBER SET M_ID = ? 
	, M_NAME = ?`;
	db.query(sql, [M_ID, M_NAME], (err, rows, next) => {
		if(!err){
			res.render('add-user', { alert: 'User added successfully'});
			//res.render('home');
		}else{
			console.log(err);
		}
		//console.log("완료:", rows);
	});
};


//https://youtu.be/1aXZQcG2Y6I?feature=shared&t=6018

//수정
exports.edit = (req, res) => {
	const sql = `SELECT * 
	FROM TBL_MEMBER
	WHERE 1 = 1 
	AND M_SEQ = ?`;
	db.query(sql, [req.params.id], (err, rows, next) => {
		if(!err){
			res.render('edit-user', { rows });
		}else{
			console.log(err);
		}
	});
};

//수정 - 저장
exports.update = (req, res) => {
	const { M_ID, M_NAME } = req.body;
	const sql = `UPDATE TBL_MEMBER SET M_ID = ?
	, M_NAME = ?
	WHERE 1 = 1 
	AND M_SEQ = ?`;
	db.query(sql, [M_ID, M_NAME, req.params.id], (err, rows, next) => {
		if(!err){
			//res.render('edit-user', { rows });
			const sql = `SELECT * 
			FROM TBL_MEMBER
			WHERE 1 = 1 
			AND M_SEQ = ?`;
			db.query(sql, [req.params.id], (err, rows, next) => {
				if(!err){
					res.render('edit-user', { rows,  alert: `${M_NAME} has been updated.` });
				}else{
					console.log(err);
				}
			});
		}else{
			console.log(err);
		}
	});
};

//삭제
exports.delete = (req, res) => {
	// const sql = `DELETE FROM TBL_MEMBER
	// WHERE 1 = 1 
	// AND M_SEQ = ?`;
	// db.query(sql, [req.params.id], (err, rows, next) => {
	// 	if(!err){
	// 		res.redirect('/');
	// 	}else{
	// 		console.log(err);
	// 	}
	// });

	const sql = `UPDATE TBL_MEMBER SET M_AUTH = 0 
	WHERE 1 = 1 
	AND M_SEQ = ?`;
	db.query(sql, [req.params.id], (err, rows, next) => {
		if(!err){
			let removeUser = encodeURIComponent('User successfully removed.')
			res.redirect('/');
		}else{
			console.log(err);
		}
	});
};

//View Users
exports.viewall = (req, res) => {
	const sql = `SELECT * 
	FROM TBL_MEMBER
	WHERE 1 = 1 
	AND M_SEQ = ? `;
	db.query(sql, [req.params.id], (err, rows, next) => {
		if(!err){
			res.render('view-user', { rows });
			//console.log(rows);
		}else{
			console.log(err);
		}
		//console.log("완료:", rows);
	});
};