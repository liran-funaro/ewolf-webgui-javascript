var Wolfpack = function(name) {
	return $("<span/>").attr({
		"style": "width:1%;",
		"class": "selectableBox"
	}).text(name).click(function() {
		eWolf.trigger("select",["__pack__"+name]);
	});
};