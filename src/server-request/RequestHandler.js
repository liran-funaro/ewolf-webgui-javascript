var BasicRequestHandler = function(requestAddress,
		refreshIntervalMillisec) {
	/****************************************************************************
	 * Members
	  ***************************************************************************/
	var self = this;
	
	var requestsMap = {},
			appsRequests = {},
			generalRequests = [];

	var onCompleteAll = [];
	var onGeneralError = null;
	var timer = null;
	var requestAllOnSelect = false;
	
	/****************************************************************************
	 * Functionality
	  ***************************************************************************/	
	this.setRefreshInterval = function (newRefreshIntervalMillisec) {
		refreshIntervalMillisec = newRefreshIntervalMillisec;
	};
	
	this.stopRefreshInterval = function () {
		clearTimeout(timer);
	};
	
	this.restartRefreshInterval = function () {
		clearTimeout(timer);
		
		if(refreshIntervalMillisec > 0) {
			timer = setTimeout(timerTimeout,refreshIntervalMillisec);
		}
	};
	
	function onRequestBegin (appID) {
		eWolf.trigger("loading",[appID]);
	}
	
	function onRequestComplete (appID, response, status) {
		eWolf.trigger("loadingEnd",[appID]);		
	}
	
	function onRequestAllComplete(appID, response, status) {
		if(appID && appsRequests[appID] && appsRequests[appID].onComplete) {
			appsRequests[appID].onComplete(appID, response, status);
		}
		
		if(onCompleteAll) {
			$.each(onCompleteAll, function(i, onCompleteFunc) {
				onCompleteFunc(appID, response, status);
			});			
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
	
	eWolf.bind("needRefresh",function(event,eventId) {
		if(eventId && appsRequests[eventId]) {
			$.each(appsRequests[eventId], function(i, req) {
				req.lastUpdate = 0;
			});
		}
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
	
	this.bindAppToAnotherApp = function(newAppID, existsAppID) {
		if(existsAppID && appsRequests[existsAppID]) {
			if(newAppID) {
				appsRequests[newAppID] = appsRequests[existsAppID];
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
			}).complete(function(response, status) {
				onRequestComplete(appID, response, status);

				if(handleOnComplete != null) {
					handleOnComplete(appID, response, status);
				}				
			}).error(function(response, status, xhr){ 
				if(onGeneralError) {
					onGeneralError(response, status, xhr);
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
		self.stopRefreshInterval();
		
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
		
		if(needRefresh.length == 0) {
			self.restartRefreshInterval();
			return self;
		}
		
		return self.requestObjectArray(appID,needRefresh,
				function (appID, response, status) {
			self.restartRefreshInterval();
			onRequestAllComplete(appID, response, status);
		});
	};
	
	this.filterByLastUpdate = function(requestsObj) {
		var needRefresh = [];
		
		var needRefreshTime = new Date().getTime() - 
							(refreshIntervalMillisec);

		$(requestsObj).each(function(i,reqObj) {
			if(reqObj.lastUpdate < needRefreshTime) {
				needRefresh.push(reqObj);
			}
		});
		
		return needRefresh;
	};
	
	this.addOnComplete = function(appID,newOnComplete) {
		if(appID && appsRequests[appID]) {
			appsRequests[appID].onComplete = newOnComplete;
		} else {
			onCompleteAll.push(newOnComplete);
		}		
		
		return self;
	};
	
	this.error = function(newOnGeneralError) {
		if(newOnGeneralError) {
			onGeneralError = newOnGeneralError;
		}		
		
		return self;
	};
		
	return this;
};

var PostRequestHandler = function(requestAddress,refreshIntervalMillisec) {
	BasicRequestHandler.call(this,requestAddress,refreshIntervalMillisec);
	
	this._makeRequest = function (address,data,success) {
		return $.post(address,JSON.stringify(data),success,"json");
	};
	
	return this;
};

/*var JSONRequestHandler = function(id,requestAddress,refreshIntervalMillisec) {
	BasicRequestHandler.call(this,id,requestAddress,refreshIntervalMillisec);
	
	this._makeRequest = function (address,data,success) {		
		return $.getJSON(address,data,success);
	};
	
	return this;
};*/

