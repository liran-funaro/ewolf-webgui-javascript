var WolfpackPage = function (id,wolfpackName,applicationFrame) {
	/****************************************************************************
	 * Members
	  ***************************************************************************/
	var self = this;
	
	/****************************************************************************
	 * Base class
	  ***************************************************************************/	
	Application.call(this, id, applicationFrame, 
			wolfpackName == null ? "News Feed" : CreateWolfpackBox(wolfpackName));
		
	/****************************************************************************
	 * User Interface
	  ***************************************************************************/
	this.feed = new WolfpackNewsFeedList(id,wolfpackName)
			.appendTo(this.frame);
	
	/****************************************************************************
	 * Functionality
	  ***************************************************************************/	
	this.title.addFunction("Post", function() {
		new NewPost(id,applicationFrame,wolfpackName).select();
	});

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
		var handlerCategory = eWolf.REQUEST_CATEGORY_WOLFPACK_MEMBERS;
		
		if(wolfpackName == eWolf.APPROVED_WOLFPACK_NAME ||
				wolfpackName == eWolf.APPROVED_ME_WOLFPACK_NAME) {
			wolfpackMembersRequestName = eWolf.APPROVED_MEMBERS_REQUEST_NAME;
		} else {
			eWolf.serverRequest.registerRequest(wolfpackMembersRequestName,
					getWolfpacksMembersData);
		}
		
		if(wolfpackName == eWolf.APPROVED_WOLFPACK_NAME) {
			handlerCategory = eWolf.REQUEST_CATEGORY_WOLFPACK_MEMBERS_ALIAS1;
		} else if(wolfpackName == eWolf.APPROVED_ME_WOLFPACK_NAME) {
			handlerCategory = eWolf.REQUEST_CATEGORY_WOLFPACK_MEMBERS_ALIAS2;
		}		
		
		eWolf.serverRequest.registerHandler(wolfpackMembersRequestName,
					new ResponseHandler(handlerCategory,
					["membersList"],
					handleWolfpacksMembersData).getHandler())
			.bindRequest(wolfpackMembersRequestName, id);
					
		
		self.title.addFunction("Add members...", this.showAddMembers);
		
		eWolf.bind("select",function(event,eventId) {
			self.removeAddMemebers();
		});
	}
	
	this.getName = function() {
		return wolfpackName;			
	};
	
	return this;
};
