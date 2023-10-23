//사용 안함
function hbsHelpers(hbs) {
	return hbs.create({
	  helpers: { // This was missing
		inc: function(value, options) {
		  console.log('reading it');
		  return parseInt(value) + 1;
		},
		strong: function(text) {
			return '<strong>' + text + '</strong>';
		}
  
		// More helpers...
	  }
  
	});
  }
  
  module.exports = hbsHelpers;