"use strict";
if (u2f === undefined) {
    var u2f = u2f || {};
    var js_api_version;
    u2f.EXTENSION_ID = "kmendfapggjehodndflmmgagdbamhnfd";
    u2f.MessageTypes = {
        "U2F_REGISTER_REQUEST": "u2f_register_request",
        "U2F_REGISTER_RESPONSE": "u2f_register_response",
        "U2F_SIGN_REQUEST": "u2f_sign_request",
        "U2F_SIGN_RESPONSE": "u2f_sign_response",
        "U2F_GET_API_VERSION_REQUEST": "u2f_get_api_version_request",
        "U2F_GET_API_VERSION_RESPONSE": "u2f_get_api_version_response"
    };
    u2f.ErrorCodes = {
        "OK": 0,
        "OTHER_ERROR": 1,
        "BAD_REQUEST": 2,
        "CONFIGURATION_UNSUPPORTED": 3,
        "DEVICE_INELIGIBLE": 4,
        "TIMEOUT": 5
    };
    u2f.U2fRequest;
    u2f.U2fResponse;
    u2f.Error;
    u2f.Transport;
    u2f.Transports;
    u2f.SignRequest;
    u2f.SignResponse;
    u2f.RegisterRequest;
    u2f.RegisterResponse;
    u2f.RegisteredKey;
    u2f.GetJsApiVersionResponse;
    u2f.getMessagePort = function(callback) {
        if (typeof chrome != "undefined" && chrome.runtime) {
            var msg = {
                type: u2f.MessageTypes.U2F_SIGN_REQUEST,
                signRequests: []
            };
            chrome.runtime.sendMessage(u2f.EXTENSION_ID, msg, function() {
                if (!chrome.runtime.lastError) {
                    u2f.getChromeRuntimePort_(callback);
                } else {
                    u2f.getIframePort_(callback);
                }
            });
        } else {
            if (u2f.isAndroidChrome_()) {
                u2f.getAuthenticatorPort_(callback);
            } else {
                if (u2f.isIosChrome_()) {
                    u2f.getIosPort_(callback);
                } else {
                    u2f.getIframePort_(callback);
                }
            }
        }
    };
    u2f.isAndroidChrome_ = function() {
        var userAgent = navigator.userAgent;
        return userAgent.indexOf("Chrome") != -1 && userAgent.indexOf("Android") != -1;
    };
    u2f.isIosChrome_ = function() {
        return ["iPhone", "iPad", "iPod"].indexOf(navigator.platform) > -1;
    };
    u2f.getChromeRuntimePort_ = function(callback) {
        var port = chrome.runtime.connect(u2f.EXTENSION_ID, {
            "includeTlsChannelId": true
        });
        setTimeout(function() {
            callback(new u2f.WrappedChromeRuntimePort_(port));
        }, 0);
    };
    u2f.getAuthenticatorPort_ = function(callback) {
        setTimeout(function() {
            callback(new u2f.WrappedAuthenticatorPort_());
        }, 0);
    };
    u2f.getIosPort_ = function(callback) {
        setTimeout(function() {
            callback(new u2f.WrappedIosPort_());
        }, 0);
    };
    u2f.WrappedChromeRuntimePort_ = function(port) {
        this.port_ = port;
    };
    u2f.formatSignRequest_ = function(appId, challenge, registeredKeys, timeoutSeconds, reqId) {
        if (js_api_version === undefined || js_api_version < 1.1) {
            var signRequests = [];
            for (var i = 0; i < registeredKeys.length; i++) {
                signRequests[i] = {
                    version: registeredKeys[i].version,
                    challenge: challenge,
                    keyHandle: registeredKeys[i].keyHandle,
                    appId: appId
                };
            }
            return {
                type: u2f.MessageTypes.U2F_SIGN_REQUEST,
                signRequests: signRequests,
                timeoutSeconds: timeoutSeconds,
                requestId: reqId
            };
        }
        return {
            type: u2f.MessageTypes.U2F_SIGN_REQUEST,
            appId: appId,
            challenge: challenge,
            registeredKeys: registeredKeys,
            timeoutSeconds: timeoutSeconds,
            requestId: reqId
        };
    };
    u2f.formatRegisterRequest_ = function(appId, registeredKeys, registerRequests, timeoutSeconds, reqId) {
        if (js_api_version === undefined || js_api_version < 1.1) {
            for (var i = 0; i < registerRequests.length; i++) {
                registerRequests[i].appId = appId;
            }
            var signRequests = [];
            for (var i = 0; i < registeredKeys.length; i++) {
                signRequests[i] = {
                    version: registeredKeys[i].version,
                    challenge: registerRequests[0],
                    keyHandle: registeredKeys[i].keyHandle,
                    appId: appId
                };
            }
            return {
                type: u2f.MessageTypes.U2F_REGISTER_REQUEST,
                signRequests: signRequests,
                registerRequests: registerRequests,
                timeoutSeconds: timeoutSeconds,
                requestId: reqId
            };
        }
        return {
            type: u2f.MessageTypes.U2F_REGISTER_REQUEST,
            appId: appId,
            registerRequests: registerRequests,
            registeredKeys: registeredKeys,
            timeoutSeconds: timeoutSeconds,
            requestId: reqId
        };
    };
    u2f.WrappedChromeRuntimePort_.prototype.postMessage = function(message) {
        this.port_.postMessage(message);
    };
    u2f.WrappedChromeRuntimePort_.prototype.addEventListener = function(eventName, handler) {
        var name = eventName.toLowerCase();
        if (name == "message" || name == "onmessage") {
            this.port_.onMessage.addListener(function(message) {
                handler({
                    "data": message
                });
            });
        } else {
            console.error("WrappedChromeRuntimePort only supports onMessage");
        }
    };
    u2f.WrappedAuthenticatorPort_ = function() {
        this.requestId_ = -1;
        this.requestObject_ = null;
    };
    u2f.WrappedAuthenticatorPort_.prototype.postMessage = function(message) {
        var intentUrl = u2f.WrappedAuthenticatorPort_.INTENT_URL_BASE_ + ";S.request=" + encodeURIComponent(JSON.stringify(message)) + ";end";
        document.location = intentUrl;
    };
    u2f.WrappedAuthenticatorPort_.prototype.getPortType = function() {
        return "WrappedAuthenticatorPort_";
    };
    u2f.WrappedAuthenticatorPort_.prototype.addEventListener = function(eventName, handler) {
        var name = eventName.toLowerCase();
        if (name == "message") {
            var self = this;
            window.addEventListener("message", self.onRequestUpdate_.bind(self, handler), false);
        } else {
            console.error("WrappedAuthenticatorPort only supports message");
        }
    };
    u2f.WrappedAuthenticatorPort_.prototype.onRequestUpdate_ = function(callback, message) {
        var messageObject = JSON.parse(message.data);
        var intentUrl = messageObject["intentURL"];
        var errorCode = messageObject["errorCode"];
        var responseObject = null;
        if (messageObject.hasOwnProperty("data")) {
            responseObject = (JSON.parse(messageObject["data"]));
        }
        callback({
            "data": responseObject
        });
    };
    u2f.WrappedAuthenticatorPort_.INTENT_URL_BASE_ = "intent:#Intent;action=com.google.android.apps.authenticator.AUTHENTICATE";
    u2f.WrappedIosPort_ = function() {};
    u2f.WrappedIosPort_.prototype.postMessage = function(message) {
        var str = JSON.stringify(message);
        var url = "u2f://auth?" + encodeURI(str);
        location.replace(url);
    };
    u2f.WrappedIosPort_.prototype.getPortType = function() {
        return "WrappedIosPort_";
    };
    u2f.WrappedIosPort_.prototype.addEventListener = function(eventName, handler) {
        var name = eventName.toLowerCase();
        if (name !== "message") {
            console.error("WrappedIosPort only supports message");
        }
    };
    u2f.getIframePort_ = function(callback) {
        var iframeOrigin = "chrome-extension://" + u2f.EXTENSION_ID;
        var iframe = document.createElement("iframe");
        iframe.src = iframeOrigin + "/u2f-comms.html";
        iframe.setAttribute("style", "display:none");
        document.body.appendChild(iframe);
        var channel = new MessageChannel();
        var ready = function(message) {
            if (message.data == "ready") {
                channel.port1.removeEventListener("message", ready);
                callback(channel.port1);
            } else {
                console.error('First event on iframe port was not "ready"');
            }
        };
        channel.port1.addEventListener("message", ready);
        channel.port1.start();
        iframe.addEventListener("load", function() {
            iframe.contentWindow.postMessage("init", iframeOrigin, [channel.port2]);
        });
    };
    u2f.EXTENSION_TIMEOUT_SEC = 30;
    u2f.port_ = null;
    u2f.waitingForPort_ = [];
    u2f.reqCounter_ = 0;
    u2f.callbackMap_ = {};
    u2f.getPortSingleton_ = function(callback) {
        if (u2f.port_) {
            callback(u2f.port_);
        } else {
            if (u2f.waitingForPort_.length == 0) {
                u2f.getMessagePort(function(port) {
                    u2f.port_ = port;
                    u2f.port_.addEventListener("message", (u2f.responseHandler_));
                    while (u2f.waitingForPort_.length) {
                        u2f.waitingForPort_.shift()(u2f.port_);
                    }
                });
            }
            u2f.waitingForPort_.push(callback);
        }
    };
    u2f.responseHandler_ = function(message) {
        var response = message.data;
        var reqId = response["requestId"];
        if (!reqId || !u2f.callbackMap_[reqId]) {
            console.error("Unknown or missing requestId in response.");
            return;
        }
        var cb = u2f.callbackMap_[reqId];
        delete u2f.callbackMap_[reqId];
        cb(response["responseData"]);
    };
    u2f.sign = function(appId, challenge, registeredKeys, callback, opt_timeoutSeconds) {
        if (js_api_version === undefined) {
            u2f.getApiVersion(function(response) {
                js_api_version = response["js_api_version"] === undefined ? 0 : response["js_api_version"];
                console.log("Extension JS API Version: ", js_api_version);
                u2f.sendSignRequest(appId, challenge, registeredKeys, callback, opt_timeoutSeconds);
            });
        } else {
            u2f.sendSignRequest(appId, challenge, registeredKeys, callback, opt_timeoutSeconds);
        }
    };
    u2f.sendSignRequest = function(appId, challenge, registeredKeys, callback, opt_timeoutSeconds) {
        u2f.getPortSingleton_(function(port) {
            var reqId = ++u2f.reqCounter_;
            u2f.callbackMap_[reqId] = callback;
            var timeoutSeconds = (typeof opt_timeoutSeconds !== "undefined" ? opt_timeoutSeconds : u2f.EXTENSION_TIMEOUT_SEC);
            var req = u2f.formatSignRequest_(appId, challenge, registeredKeys, timeoutSeconds, reqId);
            port.postMessage(req);
        });
    };
    u2f.register = function(appId, registerRequests, registeredKeys, callback, opt_timeoutSeconds) {
        if (js_api_version === undefined) {
            u2f.getApiVersion(function(response) {
                js_api_version = response["js_api_version"] === undefined ? 0 : response["js_api_version"];
                console.log("Extension JS API Version: ", js_api_version);
                u2f.sendRegisterRequest(appId, registerRequests, registeredKeys, callback, opt_timeoutSeconds);
            });
        } else {
            u2f.sendRegisterRequest(appId, registerRequests, registeredKeys, callback, opt_timeoutSeconds);
        }
    };
    u2f.sendRegisterRequest = function(appId, registerRequests, registeredKeys, callback, opt_timeoutSeconds) {
        u2f.getPortSingleton_(function(port) {
            var reqId = ++u2f.reqCounter_;
            u2f.callbackMap_[reqId] = callback;
            var timeoutSeconds = (typeof opt_timeoutSeconds !== "undefined" ? opt_timeoutSeconds : u2f.EXTENSION_TIMEOUT_SEC);
            var req = u2f.formatRegisterRequest_(appId, registeredKeys, registerRequests, timeoutSeconds, reqId);
            port.postMessage(req);
        });
    };
    u2f.getApiVersion = function(callback, opt_timeoutSeconds) {
        u2f.getPortSingleton_(function(port) {
            if (port.getPortType) {
                var apiVersion;
                switch (port.getPortType()) {
                    case "WrappedIosPort_":
                    case "WrappedAuthenticatorPort_":
                        apiVersion = 1.1;
                        break;
                    default:
                        apiVersion = 0;
                        break;
                }
                callback({
                    "js_api_version": apiVersion
                });
                return;
            }
            var reqId = ++u2f.reqCounter_;
            u2f.callbackMap_[reqId] = callback;
            var req = {
                type: u2f.MessageTypes.U2F_GET_API_VERSION_REQUEST,
                timeoutSeconds: (typeof opt_timeoutSeconds !== "undefined" ? opt_timeoutSeconds : u2f.EXTENSION_TIMEOUT_SEC),
                requestId: reqId
            };
            port.postMessage(req);
        });
    };
}