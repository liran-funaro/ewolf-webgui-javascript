RESPONSE_ARRAY_CONDITION_GENRAL_ERROR = 
	function(response, textStatus, postData) {
		return response.isGeneralError();
	};

var ResponseHandler = function(category, requiredFields, handler) {
	/****************************************************************************
	 * Members
	  ***************************************************************************/
	var self = this;
	
	var errorHandler = null;
	var completeHandler = null;
	var badResponseHandler = null;
	var responseArray = [];
	
	/****************************************************************************
	 * Functionality
	  ***************************************************************************/
	function theHandler(data, textStatus, postData) {
		if (data && data[category]) {
			var response = new GenericResponse(data[category]);
			var valid = true;
			
			$.each(responseArray, function(i, resObj) {
				if(resObj.condition && resObj.key &&
						resObj.condition(response, textStatus, postData[category])) {
					if(response[resObj.key]) {
						$.each(response[resObj.key], function(pos, item) {
							var subResponse = new GenericResponse(item);
							
							if(subResponse.isSuccess()) {
								if(resObj.success) {
									resObj.success(pos, subResponse, textStatus, postData[category]);
								}								
							} else {
								if(resObj.error) {
									resObj.error(pos, subResponse, textStatus, postData[category]);
								}								
							}
						});
					} else {
						console.log("No " + resObj.key + " in response");
					}
				}
			});
			
			if (response.isSuccess()) {				
				$.each(requiredFields, function(i, field) {
					if (field && !response[field]) {
						console.log("No field: \"" + field + "\" in response");
						valid = false;
					}
				});
			} else {
				valid = false;
			}
			
			if (valid) {
				if(handler) {
					handler(response, textStatus, postData[category]);
				}				
			} else {
				console.log(response.toString());
				
				if(errorHandler) {
					errorHandler(response, textStatus, postData[category]);
				}
			}
		} else {
			var errorMsg = "No category: \"" + category + "\" in response";
			console.log(errorMsg);
			
			if(badResponseHandler) {
				badResponseHandler(errorMsg, textStatus, postData[category]);
			}
		}
		
		if(completeHandler) {
			completeHandler(textStatus, postData[category]);
		}		
	};	
	
	this.addResponseArray = function(key, conditionFunc, success, error) {
		responseArray.push({
			key : key,
			condition : conditionFunc,
			success : success,
			error : error
		});
		
		return self;
	};

	this.getHandler = function() {
		return theHandler;
	};
	
	this.error = function (newErrorHandler) {
		errorHandler = newErrorHandler;
		return self;
	};
	
	this.success = function (newSuccessHandler) {
		handler = newSuccessHandler;
		return self;
	};
	
	this.complete = function (newCompleteHandler) {
		completeHandler = newCompleteHandler;
		return self;
	};
	
	this.badResponseHandler = function (newBadResponseHandler) {
		badResponseHandler = newBadResponseHandler;
		return self;
	};
	
	return this;
};