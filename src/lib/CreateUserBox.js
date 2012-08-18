function CreateUserBox(id,name) {
	var link = $("<a/>").attr({
		"style": "width:1%;",
		"class": "selectableBox",
		"title": id
	}).click(function() {
		eWolf.trigger("search",[id,name]);
	});
	
	if (id == null && name != null) {
		id = eWolf.wolfpacks.getFriendID(name);
	} else if (id != null && name == null) {
		name = eWolf.wolfpacks.getFriendName(id);
		if(name == null) {
			name = id;
			var request = new PostRequestHandler(id,"/json",0).request({
						profile: {
							userID: id
						}
					  },
					new ResponseHandler("profile",["name"],
							function(data, textStatus, postData) {
						name = data.name;
						link.text(name);
					}).getHandler());
		}
	} else if (id == null && name == null) {
		return null;
	}
	
	link.text(name);

	return link;
}