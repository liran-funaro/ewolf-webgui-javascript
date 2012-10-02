LOGIN_CONSTANTS = {
	LOGIN_USERNAME_ID : "login username",
	LOGIN_PASSWORD_ID : "login password"
};

var Login = function(id,applicationFrame) {
	/****************************************************************************
	 * Base class
	  ***************************************************************************/	
	Application.call(this, id, applicationFrame, "Welcome to eWolf");	
	
	/****************************************************************************
	 * Members
	  ***************************************************************************/
	var self = this;
	$.extend(this,LOGIN_CONSTANTS);
	
	/****************************************************************************
	 * User Interface
	  ***************************************************************************/
	var itro = $("<div/>").css({
		"font-size" : "12px"
	}).append("If it is your first time using eWolf, please take the time to signup first.");
	
	this.title.appendAtBottomPart(itro);
	
	this.frame.append("<br>");
	
	var login = new TitleArea("Login").appendTo(this.frame);
	
	var username = $("<input/>").attr({
		"type" : "text",
		"placeholder" : "Username"
	});
	
	var usernameError = $("<span/>").addClass("errorArea");
	
	var password = $("<input/>").attr({
		"type" : "password",
		"placeholder" : "Password"
	});
	
	var passwordError = $("<span/>").addClass("errorArea");
	
	var loginError = $("<span/>").addClass("errorArea");
	
	var base = $("<table/>");
	
	var usernameRaw = $("<tr/>").appendTo(base);
	$("<td/>").addClass("loginFieldDescription")
		.append("Username:")
		.appendTo(usernameRaw);	
	$("<td/>")
		.append(username)
		.append(usernameError)
		.appendTo(usernameRaw);
	
	var passwordRaw = $("<tr/>").appendTo(base);
	$("<td/>").addClass("loginFieldDescription")
		.append("Password:")
		.appendTo(passwordRaw);	
	$("<td/>")
		.append(password)
		.append(passwordError)
		.appendTo(passwordRaw);
	
	var loginErrorRow = $("<tr/>").appendTo(base);
	$("<td/>").addClass("loginFieldDescription")
		.appendTo(loginErrorRow);	
	$("<td/>")
		.append(loginError)
		.appendTo(loginErrorRow);
	
	login.appendAtBottomPart(base);
	
	/****************************************************************************
	 * Functionality
	  ***************************************************************************/
	this.title.addFunction("Signup",function() {
		eWolf.selectApp(eWolf.SIGNUP_APP_ID);
	});	
	
	function handleLogin(data, textStatus, postData) {
		eWolf.getUserInformation();
	}
	
	function errorHandler(data, textStatus, postData) {
		loginError.html(data.errorMessage);
		self.clearAll();
	}
	
	function badRequestHandler(data, textStatus, postData) {
		loginError.html("Server Error. Could not login.");
		self.clearAll();
	}
	
	var formValidator = new FormValidator()
			.registerField(self.LOGIN_USERNAME_ID, username, usernameError)
			.registerField(self.LOGIN_PASSWORD_ID, password, passwordError)
			.attachOnSend(function() {
						var handler = new ResponseHandler("login",[])
							.success(handleLogin)
							.error(errorHandler)
							.badResponseHandler(badRequestHandler);
						
						eWolf.serverRequest.request(id,{
							login : {
								username : username.val(),
								password : password.val()
							}
						}, handler.getHandler());
				})
			.addValidator(self.LOGIN_USERNAME_ID, VALIDATOR_IS_NOT_EMPTY,
					"* Must specify a user name.")
			.addValidator(self.LOGIN_PASSWORD_ID, VALIDATOR_IS_NOT_EMPTY,
					"* Must specify a password.");	
	
	login.addFunction("Login",formValidator.sendForm);
	
	this.clearAll = function() {
		formValidator.clearAllFields();
		return self;
	};
	
	eWolf.bind("refresh",function(event,eventID) {
		if(id == eventID) {
			self.clearAll();
		}
	});
	
	eWolf.serverRequest.bindAppToAnotherApp(id, eWolf.FIRST_EWOLF_LOGIN_REQUEST_ID);
	
	return this;
};