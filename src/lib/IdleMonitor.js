var IdleMonitor = function(awayTime, awayForLongTime,
		idleTime) {
	/****************************************************************************
	 * Members
	  ***************************************************************************/
	var self = this;
	
	this.checkInterval = ONE_MINUTE_IN_MILLISECOUNDS;
	this.awayTime = awayTime;
	this.awayForLongTime = awayForLongTime;
  this.idleTime = idleTime;
  
  var ACTIVE 				= "active",
  		AWAY 					= "away",
  		AWAY_FOR_LONG = "awayforlong",
  		IDLE					=	"idle";
  
  var event = {};
  event[ACTIVE] 				= eWolf.EVENT_ACTIVE;
  event[AWAY]					 	= eWolf.EVENT_AWAY;
  event[AWAY_FOR_LONG]	= eWolf.EVENT_AWAY_FOR_LONG;
  event[IDLE] 					= eWolf.EVENT_IDLE;
  
  this.state = ACTIVE;
  
  this.idleCount = 0;
  
	/****************************************************************************
	 * Functionality
	  ***************************************************************************/
	this.initialize = function() {
		$(document).mousemove(self.reinitIdle);
		$(document).keypress(self.reinitIdle);
		self.timer = setTimeout(self.increaseIdle, self.checkInterval);
	};
	
	this.increaseIdle = function() {
		self.idleCount++;
		self.handleIdleCountChange();
		self.timer = setTimeout(self.increaseIdle, self.checkInterval);
	};
	
	this.reinitIdle = function () {
		self.idleCount = 0;
		self.sendSignal(ACTIVE);	
	};
	
	this.handleIdleCountChange = function () {
		if(self.idleCount >= self.idleTime) {			
			self.sendSignal(IDLE);
		} else if(self.idleCount >= self.awayForLongTime) {
			self.sendSignal(AWAY_FOR_LONG);
		} else if(self.idleCount >= self.awayTime) {
			self.sendSignal(AWAY);
		} else {
			self.sendSignal(ACTIVE);
		}
	};
	
	this.sendSignal = function (newState) {
		if(newState != self.state) {
			self.state = newState;
			
			if(self.state == IDLE) {
				clearTimeout(self.timer);
			}
			
			if(self.state == ACTIVE) {
				clearTimeout(self.timer);
				self.timer = setTimeout(self.increaseIdle, self.checkInterval);
			}
			
			eWolf.trigger(event[self.state]);
		}		
	};
	
	return this;
};