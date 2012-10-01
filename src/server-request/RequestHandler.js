var BasicRequestHandler = function(requestAddress,refreshIntervalSec) {
	var self = this;
	
	var requestsMap = {},
			appsRequests = {},
			generalRequests = [];

	var onCompleteAll = null;
	var timer = null;
	var requestAllOnSelect = false;
	
	this.stopRefreshInterval = function () {
		clearTimeout(timer);
	};
	
	this.restartRefreshInterval = function () {
		if(refreshIntervalSec > 0) {
			clearTimeout(timer);
			timer = setTimeout(timerTimeout,refreshIntervalSec*1000);
		}
	};
	
	function onRequestBegin (appID) {
		eWolf.trigger("loading",[appID]);
	}
	
	function onRequestComplete (appID) {
		eWolf.trigger("loadingEnd",[appID]);		
	}
	
	function omRequestAllBegin(appID) {
		self.stopRefreshInterval();
	}
	
	function onRequestAllComplete(appID) {
		self.restartRefreshInterval();
		
		if(appID && appsRequests[appID] && appsRequests[appID].onComplete) {
			appsRequests[appID].onComplete();
		}
		
		if(onCompleteAll) {
			onCompleteAll();
		}		
	}
		
	function timerTimeout() {
		self.requestAll(eWolf.selectedApp,false);
	}
	
	eWolf.bind("select",function(event,eventId) {
		if(requestAllOnSelect) {
			self.requestAll(eventId,false);
		}		
	});
	
	eWolf.bind("refresh",function(event,eventId) {
		self.requestAll(eventId,true);
	});
	
	this.setRequestAllOnSelect = function (enable) {
		requestAllOnSelect = enable;
	};
	
	this.registerRequest = function(requestName, requestFunction) {
		if(requestName && requestFunction) {
			requestsMap[requestName] = {
					request : requestFunction,
					handlers : [],
					lastUpdate : 0
			};
		}
		
		return self;
	};
	
	this.registerHandler = function(requestName, handleDataFunction) {
		if(requestName && requestsMap[requestName]) {
			requestsMap[requestName].handlers.push(handleDataFunction);
		}
		
		return self;
	};
	
	this.bindRequest = function(requestName,appID) {
		if(requestName && requestsMap[requestName]) {
			if(appID) {
				if(!appsRequests[appID]) {
					appsRequests[appID] = [];
				}
				appsRequests[appID].push(requestsMap[requestName]);
			} else {
				generalRequests.push(requestsMap[requestName]);
			}			
		}
		
		return self;
	};
	
	this.unregisterApp = function(appID) {
		if(appID && appsRequests[appID]) {
			delete appsRequests[appID];
		}
		
		return self;
	};
	
	this.setRequestAddress = function(inputRequestAddress) {
		requestAddress = inputRequestAddress;
		return self;
	};
	
	this._makeRequest = function (address,data,success) {
		return self;
	};
	
	this.request = function(appID,data,handleDataFunction,handleOnComplete) {
		onRequestBegin(appID);
		
		self._makeRequest(requestAddress,data,
			function(receivedData,textStatus) {
				if(handleDataFunction != null) {
					handleDataFunction(receivedData,textStatus,data);
				}				
			}).complete(function() {
				onRequestComplete(appID);

				if(handleOnComplete != null) {
					handleOnComplete(appID);
				}				
			});
		
		return self;
	};	

	this.requestObjectArray = function(appID,requestsObj,handleOnComplete) {
		if(requestsObj.length == 0) {
			return self;
		}
		
		var data = {};

		$(requestsObj).each(function(i, reqObj) {
			$.extend(data, reqObj.request());
		});

		this.request(appID, data, function(receivedData, textStatus, data) {
			$(requestsObj).each(function(i, reqObj) {
				$(reqObj.handlers).each(function(i, handlerFunc) {
					handlerFunc(receivedData, textStatus, data);
				});
				
				reqObj.lastUpdate = new Date().getTime();
			});
		}, handleOnComplete);

		return self;
	};
	
	this.requestAll = function(appID,forceUpdate) {
		omRequestAllBegin(appID);
		
		var requestsObj = generalRequests;
		
		if(appID && appsRequests[appID]) {
			requestsObj = requestsObj.concat(appsRequests[appID]);
		}

		var needRefresh = [];
		
		if(forceUpdate) {
			needRefresh = requestsObj;
		} else {
			needRefresh = self.filterByLastUpdate(requestsObj);
		}	
		
		return self.requestObjectArray(appID,needRefresh,
				onRequestAllComplete);
	};
	
	this.filterByLastUpdate = function(requestsObj) {
		var needRefresh = [];
		
		var needRefreshTime = new Date().getTime() - 
							(refreshIntervalSec * 1000);

		$(requestsObj).each(function(i,reqObj) {
			if(reqObj.lastUpdate < needRefreshTime) {
				needRefresh.push(reqObj);
			}
		});
		
		return needRefresh;
	};
	
	this.complete = function(appID,newOnComplete) {
		if(appID && appsRequests[appID]) {
			appsRequests[appID].onComplete = newOnComplete;
		} else {
			onCompleteAll = newOnComplete;
		}		
		
		return self;
	};
		
	return this;
};

var PostRequestHandler = function(requestAddress,refreshIntervalSec) {
	BasicRequestHandler.call(this,requestAddress,refreshIntervalSec);
	
	this._makeRequest = function (address,data,success) {
		return $.post(address,JSON.stringify(data),success,"json");
	};
	
	return this;
};

/*var JSONRequestHandler = function(id,requestAddress,refreshIntervalSec) {
	BasicRequestHandler.call(this,id,requestAddress,refreshIntervalSec);
	
	this._makeRequest = function (address,data,success) {		
		return $.getJSON(address,data,success);
	};
	
	return this;
};*/

