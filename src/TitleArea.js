var TitleArea = function (title) {
	var thisObj = this;
	
	var frame = $("<div/>").attr("class","titleArea");
	
	var topPart = $("<div/>").appendTo(frame);
	var bottomPart = $("<div/>").attr("class","titleBottomPart").appendTo(frame);
	
	var table = $("<table/>").attr("class","titleTable").appendTo(topPart);
	
	var row = $("<tr>").appendTo(table);
	var titleTextArea = $("<td>")
		.attr("class","titleTextArea").appendTo(row);
	var titleFunctionsArea = $("<td>")
		.attr("class","titleFunctionsArea").appendTo(row);
	
	var theTitle = $("<span/>").attr({
		"class" : "eWolfTitle"
	}).appendTo(titleTextArea);
	
	var functions = {};
	
	this.setTitle = function (newTitle) {
		if(newTitle != null) {
			theTitle.html(newTitle);
		}
	};
	
	this.setTitle(title);
	
	this.appendTo = function (container) {
		frame.appendTo(container);
		return thisObj;
	};
	
	this.appendAtTitleTextArea = function (obj) {
		titleTextArea.append(obj);
		return thisObj;
	};
	
	this.appendAtTitleFunctionsArea = function (obj) {
		titleFunctionsArea.append(obj);
		return thisObj;
	};
	
	this.appendAtBottomPart = function (obj) {
		bottomPart.append(obj);
		return thisObj;
	};
	
	this.addFunction = function (functionName,functionOp) {
		if(functions[functionName] == null) {
			functions[functionName] = $("<input/>").attr({
				"type": "button",
				"value": functionName
			}).click(functionOp).appendTo(titleFunctionsArea);
		}
		
		return this;
	};
	
	this.removeFunction = function (functionName) {
		if(functions[functionName] != null) {
			functions[functionName].remove();
			functions[functionName] = null;
		}
		
		return this;
	};
	
	return this;
};