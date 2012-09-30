var Login = function(id,applicationFrame) {
	Application.call(this,id,applicationFrame);
	
	var login = new LoginArea(id).appendTo(this.frame);
	
	this.frame.append("<br>");
	
	var signup = new SignUpArea(id).appendTo(this.frame);
	
	eWolf.bind("select",function(event,eventID) {
		if(id == eventID) {
			login.clearAll();
			signup.clearAll();
		}
	});
	
	return this;
};

var LoginArea = function(id) {
	var self = this;
	
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
	}
	
	function badRequestHandler(data, textStatus, postData) {
		loginError.html("Server Error. Could not login.");
	}
	
	this.showErrors = function() {
		checkForError(username, usernameError, "* Must specify a user name.");
		checkForError(password, passwordError, "* Must specify a password.");		
	};
	
	this.clearAll = function() {
		clearField(username, usernameError);
		clearField(password, passwordError);
	};
	
	this.commitLogin = function () {
		self.showErrors();
		
		if(	username.val() != "" &&
				password.val() != "" ) {
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
		}
	};
	
	function onKeyUp(event) {
		if (event.keyCode == 13) {
			self.commitLogin();
		}
	}
	
	login.addFunction("Login",this.commitLogin);	
	username.keyup(onKeyUp);
	password.keyup(onKeyUp);
	
	this.appendTo = function (someFrame) {
		login.appendTo(someFrame);
		return self;
	};
	
	return this;
};

var SignUpArea = function(id) {
	var self = this;
	
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
	}
	
	function badRequestHandler(data, textStatus, postData) {
		signUpError.html("Server Error. Could not sign up.");
	}
	
	this.showErrors = function() {
		checkForError(fullName, fullNameError, "* Must specify a name.");
		checkForError(username, usernameError, "* Must specify a user name.");
		checkForError(password, passwordError, "* Must specify a password.");		
		checkForError(verifyPassword, verifyPasswordError, "* Must verify the password.",
				password.val() == verifyPassword.val() ?
						null : "* Password do not mach.");
	};
	
	this.clearAll = function() {
		clearField(fullName, fullNameError);
		clearField(username, usernameError);
		clearField(password, passwordError);
		clearField(verifyPassword, verifyPasswordError);
	};
	
	this.commitSignUp = function() {
		if(		fullName.val() == "" ||
				username.val() == "" ||
				password.val() == "" ||
				password.val() != verifyPassword.val()) {
			self.showErrors();
		} else {
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
		}
	};
	
	function onKeyUp(event) {
		if (event.keyCode == 13) {
			self.commitSignUp();
		}
	}
	
	signup.addFunction("Sign Up",this.commitSignUp);	
	fullName.keyup(onKeyUp);
	username.keyup(onKeyUp);
	password.keyup(onKeyUp);
	verifyPassword.keyup(onKeyUp);

	this.appendTo = function (someFrame) {
		signup.appendTo(someFrame);
		return self;
	};
	
	return this;
};

function clearField(field,errorField) {
	errorField.animate({
		"opacity" : "0"
	},500,function() {
		errorField.val("");
	});
	
	field.val("");		
	
	field.animate({
		"background-color" : "#ddd"
	},500);
	
//	field.css({
//		"background-color" : ""
//	});
}

function checkForError(field,errorField,emptyErrorMessage,
		forceErrorMessage) {
	var fieldEmpty = field.val() == "";
	var forecedError = 	forceErrorMessage != undefined &&
											forceErrorMessage != null;
	
	var haveError = fieldEmpty || forecedError;
	
	errorField.animate({
		"opacity" : "0"
	},500,function() {
		if(fieldEmpty) {
			errorField.html(emptyErrorMessage);	
		} else if(forecedError) {
			errorField.html(forceErrorMessage);
		}
		
		if(haveError) {
			errorField.animate({
				"opacity" : "1"
			},1000);
			
			field.animate({
				"background-color" : "#debdbd"
			},1000);
		} else {
			field.animate({
				"background-color" : "#bddec0"
			},1000);
		}
	});
	
	return haveError;
}