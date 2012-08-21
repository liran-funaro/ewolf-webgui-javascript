function CreateUserBox(id,name,showID) {
	var link = $("<a/>").attr({
		"style": "width:1%;",
		"class": "selectableBox",
		"title": id
	}).click(function() {
		eWolf.trigger("search",[id,name]);
	});
	
	var idBox = null;
	
	if(showID) {
		idBox = $("<span/>")
			.addClass("idBox");
	}
	
	function fillInformation() {
		link.attr({
			"title": id
		}).text(name);
		
		if(idBox) {
			idBox.html(id).appendTo(link);
		}		
	}
	
	if (id == null && name != null) {
		id = eWolf.wolfpacks.getFriendID(name);
		if(!id) {
			return null;
		}
	} else if (id != null && name == null) {
		name = eWolf.wolfpacks.getFriendName(id);
		if(!name) {			
			var request = new PostRequestHandler(id,"/json",0).request({
						profile: {
							userID: id
						}
					  },
					new ResponseHandler("profile",["name"],
							function(data, textStatus, postData) {
						name = data.name;
						fillInformation();
					}).getHandler());
		}
	} else if (id == null && name == null) {
		return null;
	} 
	
	fillInformation();	

	return link;
}