var User = function(id,name) {
	return $("<span/>").attr({
		"style": "width:1%;",
		"class": "userBox"
	}).text(name).click(function() {
		eWolf.trigger("search",[id]);
	});	
};