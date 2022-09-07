//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; //stream from getUserMedia()
var rec; //Recorder.js object
var input; //MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb.
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //audio context to help us record

let blobLeft, filenameLeft, blobRight, filenameRight;

var recordButton = document.getElementById("recordButtonLeft");
var stopButton = document.getElementById("stopButtonLeft");
var pauseButton = document.getElementById("pauseButtonLeft");

//add events to those 2 buttons
recordButton.addEventListener("click", startRecordingLeft);
stopButton.addEventListener("click", stopRecordingLeft);
pauseButton.addEventListener("click", pauseRecordingLeft);

function startRecordingLeft() {
    console.log("recordButton clicked");

    /*
		Simple constraints object, for more advanced audio features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/

    var constraints = { audio: true, video: false };

    /*
    	Disable the record button until we get a success or fail from getUserMedia() 
	*/

    recordButton.disabled = true;
    stopButton.disabled = false;
    pauseButton.disabled = false;

    /*
    	We're using the standard promise based getUserMedia()
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
            console.log(
                "getUserMedia() success, stream created, initializing Recorder.js ..."
            );

            /*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device

		*/
            audioContext = new AudioContext();

            //update the format
            document.getElementById("formats").innerHTML =
                "Format: 1 channel pcm @ " + audioContext.sampleRate / 1000 + "kHz";

            /*  assign to gumStream for later use  */
            gumStream = stream;

            /* use the stream */
            input = audioContext.createMediaStreamSource(stream);

            /*
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
		*/
            rec = new Recorder(input, { numChannels: 1 });

            //start the recording process
            rec.record();

            console.log("Recording started");
        })
        .catch(function(err) {
            //enable the record button if getUserMedia() fails
            recordButton.disabled = false;
            stopButton.disabled = true;
            pauseButton.disabled = true;
        });
}

function pauseRecordingLeft() {
    console.log("pauseButton clicked rec.recording=", rec.recording);
    if (rec.recording) {
        //pause
        rec.stop();
        pauseButton.innerHTML = "Resume";
    } else {
        //resume
        rec.record();
        pauseButton.innerHTML = "Pause";
    }
}

function stopRecordingLeft() {
    console.log("stopButton clicked");

    //disable the stop button, enable the record too allow for new recordings
    stopButton.disabled = true;
    recordButton.disabled = false;
    pauseButton.disabled = true;

    //reset button just in case the recording is stopped while paused
    pauseButton.innerHTML = "Pause";

    //tell the recorder to stop the recording
    rec.stop();

    //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLinkLeft);
}

function createDownloadLinkLeft(blob) {
    filenameLeft = "Left" + new Date().toISOString();
    blobLeft = blob;



    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');

    //add controls to the <audio> element
    au.controls = true;
    au.src = url;

    //save to disk link
    link.href = url;
    link.download = filenameLeft + ".wav"; //download forces the browser to donwload the file using the  filename
    link.innerHTML = "Save to disk";

    //add the new audio element to li
    li.appendChild(au);

    //add the filename to the li
    li.appendChild(document.createTextNode(filenameLeft + ".wav "))

    //add the save to disk link to li
    li.appendChild(link);

    //add the li element to the ol
    recordingsListLeft.appendChild(li);
}

var loadWikiArticle = function(e) {
    var xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        "https://en.wikipedia.org/api/rest_v1/page/random/summary",
        true
    );
    xhr.onloadend = function(e) {
        var res = JSON.parse(e.target.responseText);
        document.getElementById("readingText").innerText = res["extract"];
    };
    xhr.send();
};

var recordButtonRight = document.getElementById("recordButtonRight");
var stopButtonRight = document.getElementById("stopButtonRight");
var pauseButtonRight = document.getElementById("pauseButtonRight");

//add events to those 2 buttons
recordButtonRight.addEventListener("click", startRecordingRight);
stopButtonRight.addEventListener("click", stopRecordingRight);
pauseButtonRight.addEventListener("click", pauseRecordingRight);

