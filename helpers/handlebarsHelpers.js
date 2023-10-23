const Handlebars  = require('handlebars');

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