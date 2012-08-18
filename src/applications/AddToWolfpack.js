var AddToWolfpack = function(id, userID, frame, activator, request, packsAlreadyIn) {
	var self = this;
	PopUp.call(this,frame,activator);
	
	var packList = $("<ul/>").attr({
		"class": "packListSelect"
	}).appendTo(this.frame);	

	$.each(eWolf.wolfpacks.wolfpacksArray,function(i,pack) {
		var box = $("<input/>").attr({
			"value" : pack,
			"type": "checkbox"
		});
		
		if(packsAlreadyIn.indexOf(pack) >= 0) {
			box.attr({
				"checked" : "checked",
				"disabled" : true
			});
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
	
	function trimSpaces(s) {
		s = s.replace(/(^\s*)|(\s*$)/gi,"");
		s = s.replace(/[ ]{2,}/gi," ");
		s = s.replace(/\n /,"\n");
		return s;
	}
	
	$("<hr/>").css({
		"margin":"0"
	}).appendTo(this.frame);
	
	var applyBtn = $("<span/>").attr({
		"class": "aLink applyLink"
	}).append("Apply").appendTo(this.frame);
	
	this.getSelection = function () {
		var result = {
			add : [],
			create : [],
			remove : []	
		};
	
		$.each(packList.find("input"),function(i,item) {
			var itsBox = $(item);
	
			if(itsBox.is(':checked') == true) {
				if(itsBox.data("isMember") != true) {
					if(itsBox.data("isNew") == true) {
						var packName = trimSpaces(itsBox.data("itsInput").val());
						result.add.push(packName);
						result.create.push(packName);
					} else {
						result.add.push(itsBox.attr("value"));
					}		
				}
			} else {
				if(itsBox.data("isMember") == true) {
					result.remove.push(itsBox.attr("value"));
				}
			}
		});
		
		return result;	
	};
	
	this.createWolfpacks = function(wolfpacks,onComplete) {
		if(wolfpacks.length > 0) {			
			var responseHandler = new ResponseHandler("createWolfpack",[],null);
			
			responseHandler.success(function(data, textStatus, postData) {
				$.each(wolfpacks,function(i,pack) {
					eWolf.wolfpacks.addWolfpack(pack);
				});
			}).error(function(data, textStatus, postData) {				
				if(data.wolfpacksResult == null) {
					console.log("No wolfpacksResult in response");
				} else {
					$.each(data.wolfpacksResult, function(i,response) {
						if(response.result == RESPONSE_RESULT.SUCCESS) {
							eWolf.wolfpacks.addWolfpack(postData.wolfpackNames[i]);
						}
					});
					
				}
			}).complete(onComplete);
			
			request.request({
				createWolfpack: {
					wolfpackNames: wolfpacks
				}
			},responseHandler.getHandler());
			
		} else {
			onComplete();
		}
	};
	
	this.addToAllWolfpacks = function (wolfpacks) {
		if(wolfpacks.length > 0) {
			var response = new ResponseHandler("addWolfpackMember",[],null);
			
			response.complete(function (textStatus, postData) {
				eWolf.trigger("needRefresh."+id.replace("+","\\+"));
			});			
			
			request.request({
				addWolfpackMember: {
					wolfpackNames: wolfpacks,
					userIDs: [userID]
				}
			},response.getHandler());
		}
	};
	
	this.apply = function() {
		result = self.getSelection();
		
		self.destroy();
		
		self.createWolfpacks(result.create, function () {
			self.addToAllWolfpacks(result.add);
		});
	};
	
	applyBtn.click(this.apply);
		
	return this;
};