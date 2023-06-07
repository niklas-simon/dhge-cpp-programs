function reportMetric(name, value, context, path) {
    var data = "name=" + name + "&value=" + value + "&operation=" + context;
    reportMetrics(path, data);
}

function reportMetrics(path, data) {
    $.ajax({
        type: "POST",
        url: path,
        data: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });
}