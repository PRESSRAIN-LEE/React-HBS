"use strict";

//공통모듈 테스트
//##########방법1.##########
/*
const add = (a, b) => {
	return a + b;
}
//module.exports = add;

const mult = (a, b) => {
	return a * b;
}

const div = (a, b) => {
	return a / b;
}

const minus = (a, b) => {
	return a - b;
}

const mean = (arr) => {
	if(arr.length === 0){
		return 0;
	}
	let sum = 0;
	for(let i = 0; i < arr.length; i++){
		sum += arr[i];
	}
	return sum / arr.length;
}

module.exports = {add, mult, div, minus, mean};
*/
/*
같은 방법1.
module.exports.add = add;
module.exports.mult = mult;
module.exports.div = div;
module.exports.minus = minus;
module.exports.mean = mean;

같은 방법2.
module.exports = {
	add: add, 
	mult: mult, 
	div: div, 
	minus: minus, 
	mean: mean
};
*/

//##########방법2.##########
exports.add = (a, b) => {
	return a + b;
};
//module.exports = add;

exports.mult = (a, b) => {
	return a * b;
};

exports.div = (a, b) => {
	return a / b;
};

exports.minus = (a, b) => {
	return a - b;
};

exports.mean = (arr) => {
	if(arr.length === 0){
		return 0;
	}
	let sum = 0;
	for(let i = 0; i < arr.length; i++){
		sum += arr[i];
	}
	return sum / arr.length;
};

exports.sessionIfo = (arr) => {
	//console.log("arr: ", arr);
	//console.log("arr: ", arr.loginInfo);
};

//계층형 게시판 답변 표시
exports.forSpase = (value) => {
	let result = "";
	for(let i = 0; i < value; i++){
		result += "&nbsp;&nbsp;";
	}
	return result;
};