const mainDiv = document.getElementById("main");
const uploadStatuses = document.getElementById("uploadstatuses");
const locationDiv = document.getElementById("location");
const notice = document.getElementById("notice");
function buttonSetup(id0) {
    const input = document.getElementById(id0 + "input");
    input.oninput = function(){
        fileUpload(null, input);
    };
    document.getElementById(id0 + "button").addEventListener("click", function(){
        input.click();
    });
}
buttonSetup("takephoto");
buttonSetup("recordvideo");
buttonSetup("choosephoto");
buttonSetup("choosevideo");
document.getElementById("buttons").style.opacity = "1";
notice.innerText = "file upload will be started directly as soon as file will be chosen";
var latitude;
var longitude;
var altitude;
var accuracy;
var altitudeAccuracy;
const locationTop = document.createElement("div");
locationTop.id = "locationtop";
locationDiv.appendChild(locationTop);
const locationImage = document.createElement("img");
locationImage.src = "images/location.svg";
locationImage.width = "32";
locationImage.height = "32";
locationTop.appendChild(locationImage);
const locationTitle = document.createElement("span");
locationTitle.innerText = "current location";
locationTitle.style.fontSize = "20px";
locationTop.appendChild(locationTitle);
const locationData = document.createElement("div");
locationDiv.appendChild(locationData);
function addLocationElements(text)  {
    var div = document.createElement("div");
    div.className = "locationDivs";
    locationData.appendChild(div);
    var title = document.createElement("span");
    title.className = "locationTitles";
    title.innerText = text + ": ";
    div.appendChild(title);
    var data = document.createElement("span");
    div.appendChild(data);
    return data;
}
function showLocation(element, data)    {
    if(data == null)    {
        data = "no data";
        element.style.backgroundColor = "#ff000080";
    }
    else    {
        element.style.backgroundColor = "";
    }
    element.innerText = data;
}
const latitudeLongitudeData = addLocationElements("latitude, longitude");
const altitudeData = addLocationElements("altitude");
const accuracyData = addLocationElements("accuracy");
const altitudeAccuracyData = addLocationElements("altitude accuracy");
locationDiv.style.display = "block";
notice.innerHTML += "<br><br>if location coordinates detected,<br>it will be attached automatically as soon as file will be uploaded";
function getLocation()  {
    if(navigator.geolocation)    {
        navigator.geolocation.watchPosition(afterLocation, locationError);
    }
    else    {
        locationData.innerText = "Geolocation not supported by this browser.";
        locationDiv.style.backgroundColor = "#ff000080";
    }
}
function afterLocation(position)  {
    if(locationDiv.contains(locationErrorDiv))    {
        locationDiv.removeChild(locationErrorDiv);
    }
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    altitude = position.coords.altitude;
    accuracy = position.coords.accuracy;
    altitudeAccuracy = position.coords.altitudeAccuracy;
    showLocation(latitudeLongitudeData, latitude + ", " + longitude);
    showLocation(altitudeData, altitude);
    showLocation(accuracyData, accuracy);
    showLocation(altitudeAccuracyData, altitudeAccuracy);
}
const locationErrorDiv = document.createElement("div");
locationErrorDiv.style.border = "2px solid #ff0000";
function locationError(error)    {
    locationDiv.appendChild(locationErrorDiv);
    switch(error.code)   {
        case error.PERMISSION_DENIED:
            locationErrorDiv.innerText = "permission denied. to detect location,";
            locationErrorDiv.appendChild(document.createElement("br"));
            var button = document.createElement("button");
            button.innerText = "allow permission";
            button.addEventListener("click", function(){
                getLocation();
            });
            locationErrorDiv.appendChild(button);
            break;
        case error.POSITION_UNAVAILABLE:
            locationErrorDiv.innerText = "location unavailable";
            break;
        case error.TIMEOUT:
            locationErrorDiv.innerText = "request timed out";
            break;
        case error.UNKNOWN_ERROR:
            locationErrorDiv.innerText = "unknown error";
            break;
    }
}
getLocation();
function uploadString(n, key, post, location, value) {
    var ajax = new XMLHttpRequest();
    var text;
    if(location == true)    {
        text = "location";
    }
    else    {
        text = "description";
    }
    text += " upload";
    const element = document.getElementById('q'+n);
    var div = document.createElement("div");
    div.className = "statusText";
    div.innerText = text + "ing...";
    var color = "#ffff00";
    div.style.borderColor = color;
    var div2 = document.createElement("div");
    div2.innerText = value;
    var borderStyle = "1px dotted";
    div2.style.border = borderStyle;
    div2.borderColor = color;
    div.appendChild(div2);
    element.prepend(div);
    ajax.onload = function(){
        div = document.createElement("div");
        div.className = "statusText";
        if(this.responseText === "1")    {
            div.innerText = text + "ed";
            color = "#00ff00";
        }
        else    {
            div.innerText = text + " failed";
            color = "#ff0000";
            if(!location)    {
                document.getElementById("b"+n).disabled = 0;
            }
            var div2 = document.createElement("div");
            div2.innerText = this.responseText;
            div2.style.border = borderStyle;
            div2.style.borderColor = color;
            div.appendChild(div2);
        }
        div.style.borderColor = color;
        element.prepend(div);
    };
    ajax.onerror = function(){
        div = document.createElement("div");
        div.className = "statusText";
        div.innerText = text + " error";
        color = "#ff0000";
        div.style.borderColor = color;
        if(!location)    {
            document.getElementById("b"+n).disabled = 0;
        }
        div2 = document.createElement("div");
        div2.innerText = this.Error;
        div2.style.border = borderStyle;
        div2.style.borderColor = color;
        div.appendChild(div2);
        element.prepend(div);
    };
    ajax.open("POST", "php/uploadstring.php");
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.send("n="+n+"&key="+key+post);
}
function uploadLocation(n, key)   {
    uploadString(n, key, "&latitude="+latitude+"&longitude="+longitude+"&altitude="+altitude+"&accuracy="+accuracy+"&altitudeaccuracy="+altitudeAccuracy, true, latitude + ", " + longitude + "; " + altitude + "; " + accuracy + "; " + altitudeAccuracy);
}
function uploadDescription(n, key)    {
    var descriptionValue = document.getElementById(n).value;
    uploadString(n, key, "&description="+descriptionValue, false, descriptionValue);
}
function uploadVoice(n, key)  {
    const statusElement = document.getElementById('q'+n);
    const voiceinput = document.getElementById('v'+n);
    var div = document.createElement("div");
    div.className = "statusText";
    div.innerText = "voice uploading...";
    div.style.borderColor = "#ffff00";
    statusElement.prepend(div);
    var formData = new FormData();
    formData.append("voice", voiceinput.files[0]);
    formData.append("n", n);
    formData.append("key", key);
    fetch("php/uploadvoice.php", {method: "POST", body: formData})
    .then(Response => Response.text())
    .then(Response => {
        div = document.createElement("div");
        div.className = "statusText";
        if(Response === "1")    {
            div.innerText = "voice uploaded";
            div.style.borderColor = "#00ff00";
        }
        else    {
            div.innerText = "voice upload failed\n(" + Response + ")";
            div.style.borderColor = "#ff0000";
        }
        statusElement.prepend(div);
    })
    .catch(Error => {
        div = document.createElement("div");
        div.className = "statusText";
        div.innerText = "voice upload error\n(" + Error + ")";
        div.style.borderColor = "#ff0000";
        statusElement.prepend(div);
    });
}
var timeout1;
var timeout2;
function bottomProgressVisible(visible)    {
    if(visible)    {
        if(timeout1 != undefined)    {
            clearTimeout(timeout1);
        }
        if(timeout2 != undefined)    {
            clearTimeout(timeout2);
        }
        uploadStatusBottom.style.display = "flex";
        uploadStatusBottom.style.animation = "showbottom 0.5s forwards";
    }
    else    {
        timeout1 = setTimeout(function(){
            uploadStatusBottom.style.animation = "hidebottom 0.5s forwards";
            timeout2 = setTimeout(function(){uploadStatusBottom.style.display = "none";}, 500);
        }, 3000);
    }
}
function flexCenter(element) {
    element.style.display = "flex";
    element.style.alignItems = "center";
    element.style.flexDirection = "column";
}
const uploadStatusBottom = document.getElementById("uploadstatusbottom");
const bottomProgressBar = document.createElement("div");
uploadStatusBottom.appendChild(bottomProgressBar);
var uploadstatusesdisplayed = 0;
const maxFileSize = 25000000;
const allowedFileExtensions = ["bmp", "gif", "x-icon", "jpeg", "png", "tiff", "webp", "x-msvideo", "mpeg", "ogg", "mp2t", "webm", "3gpp", "3gpp2", "mp4"];
function fileUpload(file, fileInput){
    if(file === null)  {
        file = fileInput.files[0];
    }
    if(file.size > maxFileSize)    {
        alert("maximum file size is " + (maxFileSize / 1000000) + "MB.");
        return;
    }
    var fileTypeArray = file.type.split('/');
    var fileType = fileTypeArray[0];
    var fileExtension = fileTypeArray[1];
    if(fileType != "image" && fileType != "video")    {
        alert("only images and videos are allowed.");
        return;
    }
    if(!allowedFileExtensions.includes(fileExtension))    {
        alert("allowed file extensions are: ." + allowedFileExtensions.join(", .") + ".");
        return;
    }
    unloadWarning = 1;
    const subbox = document.createElement("div");
    flexCenter(subbox);
    subbox.className = "boxs";
    uploadStatuses.prepend(subbox);
    const status = document.createElement("div");
    status.className = "uploadstatuses2 boxs";
    const after = document.createElement("div");
    after.classList.add("uploadstatuses2", "boxs");
    const statusDiv = document.createElement("div");
    subbox.appendChild(after);
    status.appendChild(statusDiv);
    subbox.appendChild(status);
    var statusText = document.createElement("div");
    statusText.innerText = "uploading...";
    statusDiv.appendChild(statusText);
    const progress = document.createElement("div");
    statusDiv.appendChild(progress);
    const progressBar0 = document.createElement("div");
    progressBar0.className = "progressbar0";
    statusDiv.appendChild(progressBar0);
    const progressBar = document.createElement("div");
    progressBar.className = "progressbar";
    progressBar0.appendChild(progressBar);
    var color = "#ffff00";
    statusDiv.className = "statusText";
    statusDiv.style.borderColor = color;
    if(!uploadstatusesdisplayed) {
        flexCenter(uploadStatuses);
        uploadstatusesdisplayed = 1;
    }
    statusText = document.createElement("div");
    bottomProgressBar.style.backgroundColor = color;
    bottomProgressBar.style.width = "0%";
    bottomProgressVisible(1);
    var formData = new FormData();
    formData.append("photovideo", file);
    var ajax = new XMLHttpRequest();
    ajax.onload = function(){
        if(this.responseText.includes('|'))    {
            var responseArray = this.responseText.split('|');
            var n = responseArray[0];
            var key = responseArray[1];
            var html = "#" + n + "<br>";
            html += "<button onclick=window.open(\"php/view.php?n=" + n + "\") class=\"texts buttons afteruploadbuttons\"><img width=\"32\" height=\"32\" src=\"images/viewicon.svg\">&nbsp;view upload</button>";
            html += "<br><br><div class=\"descriptioninput\"><textarea id=\""+n+"\" class=\"texts\" rows=\"2\" cols=\"10\" placeholder=\"write description...\"></textarea></div>";
            html += "<br><button id=\"b"+n+"\" class=\"texts buttons afteruploadbuttons\" disabled><img width=\"32\" height=\"32\" src=\"images/description.svg\">&nbsp;upload description</button>";
            html += "<br><br><input type=\"file\" accept=\"audio/*\" id=\"v"+n+"\" oninput=uploadVoice(\""+n+"\",\""+key+"\") hidden><button class=\"texts buttons afteruploadbuttons\" onclick=document.getElementById(\"v"+n+"\").click()><img width=\"32\" height=\"32\" src=\"images/microphone.svg\">&nbsp;upload voice</button>";
            html += "<br><br><div id=\"q"+n+"\" class=\"uploadstatuses2 boxs\"></div>";
            after.innerHTML = html;
            var button = document.getElementById("b"+n);
            button.addEventListener("click", function(){
                button.disabled = 1;
                uploadDescription(n,key);
            });
            var textarea = document.getElementById(n);
            textarea.addEventListener("input", function(){
                button.disabled = textarea.value == '';
            });
            statusText.innerText += "upload completed\n(#" + n + ")";
            color = "#00ff00";
            bottomProgressVisible(0);
            if(latitude != null && longitude != null)    {
                uploadLocation(n, key);
            }
            setDarkMode(darkModeEnabled);
        }
        else    {
            statusText.innerText += "upload failed\n(" + this.responseText + ")";
            color = "#ff0000";
            bottomProgressVisible(0);
        }
        if(fileInput !== undefined)fileInput.value = null;
        statusText.className = "statusText";
        statusText.style.borderColor = color;
        bottomProgressBar.style.backgroundColor = color;
        status.prepend(statusText);
    };
    ajax.onerror = function(){
        statusText.innerText += "upload error\n(" + this.Error + ")";
        statusText.className = "statusText";
        color = "#ff0000";
        statusText.style.borderColor = color;
        bottomProgressBar.style.backgroundColor = color;
        bottomProgressVisible(0);
        status.prepend(statusText);
    };
    var progressPercent;
    ajax.upload.onprogress = function(e){
        progressPercent = ((e.loaded / e.total) * 100).toFixed(2) + '%';
        progress.innerText = progressPercent + " (" + e.loaded + " / " + e.total + ")";
        progressBar.style.width = progressPercent;
        bottomProgressBar.style.width = progressPercent;
    };
    ajax.open("POST", "php/uploadphotovideo.php");
    ajax.send(formData);
}
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}
var darkModeEnabled;
function setDarkMode(enabled) {
    var color = "#000000";
    var backgroundColor = "#ffffff";
    if(enabled)    {
        var temp = color;
        color = backgroundColor;
        backgroundColor = temp;
    }
    mainDiv.style.backgroundColor = backgroundColor;
    var elements = document.getElementsByClassName("texts");
    for(var i = 0; i < elements.length; i++)   {
        elements[i].style.color = color;
    }
    darkModeEnabled = enabled;
    setCookie("darkmode", darkModeEnabled, 1000);
}
const darkmodediv = document.getElementById("darkmodediv");
darkmodediv.innerHTML = "<div><label class=\"switch\"><input type=\"checkbox\" id=\"darkmode\"><span class=\"slider round\"><img width=\"26\" height=\"26\" src=\"images/darkmode0.png\"></span></label></div><span class=\"texts\">dark mode</span><br>";
darkmodediv.style.display = "block";
const darkmodecheckbox = document.getElementById("darkmode");
function changeDarkMode()   {
    setDarkMode(!darkModeEnabled);
}
darkmodecheckbox.addEventListener("click", function(){changeDarkMode();});
darkmodediv.addEventListener("click", function(){darkmodecheckbox.checked = !darkmodecheckbox.checked;changeDarkMode();});
function darkmodeifelse(condition)   {
    if(condition)    {
        setDarkMode(true);
    }
    else    {
        setDarkMode(false);
    }
    darkmodecheckbox.checked = darkModeEnabled;
}
function defaultdarkmode()  {
    var matchmedia = window.matchMedia("(prefers-color-scheme: dark)");
    darkmodeifelse(matchmedia.matches);
    matchmedia.onchange = function(e){darkmodeifelse(e.matches)};
}
if(getCookie("darkmode") == "")    {
    defaultdarkmode();
}
else    {
    darkmodeifelse(getCookie("darkmode") == "true");
}
var unloadWarning = 0;
window.addEventListener("beforeunload", function(e){
    if(unloadWarning)    {
        e.preventDefault();
        e.returnValue = '';
    }
});
const dragOverlay = document.getElementById("dragoverlay");
var uploadImageDiv = document.createElement("div");
uploadImageDiv.style.width = "50%";
uploadImageDiv.style.height = "50%";
uploadImageDiv.style.backgroundImage = "url(images/uploadicon.svg)";
uploadImageDiv.style.backgroundRepeat = "no-repeat";
uploadImageDiv.style.backgroundPosition = "center";
uploadImageDiv.style.backgroundSize = "contain";
uploadImageDiv.style.backgroundColor = "#ffffff80";
uploadImageDiv.style.borderRadius = "8px";
dragOverlay.appendChild(uploadImageDiv);
const dragOverlay2 = document.createElement("div");
dragOverlay2.className = "overlay";
dragOverlay.appendChild(dragOverlay2);
dragOverlay2.addEventListener("dragover", function(e){
    e.preventDefault();
});
dragOverlay2.addEventListener("drop", function(e){
    e.preventDefault();
    fileUpload(e.dataTransfer.items[0].getAsFile());
    dragOverlay.style.display = "none";
});
mainDiv.addEventListener("dragenter", function(e){
    if(e.dataTransfer.items[0].kind == "file")    {
        dragOverlay.style.display = "flex";
    }
});
dragOverlay2.addEventListener("dragleave", function(){
    dragOverlay.style.display = "none";
});
const openFullScreenButton = document.createElement("button");
openFullScreenButton.innerText = "open fullscreen";
openFullScreenButton.addEventListener("click", function(){document.documentElement.requestFullscreen();});
mainDiv.appendChild(openFullScreenButton);
const closeFullScreenButton = document.createElement("button");
closeFullScreenButton.innerText = "close fullscreen";
closeFullScreenButton.addEventListener("click", function(){document.exitFullscreen();});
mainDiv.appendChild(closeFullScreenButton);
const bottomSpace = document.createElement("div");
bottomSpace.style.height = "25vh";
mainDiv.appendChild(bottomSpace);