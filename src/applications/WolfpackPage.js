var WolfpackPage = function (id,wolfpackName,applicationFrame) {
	var appContainer = new AppContainer(id,applicationFrame);
	var frame = appContainer.getFrame();
	
	var request = new PostRequestHandler(id,"/json",60)
		.listenToRefresh();
				
	var topTitle = new TitleArea().appendTo(frame)
		.addFunction("Post", function() {
			new NewPost(id,applicationFrame,wolfpackName).select();
		});		
	
	var newsFeedRequestObj = {
			newsOf:"wolfpack"	
	};
	
	var addMembers = null;

	var members = new CommaSeperatedList("Members");
	topTitle.appendAtBottomPart(members.getList());
	
	if(wolfpackName != null) {
		topTitle.setTitle(new Wolfpack(wolfpackName));
		newsFeedRequestObj["wolfpackName"] = wolfpackName;
		
		request.register(getWolfpacksMembersData,
				new ResponseHandler("wolfpackMembers",
					["membersList"],handleWolfpacksMembersData).getHandler());
		
		topTitle.addFunction("Add members...", showAddMembers);		
		topTitle.addFunction("Delete wolfpack", showDeleteWolfpackDialog);		
	} else {
		topTitle.setTitle("News Feed");
	}
	
	new NewsFeedList(request,newsFeedRequestObj).appendTo(frame);
	
	eWolf.bind("select."+id,function(event,eventId) {
		removeAddMemebers();
	});
	
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
			members.addItem(new User(member.id, member.name),member.name);
		});
	}
	
	function showAddMembers() {
		members.hide(200);
		topTitle.hideFunction("Add members...");
		if(addMembers != null) {
			addMembers.remove();
		}
		
		addMembers = $("<span/>");
		topTitle.appendAtBottomPart(addMembers);
		
		new AddMembersToWolfpack(id,wolfpackName,members.getItemNames(),
				removeAddMemebers,request).frame.appendTo(addMembers);
	}
	
	function removeAddMemebers() {
		if(addMembers != null) {
			addMembers.hide(200,function() {
				addMembers.remove();
				addMembers = null;
			});			
		}
		
		topTitle.showFunction("Add members...");
		members.show(200);
	}
	
	function showDeleteWolfpackDialog() {
		var diag = $("<div/>").attr({
			"id" : "dialog-confirm",
			"title" : "Delete wolfpack?"
		});
		
		var p = $("<p/>").appendTo(diag);
	
		p.append("The wolfpack will be permanently deleted and cannot be recovered. Are you sure?");
		
		diag.dialog({
			resizable: true,
			//height:140,
			modal: true,
			buttons: {
				"Delete wolfpack": function() {
					// TODO: delete wolfpack
					$( this ).dialog( "close" );
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
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
