window.onload = function() {
    try {
        var wpt = (window.performance && window.performance.timing) || {};
        currentPath = window.location.pathname;
        $.ajax({
            type: "POST",
            url: "/metrics/pageload",
            data: {
                path: currentPath,
                perf_data: JSON.stringify(wpt)
            }
        });
    } catch (error) {}
};
(function(window) {
    var validUrls = ["/signin", "/updateaccount", "/mfa", "/resetpassword", "/setpassword"];

    function defineSCSM() {
        var SCSM = {
            startTimeMap: new Object(),
            getQueryVariable: function(queryString, variable) {
                if (queryString && variable) {
                    var qs = queryString.split("&");
                    for (var i = 0; i < qs.length; i++) {
                        var param = qs[i].split("=");
                        if (decodeURIComponent(param[0]) === variable) {
                            return decodeURIComponent(param[1]);
                        }
                    }
                    return "";
                } else {
                    return "";
                }
            },
            getActionNameFromXhrSettings: function(settings) {
                if (settings) {
                    var actionName = this.getQueryVariable(settings.data, "action");
                    return actionName;
                } else {
                    return "";
                }
            },
            getUrlFromXhrSettings: function(settings) {
                if (settings != null && settings.url) {
                    return settings.url;
                } else {
                    return "";
                }
            },
            saveAjaxCallStartTime: function(actionName) {
                var currentTime = new Date().getTime();
                this.startTimeMap[actionName] = currentTime;
            },
            beforeAjaxCall: function(event, xhr, settings) {
                if (event == null || xhr == null || settings == null) {
                    return;
                } else {
                    var url = this.getUrlFromXhrSettings(settings);
                    var actionName = this.getActionNameFromXhrSettings(settings);
                    if (validUrls.indexOf(url) >= 0) {
                        SCSM.saveAjaxCallStartTime(actionName);
                    }
                }
            },
            afterAjaxCall: function(event, xhr, settings) {
                if (event == null || xhr == null || settings == null) {
                    return;
                } else {
                    var url = this.getUrlFromXhrSettings(settings);
                    var actionName = this.getActionNameFromXhrSettings(settings);
                    if (validUrls.indexOf(url) >= 0) {
                        var endTime = new Date().getTime();
                        $.ajax({
                            type: "POST",
                            url: "/metrics/ajax",
                            data: {
                                path: url,
                                ajaxAction: actionName,
                                startTime: this.startTimeMap[actionName],
                                endTime: endTime,
                                statusCode: xhr.status
                            }
                        });
                    }
                }
            }
        };
        return SCSM;
    }
    if (typeof(SCSM) === "undefined") {
        window.SCSM = defineSCSM();
    }
})(window);
$(document).ajaxSend(function(event, xhr, settings) {
    try {
        SCSM.beforeAjaxCall(event, xhr, settings);
    } catch (error) {}
});
$(document).ajaxComplete(function(event, xhr, settings) {
    try {
        SCSM.afterAjaxCall(event, xhr, settings);
    } catch (error) {}
});