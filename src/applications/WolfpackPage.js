var WolfpackPage = function (id,wolfpackName,applicationFrame) {
	var appContainer = new AppContainer(id,applicationFrame);
	var frame = appContainer.getFrame();
	
	var request = new PostRequestHandler(id,"/json",60)
		.listenToRefresh()
		.register(getWolfpacksMembersData,
				new ResonseHandler("wolfpackMembers",
						["membersList"],handleWolfpacksMembersData));
		
	var topTitle = new TitleArea(new Wolfpack(wolfpackName))
		.appendTo(frame)
		.addFunction("Post", function() {
			// TODO: post on wolfpack
		})
		.addFunction("Add member...", function() {
			// TODO: add member
		});
	
	var members = $("<span/>").attr("class","wolfpacksBox").hide();
	topTitle.appendAtBottomPart(members);
	
	members.append("Members: ");
	var membersList = null;
		
	function updateMembersView(newMembersList) {
		if (membersList != null) {
			membersList.remove();
		}
		
		if(newMembersList == null) {
			members.hide();
		} else {
			membersList = newMembersList;
			members.append(membersList);
			members.show();
		}		
	}	
	
	new NewsFeedList(request,{
		newsOf:"wolfpack",
		wolfpackName:wolfpackName
	}).appendTo(frame);	
	
	function getWolfpacksMembersData() {
		return {
			wolfpackMembers: {
				wolfpackName: wolfpackName
			}
		};
	}
	
	function handleWolfpacksMembersData(data, textStatus, postData) {
		list = data.membersList;

		var newMembersList = null;
		
		if(list.length > 0) {
			newMembersList = $("<span/>");

			$.each(list, function(i, member) {
				newMembersList.append(new User(member.id, member.name));
				if (i != list.length - 1) {
					newMembersList.append(", ");
				}
			});
		}		
		
		updateMembersView(newMembersList);
	}
	
	return {
		getID : function() {
			return id;			
		},
		getName : function() {
			return wolfpackName;			
		},
		isSelected : function() {
			return appContainer.isSelected();
		},
		destroy : function() {
			appContainer.destroy();
			delete this;
		}
	};
};
