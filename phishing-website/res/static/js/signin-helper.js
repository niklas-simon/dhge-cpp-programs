function getParameterByName(name) {
    var url = window.location.href;
    var regex = new RegExp("[?&]" + name + "=([^&#]*)"),
        results = regex.exec(url);
    if (!results) {
        return null;
    }
    if (!results[1]) {
        return "";
    }
    return decodeURIComponent(results[1]);
}

function loadInlineJSON(elementId) {
    var element = document.getElementById(elementId);
    var string = element.textContent || element.innerText;
    var data = JSON.parse(string);
    element.innerHTML = "";
    return data;
}

function isIOSWebview() {
    var useragent = navigator.userAgent;
    var iosDevices = ["iPhone", "iPod", "iPad"];
    var isIOSDevice = new RegExp(iosDevices.join("|")).test(useragent);
    var isSafariUseragent = useragent.includes("Safari");
    return isIOSDevice && !isSafariUseragent;
}

function isBrowserWebAuthnCompatible() {
    var isBrowserWebAuthnCompatible = INCOMPATIBLE;
    if (window.PublicKeyCredential && typeof window.PublicKeyCredential === "function" && !isIOSWebview()) {
        isBrowserWebAuthnCompatible = COMPATIBLE;
    }
    return isBrowserWebAuthnCompatible;
}