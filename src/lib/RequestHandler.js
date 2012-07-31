var BasicRequestHandler = function(id,requestAddress,refreshIntervalSec) {
	
	var observersRequestFunction = [];
	var observersHandleDataFunction = [];
	var timer = null;
	
	function trigger() {
		eWolf.trigger('needRefresh.'+id,[id]);
	}
	
	function onPostComplete () {
		eWolf.trigger("loadingEnd",[id]);
		
		if(refreshIntervalSec > 0) {
			clearTimeout(timer);
			timer = setTimeout(trigger,refreshIntervalSec*1000);
		}
	}
	
	var _makeRequest = function(address,data,success) {
		// Not implemented
	};	

	
	return {		
		getId : function() {
			return id;
		},
		setRequestAddress : function(inputRequestAddress) {
			requestAddress = inputRequestAddress;
			return this;
		},
		_makeRequest: function (address,data,success) {
			// Not implemented
		},
		request: function(data,handleDataFunction) {
			clearTimeout(timer);
			eWolf.trigger("loading",[id]);
			
			this._makeRequest(requestAddress,data,
				function(receivedData,textStatus) {
					handleDataFunction(receivedData,textStatus,data);
				}).complete(onPostComplete);
			
			return this;
		},
		requestAll: function() {
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
			
			return this;
		},
		register: function(requestFunction,handleDataFunction) {
			if(requestFunction != null && handleDataFunction != null) {
				observersRequestFunction.push(requestFunction);
				observersHandleDataFunction.push(handleDataFunction);
			}
			
			return this;
		},
		listenToRefresh: function() {
			var req = this;
			eWolf.bind("refresh."+id,function(event,eventId) {
				if(id == eventId) {
					req.requestAll();
				}
			});
			
			return this;
		}
		
	};
};

var PostRequestHandler = function(id,requestAddress,refreshIntervalSec) {
	var res = new BasicRequestHandler(id,requestAddress,refreshIntervalSec);
	
	res._makeRequest = function (address,data,success) {
		return $.post(address,JSON.stringify(data),success,"json");
	};
	
	return res;
};

var JSONRequestHandler = function(id,requestAddress,refreshIntervalSec) {
	var res = new BasicRequestHandler(id,requestAddress,refreshIntervalSec);
	
	res._makeRequest = function (address,data,success) {		
		return $.getJSON(address,data,success);
	};
	
	return res;
};