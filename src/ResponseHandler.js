var ResponseHandler = function(category, requiredFields, handler) {
	var errorHandler = null;
	var completeHandler = null;
	
	function theHandler(data, textStatus, postData) {
		if (data[category] != null) {
			if (data[category].result == "success") {
				var valid = true;
				$.each(requiredFields, function(i, field) {
					if (field == null) {
						console.log("No field: \"" + field + "\" in response");
						valid = false;
						return false;
					}
				});

				if (valid && handler) {
					handler(data[category], textStatus, postData);
				}
			} else {
				console.log("Response unsuccesssful: " + data[category].result);
				if(errorHandler) {
					errorHandler(data[category].result, textStatus, postData);
				}
			}

		} else {
			var errorMsg = "No category: \"" + category + "\" in response";
			console.log(errorMsg);
			
			if(errorHandler) {
				errorHandler(errorMsg, textStatus, postData);
			}
		}
		
		if(completeHandler) {
			completeHandler(data, textStatus, postData);
		}		
	};
	
	return {
		getHandler: function() {
			return theHandler;
		},
		error: function (newErrorHandler) {
			errorHandler = newErrorHandler;
			return this;
		},		
		success: function (newSuccessHandler) {
			handler = newSuccessHandler;
			return this;
		},		
		complete: function (newCompleteHandler) {
			completeHandler = newCompleteHandler;
			return this;
		}
	};
};