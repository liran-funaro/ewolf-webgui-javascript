var FilesBox = function(uploaderArea) {
	var self = this;
	
	var fileselect;
	var filedrag = null;
	var filelist = null;
	var errorBox = null;
	
	// file unique ID
	var UID = 0;
	
	if (new XMLHttpRequest().upload) {
		fileselect = $("<input/>").attr({
			"type" : "file",
			"id" : "fileselect",
			"name" : "fileselect[]",
			"multiple" : "multiple"
		}).appendTo(uploaderArea);

		filedrag = $("<div/>")
			.addClass("fileDragBox")
			.append("drop files here")
			.appendTo(uploaderArea);

		filelist = new TagList(true,null,true).appendTo(uploaderArea);

		fileselect[0].addEventListener("change", FileSelectHandler, false);

		// file drop
		filedrag[0].addEventListener("dragover", FileDragHover, false);
		filedrag[0].addEventListener("dragleave", FileDragHover, false);
		filedrag[0].addEventListener("drop", FileDropHandler, false);		
		
		errorBox = $("<div/>")
			.addClass("errorArea")
			.appendTo(uploaderArea);
	}
	
	this.addFiles = function (files) {
		if(!files) {
			return;
		}
		
		// process all File objects
		var emptyFile = false;
		
		for ( var i = 0, f; f = files[i]; i++) {
			if(f.size != 0) {
				var itemBox = CreateFileItemBox(f.name,f.type,f.size,f);
				var thisUID = UID;
				UID += 1;
				filelist.addTag(thisUID, f, itemBox, true);
			} else {
				emptyFile = true;
			}
		}
		
		if(emptyFile) {
			errorBox.html("Can't upload an empty file or a folder.");
		} else {
			errorBox.html("");
		}
	};
	
	function FileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		
		if(e.type == "dragover") {
			filedrag.addClass("fileDragBoxHover");
		} else {
			filedrag.removeClass("fileDragBoxHover");
		}
	}
	
	function FileDropHandler(e) {
		// cancel event and hover styling
		FileDragHover(e);
		self.addFiles(e.dataTransfer.files);
	}

	function FileSelectHandler(e) {
		self.addFiles(e.target.files);
	}
		
	this.markError = function (id) {
		filelist.match({id:id})
			.removeProgressBar()
			.markError("There was an error attempting to upload the file.");
	};
	
	this.markOK = function (id,fileObj) {
		filelist.match({id:id})
			.removeProgressBar()
			.markOK()
			.setData(fileObj);
	};

	this.getUploadedFiles = function() {
		if(!filelist) {
			return [];
		} else {
			return filelist.match({markedOK:true}).getData();
		}		
	};
	
	this.getCallbackAddress = function (wolfpackName, fileName, fileType) {
		return  "/sfsupload?" + "wolfpackName=" + wolfpackName
			+ "&fileName=" + fileName
			+ "&contentType=" + fileType;
	};
	
	this.initProgress = function (id) {
		filelist.initProgressBar(id);
	};
	
	this.showProgress = function (id,percentComplete) {
		filelist.setProgress(id,percentComplete);
	};
	
	this.uploadFileViaXML = function (id,file,wolfpackName,
			onSuccess,onError,onComplete) {
		var xhr = new XMLHttpRequest();
		
		self.initProgress(id);
		
		/* event listners */
		xhr.upload.addEventListener("progress", function(evt) {			
			if (evt.lengthComputable) {
				var percentComplete = Math.round(evt.loaded * 100
						/ evt.total);
				self.showProgress(id, percentComplete);
			}
		}, false);
		
		xhr.addEventListener("load", function (evt) {
			var response = JSON.parse(xhr.responseText);
			if(response.result != RESPONSE_RESULT.SUCCESS) {
				onError(response);
			} else {
				onSuccess(response);
			}
			
			onComplete(response);
		}, false);
		
		xhr.addEventListener("error", function (evt) {
			var response = JSON.parse(xhr.responseText);
			onError(response);
			onComplete(response);
		}, false);
		
		xhr.addEventListener("abort", function (evt) {
			var response = JSON.parse(xhr.responseText);
			onError(response);
			onComplete(response);
		}, false);
		
		filelist.setOnRemoveTag(id, function(id) {
			xhr.abort();
		});

		xhr.open("POST",self.getCallbackAddress(wolfpackName,
				file.name, file.type));
		xhr.send(file);
	};
	
	this.uploadFile = this.uploadFileViaXML;
	
	this.uploadAllFiles = function(wolfpackName,onComplete) {
		if(!filelist || filelist.match({markedOK:false}).isEmpty()) {
			onComplete(true,[]);
			return this;
		}
		
		function onCompleteOneFile() {
			if(filelist.match({markedOK:false,markedError:false}).isEmpty()) {
				var success = false;
				if(filelist.match({markedError:true}).isEmpty()) {
					success = true;
				}
				
				return onComplete(success,self.getUploadedFiles());
			}
		}
		
		filelist.match({markedOK:false}).each(function(id,file) {			
			self.uploadFile(id, file, wolfpackName, function(response) {
				self.markOK(id,{
					filename: file.name,
					contentType: file.type,
					size: file.size,
					path: response.path
				});
			},function(response) {
				self.markError(id);
			},onCompleteOneFile);
		});
		
		return this;
	};
	
	return this;
};
