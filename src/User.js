var User = function(id,name) {
	return $("<span/>").attr({
		"style": "width:1%;",
		"class": "selectableBox"
	}).text(name).click(function() {
		if(id != eWolf.data("userID")) {
			eWolf.trigger("search",[id,name]);
		} else {
			eWolf.trigger("select",[id]);
		}
	});
};