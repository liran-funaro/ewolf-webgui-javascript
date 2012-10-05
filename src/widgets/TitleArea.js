var TitleArea = function (title) {
	/****************************************************************************
	 * Members
	  ***************************************************************************/
	var self = this;
	
	/****************************************************************************
	 * User Interface
	  ***************************************************************************/
	this.frame = $("<div/>").attr("class","titleArea");
	
	var topPart = $("<div/>").appendTo(this.frame);
	var bottomPart = $("<div/>")
		.attr("class","titleBottomPart")
		.appendTo(this.frame);
	
	var table = $("<table/>").attr("class","titleTable").appendTo(topPart);
	
	var row = $("<tr>").appendTo(table);
	var titleTextArea = $("<td>")
		.addClass("titleTextArea").appendTo(row);
	var titleFunctionsArea = $("<td>")
		.attr("class","titleFunctionsArea").appendTo(row);
	
	var functions = new FunctionsArea().appendTo(titleFunctionsArea);
	
	var theTitle = $("<span/>").attr({
		"class" : "eWolfTitle"
	}).appendTo(titleTextArea);
	
	var titleExtraText = $("<span/>").appendTo(titleTextArea);
	
	/****************************************************************************
	 * Functionality
	  ***************************************************************************/	
	this.setTitle = function (newTitle) {
		if(newTitle != null) {
			theTitle.html(newTitle);
		}
		
		return self;
	};
	
	this.appendTo = function (container) {
		this.frame.appendTo(container);
		return self;
	};
	
	this.appendAtTitleTextArea = function (obj) {
		titleExtraText.append(obj);
		return self;
	};
	
	this.appendAtTitleFunctionsArea = function (obj) {
		titleFunctionsArea.append(obj);
		return self;
	};
	
	this.appendAtBottomPart = function (obj) {
		bottomPart.append(obj);
		return self;
	};
	
	this.addFunction = function (functionName,functionOp, hide) {
		functions.addFunction(functionName,functionOp, hide);
		return self;
	};
	
	this.removeFunction = function (functionName) {
		functions.removeFunction(functionName);
		return self;
	};
	
	this.hideFunction = function (functionName) {
		functions.hideFunction(functionName);		
		return self;
	};
	
	this.showFunction = function (functionName) {
		functions.showFunction(functionName);
		return self;
	};
	
	this.hideAll = function () {
		functions.hideAll();
		return self;
	};
	
	this.showAll = function () {
		functions.showAll();
		return self;
	};
	
	this.setTitle(title);
	
	return this;
};