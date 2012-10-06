var FunctionsArea = function () {
	/****************************************************************************
	 * Members
	  ***************************************************************************/
	var self = this;
	
	var functions = {};
	
	/****************************************************************************
	 * User Interface
	  ***************************************************************************/
	this.frame = $("<div/>");

	/****************************************************************************
	 * Functionality
	  ***************************************************************************/	
	this.appendTo = function (container) {
		self.frame.appendTo(container);
		return self;
	};
	
	this.addFunction = function (functionName,functionOp, hide) {
		if(functions[functionName] == null) {
			functions[functionName] = $("<input/>").attr({
				"type": "button",
				"value": functionName
			}).click(functionOp).appendTo(self.frame);
			
			if(hide) {
				functions[functionName].hide();
			}
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