var TitleArea = function (title) {	
	this.frame = $("<div/>").attr("class","titleArea");
	
	var topPart = $("<div/>").appendTo(this.frame);
	var bottomPart = $("<div/>")
		.attr("class","titleBottomPart")
		.appendTo(this.frame);
	
	var table = $("<table/>").attr("class","titleTable").appendTo(topPart);
	
	var row = $("<tr>").appendTo(table);
	var titleTextArea = $("<td>")
		.attr("class","titleTextArea").appendTo(row);
	var titleFunctionsArea = $("<td>")
		.attr("class","titleFunctionsArea").appendTo(row);
	
	var functions = new FunctionsArea().appendTo(titleFunctionsArea);
	
	var theTitle = $("<span/>").attr({
		"class" : "eWolfTitle"
	}).appendTo(titleTextArea);	
	
	this.setTitle = function (newTitle) {
		if(newTitle != null) {
			theTitle.html(newTitle);
		}
	};
	
	this.appendTo = function (container) {
		this.frame.appendTo(container);
		return this;
	};
	
	this.appendAtTitleTextArea = function (obj) {
		titleTextArea.append(obj);
		return this;
	};
	
	this.appendAtTitleFunctionsArea = function (obj) {
		titleFunctionsArea.append(obj);
		return this;
	};
	
	this.appendAtBottomPart = function (obj) {
		bottomPart.append(obj);
		return this;
	};
	
	this.addFunction = function (functionName,functionOp) {
		functions.addFunction(functionName,functionOp);
		return this;
	};
	
	this.removeFunction = function (functionName) {
		functions.removeFunction(functionName);
		return this;
	};
	
	this.hideFunction = function (functionName) {
		functions.hideFunction(functionName);		
		return this;
	};
	
	this.showFunction = function (functionName) {
		functions.showFunction(functionName);
		return this;
	};
	
	this.setTitle(title);
	
	return this;
};