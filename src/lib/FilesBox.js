var FilesBox = function(uploaderArea) {
	var fileselect = $("<input/>").attr({
		"type" : "file",
		"id" : "fileselect",
		"name" : "fileselect[]",
		"multiple" : "multiple"
	}).appendTo(uploaderArea);

	var filedrag = $("<div/>").attr("id", "filedrag").append(
			"or drop files here").appendTo(uploaderArea);

	var filelist = new TagList(true).appendTo(uploaderArea);

	// call initialization file
	if (window.File && window.FileList && window.FileReader) {
		Init();
	}

	// getElementById
	function $id(id) {
		return document.getElementById(id);
	}

	// file drag hover
	function FileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == "dragover" ? "hover" : "");
	}

	// file selection
	var UID = 0;

	function FileSelectHandler(e) {
		// cancel event and hover styling
		FileDragHover(e);

		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files;

		// process all File objects
		for ( var i = 0, f; f = files[i]; i++) {
			filelist.addTag(UID, f, new FileItem(f), true);
			UID += 1;
		}
	}

	// initialize
	function Init() {

		// file select
		fileselect[0].addEventListener("change", FileSelectHandler, false);

		// is XHR2 available?
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {

			// file drop
			filedrag[0].addEventListener("dragover", FileDragHover, false);
			filedrag[0].addEventListener("dragleave", FileDragHover, false);
			filedrag[0].addEventListener("drop", FileSelectHandler, false);
			filedrag[0].style.display = "block";
		}

	}

	function uploadComplete(evt) {
		/* This event is raised when the server send back a response */
	}

	function uploadFailed(evt) {
		alert("There was an error attempting to upload the file.");
	}

	function uploadCanceled(evt) {
		alert("The upload has been canceled by the user or the browser dropped the connection.");
	}

	return {
		getFiles : function() {
			return files;
		},
		uploadFile : function(wolfpackName) {
			filelist.foreachUnMarkedTag(function(id,file) {
				var xhr = new XMLHttpRequest();

				filelist.initProgressBar(id);
				/* event listners */
				xhr.upload.addEventListener("progress", function(evt) {
					if (evt.lengthComputable) {
						var percentComplete = Math.round(evt.loaded * 100
								/ evt.total);
						filelist.setProgress(id,percentComplete);
					} else {
						// TODO: wating animation
					}
				}, false);
				xhr.addEventListener("load", uploadComplete, false);
				xhr.addEventListener("error", uploadFailed, false);
				xhr.addEventListener("abort", uploadCanceled, false);
				/*
				 * Be sure to change the url below to the url of your upload
				 * server side script
				 */
				var addr = "/sfsupload?" + "wolfpackName=" + wolfpackName
						+ "&fileName=" + file.name 
						+ "&contentType=" + file.type;

				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4) {
						var obj = JSON.parse(xhr.responseText);
						console.log(obj);
//						window.open(obj.path, 'TheLINK'+id);
					}
				};

				xhr.open("POST", addr);
				xhr.send(file);
			});
		}
	};
};