var Login = function(id,applicationFrame) {
	Application.call(this,id,applicationFrame);
	
	new LoginArea(id).appendTo(this.frame);
	
	this.frame.append("<br>");
	
	new SignUpArea(id).appendTo(this.frame);
	
	return this;
};

var LoginArea = function(id) {
	var self = this;
	
	var login = new TitleArea("Login").appendTo(this.frame);
	login.addFunction("Login",function() {
		// TODO: Login
		eWolfMaster.getUserInformation();
	});
	
	var username = $("<input/>").attr({
		"type" : "text",
		"placeholder" : "Username"
	});
	
	var password = $("<input/>").attr({
		"type" : "password",
		"placeholder" : "Password"
	});
	
	var base = $("<table/>");
	
	var usernameRaw = $("<tr/>").appendTo(base);
	$("<td/>").addClass("newMailAlt")
		.append("Username:")
		.appendTo(usernameRaw);	
	$("<td/>")
		.append(username)
		.appendTo(usernameRaw);
	
	var passwordRaw = $("<tr/>").appendTo(base);
	$("<td/>").addClass("newMailAlt")
		.append("Password:")
		.appendTo(passwordRaw);	
	$("<td/>")
		.append(password)
		.appendTo(passwordRaw);
	
	login.appendAtBottomPart(base);
	
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
	
	var verifyPassword = $("<input/>").attr({
		"type" : "password",
		"placeholder" : "Verify Password"
	});
	
	var passwordError = $("<span/>").addClass("errorArea");
	
	var base = $("<table/>");
	
	var fullNameRaw = $("<tr/>").appendTo(base);
	$("<td/>").addClass("newMailAlt")
		.append("Full Name:")
		.appendTo(fullNameRaw);	
	$("<td/>")
		.append(fullName)
		.append(fullNameError)
		.appendTo(fullNameRaw);
	
	var usernameRaw = $("<tr/>").appendTo(base);
	$("<td/>").addClass("newMailAlt")
		.append("Username:")
		.appendTo(usernameRaw);	
	$("<td/>")
		.append(username)
		.append(usernameError)
		.appendTo(usernameRaw);
	
	var passwordRaw = $("<tr/>").appendTo(base);
	$("<td/>").addClass("newMailAlt")
		.append("Password:")
		.appendTo(passwordRaw);	
	$("<td/>")
		.append(password)
		.append(passwordError)
		.appendTo(passwordRaw);
	
	var passwordRaw = $("<tr/>").appendTo(base);
	$("<td/>").addClass("newMailAlt")
		.append("Verify Password:")
		.appendTo(passwordRaw);	
	$("<td/>")
		.append(verifyPassword)
		.appendTo(passwordRaw);
	
	signup.appendAtBottomPart(base);
	
	function handleSignUp(data, textStatus, postData) {
		eWolfMaster.getUserInformation();
		self.clearAll();
	}
	
	signup.addFunction("Sign Up",function() {
		var error = false;
		
		if(fullName.val() == "") {
			error = true;
		}
		
		if(username.val() == "") {
			error = true;
		}
		
		if(password.val() == "") {
			error = true;
		} else if(password.val() != verifyPassword.val()) {
			error = true;
		}
		
		if(error) {
			self.showErrors();
		} else {
			new PostRequestHandler(id, "/json", 0).request({
				createAccount : {
					name : fullName.val(),
					username : username.val(),
					password : password.val()
				}
			}, new ResponseHandler("createAccount", 
					[],handleSignUp).getHandler());
		}
	});
	
	this.showErrors = function() {
		fullNameError.animate({
			"opacity" : "0"
		},500,function() {
			if(fullName.val() == "") {
				fullNameError.html("* Must specify a name.");
				fullNameError.animate({
					"opacity" : "1"
				},1000);
				
				fullName.animate({
					"background-color" : "#debdbd"
				},1000);
			} else {
				fullName.animate({
					"background-color" : "#bddec0"
				},1000);
			}
		});
		
		usernameError.animate({
			"opacity" : "0"
		},500,function() {
			if(username.val() == "") {
				usernameError.html("* Must specify a user name.");
				usernameError.animate({
					"opacity" : "1"
				},1000);
				
				username.animate({
					"background-color" : "#debdbd"
				},1000);
			} else {
				username.animate({
					"background-color" : "#bddec0"
				},1000);
			}
		});;
		
		passwordError.animate({
			"opacity" : "0"
		},500,function() {
			if(password.val() == "") {
				passwordError.html("* Must specify a password.");
				passwordError.animate({
					"opacity" : "1"
				},1000);
				
				password.animate({
					"background-color" : "#debdbd"
				},1000);
			} else if(password.val() != verifyPassword.val()) {
				passwordError.html("* Password do not mach.");
				passwordError.animate({
					"opacity" : "1"
				},1000);
				
				password.animate({
					"background-color" : "#debdbd"
				},1000);
				verifyPassword.animate({
					"background-color" : "#debdbd"
				},1000);
			} else {
				password.animate({
					"background-color" : "#bddec0"
				},1000);
				verifyPassword.animate({
					"background-color" : "#bddec0"
				},1000);
			}
		});
	};
	
	this.clearAll = function() {
		fullName.val("");
		fullNameError.val("");
		
		username.val("");
		usernameError.val("");
		
		password.val("");
		passwordError.val("");
		
		verifyPassword.val("");
	};
	
	this.appendTo = function (someFrame) {
		signup.appendTo(someFrame);
		return self;
	};
	
	return this;
};