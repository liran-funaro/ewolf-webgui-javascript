var Login = function(id,applicationFrame) {
	Application.call(this,id,applicationFrame);
	
	var login = new TitleArea("Login").appendTo(this.frame);
	login.addFunction("Login",function() {
		// TODO: Login
		alert("Option unavailible");
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
	
	this.frame.append("<br>");
	new TitleArea("Sign Up").appendTo(this.frame);
	
	return this;
};