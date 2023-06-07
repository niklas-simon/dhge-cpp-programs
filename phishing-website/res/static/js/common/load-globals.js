(function(window) {
    var data = loadInlineJSON("global-context");
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            window[key] = data[key];
        }
    }
})(window);