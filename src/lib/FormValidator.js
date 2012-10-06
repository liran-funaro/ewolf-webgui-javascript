VALIDATOR_IS_NOT_EMPTY = function(field) {
	return field.val() != "";
};

var FormValidator = function() {
	/****************************************************************************
	 * Members
	  ***************************************************************************/
	var self = this;
	
	var fields = {};
	var onSend = null;
	
	/****************************************************************************
	 * Functionality
	  ***************************************************************************/		
	this.attachOnSend = function(newOnSend) {
		onSend = newOnSend;
		return self;
	};
	
	this.sendForm = function() {
		if(self.isValid(true) && onSend) {
			onSend();
		}
	};
	
	this.registerField = function (fieldId, field, itsErrorBox) {
		if(fieldId) {
			fields[fieldId] = {
				field	: field,
				error : itsErrorBox,
				lastCheckStatus : true,
				isVergin : true,
				isMarkedOK : false,
				validators : []
			};
			
			field.bind('input propertychange',function() {
				fields[fieldId].isVergin = false;
				self.isValid(false);
			});
			
			field.keyup(function(event) {
			    if(event.keyCode == 13) {
			    	self.sendForm();
			    	}
			});
		}
		
		return self;
	};
	
	this.addValidator = function (fieldId, validator, errorMessage) {
		if(fieldId && fields[fieldId]) {
			fields[fieldId].validators.push( {
				isValid : validator,
				errorMessage : errorMessage
			});
		}
		
		return self;
	};
	
	this.isValid = function(markOK) {
		var allValid = true;
		
		$.each(fields, function(fieldId, f) {
			if(!markOK && f.isVergin) {
				return true;
			}
			
			var fieldValid = true;
			var fieldErrorMessage = "";
			
			$.each(f.validators, function(j, validator) {
				var fieldValidatorValid = validator.isValid(f.field);
				
				if(fieldValidatorValid == false) {
					fieldErrorMessage = validator.errorMessage;
					fieldValid = false;
					allValid = false;
				}
				
				return fieldValidatorValid;
			});
			
			if(fieldValid) {
				if(f.lastCheckStatus == false || (markOK && !f.isMarkedOK)) {
					f.isMarkedOK = markOK;
					
					f.field.animate({
						"background-color" : markOK ? "#bddec0" : "#ddd" 
					},300, function() {
						if(!markOK) {
							f.field.css("background-color","");
						}						
					});
				}
				
				if(f.lastCheckStatus == false) {
					f.error.animate({
						"opacity" : "0"
					},300, function() {
						f.error.html("");
					});
				}
			} else {
				if(f.lastCheckStatus == true) {
					f.isMarkedOK = false;
					
					f.field.animate({
						"background-color" : "#debdbd"
					},300);	
				}
				
				if(f.error.html() != fieldErrorMessage) {
					f.error.animate({
						"opacity" : "0"
					},150, function() {
						f.error.html(fieldErrorMessage);
						
						f.error.animate({
							"opacity" : "1"
						},300);
					});
				}
			}
			
			f.lastCheckStatus = fieldValid;
		});		
		
		return allValid;
	};
	
	this.clearField = function (fieldId) {
		if(fieldId && fields[fieldId] &&
				!fields[fieldId].isVergin &&
					(		fields[fieldId].isMarkedOK || 
							fields[fieldId].lastCheckStatus == false)) {
			fields[fieldId].field.animate({
				"background-color" : "#ddd" 
			},150, function() {
				fields[fieldId].field.css("background-color","");				
			});
		}
		
		return self;
	};
	
	this.clearAllFields = function () {
		$.each(fields, function(fieldId, f) {
			self.clearField(fieldId);
		});
		return self;
	};
	
	return this;
};
