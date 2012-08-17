var FilesBox = function(uploaderArea) {
	var thisObj = this;
	
	var fileselect;
	var filedrag;
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

		filelist = new TagList(true).appendTo(uploaderArea);

		fileselect[0].addEventListener("change", FileSelectHandler, false);

		// file drop
		filedrag[0].addEventListener("dragover", FileDragHover, false);
		filedrag[0].addEventListener("dragleave", FileDragHover, false);
		filedrag[0].addEventListener("drop", FileSelectHandler, false);
		filedrag[0].style.display = "block";
		
		errorBox = $("<div/>")
			.addClass("errorArea")
			.appendTo(uploaderArea);
	}

	// file drag hover
	function FileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == "dragover" ? "fileDragBoxHover" : "fileDragBox");
	}

	function FileSelectHandler(e) {
		// cancel event and hover styling
		FileDragHover(e);

		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files;

		// process all File objects
		var emptyFile = false;
		for ( var i = 0, f; f = files[i]; i++) {
			if(f.size != 0) {
				filelist.addTag(UID, f, CreateFileItemBox(f), true);
				UID += 1;
			} else {
				emptyFile = true;
			}
		}
		
		if(emptyFile) {
			errorBox.html("Can't upload an empty file or a folder.");
		} else {
			errorBox.html("");
		}
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
	
	this.uploadFile = function(wolfpackName,onComplete) {
		if(!filelist || filelist.match({markedOK:false}).isEmpty()) {
			onComplete(true,[]);
			return this;
		}
		
		filelist.match({markedOK:false}).each(function(id,file) {
			var xhr = new XMLHttpRequest();

			filelist.initProgressBar(id);
			
			/* event listners */
			xhr.upload.addEventListener("progress", function(evt) {
				if (evt.lengthComputable) {
					var percentComplete = Math.round(evt.loaded * 100
							/ evt.total);
					filelist.setProgress(id,percentComplete);
				} else {
					// TODO: waiting animation
				}
			}, false);
			
			xhr.addEventListener("load", function (evt) {
				var obj = JSON.parse(xhr.responseText);
				
				if(obj.result != RESPONSE_RESULT.SUCCESS) {
					thisObj.markError(id);
				} else {
					thisObj.markOK(id,{
						filename: file.name,
						contentType: file.type,
						path: obj.path
					});
				}
				
				isComplete();
			}, false);
			
			xhr.addEventListener("error", function (evt) {
				thisObj.markError(id);
				isComplete();
			}, false);
			
			xhr.addEventListener("abort", function (evt) {
				thisObj.markError(id);
				isComplete();
			}, false);
			
			filelist.setOnRemoveTag(id, function(id) {
				xhr.abort();
			});
			
			function isComplete() {
				if(filelist.match({markedOK:false,markedError:false}).isEmpty()) {
					var success = false;
					if(filelist.match({markedError:true}).isEmpty()) {
						success = true;
					}
					
					return onComplete(success,thisObj.getUploadedFiles());
				}				
			}

			var addr = "/sfsupload?" + "wolfpackName=" + wolfpackName
					+ "&fileName=" + file.name 
					+ "&contentType=" + file.type;


			xhr.open("POST", addr);
			xhr.send(file);
		});
		
		return this;
	};
	
	return this;
};