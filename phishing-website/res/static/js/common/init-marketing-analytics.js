(function() {
    var targetedContentJson = loadInlineJSON("marketingTargetedContent");
    var data = loadInlineJSON("marketingAnalyticsEnvironment");
    var environment = data["environment"];
    try {
        var analyticsConfig = {
            environment: environment,
            customerData: {
                organizationId: "aws-signin"
            }
        };
        var targetServiceAnalyticsClient = new AWSMarketingTargetServiceAnalyticsClient["default"](analyticsConfig);
        window.targetServiceAnalyticsClient = targetServiceAnalyticsClient;
        targetServiceAnalyticsClient.startTracking();
    } catch (e) {}
    try {
        (function() {
            if (typeof window.CustomEvent === "function") {
                return false;
            }

            function CustomEvent(event, params) {
                params = params || {
                    bubbles: false,
                    cancelable: false,
                    detail: null
                };
                var evt = document.createEvent("CustomEvent");
                evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                return evt;
            }
            window.CustomEvent = CustomEvent;
        })();
        var response = {
            "contents": {},
            "errors": []
        };
        if (!(targetedContentJson && typeof targetedContentJson === "object")) {
            throw "Content is malformed";
        }
        response["contents"] = targetedContentJson;
        var eventDetail = {
            detail: response
        };
        var customEvent = new window.CustomEvent("awsm_ts_request_success", eventDetail);
        window.dispatchEvent(customEvent);
    } catch (e) {}
})();