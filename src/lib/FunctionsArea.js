var FunctionsArea = function () {
	var self = this;
	
	this.frame = $("<div/>");
	
	var functions = {};
	
	this.appendTo = function (container) {
		self.frame.appendTo(container);
		return self;
	};
	
	this.addFunction = function (functionName,functionOp) {
		if(functions[functionName] == null) {
			functions[functionName] = $("<input/>").attr({
				"type": "button",
				"value": functionName
			}).click(functionOp).appendTo(this.frame);
		}
		
		return self;
	};
	
	this.removeFunction = function (functionName) {
		if(functions[functionName] != null) {
			functions[functionName].remove();
			functions[functionName] = null;
		}
		
		return self;
	};
	
	this.hideFunction = function (functionName) {
		if(functions[functionName] != null) {
			functions[functionName].hide(200);
		}
		
		return self;
	};
	
	this.showFunction = function (functionName) {
		if(functions[functionName] != null) {
			functions[functionName].show(200);
		}
		
		return self;
	};
	
	this.hideAll = function () {
		for(var functionName in functions) {
			self.hideFunction(functionName);
		}
		
		return self;
	};
	
	this.showAll = function () {
		for(var functionName in functions) {
			self.showFunction(functionName);
		}
		
		return self;
	};
	
	return this;
};