var WolfpackPage = function (id,wolfpackName,applicationFrame) {
	var appContainer = new AppContainer(id,applicationFrame);
	var frame = appContainer.getFrame();
	
	var request = new PostRequestHandler(id,"/json",60)
		.listenToRefresh()
		.register(getWolfpacksMembersData,
				new eWolfResonseHandler("wolfpackMembers",
						["membersList"],handleWolfpacksMembersData));
		
	var title = $("<div/>").appendTo(frame);
	
	$("<span/>").attr({
		"class" : "eWolfTitle"
	}).append(new Wolfpack(wolfpackName)).appendTo(title);
	
	title.append("&nbsp;&nbsp;&nbsp; ");
	
	var members = $("<span/>").appendTo(title);	
	
	new NewsFeedList(request,{
		newsOf:"wolfpack",
		wolfpackName:wolfpackName
	}).appendTo(frame);
	
	var membersList = null;
	
	function getWolfpacksMembersData() {
		return {
			wolfpackMembers: {
				wolfpackName: wolfpackName
			}
		};
	}
	
	function handleWolfpacksMembersData(data, textStatus, postData) {
		list = data.membersList;

		if (membersList != null) {
			membersList.remove();
		}

		membersList = $("<span/>").appendTo(members);

		$.each(list, function(i, member) {
			membersList.append(new User(member.id, member.name));
			if (i != list.length - 1) {
				membersList.append(", ");
			}
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
