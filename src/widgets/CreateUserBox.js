function CreateUserBox(id,name,showID) {
	if(id == null) {
		return null;
	}
	
	var link = $("<a/>").attr({
		"style": "width:1%;",
		"class": "selectableBox selectableBoxHovered",
	}).click(function() {
			eWolf.trigger("search",[id,name]);
	});
	
	var nameBox = $("<span/>").appendTo(link);
	
	var idBox = null;
	
	if(showID) {
		idBox = $("<span/>")
			.addClass("idBox")
			.appendTo(link);
		
		nameBox.addClass("selectableBoxHovered");
		link.removeClass("selectableBoxHovered");
	}
	
	function fillInformation() {
		nameBox.attr({
			"title": id
		}).text(name ? name : id);
		
		if(idBox) {
			idBox.html(id);
		}		
	}
	
	if (!name) {
		var fullDescID = eWolf.members.getUserFromFullDescription(id);
		
		if(fullDescID) {
			id = fullDescID;
		}
		
		name = eWolf.members.getUserName(id);

		if(name) {
			fillInformation();
		}
	}
	
	fillInformation();	

	return link;
}