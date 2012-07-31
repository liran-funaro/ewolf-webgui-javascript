var AddToWolfpack = function(id, frame, activator, request, packsAlreadyIn) {
	var popUpApp = new PopUp(frame,activator);
	var popUp = popUpApp.frame;
	
	var packList = $("<ul/>").attr({
		"class": "packListSelect"
	}).appendTo(popUp);	

	$.each(eWolf.wolfpacks.wolfpacksArray,function(i,pack) {
		var box = $("<input/>").attr({
			"value" : pack,
			"type": "checkbox"
		});
		
		if(packsAlreadyIn.indexOf(pack) >= 0) {
			box.attr("checked","checked");
			box.data("isMember",true);
		} else {
			box.data("isMember",false);
		}

		$("<li/>").attr({
			"class": "packListSelectItem"
		}).append(box).append(pack).appendTo(packList);
	});
	
	var createItem = $("<li/>").attr({
		"class": "packListSelectItem"
	}).css({
		"margin-top": "5px"
	}).appendTo(packList);
	
	var createLink = $("<span/>").attr({
		"class": "aLink createLink"
	});
	
	createLink.append("+ new wolfpack").appendTo(createItem).click(function() {
		var newPackItem = $("<li/>").attr({
			"class": "packListSelectItem"
		});		

		
		var newPack = $("<input/>").attr({
			"type":"text",
			"class": "newWolfpackInput"
		}).css({
			"width" : (parseInt(createLink.css("width")) - 5) + "px"
		});
		
		var itsCheckbox = $("<input/>").attr({
			"type": "checkbox",
			"disabled" : true
		}).data({
			"isNew" : true,
			"itsInput" : newPack
		}).appendTo(newPackItem);
		
		newPack.appendTo(newPackItem);
		newPack.keyup(function(event) {
		    if(newPack.val() != "") {
		    	itsCheckbox.attr("checked",true);
		    	itsCheckbox.removeAttr("disabled");
		    } else {
		    	itsCheckbox.attr({
		    		"checked" : false,
		    		"disabled" : true
		    	});
		    }
		});
			
		createItem.before(newPackItem);
		
		window.setTimeout(function () {
			newPack.focus();
		}, 0);	
	});
	
	$("<hr/>").css({
		"margin":"0"
	}).appendTo(popUp);
	
	$("<span/>").attr({
		"class": "aLink applyLink"
	}).append("Apply").appendTo(popUp).click(function() {
		var add = [],
			create = [],
			remove = [];
		
		$.each(packList.find("input"),function(i,item) {
			var itsBox = $(item);

			if(itsBox.is(':checked') == true) {
				if(itsBox.data("isMember") != true) {
					if(itsBox.data("isNew") == true) {
						var packName = itsBox.data("itsInput").val();
						add.push(packName);
						create.push(packName);
					} else {
						add.push(itsBox.attr("value"));
					}		
				}
			} else {
				if(itsBox.data("isMember") == true) {
					remove.push(itsBox.attr("value"));
				}
			}
		});
		
		popUpApp.destroy();
			
		if(create.length > 0) {			
			var responseHandler = new ResponseHandler("createWolfpack",[],null);
			
			responseHandler.success(function(data, textStatus, postData) {
				$.each(create,function(i,pack) {
					eWolf.wolfpacks.addWolfpack(pack);
				});
				
				addToAllWolfpacks();
			}).error(function(data, textStatus, postData) {				
				if(data.wolfpacksResult == null) {
					console.log("No wolfpacksResult in response");
				} else {
					$.each(data.wolfpacksResult, function(i,item) {
						if(item == "success")
							eWolf.wolfpacks.addWolfpack(postData.wolfpackName[i]);
					});
					
				}
				
				addToAllWolfpacks();
			});
			
			request.request({
				createWolfpack: {
					wolfpackName: create
				}
			},responseHandler.getHandler());
			
		} else {
			addToAllWolfpacks();
		}
		
		function addToAllWolfpacks() {
			if(add.length > 0) {
				var response = new ResponseHandler("addWolfpackMember",[],null);
				
				response.complete(function (textStatus, postData) {
					eWolf.trigger("needRefresh."+id);
				});			
				
				request.request({
					addWolfpackMember: {
						wolfpackName: add,
						userID: [id]
					}
				},response.getHandler());
			}			
		}		
	});
		
	return this;
};