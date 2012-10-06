var AddToWolfpack = function(id, userID, packsAlreadyIn) {
	/****************************************************************************
	 * Members
	  ***************************************************************************/
	var self = this;
	
	/****************************************************************************
	 * User Interface
	  ***************************************************************************/
	this.context = $("<span/>");
	
	this.title = $("<span/>")
				.css({
					"padding" : "5px",
					"font-size" : "12px"
				})
				.appendTo(this.context)
				.append("Add ")
				.append(CreateUserBox(userID, null, false))
				.append(" to:");
	
	$("<hr/>").css("margin", "0").appendTo(this.context);
	
	var packList = $("<ul/>")
				.addClass("packListSelect")
				.appendTo(this.context);	

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

		$("<li/>")
					.addClass("packListSelectItem")
					.append(box)
					.append(pack)
					.appendTo(packList);
	});
	
	var createItem = $("<li/>")
				.addClass("packListSelectItem")
				.css("margin-top","5px")
				.appendTo(packList);
	
	var createLink = $("<span/>")
				.addClass("aLink")
				.addClass("createLink")
				.append("+ new wolfpack")
				.appendTo(createItem);
	
	$("<hr/>").css("margin", "0").appendTo(this.context);
	
	var applyBtn = $("<span/>")
				.addClass("aLink")
				.addClass("applyLink")
				.append("Apply")
				.appendTo(this.context);
	
	var errorBox = $("<div/>")
				.addClass("errorArea")
				.appendTo(this.context);
	
	/****************************************************************************
	 * Functionality
	  ***************************************************************************/
	function trimSpaces(s) {
		s = s.replace(/(^\s*)|(\s*$)/gi,"");
		s = s.replace(/[ ]{2,}/gi," ");
		s = s.replace(/\n /,"\n");
		return s;
	}
	
	createLink.click(function() {
		var newPackItem = $("<li/>").attr({
			"class": "packListSelectItem"
		});		

		
		var newPack = $("<input/>")
					.addClass("newWolfpackInput")
					.attr("type", "text")
					.css("width", (parseInt(createLink.css("width")) - 5) + "px");
		
		var itsCheckbox = $("<input/>")
				.attr({
					"type": "checkbox",
					"disabled" : true
				}).data({
					"isNew" : true,
					"itsInput" : newPack
				}).appendTo(newPackItem);
		
		newPack.appendTo(newPackItem);
		
		var validator = new FormValidator()
			.registerField("newPack", newPack, errorBox)
			.addValidator("newPack", VALIDATOR_IS_NOT_EMPTY
					, " * Please enter a wolfpack name")
			.addValidator("newPack", function(field) {
					return $.inArray(field.val(),eWolf.wolfpacks.wolfpacksArray) == -1;
				}, " * Wolfpack with that name already exist");
		
		newPack.bind('input propertychange',function(event) {
		    if(validator.isValid()) {
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
	
	this.addToAllWolfpacks = function (wolfpacks) {
		if(wolfpacks.length > 0) {
			var response = new ResponseHandler("addWolfpackMember",[],null);
			
			response.complete(function (textStatus, postData) {
				eWolf.trigger("refresh",[id]);
			});			
			
			eWolf.serverRequest.request(id,{
				addWolfpackMember: {
					wolfpackNames: wolfpacks,
					userIDs: [userID]
				}
			},response.getHandler());
		}
	};
	
	this.apply = function() {
		result = self.getSelection();
		
		eWolf.trigger("select",[id]);
		
		eWolf.wolfpacks.createWolfpacks(result.create, function () {
			self.addToAllWolfpacks(result.add);
		});
	};
	
	applyBtn.click(this.apply);
		
	return this;
};