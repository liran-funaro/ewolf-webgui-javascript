var TagList = function(multirow) {
	var thisObj = this;
	
	var tagBox = $("<div/>");
		
	this.foreachTag = function (applyThis,withSelector) {
		var selector = ".TagClass";
		if(withSelector) {
			selector += withSelector;
		}
		
		tagBox.children(selector).each(function(i, thisTag) {
			applyThis($(thisTag).attr("id"),$(thisTag).data("tagData"));
		});
		
		return this;
	};
	
	this.foreachMarkedTag = function (applyThis) {
		return thisObj.foreachTag(applyThis, ".TagErrorClass");
	};
	
	this.foreachUnMarkedTag = function (applyThis) {
		return thisObj.foreachTag(applyThis, ":not(.TagErrorClass)");
	};
	
	this.foreachRemovableTag = function (applyThis) {
		return thisObj.foreachTag(applyThis, ":not(.TagNonRemoveable)");
	};
	
	this.removeTag = function (id) {
		var tagElement = tagBox.children(".TagClass[id=\""+id+"\"]");
		if(tagElement.length > 0) {
			tagElement.remove();
			return true;
		}
		
		return false;
	};
	
	this.addTag = function(id,tagData,tagText,removable) {
		if(tagBox.find(".TagClass[id=\""+id+"\"]").length != 0) {
			return false;
		}		
		
		var newTagItem = new Tag(id,null,removable,multirow)
			.attr("id",id)
			.data("tagData",tagData)
			.append(tagText);
		
		tagBox.append(newTagItem);
		
		return true;
	};
	
	this.appendTo = function(someFrame) {
		tagBox.appendTo(someFrame);
		return this;
	};
	
	this.markTag = function (tag,error) {
		tagBox.children(".TagClass[id=\""+tag+"\"]")
			.addClass("TagErrorClass")
			.attr("title",error);
		return this;
	};
	
	this.unmarkTag = function (tag) {
		tagBox.children(".TagClass[id=\""+tag+"\"]")
			.removeClass("TagErrorClass")
			.attr("title",null);
		return this;
	};
	
	this.isEmpty = function() {
		return (tagBox.children(".TagClass,.TagClass.TagErrorClass").length == 0);
	};
	
	this.tagCount = function() {
		return tagBox.children(".TagClass").length;
	};
	
	this.unmarkedTagCount = function() {
		return tagBox.children(".TagClass:not(.TagErrorClass)").length;
	};
	
	this.markedTagCount = function() {
		return tagBox.children(".TagClass.TagErrorClass").length;
	};
	
	this.removableTagCount = function () {
		return tagBox.children(".TagClass:not(.TagNonRemoveable)").length;
	};
	
	this.unmarkAll = function () {
		tagBox.children(".TagClass").removeClass("TagErrorClass");
		return this;
	};
	
	this.initProgressBar = function (tag) {
		tagBox.children(".TagClass[id=\""+tag+"\"]").data("initProgressBar")();
	};
	
	this.setProgress = function (tag, prec) {
		tagBox.children(".TagClass[id=\""+tag+"\"]").data("setProgress")(prec);
	};
	
	return this;
};