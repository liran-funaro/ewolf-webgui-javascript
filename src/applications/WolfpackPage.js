var WolfpackPage = function (id,wolfpackName,applicationFrame) {
	var appContainer = new AppContainer(id,applicationFrame);
	var frame = appContainer.getFrame();
	
	var request = new PostRequestHandler(id,"/json",60)
		.listenToRefresh();
				
	var topTitle = new TitleArea()
		.appendTo(frame)
		.addFunction("Post", function() {
			new NewPost(id,applicationFrame,wolfpackName).select();
		});
	
	var newsFeedRequestObj = {
			newsOf:"wolfpack"	
	};
	
	if(wolfpackName != null) {
		request.register(getWolfpacksMembersData,
				new ResponseHandler("wolfpackMembers",
						["membersList"],handleWolfpacksMembersData).getHandler());
		topTitle.addFunction("Add member...", function() {
			// TODO: add member
			alert("This will add a member to a wolfpack");
		});
		
		topTitle.setTitle(new Wolfpack(wolfpackName));
		newsFeedRequestObj["wolfpackName"] = wolfpackName;
	} else {
		topTitle.setTitle("News Feed");
	}		
	
	var members = new CommaSeperatedList("Members");
	topTitle.appendAtBottomPart(members.getList());
	
	new NewsFeedList(request,newsFeedRequestObj).appendTo(frame);	
	
	function getWolfpacksMembersData() {
		return {
			wolfpackMembers: {
				wolfpackName: wolfpackName
			}
		};
	}
	
	function handleWolfpacksMembersData(data, textStatus, postData) {
		list = data.membersList;

		members.removeAll();

		$.each(list, function(i, member) {
			members.addItem(new User(member.id, member.name));
		});
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
