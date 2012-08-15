var TagList = function(multirow,onRemoveTag) {
	this.div = $("<div/>");
	
	this.appendTo = function(someFrame) {
		this.div.appendTo(someFrame);
		return this;
	};
	
	this.getTags = function(matches) {
		var selector = ".TagClass";
		
		if(matches != null) {
			if(matches.id != null) {
				selector += "[id=\"" + matches.id + "\"]";
			}
			
			if(matches.markedError == true) {
				selector += ".TagErrorClass";
			} else if(matches.markedError == false){
				selector += ":not(.TagErrorClass)";
			}
			
			if(matches.markedOK == true) {
				selector += ".TagOKClass";
			} else if(matches.markedOK == false){
				selector += ":not(.TagOKClass)";
			}
			
			if(matches.removable == true) {
				selector += ":not(.TagNonRemoveable)";
			} else if(matches.removable == false){
				selector += ".TagNonRemoveable";
			}
		}		
		
		return this.div.children(selector);
	};
	
	this.match = function(matches) {
		var tags = this.getTags(matches);
		
		return {
			each: function (applyThis) {
				tags.each(function(i, thisTag) {
					var tag = $(thisTag);
					applyThis(tag.attr("id"),tag.data("tagData"));
				});
				
				return this;
			},
			unremovable: function () {
				tags.addClass("TagNonRemoveable");
				return this;
			},
			removable: function () {
				tags.removeClass("TagNonRemoveable");
				return this;
			},			
			markError: function (error) {
				tags.addClass("TagErrorClass")
					.removeClass("TagOKClass")
					.attr("title",error);
				return this;
			},			
			unmarkError: function () {
				tags.removeClass("TagErrorClass")
					.attr("title",null);
				return this;
			},			
			markOK: function () {
				tags.addClass("TagOKClass")
					.removeClass("TagErrorClass")
					.attr("title","Successful");
				return this;
			},			
			unmarkOK: function () {
				tags.removeClass("TagOKClass")
					.attr("title",null);
				return this;
			},			
			unmark: function () {
				tags.removeClass("TagErrorClass")
					.removeClass("TagOKClass")
					.attr("title",null);
				return this;
			},			
			remove: function () {
				tags.remove();
				return this;
			},			
			initProgressBar: function () {
				tags.each(function(i, thisTag) {
					 $(thisTag).data("initProgressBar")();
				});
				
				return this;
			},			
			setProgress: function (prec) {
				tags.each(function(i, thisTag) {
					var func = $(thisTag).data("setProgress");
					if(func) {
						return func(prec);
					}
				});
				
				return this;
			},			
			removeProgressBar: function () {				
				tags.each(function(i, thisTag) {
					var func = $(thisTag).data("removeProgressBar");
					if(func) {
						return func();
					}
				});
				
				return this;					
			},			
			setOnRemoveTag: function(newOnRemove) {
				tags.data("onRemove",newOnRemove);
				return this;
			},			
			setData: function (tagData) {
				tags.data("tagData",tagData);
				return this;
			},
			count: function () {
				return tags.length;
			},
			isEmpty: function () {
				return tags.length == 0;
			},
			getData: function () {
				result = [];
				tags.each(function(i, thisTag) {
					result.push($(thisTag).data("tagData"));
				});
				
				return result;
			}
		};
	};
	
	this.addTag = function(id,tagData,tagText,removable) {
		if( this.match({id:id}).isEmpty()) {
			var newTagItem = new Tag(id,onRemoveTag,removable,multirow)
				.attr("id",id)
				.data("tagData",tagData)
				.append(tagText);
		
			this.div.append(newTagItem);
			
			return true;
		}				
		
		return false;
	};
	
	this.removeTag = function (id) {
		this.match({id:id}).remove();
		return this;
	};
		
	this.foreachTag = function (matches,applyThis) {
		if(applyThis == null) {
			applyThis =  matches;
			matches = null;
		}
		
		this.match(matches).each(applyThis);
		
		return this;
	};
	
	this.setTagUnremovable = function (id) {
		this.match({id:id}).unremovable();
		return this;
	};
	
	this.setTagRmovable = function (id) {
		this.match({id:id}).removable();
		return this;
	};
	
	this.markTagError = function (id,error) {
		this.match({id:id}).markError(error);
		return this;
	};	
	
	this.unmarkTagError = function (id) {
		this.match({id:id}).unmarkError();
		return this;
	};
	
	this.markTagOK = function (id) {
		this.match({id:id}).markOK();
		return this;
	};	
	
	this.unmarkTagOK = function (id) {
		this.match({id:id}).unmarkOK();
		return this;
	};
	
	this.isEmpty = function() {
		return this.match().isEmpty();
	};
	
	this.tagCount = function(matches) {
		return this.match(matches).count();
	};
	
	this.unmarkTags = function (matches) {
		this.match(matches).unmark();
		return this;
	};
	
	this.removeTags = function (matches) {
		this.match(matches).remove();
		return this;
	};
	
	this.initProgressBar = function (id) {
		this.match({id:id}).initProgressBar();
		return this;
	};
	
	this.setProgress = function (id, prec) {
		this.match({id:id}).setProgress(prec);
		return this;
	};
	
	this.removeProgressBar = function (id) {
		this.match({id:id}).removeProgressBar();		
		return this;
	};
	
	this.setOnRemoveTag = function(id,newOnRemove) {
		this.match({id:id}).setOnRemoveTag(newOnRemove);
		return this;
	};
	
	this.setTagData = function (id,tagData) {
		this.match({id:id}).setData(tagData);
		return this;
	};
	
	return this;
};