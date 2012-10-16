ONE_MINUTE_IN_MILLISECOUNDS = 60000;

EWOLF_CONSTANTS = {
	JSON_REQUEST : "/json",
		
	LOADING_FRAME : "loadingFrame",
	APPLICATION_FRAME : "applicationFrame",
	MAIN_FRAME : "mainFrame",
	MENU_FRAME : "menu",
	TOPBAR_FRAME : "topbarID",
	
	WELCOME_MENU_ID : "__welcome_menu__",
	MAINAPPS_MENU_ID : "__mainapps_menu__",
	WOLFPACKS_MENU_ID : "__wolfpacks_menu__",
	
	MYPROFILE_APP_ID : "profile",
	NEWSFEED_APP_ID : "newsfeed",
	INBOX_APP_ID : "inbox",
	LOGIN_APP_ID : "login",
	SIGNUP_APP_ID : "signup",
	LOGOUT_APP_ID : "logout",
	
	FIRST_EWOLF_LOGIN_REQUEST_ID : "eWolfLogin",
	
	PROFILE_REQUEST_NAME : "__main_profile_request__",
	WOLFPACKS_REQUEST_NAME : "__main_wolfpacks_request",
	MEMBERS_REQUEST_NAME : "__main_members_request__",
	APPROVED_MEMBERS_REQUEST_NAME : "__pending_requests_approved_request__",
	
	APPROVED_WOLFPACK_NAME : "wall-readers",
	APPROVED_ME_WOLFPACK_NAME : "inviters",
	
	INBOX_MAX_OLDER_MESSAGES_FETCH : 2,
	NEWSFEED_MAX_OLDER_MESSAGES_FETCH : 2,
	
	REQUEST_CATEGORY_INBOX : "inbox",
	REQUEST_CATEGORY_WOLFPACKS : "wolfpacks",
	REQUEST_CATEGORY_WOLFPACKS_ALIAS1 : "wolfpacksAll",
	REQUEST_CATEGORY_PROFILE : "profile",
	REQUEST_CATEGORY_WOLFPACK_MEMBERS : "wolfpackMembers",
	REQUEST_CATEGORY_WOLFPACK_MEMBERS_ALIAS1 : "wolfpackMembersAll",
	REQUEST_CATEGORY_WOLFPACK_MEMBERS_ALIAS2 : "wolfpackMembersNotAllowed",
	REQUEST_CATEGORY_NEWS_FEED : "newsFeed",
	REQUEST_CATEGORY_CREATE_WOLFPACK : "createWolfpack",
	REQUEST_CATEGORY_ADD_WOLFPACK_MEMBER : "addWolfpackMember",
	REQUEST_CATEGORY_POST : "post",
	REQUEST_CATEGORY_SEND_MESSAGE : "sendMessage",
	REQUEST_CATEGORY_CREATE_ACCOUNT : "createAccount",
	REQUEST_CATEGORY_LOGIN : "login",
	REQUEST_CATEGORY_LOGOUT : "logout",
	
	EVENT_ACTIVE : "state:active",
	EVENT_AWAY : "state:away", 
	EVENT_AWAY_FOR_LONG: "state:awayforlong",
	EVENT_IDLE : "state:idle",
	
	TIMEOUT_AWAY_MINUTES 					: 5,
	TIMEOUT_AWAY_FOR_LONG_MINUTES : 10,
	TIMEOUT_IDLE_MINUTES 					: 15,
	
	REQUEST_INTERVAL_ACTIVE_MILLISECOUNDS 				: 1 * ONE_MINUTE_IN_MILLISECOUNDS,
	REQUEST_INTERVAL_AWAY_MILLISECOUNDS 					: 2 * ONE_MINUTE_IN_MILLISECOUNDS ,
	REQUEST_INTERVAL_AWAY_FOR_LONG_MILLISECOUNDS 	: 3 * ONE_MINUTE_IN_MILLISECOUNDS,
	REQUEST_INTERVAL_IDLE_MILLISECOUNDS 					: 0,
	
	IMAGE_PAPER_CLIP : "/static_files/Paperclip.png",
	IMAGE_REFRESH : "/static_files/refresh.svg",
	IMAGE_USER_ADD : "/static_files/user-add.png",
	IMAGE_USER_BLOCKING : "/static_files/user-blocking.png",
	IMAGE_PAW : "/static_files/wolf-paw.svg"
};

WOLFPACK_CONSTANTS = {
	WOLFPACK_APP_PREFIX : "wolfpack:"
};

CREATE_NEW_WOLFPACK_LINK_CONSTANTS = {
	QUERY_ID : "query"	
};

SEARCHBAR_CONSTANTS = {
	SEARCH_PROFILE_PREFIX : "profile:",
	SEARCH_MENU_ITEM_ID : "__seach_menu_id__"
};

SIGNUP_CONSTANTS = {
	SIGNUP_FULL_NAME_ID : "signup full name",
	SIGNUP_USERNAME_ID : "signup username",
	SIGNUP_PASSWORD_ID : "signup password",
	SIGNUP_VERIFY_PASSWORD_ID : "signup verify password"
};

LOGIN_CONSTANTS = {
	LOGIN_USERNAME_ID : "login username",
	LOGIN_PASSWORD_ID : "login password"
};

NEWMAIL_CONSTANTS = {
	NEWMAIL_APP_ID_PREFIX : "mailto:",
	NEW_MAIL_DAFAULTS : {
			TITLE : "New Mail",
			TO : "To",
			CONTENT : "Content",
			ATTACHMENT : "Attachment"
		}
};