function startRecordingRight() {
    console.log("recordButton clicked");

    /*
		Simple constraints object, for more advanced audio features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/

    var constraints = { audio: true, video: false };

    /*
    	Disable the record button until we get a success or fail from getUserMedia() 
	*/

    recordButtonRight.disabled = true;
    stopButtonRight.disabled = false;
    pauseButtonRight.disabled = false;

    /*
    	We're using the standard promise based getUserMedia()
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
            console.log(
                "getUserMedia() success, stream created, initializing Recorder.js ..."
            );

            /*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device

		*/
            audioContext = new AudioContext();

            //update the format
            document.getElementById("formats").innerHTML =
                "Format: 1 channel pcm @ " + audioContext.sampleRate / 1000 + "kHz";

            /*  assign to gumStream for later use  */
            gumStream = stream;

            /* use the stream */
            input = audioContext.createMediaStreamSource(stream);

            /*
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
		*/
            rec = new Recorder(input, { numChannels: 1 });

            //start the recording process
            rec.record();

            console.log("Recording started");
        })
        .catch(function(err) {
            //enable the record button if getUserMedia() fails
            recordButtonRight.disabled = false;
            stopButtonRight.disabled = true;
            pauseButtonRight.disabled = true;
        });
}

function pauseRecordingRight() {
    console.log("pauseButton clicked rec.recording=", rec.recording);
    if (rec.recording) {
        //pause
        rec.stop();
        pauseButtonRight.innerHTML = "Resume";
    } else {
        //resume
        rec.record();
        pauseButtonRight.innerHTML = "Pause";
    }
}

function stopRecordingRight() {
    console.log("stopButton clicked");

    //disable the stop button, enable the record too allow for new recordings
    stopButtonRight.disabled = true;
    recordButtonRight.disabled = false;
    pauseButtonRight.disabled = true;

    //reset button just in case the recording is stopped while paused
    pauseButtonRight.innerHTML = "Pause";

    //tell the recorder to stop the recording
    rec.stop();

    //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLinkRight);
}

function createDownloadLinkRight(blob) {
    filenameRight = "Right" + new Date().toISOString();
    blobRight = blob;


    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');

    //add controls to the <audio> element
    au.controls = true;
    au.src = url;

    //save to disk link
    link.href = url;
    link.download = filenameRight + ".wav"; //download forces the browser to donwload the file using the  filename
    link.innerHTML = "Save to disk";

    //add the new audio element to li
    li.appendChild(au);

    //add the filename to the li
    li.appendChild(document.createTextNode(filenameRight + ".wav "))

    //add the save to disk link to li
    li.appendChild(link);

    //add the li element to the ol
    recordingsListRight.appendChild(li);
}

var submit = document.getElementById("submitButton");
submit.addEventListener("click", function(event) {
    document.getElementById("result").innerText = "Comparing...";
    var xhr = new XMLHttpRequest();
    xhr.onload = function(e) {
        if (this.readyState === 4) {
            console.log("Server returned: ", e.target.responseText);
            var response = e.target.responseText;
            document.getElementById("result").innerText =
                "SCORE :: " + response + " / 1";
            /* if (action === 'register') {
					document.getElementById("result").innerText = 'Hey ' + username + ', You have been registered!';
				} else {
					if (response === 'SUCCESS') {
					document.getElementById("result").innerText = 'Hey ' + username + ', Welcome, it is you!';
				} else {
					document.getElementById("result").innerText = 'The system does not think you are who you say you are!';
				}
				} */
        }
    };
    var fd = new FormData();
    let timestamp = Date.now().toString();
    fd.append("fileLeft", blobLeft, filenameLeft);
    fd.append("fileRight", blobRight, filenameRight);
    fd.append("register", timestamp);
    xhr.open("POST", "/register/" + timestamp, true);
    console.log(fd);
    window.submittedFd = fd;
    xhr.send(fd);
});

var textarea = document.querySelector("textarea");
let inputLeft = document.getElementById("fileLeft");
inputLeft.addEventListener("change", () => {
    let file = inputLeft.files[0];
    let reader = new FileReader();

    reader.onload = function() {
        console.log(reader.result);
        var blob = dataURItoBlob(reader.result);
        blobLeft = blob;
    };
    reader.readAsDataURL(file);

    /* reader.addEventListener('load', readFile);
      reader.readAsText(file); */
    filenameLeft = "Left" + new Date().toISOString();
});

let inputRight = document.getElementById("fileRigth");
inputRight.addEventListener("change", () => {
    let file = inputRight.files[0];
    let reader = new FileReader();

    reader.onload = function() {
        console.log(reader.result);
        var blob = dataURItoBlob(reader.result);
        blobRight = blob;
    };
    reader.readAsDataURL(file);
    //   reader.addEventListener("load", readFile);
    //   reader.readAsText(file);
    // blobRight = reader;
    filenameRight = "Left" + new Date().toISOString();
});

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], { type: mimeString });
    return blob;

}

// function readFile(event) {
//     textarea.textContent = event.target.result;
// }

