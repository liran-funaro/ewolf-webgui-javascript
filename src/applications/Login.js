LOGIN_CONSTANTS = {
	LOGIN_USERNAME_ID : "login username",
	LOGIN_PASSWORD_ID : "login password"
};

SIGNUP_CONSTANTS = {
	SIGNUP_FULL_NAME_ID : "signup full name",
	SIGNUP_USERNAME_ID : "signup username",
	SIGNUP_PASSWORD_ID : "signup password",
	SIGNUP_VERIFY_PASSWORD_ID : "signup verify password"
};

var Login = function(id,applicationFrame) {
	Application.call(this,id,applicationFrame);
	
	var login = new LoginArea(id).appendTo(this.frame);
	
	this.frame.append("<br>");
	
	var signup = new SignUpArea(id).appendTo(this.frame);
	
	eWolf.bind("refresh",function(event,eventID) {
		if(id == eventID) {
			login.clearAll();
			signup.clearAll();
		}
	});
	
	return this;
};

var LoginArea = function(id) {
	var self = this;
	$.extend(this,LOGIN_CONSTANTS);
	
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
	
	this.showErrors = function() {
		checkForError(username, usernameError, "* Must specify a user name.");
		checkForError(password, passwordError, "* Must specify a password.");		
	};
	
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
	
	this.appendTo = function (someFrame) {
		login.appendTo(someFrame);
		return self;
	};
	
	return this;
};

var SignUpArea = function(id) {
	var self = this;
	$.extend(this,SIGNUP_CONSTANTS);
	
	var signup = new TitleArea("Sign Up");
	
	var fullName = $("<input/>").attr({
		"type" : "text",
		"placeholder" : "Full Name"
	});
	
	var fullNameError = $("<span/>").addClass("errorArea");
	
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
	
	var verifyPassword = $("<input/>").attr({
		"type" : "password",
		"placeholder" : "Verify Password"
	});
	
	var verifyPasswordError = $("<span/>").addClass("errorArea");
	
	var signUpError = $("<span/>").addClass("errorArea");
	
	var base = $("<table/>");
	
	var fullNameRaw = $("<tr/>").appendTo(base);
	$("<td/>").addClass("loginFieldDescription")
		.append("Full Name:")
		.appendTo(fullNameRaw);	
	$("<td/>")
		.append(fullName)
		.append(fullNameError)
		.appendTo(fullNameRaw);
	
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
	
	var verifyPasswordRaw = $("<tr/>").appendTo(base);
	$("<td/>").addClass("loginFieldDescription")
		.append("Verify Password:")
		.appendTo(verifyPasswordRaw);	
	$("<td/>")
		.append(verifyPassword)
		.append(verifyPasswordError)
		.appendTo(verifyPasswordRaw);
	
	var signUpErrorRow = $("<tr/>").appendTo(base);
	$("<td/>").addClass("loginFieldDescription")
		.appendTo(signUpErrorRow);	
	$("<td/>")
		.append(signUpError)
		.appendTo(signUpErrorRow);
	
	signup.appendAtBottomPart(base);
	
	function handleSignUp(data, textStatus, postData) {
		eWolf.getUserInformation();
	}
	
	function errorHandler(data, textStatus, postData) {
		signUpError.html(data.errorMessage);
		self.clearAll();
	}
	
	function badRequestHandler(data, textStatus, postData) {
		signUpError.html("Server Error. Could not sign up.");
		self.clearAll();
	}
	
	var formValidator = new FormValidator()
			.registerField(self.SIGNUP_FULL_NAME_ID, fullName, fullNameError)
			.registerField(self.SIGNUP_USERNAME_ID, username, usernameError)
			.registerField(self.SIGNUP_PASSWORD_ID, password, passwordError)
			.registerField(self.SIGNUP_VERIFY_PASSWORD_ID, verifyPassword, verifyPasswordError)
			.attachOnSend(function() {
				var handler = new ResponseHandler("createAccount",[])
					.success(handleSignUp)
					.error(errorHandler)
					.badResponseHandler(badRequestHandler);
				
				eWolf.serverRequest.request(id,{
						createAccount : {
							name : fullName.val(),
							username : username.val(),
							password : password.val()
						}
					}, handler.getHandler());
				})
			.addValidator(self.SIGNUP_FULL_NAME_ID, VALIDATOR_IS_NOT_EMPTY,
					"* Must specify a name.")
			.addValidator(self.SIGNUP_USERNAME_ID, VALIDATOR_IS_NOT_EMPTY,
					"* Must specify a user name.")
			.addValidator(self.SIGNUP_PASSWORD_ID, VALIDATOR_IS_NOT_EMPTY,
					"* Must specify a password.")
			.addValidator(self.SIGNUP_VERIFY_PASSWORD_ID, VALIDATOR_IS_NOT_EMPTY,
					"* Must verify the password.")
			.addValidator(self.SIGNUP_VERIFY_PASSWORD_ID, function(field) {
				return password.val() == field.val();
			},"* Password do not mach.");
			
	signup.addFunction("Sign Up",formValidator.sendForm);
	
	this.clearAll = function() {
		formValidator.clearAllFields();
		return self;
	};

	this.appendTo = function (someFrame) {
		signup.appendTo(someFrame);
		return self;
	};
	
	return this;
};