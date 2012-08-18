function CreateWolfpackBox(name) {
	var packAppID = eWolf.wolfpacks.WOLFPACK_APP_PREFIX + name;
	
	return $("<span/>").attr({
		"style": "width:1%;",
		"class": "selectableBox"
	}).text(name).click(function() {
		eWolf.selectApp(packAppID);
	});
}