document
    .getElementsByName("mode")[0]
    .addEventListener("change", function(event) {
        document.getElementById("fileUpload").hidden = true;
        document.getElementById("voiceRecord").hidden = false;
        document.getElementById("bothRecordUpload").hidden = true;
    });
document
    .getElementsByName("mode")[1]
    .addEventListener("change", function(event) {
        document.getElementById("fileUpload").hidden = false;
        document.getElementById("voiceRecord").hidden = true;
        document.getElementById("bothRecordUpload").hidden = true;
    });


document
    .getElementsByName("mode")[2]
    .addEventListener("change", function(event) {
        document.getElementById("fileUpload").hidden = true;
        document.getElementById("voiceRecord").hidden = true;
        document.getElementById("bothRecordUpload").hidden = false;
    });




// Both

var recordButtonBoth = document.getElementById("recordButtonBoth");
var stopButtonBoth = document.getElementById("stopButtonBoth");
var pauseButtonBoth = document.getElementById("pauseButtonBoth");

//add events to those 2 buttons
recordButtonBoth.addEventListener("click", startRecordingBoth);
stopButtonBoth.addEventListener("click", stopRecordingBoth);
pauseButtonBoth.addEventListener("click", pauseRecordingBoth);

function startRecordingBoth() {
    console.log("recordButton clicked");

    /*
		Simple constraints object, for more advanced audio features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/

    var constraints = { audio: true, video: false };

    /*
    	Disable the record button until we get a success or fail from getUserMedia() 
	*/

    recordButtonBoth.disabled = true;
    stopButtonBoth.disabled = false;
    pauseButtonBoth.disabled = false;

    /*
    	We're using the standard promise based getUserMedia()
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
            console.log(
                "getUserMedia() success, stream created, initializing Recorder.js ..."
            );

            /*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device

		*/
            audioContext = new AudioContext();

            //update the format
            document.getElementById("formats").innerHTML =
                "Format: 1 channel pcm @ " + audioContext.sampleRate / 1000 + "kHz";

            /*  assign to gumStream for later use  */
            gumStream = stream;

            /* use the stream */
            input = audioContext.createMediaStreamSource(stream);

            /*
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
		*/
            rec = new Recorder(input, { numChannels: 1 });

            //start the recording process
            rec.record();

            console.log("Recording started");
        })
        .catch(function(err) {
            //enable the record button if getUserMedia() fails
            recordButtonBoth.disabled = false;
            stopButtonBoth.disabled = true;
            pauseButtonBoth.disabled = true;
        });
}

function pauseRecordingBoth() {
    console.log("pauseButton clicked rec.recording=", rec.recording);
    if (rec.recording) {
        //pause
        rec.stop();
        pauseButtonBoth.innerHTML = "Resume";
    } else {
        //resume
        rec.record();
        pauseButtonBoth.innerHTML = "Pause";
    }
}

function stopRecordingBoth() {
    console.log("stopButton clicked");

    //disable the stop button, enable the record too allow for new recordings
    stopButtonBoth.disabled = true;
    recordButtonBoth.disabled = false;
    pauseButtonBoth.disabled = true;

    //reset button just in case the recording is stopped while paused
    pauseButtonBoth.innerHTML = "Pause";

    //tell the recorder to stop the recording
    rec.stop();

    //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLinkBoth);
}

function createDownloadLinkBoth(blob) {
    filenameBoth = "Both" + new Date().toISOString();
    blobRight = blob;


    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');

    //add controls to the <audio> element
    au.controls = true;
    au.src = url;

    //save to disk link
    link.href = url;
    link.download = filenameBoth + ".wav"; //download forces the browser to donwload the file using the  filename
    link.innerHTML = "Save to disk";

    //add the new audio element to li
    li.appendChild(au);

    //add the filename to the li
    li.appendChild(document.createTextNode(filenameBoth + ".wav "))

    //add the save to disk link to li
    li.appendChild(link);

    //add the li element to the ol
    recordingsListBoth.appendChild(li);
}


let inputBoth = document.getElementById("fileBoth");
inputBoth.addEventListener("change", () => {
    let file = inputBoth.files[0];
    let reader = new FileReader();

    reader.onload = function() {
        console.log(reader.result);
        var blob = dataURItoBlob(reader.result);
        blobLeft = blob;
    };
    reader.readAsDataURL(file);

    /* reader.addEventListener('load', readFile);
      reader.readAsText(file); */
    filenameLeft = "Left" + new Date().toISOString();
});