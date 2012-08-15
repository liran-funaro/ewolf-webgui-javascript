var FunctionsArea = function () {	
	this.frame = $("<div/>");
	
	var functions = {};
	
	this.appendTo = function (container) {
		this.frame.appendTo(container);
		return this;
	};
	
	this.addFunction = function (functionName,functionOp) {
		if(functions[functionName] == null) {
			functions[functionName] = $("<input/>").attr({
				"type": "button",
				"value": functionName
			}).click(functionOp).appendTo(this.frame);
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
	
	this.hideFunction = function (functionName) {
		if(functions[functionName] != null) {
			functions[functionName].hide(200);
		}
		
		return this;
	};
	
	this.showFunction = function (functionName) {
		if(functions[functionName] != null) {
			functions[functionName].show(200);
		}
		
		return this;
	};
	
	this.hideAll = function (functionName) {
		$.each(functions, function(funcName,funcBtn) {
			if(funcBtn != null) {
				funcBtn.hide(200);
			}			
		});
		
		return this;
	};
	
	this.showAll = function (functionName) {
		$.each(functions, function(funcName,funcBtn) {
			if(funcBtn != null) {
				funcBtn.show(200);
			}			
		});
		
		return this;
	};
	
	return this;
};