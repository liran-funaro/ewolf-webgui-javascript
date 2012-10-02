var WolfpackPage = function (id,wolfpackName,applicationFrame) {	
	Application.call(this, id, applicationFrame, 
			wolfpackName == null ? "News Feed" : CreateWolfpackBox(wolfpackName));
			
	var self = this;
	this.title.addFunction("Post", function() {
			new NewPost(id,applicationFrame,wolfpackName).select();
		});
	
	new WolfpackNewsFeedList(id,wolfpackName)
		.appendTo(this.frame);
	
	if(wolfpackName != null) {
		var addMembers = null;

		var members = new CommaSeperatedList("Members");
		this.title.appendAtBottomPart(members.getList());
		
		this.showAddMembers = function () {
			members.hide(200);
			self.title.hideFunction("Add members...");
			if(addMembers != null) {
				addMembers.remove();
			}
			
			addMembers = $("<span/>");
			self.title.appendAtBottomPart(addMembers);
			
			new AddMembersToWolfpack(id,wolfpackName,members.getItemNames(),
					self.removeAddMemebers).frame.appendTo(addMembers);
		};
		
		this.removeAddMemebers = function () {
			if(addMembers != null) {
				addMembers.hide(200,function() {
					addMembers.remove();
					addMembers = null;
				});			
			}
			
			self.title.showFunction("Add members...");
			members.show(200);
		};

//		this.deleteWolfpack = function() {
//			var diag = $("<div/>").attr({
//				"id" : "dialog-confirm",
//				"title" : "Delete wolfpack?"
//			});
//			
//			var p = $("<p/>").appendTo(diag);
//		
//			p.append("The wolfpack will be permanently deleted and cannot be recovered. Are you sure?");
//			
//			diag.dialog({
//				resizable: true,
//				modal: true,
//				buttons: {
//					"Delete wolfpack": function() {
//						// TODO: delete wolfpack
//						$( this ).dialog( "close" );
//						alert("Option unavailible");
//					},
//					Cancel: function() {
//						$( this ).dialog( "close" );
//					}
//				}
//			});
//		};
		
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
		
		var wolfpackMembersRequestName = id + "__wolfpack_members_request_name__";
		
		eWolf.serverRequest
			.registerRequest(wolfpackMembersRequestName,
					getWolfpacksMembersData)
			.registerHandler(wolfpackMembersRequestName,
					new ResponseHandler("wolfpackMembers",
					["membersList"],
					handleWolfpacksMembersData).getHandler())
			.bindRequest(wolfpackMembersRequestName,
					id);
					
		
		self.title.addFunction("Add members...", this.showAddMembers);		
//		self.title.addFunction("Delete wolfpack", this.deleteWolfpack);
		
		eWolf.bind("select",function(event,eventId) {
			self.removeAddMemebers();
		});
	}
	
	this.getName = function() {
		return wolfpackName;			
	};
	
	return this;
};
