var WolfpackPage = function (id,wolfpackName,applicationFrame) {
	var self = this;
	
	Application.call(this,id,applicationFrame);
	
	var request = new PostRequestHandler(id,"/json",60)
		.listenToRefresh();
				
	var topTitle = new TitleArea().appendTo(this.frame)
		.addFunction("Post", function() {
			new NewPost(id,applicationFrame,wolfpackName).select();
		});		
	
	if(wolfpackName != null) {
		topTitle.setTitle(CreateWolfpackBox(wolfpackName));
	} else {
		topTitle.setTitle("News Feed");
	}
	
	new WolfpackNewsFeedList(request,wolfpackName)
		.appendTo(this.frame);
	
	if(wolfpackName != null) {
		var addMembers = null;

		var members = new CommaSeperatedList("Members");
		topTitle.appendAtBottomPart(members.getList());
		
		this.showAddMembers = function () {
			members.hide(200);
			topTitle.hideFunction("Add members...");
			if(addMembers != null) {
				addMembers.remove();
			}
			
			addMembers = $("<span/>");
			topTitle.appendAtBottomPart(addMembers);
			
			new AddMembersToWolfpack(id,wolfpackName,members.getItemNames(),
					self.removeAddMemebers,request).frame.appendTo(addMembers);
		};
		
		this.removeAddMemebers = function () {
			if(addMembers != null) {
				addMembers.hide(200,function() {
					addMembers.remove();
					addMembers = null;
				});			
			}
			
			topTitle.showFunction("Add members...");
			members.show(200);
		};
		
		this.deleteWolfpack = function() {
			var diag = $("<div/>").attr({
				"id" : "dialog-confirm",
				"title" : "Delete wolfpack?"
			});
			
			var p = $("<p/>").appendTo(diag);
		
			p.append("The wolfpack will be permanently deleted and cannot be recovered. Are you sure?");
			
			diag.dialog({
				resizable: true,
				modal: true,
				buttons: {
					"Delete wolfpack": function() {
						// TODO: delete wolfpack
						$( this ).dialog( "close" );
						alert("Option unavailible");
					},
					Cancel: function() {
						$( this ).dialog( "close" );
					}
				}
			});
		};
		
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
				members.addItem(CreateUserBox(member.id, member.name),member.id);
			});
		}
		
		request.register(getWolfpacksMembersData,
				new ResponseHandler("wolfpackMembers",
					["membersList"],
					handleWolfpacksMembersData).getHandler());
		
		topTitle.addFunction("Add members...", this.showAddMembers);		
		topTitle.addFunction("Delete wolfpack", this.deleteWolfpack);
		
		eWolf.bind("select."+id,function(event,eventId) {
			self.removeAddMemebers();
		});
	}
	
	this.getName = function() {
		return wolfpackName;			
	};
	
	return this;
};
