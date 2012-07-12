var Wolfpack = function(name) {
	var box = $("<span/>").attr({
		"style": "width:1%;",
		"class": "userBox"
	}).text(name).click(function() {
		eWolf.trigger("select",["__packid__"+name]);
	});	
		
	return box;
};