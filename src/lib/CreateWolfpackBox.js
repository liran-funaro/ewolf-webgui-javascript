function CreateWolfpackBox(name) {
	var packAppID = eWolf.wolfpacks.getWolfpackAppID(name);
	
	return $("<span/>").attr({
		"style": "width:1%;",
		"class": "selectableBox selectableBoxHovered"
	}).text(name).click(function() {
		eWolf.selectApp(packAppID);
	});
}