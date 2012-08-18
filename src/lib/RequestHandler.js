var BasicRequestHandler = function(id,requestAddress,
		refreshIntervalSec) {
	var self = this;
	
	var observersRequestFunction = [];
	var observersHandleDataFunction = [];
	var onCompleteAll = null;
	var timer = null;
	
	function trigger() {
		eWolf.trigger('needRefresh.'+id.replace("+","\\+"),[id]);
	}
	
	function onPostComplete () {
		eWolf.trigger("loadingEnd",[id]);
		
		if(refreshIntervalSec > 0) {
			clearTimeout(timer);
			timer = setTimeout(trigger,refreshIntervalSec*1000);
		}
		
		if(onCompleteAll) {
			onCompleteAll();
		}		
	}
		
	this.getId = function() {
		return id;
	};
	
	this.setRequestAddress = function(inputRequestAddress) {
		requestAddress = inputRequestAddress;
		return self;
	};
	
	this._makeRequest = function (address,data,success) {
		return self;
	};
	
	this.request = function(data,handleDataFunction) {
		clearTimeout(timer);
		eWolf.trigger("loading",[id]);
		
		self._makeRequest(requestAddress,data,
			function(receivedData,textStatus) {
				handleDataFunction(receivedData,textStatus,data);
			}).complete(onPostComplete);
		
		return self;
	};
	
	this.requestAll = function() {
		var data = {};
		
		$.each(observersRequestFunction, function(i, func) {
			var res = func();
			
			if(res != null) {
				$.extend(data,res);
			}				
		});
		
		this.request(data,function(receivedData,textStatus,data) {
			$.each(observersHandleDataFunction, function(i, func) {
				func(receivedData,textStatus,data);			
			});
		});
		
		return self;
	};
	
	this.register = function(requestFunction,handleDataFunction) {
		if(requestFunction != null && handleDataFunction != null) {
			observersRequestFunction.push(requestFunction);
			observersHandleDataFunction.push(handleDataFunction);
		}
		
		return self;
	};
	
	this.listenToRefresh = function() {
		eWolf.bind("refresh."+id,function(event,eventId) {
			if(id == eventId) {
				self.requestAll();
			}
		});
		
		return self;
	};
	
	this.complete = function(newOnCompleteAll) {
		onCompleteAll = newOnCompleteAll;
		return this;
	};
		
	return this;
};

var PostRequestHandler = function(id,requestAddress,refreshIntervalSec) {
	BasicRequestHandler.call(this,id,requestAddress,refreshIntervalSec);
	
	this._makeRequest = function (address,data,success) {
		return $.post(address,JSON.stringify(data),success,"json");
	};
	
	return this;
};

var JSONRequestHandler = function(id,requestAddress,refreshIntervalSec) {
	BasicRequestHandler.call(this,id,requestAddress,refreshIntervalSec);
	
	this._makeRequest = function (address,data,success) {		
		return $.getJSON(address,data,success);
	};
	
	return this;
};