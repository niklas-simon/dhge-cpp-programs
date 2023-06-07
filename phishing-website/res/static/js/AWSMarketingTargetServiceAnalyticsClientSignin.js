! function(t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.AWSMarketingTargetServiceAnalyticsClient = e() : t.AWSMarketingTargetServiceAnalyticsClient = e()
}(this, (function() {
    return function(t) {
        var e = {};

        function n(r) {
            if (e[r]) return e[r].exports;
            var o = e[r] = {
                i: r,
                l: !1,
                exports: {}
            };
            return t[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports
        }
        return n.m = t, n.c = e, n.d = function(t, e, r) {
            n.o(t, e) || Object.defineProperty(t, e, {
                enumerable: !0,
                get: r
            })
        }, n.r = function(t) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
                value: "Module"
            }), Object.defineProperty(t, "__esModule", {
                value: !0
            })
        }, n.t = function(t, e) {
            if (1 & e && (t = n(t)), 8 & e) return t;
            if (4 & e && "object" == typeof t && t && t.__esModule) return t;
            var r = Object.create(null);
            if (n.r(r), Object.defineProperty(r, "default", {
                    enumerable: !0,
                    value: t
                }), 2 & e && "string" != typeof t)
                for (var o in t) n.d(r, o, function(e) {
                    return t[e]
                }.bind(null, o));
            return r
        }, n.n = function(t) {
            var e = t && t.__esModule ? function() {
                return t.default
            } : function() {
                return t
            };
            return n.d(e, "a", e), e
        }, n.o = function(t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }, n.p = "", n(n.s = 84)
    }([function(t, e, n) {
        "use strict";
        var r = n(5),
            o = n(18),
            i = n(12),
            a = n(19),
            u = n(20);
        (t.exports = function(t, e) {
            var n, o, c, s, f;
            return arguments.length < 2 || "string" != typeof t ? (s = e, e = t, t = null) : s = arguments[2], r(t) ? (n = u.call(t, "c"), o = u.call(t, "e"), c = u.call(t, "w")) : (n = c = !0, o = !1), f = {
                value: e,
                configurable: n,
                enumerable: o,
                writable: c
            }, s ? i(a(s), f) : f
        }).gs = function(t, e, n) {
            var c, s, f, l;
            return "string" != typeof t ? (f = n, n = e, e = t, t = null) : f = arguments[3], r(e) ? o(e) ? r(n) ? o(n) || (f = n, n = void 0) : n = void 0 : (f = e, e = n = void 0) : e = void 0, r(t) ? (c = u.call(t, "c"), s = u.call(t, "e")) : (c = !0, s = !1), l = {
                get: e,
                set: n,
                configurable: c,
                enumerable: s
            }, f ? i(a(f), l) : l
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(4);
        t.exports = function(t) {
            if (!r(t)) throw new TypeError("Cannot use null or undefined");
            return t
        }
    }, function(t, e, n) {
        "use strict";
        t.exports = n(53)() ? n(8).Symbol : n(56)
    }, function(t, e, n) {
        "use strict";
        t.exports = function(t) {
            if ("function" != typeof t) throw new TypeError(t + " is not a function");
            return t
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(32)();
        t.exports = function(t) {
            return t !== r && null !== t
        }
    }, function(t, e, n) {
        "use strict";
        t.exports = function(t) {
            return null != t
        }
    }, function(t, e, n) {
        t.exports = function() {
            return n = {}, t.m = e = [function(t, e, n) {
                "use strict";
                var r = n(2),
                    o = n(9),
                    i = Object.prototype.toString;

                function a(t) {
                    return "[object Array]" === i.call(t)
                }

                function u(t) {
                    return null !== t && "object" == typeof t
                }

                function c(t) {
                    return "[object Function]" === i.call(t)
                }

                function s(t, e) {
                    if (null != t)
                        if ("object" != typeof t && (t = [t]), a(t))
                            for (var n = 0, r = t.length; n < r; n++) e.call(null, t[n], n, t);
                        else
                            for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && e.call(null, t[o], o, t)
                }
                t.exports = {
                    isArray: a,
                    isArrayBuffer: function(t) {
                        return "[object ArrayBuffer]" === i.call(t)
                    },
                    isBuffer: o,
                    isFormData: function(t) {
                        return "undefined" != typeof FormData && t instanceof FormData
                    },
                    isArrayBufferView: function(t) {
                        return "undefined" != typeof ArrayBuffer && ArrayBuffer.isView ? ArrayBuffer.isView(t) : t && t.buffer && t.buffer instanceof ArrayBuffer
                    },
                    isString: function(t) {
                        return "string" == typeof t
                    },
                    isNumber: function(t) {
                        return "number" == typeof t
                    },
                    isObject: u,
                    isUndefined: function(t) {
                        return void 0 === t
                    },
                    isDate: function(t) {
                        return "[object Date]" === i.call(t)
                    },
                    isFile: function(t) {
                        return "[object File]" === i.call(t)
                    },
                    isBlob: function(t) {
                        return "[object Blob]" === i.call(t)
                    },
                    isFunction: c,
                    isStream: function(t) {
                        return u(t) && c(t.pipe)
                    },
                    isURLSearchParams: function(t) {
                        return "undefined" != typeof URLSearchParams && t instanceof URLSearchParams
                    },
                    isStandardBrowserEnv: function() {
                        return ("undefined" == typeof navigator || "ReactNative" !== navigator.product) && "undefined" != typeof window && "undefined" != typeof document
                    },
                    forEach: s,
                    merge: function t() {
                        var e = {};

                        function n(n, r) {
                            "object" == typeof e[r] && "object" == typeof n ? e[r] = t(e[r], n) : e[r] = n
                        }
                        for (var r = 0, o = arguments.length; r < o; r++) s(arguments[r], n);
                        return e
                    },
                    extend: function(t, e, n) {
                        return s(e, (function(e, o) {
                            t[o] = n && "function" == typeof e ? r(e, n) : e
                        })), t
                    },
                    trim: function(t) {
                        return t.replace(/^\s*/, "").replace(/\s*$/, "")
                    }
                }
            }, function(t, e, n) {
                "use strict";
                (function(e) {
                    var r = n(0),
                        o = n(12),
                        i = {
                            "Content-Type": "application/x-www-form-urlencoded"
                        };

                    function a(t, e) {
                        !r.isUndefined(t) && r.isUndefined(t["Content-Type"]) && (t["Content-Type"] = e)
                    }
                    var u, c = {
                        adapter: (("undefined" != typeof XMLHttpRequest || void 0 !== e) && (u = n(3)), u),
                        transformRequest: [function(t, e) {
                            return o(e, "Content-Type"), r.isFormData(t) || r.isArrayBuffer(t) || r.isBuffer(t) || r.isStream(t) || r.isFile(t) || r.isBlob(t) ? t : r.isArrayBufferView(t) ? t.buffer : r.isURLSearchParams(t) ? (a(e, "application/x-www-form-urlencoded;charset=utf-8"), t.toString()) : r.isObject(t) ? (a(e, "application/json;charset=utf-8"), JSON.stringify(t)) : t
                        }],
                        transformResponse: [function(t) {
                            if ("string" == typeof t) try {
                                t = JSON.parse(t)
                            } catch (t) {}
                            return t
                        }],
                        timeout: 0,
                        xsrfCookieName: "XSRF-TOKEN",
                        xsrfHeaderName: "X-XSRF-TOKEN",
                        maxContentLength: -1,
                        validateStatus: function(t) {
                            return 200 <= t && t < 300
                        },
                        headers: {
                            common: {
                                Accept: "application/json, text/plain, */*"
                            }
                        }
                    };
                    r.forEach(["delete", "get", "head"], (function(t) {
                        c.headers[t] = {}
                    })), r.forEach(["post", "put", "patch"], (function(t) {
                        c.headers[t] = r.merge(i)
                    })), t.exports = c
                }).call(this, n(11))
            }, function(t, e, n) {
                "use strict";
                t.exports = function(t, e) {
                    return function() {
                        for (var n = new Array(arguments.length), r = 0; r < n.length; r++) n[r] = arguments[r];
                        return t.apply(e, n)
                    }
                }
            }, function(t, e, n) {
                "use strict";
                var r = n(0),
                    o = n(13),
                    i = n(15),
                    a = n(16),
                    u = n(17),
                    c = n(4);
                t.exports = function(t) {
                    return new Promise((function(e, s) {
                        var f = t.data,
                            l = t.headers;
                        r.isFormData(f) && delete l["Content-Type"];
                        var p = new XMLHttpRequest;
                        if (t.auth) {
                            var h = t.auth.username || "",
                                y = t.auth.password || "";
                            l.Authorization = "Basic " + btoa(h + ":" + y)
                        }
                        if (p.open(t.method.toUpperCase(), i(t.url, t.params, t.paramsSerializer), !0), p.timeout = t.timeout, p.onreadystatechange = function() {
                                if (p && 4 === p.readyState && (0 !== p.status || p.responseURL && 0 === p.responseURL.indexOf("file:"))) {
                                    var n = "getAllResponseHeaders" in p ? a(p.getAllResponseHeaders()) : null,
                                        r = {
                                            data: t.responseType && "text" !== t.responseType ? p.response : p.responseText,
                                            status: p.status,
                                            statusText: p.statusText,
                                            headers: n,
                                            config: t,
                                            request: p
                                        };
                                    o(e, s, r), p = null
                                }
                            }, p.onerror = function() {
                                s(c("Network Error", t, null, p)), p = null
                            }, p.ontimeout = function() {
                                s(c("timeout of " + t.timeout + "ms exceeded", t, "ECONNABORTED", p)), p = null
                            }, r.isStandardBrowserEnv()) {
                            var d = n(18),
                                v = (t.withCredentials || u(t.url)) && t.xsrfCookieName ? d.read(t.xsrfCookieName) : void 0;
                            v && (l[t.xsrfHeaderName] = v)
                        }
                        if ("setRequestHeader" in p && r.forEach(l, (function(t, e) {
                                void 0 === f && "content-type" === e.toLowerCase() ? delete l[e] : p.setRequestHeader(e, t)
                            })), t.withCredentials && (p.withCredentials = !0), t.responseType) try {
                            p.responseType = t.responseType
                        } catch (h) {
                            if ("json" !== t.responseType) throw h
                        }
                        "function" == typeof t.onDownloadProgress && p.addEventListener("progress", t.onDownloadProgress), "function" == typeof t.onUploadProgress && p.upload && p.upload.addEventListener("progress", t.onUploadProgress), t.cancelToken && t.cancelToken.promise.then((function(t) {
                            p && (p.abort(), s(t), p = null)
                        })), void 0 === f && (f = null), p.send(f)
                    }))
                }
            }, function(t, e, n) {
                "use strict";
                var r = n(14);
                t.exports = function(t, e, n, o, i) {
                    var a = new Error(t);
                    return r(a, e, n, o, i)
                }
            }, function(t, e, n) {
                "use strict";
                t.exports = function(t) {
                    return !(!t || !t.__CANCEL__)
                }
            }, function(t, e, n) {
                "use strict";

                function r(t) {
                    this.message = t
                }
                r.prototype.toString = function() {
                    return "Cancel" + (this.message ? ": " + this.message : "")
                }, r.prototype.__CANCEL__ = !0, t.exports = r
            }, function(t, e, n) {
                t.exports = n(8)
            }, function(t, e, n) {
                "use strict";
                var r = n(0),
                    o = n(2),
                    i = n(10),
                    a = n(1);

                function u(t) {
                    var e = new i(t),
                        n = o(i.prototype.request, e);
                    return r.extend(n, i.prototype, e), r.extend(n, e), n
                }
                var c = u(a);
                c.Axios = i, c.create = function(t) {
                    return u(r.merge(a, t))
                }, c.Cancel = n(6), c.CancelToken = n(24), c.isCancel = n(5), c.all = function(t) {
                    return Promise.all(t)
                }, c.spread = n(25), t.exports = c, t.exports.default = c
            }, function(t, e) {
                t.exports = function(t) {
                    return null != t && null != t.constructor && "function" == typeof t.constructor.isBuffer && t.constructor.isBuffer(t)
                }
            }, function(t, e, n) {
                "use strict";
                var r = n(1),
                    o = n(0),
                    i = n(19),
                    a = n(20);

                function u(t) {
                    this.defaults = t, this.interceptors = {
                        request: new i,
                        response: new i
                    }
                }
                u.prototype.request = function(t, e) {
                    "string" == typeof t && (t = o.merge({
                        url: arguments[0]
                    }, e)), (t = o.merge(r, {
                        method: "get"
                    }, this.defaults, t)).method = t.method.toLowerCase();
                    var n = [a, void 0],
                        i = Promise.resolve(t);
                    for (this.interceptors.request.forEach((function(t) {
                            n.unshift(t.fulfilled, t.rejected)
                        })), this.interceptors.response.forEach((function(t) {
                            n.push(t.fulfilled, t.rejected)
                        })); n.length;) i = i.then(n.shift(), n.shift());
                    return i
                }, o.forEach(["delete", "get", "head", "options"], (function(t) {
                    u.prototype[t] = function(e, n) {
                        return this.request(o.merge(n || {}, {
                            method: t,
                            url: e
                        }))
                    }
                })), o.forEach(["post", "put", "patch"], (function(t) {
                    u.prototype[t] = function(e, n, r) {
                        return this.request(o.merge(r || {}, {
                            method: t,
                            url: e,
                            data: n
                        }))
                    }
                })), t.exports = u
            }, function(t, e) {
                var n, r, o = t.exports = {};

                function i() {
                    throw new Error("setTimeout has not been defined")
                }

                function a() {
                    throw new Error("clearTimeout has not been defined")
                }

                function u(t) {
                    if (n === setTimeout) return setTimeout(t, 0);
                    if ((n === i || !n) && setTimeout) return n = setTimeout, setTimeout(t, 0);
                    try {
                        return n(t, 0)
                    } catch (e) {
                        try {
                            return n.call(null, t, 0)
                        } catch (e) {
                            return n.call(this, t, 0)
                        }
                    }
                }! function() {
                    try {
                        n = "function" == typeof setTimeout ? setTimeout : i
                    } catch (t) {
                        n = i
                    }
                    try {
                        r = "function" == typeof clearTimeout ? clearTimeout : a
                    } catch (t) {
                        r = a
                    }
                }();
                var c, s = [],
                    f = !1,
                    l = -1;

                function p() {
                    f && c && (f = !1, c.length ? s = c.concat(s) : l = -1, s.length && h())
                }

                function h() {
                    if (!f) {
                        var t = u(p);
                        f = !0;
                        for (var e = s.length; e;) {
                            for (c = s, s = []; ++l < e;) c && c[l].run();
                            l = -1, e = s.length
                        }
                        c = null, f = !1,
                            function(t) {
                                if (r === clearTimeout) return clearTimeout(t);
                                if ((r === a || !r) && clearTimeout) return r = clearTimeout, clearTimeout(t);
                                try {
                                    r(t)
                                } catch (e) {
                                    try {
                                        return r.call(null, t)
                                    } catch (e) {
                                        return r.call(this, t)
                                    }
                                }
                            }(t)
                    }
                }

                function y(t, e) {
                    this.fun = t, this.array = e
                }

                function d() {}
                o.nextTick = function(t) {
                    var e = new Array(arguments.length - 1);
                    if (1 < arguments.length)
                        for (var n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
                    s.push(new y(t, e)), 1 !== s.length || f || u(h)
                }, y.prototype.run = function() {
                    this.fun.apply(null, this.array)
                }, o.title = "browser", o.browser = !0, o.env = {}, o.argv = [], o.version = "", o.versions = {}, o.on = d, o.addListener = d, o.once = d, o.off = d, o.removeListener = d, o.removeAllListeners = d, o.emit = d, o.prependListener = d, o.prependOnceListener = d, o.listeners = function(t) {
                    return []
                }, o.binding = function(t) {
                    throw new Error("process.binding is not supported")
                }, o.cwd = function() {
                    return "/"
                }, o.chdir = function(t) {
                    throw new Error("process.chdir is not supported")
                }, o.umask = function() {
                    return 0
                }
            }, function(t, e, n) {
                "use strict";
                var r = n(0);
                t.exports = function(t, e) {
                    r.forEach(t, (function(n, r) {
                        r !== e && r.toUpperCase() === e.toUpperCase() && (t[e] = n, delete t[r])
                    }))
                }
            }, function(t, e, n) {
                "use strict";
                var r = n(4);
                t.exports = function(t, e, n) {
                    var o = n.config.validateStatus;
                    n.status && o && !o(n.status) ? e(r("Request failed with status code " + n.status, n.config, null, n.request, n)) : t(n)
                }
            }, function(t, e, n) {
                "use strict";
                t.exports = function(t, e, n, r, o) {
                    return t.config = e, n && (t.code = n), t.request = r, t.response = o, t
                }
            }, function(t, e, n) {
                "use strict";
                var r = n(0);

                function o(t) {
                    return encodeURIComponent(t).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]")
                }
                t.exports = function(t, e, n) {
                    if (!e) return t;
                    var i;
                    if (n) i = n(e);
                    else if (r.isURLSearchParams(e)) i = e.toString();
                    else {
                        var a = [];
                        r.forEach(e, (function(t, e) {
                            null != t && (r.isArray(t) ? e += "[]" : t = [t], r.forEach(t, (function(t) {
                                r.isDate(t) ? t = t.toISOString() : r.isObject(t) && (t = JSON.stringify(t)), a.push(o(e) + "=" + o(t))
                            })))
                        })), i = a.join("&")
                    }
                    return i && (t += (-1 === t.indexOf("?") ? "?" : "&") + i), t
                }
            }, function(t, e, n) {
                "use strict";
                var r = n(0),
                    o = ["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"];
                t.exports = function(t) {
                    var e, n, i, a = {};
                    return t && r.forEach(t.split("\n"), (function(t) {
                        if (i = t.indexOf(":"), e = r.trim(t.substr(0, i)).toLowerCase(), n = r.trim(t.substr(i + 1)), e) {
                            if (a[e] && 0 <= o.indexOf(e)) return;
                            a[e] = "set-cookie" === e ? (a[e] ? a[e] : []).concat([n]) : a[e] ? a[e] + ", " + n : n
                        }
                    })), a
                }
            }, function(t, e, n) {
                "use strict";
                var r, o, i, a = n(0);

                function u(t) {
                    var e = t;
                    return o && (i.setAttribute("href", e), e = i.href), i.setAttribute("href", e), {
                        href: i.href,
                        protocol: i.protocol ? i.protocol.replace(/:$/, "") : "",
                        host: i.host,
                        search: i.search ? i.search.replace(/^\?/, "") : "",
                        hash: i.hash ? i.hash.replace(/^#/, "") : "",
                        hostname: i.hostname,
                        port: i.port,
                        pathname: "/" === i.pathname.charAt(0) ? i.pathname : "/" + i.pathname
                    }
                }
                t.exports = a.isStandardBrowserEnv() ? (o = /(msie|trident)/i.test(navigator.userAgent), i = document.createElement("a"), r = u(window.location.href), function(t) {
                    var e = a.isString(t) ? u(t) : t;
                    return e.protocol === r.protocol && e.host === r.host
                }) : function() {
                    return !0
                }
            }, function(t, e, n) {
                "use strict";
                var r = n(0);
                t.exports = r.isStandardBrowserEnv() ? {
                    write: function(t, e, n, o, i, a) {
                        var u = [];
                        u.push(t + "=" + encodeURIComponent(e)), r.isNumber(n) && u.push("expires=" + new Date(n).toGMTString()), r.isString(o) && u.push("path=" + o), r.isString(i) && u.push("domain=" + i), !0 === a && u.push("secure"), document.cookie = u.join("; ")
                    },
                    read: function(t) {
                        var e = document.cookie.match(new RegExp("(^|;\\s*)(" + t + ")=([^;]*)"));
                        return e ? decodeURIComponent(e[3]) : null
                    },
                    remove: function(t) {
                        this.write(t, "", Date.now() - 864e5)
                    }
                } : {
                    write: function() {},
                    read: function() {
                        return null
                    },
                    remove: function() {}
                }
            }, function(t, e, n) {
                "use strict";
                var r = n(0);

                function o() {
                    this.handlers = []
                }
                o.prototype.use = function(t, e) {
                    return this.handlers.push({
                        fulfilled: t,
                        rejected: e
                    }), this.handlers.length - 1
                }, o.prototype.eject = function(t) {
                    this.handlers[t] && (this.handlers[t] = null)
                }, o.prototype.forEach = function(t) {
                    r.forEach(this.handlers, (function(e) {
                        null !== e && t(e)
                    }))
                }, t.exports = o
            }, function(t, e, n) {
                "use strict";
                var r = n(0),
                    o = n(21),
                    i = n(5),
                    a = n(1),
                    u = n(22),
                    c = n(23);

                function s(t) {
                    t.cancelToken && t.cancelToken.throwIfRequested()
                }
                t.exports = function(t) {
                    return s(t), t.baseURL && !u(t.url) && (t.url = c(t.baseURL, t.url)), t.headers = t.headers || {}, t.data = o(t.data, t.headers, t.transformRequest), t.headers = r.merge(t.headers.common || {}, t.headers[t.method] || {}, t.headers || {}), r.forEach(["delete", "get", "head", "post", "put", "patch", "common"], (function(e) {
                        delete t.headers[e]
                    })), (t.adapter || a.adapter)(t).then((function(e) {
                        return s(t), e.data = o(e.data, e.headers, t.transformResponse), e
                    }), (function(e) {
                        return i(e) || (s(t), e && e.response && (e.response.data = o(e.response.data, e.response.headers, t.transformResponse))), Promise.reject(e)
                    }))
                }
            }, function(t, e, n) {
                "use strict";
                var r = n(0);
                t.exports = function(t, e, n) {
                    return r.forEach(n, (function(n) {
                        t = n(t, e)
                    })), t
                }
            }, function(t, e, n) {
                "use strict";
                t.exports = function(t) {
                    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(t)
                }
            }, function(t, e, n) {
                "use strict";
                t.exports = function(t, e) {
                    return e ? t.replace(/\/+$/, "") + "/" + e.replace(/^\/+/, "") : t
                }
            }, function(t, e, n) {
                "use strict";
                var r = n(6);

                function o(t) {
                    if ("function" != typeof t) throw new TypeError("executor must be a function.");
                    var e;
                    this.promise = new Promise((function(t) {
                        e = t
                    }));
                    var n = this;
                    t((function(t) {
                        n.reason || (n.reason = new r(t), e(n.reason))
                    }))
                }
                o.prototype.throwIfRequested = function() {
                    if (this.reason) throw this.reason
                }, o.source = function() {
                    var t;
                    return {
                        token: new o((function(e) {
                            t = e
                        })),
                        cancel: t
                    }
                }, t.exports = o
            }, function(t, e, n) {
                "use strict";
                t.exports = function(t) {
                    return function(e) {
                        return t.apply(null, e)
                    }
                }
            }, function(t, e, n) {
                "use strict";
                n.r(e);
                var r = "gamma",
                    o = "aws-marketing",
                    i = function() {
                        function t(e) {
                            ! function(t, e) {
                                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                            }(this, t), this.config = e
                        }
                        return function(t, e, n) {
                            e && function(t, e) {
                                for (var n = 0; n < e.length; n++) {
                                    var r = e[n];
                                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                                }
                            }(t.prototype, e)
                        }(t, [{
                            key: "getEndpoint",
                            value: function() {
                                var t = this.config.getEnvironment();
                                return "dev" === t ? this.config.getDevEndpoint() : "https://" + this._getPrefix(t) + ".amazon.com/"
                            }
                        }, {
                            key: "_getPrefix",
                            value: function(t) {
                                switch (t) {
                                    case r:
                                        return o + "-" + r;
                                    case "prod":
                                        return "aws";
                                    default:
                                        return o + ".integ"
                                }
                            }
                        }]), t
                    }(),
                    a = n(7),
                    u = n.n(a),
                    c = "application/json",
                    s = function() {
                        function t(e, n) {
                            ! function(e, n) {
                                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                            }(this), this.config = e, this.endpointProvider = n, this.client = u.a.create({
                                baseURL: this._getBaseURL(),
                                withCredentials: !0,
                                headers: {
                                    "Content-Type": "application/plain",
                                    Accept: c
                                }
                            })
                        }
                        return function(t, e, n) {
                            e && function(t, e) {
                                for (var n = 0; n < e.length; n++) {
                                    var r = e[n];
                                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                                }
                            }(t.prototype, e)
                        }(t, [{
                            key: "get",
                            value: function(t, e) {
                                var n = 1 < arguments.length && void 0 !== e ? e : {};
                                return this.client.get(t, {
                                    params: n
                                })
                            }
                        }, {
                            key: "post",
                            value: function(t, e) {
                                return this.client.post(t, e, {
                                    headers: {
                                        "Content-Type": c,
                                        Accept: c
                                    }
                                })
                            }
                        }, {
                            key: "_getBaseURL",
                            value: function() {
                                var t = this.config.getEnvironment();
                                return this.endpointProvider.getEndpoint(t)
                            }
                        }]), t
                    }();

                function f(t) {
                    return (f = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                        return typeof t
                    } : function(t) {
                        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                    })(t)
                }
                var l = function() {
                        function t() {
                            ! function(t, e) {
                                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                            }(this, t)
                        }
                        return function(t, e, n) {
                            n && function(t, e) {
                                for (var n = 0; n < e.length; n++) {
                                    var r = e[n];
                                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                                }
                            }(t, n)
                        }(t, 0, [{
                            key: "isValid",
                            value: function(t) {
                                if ("object" !== f(t)) return !1;
                                var e = t.getMetrics(),
                                    n = t.getDimensions(),
                                    r = Array.isArray(e) && 0 < e.length;
                                return !Array.isArray(n) && "object" === f(n) && r
                            }
                        }]), t
                    }(),
                    p = function() {
                        function t() {
                            ! function(t, e) {
                                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                            }(this, t)
                        }
                        return function(t, e, n) {
                            n && function(t, e) {
                                for (var n = 0; n < e.length; n++) {
                                    var r = e[n];
                                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                                }
                            }(t, n)
                        }(t, 0, [{
                            key: "isValidRequest",
                            value: function(t) {
                                if (t && "function" == typeof t.getData) {
                                    var e = t.getData();
                                    return e && Array.isArray(e) && 0 < e.length
                                }
                                return !1
                            }
                        }, {
                            key: "isValidData",
                            value: function(t) {
                                return !!t && !Array.isArray(t) && 0 < Object.keys(t).length
                            }
                        }]), t
                    }(),
                    h = function() {
                        function t() {
                            ! function(t, e) {
                                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                            }(this, t)
                        }
                        return function(t, e, n) {
                            n && function(t, e) {
                                for (var n = 0; n < e.length; n++) {
                                    var r = e[n];
                                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                                }
                            }(t, n)
                        }(t, 0, [{
                            key: "translate",
                            value: function(t) {
                                var e = [];
                                return t.forEach((function(t) {
                                    void 0 !== t && e.push(t.toString())
                                })), e.join("/")
                            }
                        }]), t
                    }(),
                    y = function() {
                        function t(e) {
                            ! function(e, n) {
                                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                            }(this);
                            var n = new i(e);
                            this.httpClient = new s(e, n)
                        }
                        return function(t, e, n) {
                            e && function(t, e) {
                                for (var n = 0; n < e.length; n++) {
                                    var r = e[n];
                                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                                }
                            }(t.prototype, e)
                        }(t, [{
                            key: "logData",
                            value: function(t) {
                                if (l.isValid(t)) {
                                    var e = this._getRequestPath(t.getMetrics());
                                    this.httpClient.get(e, t.getDimensions()).catch((function() {}))
                                }
                            }
                        }, {
                            key: "logDataV2",
                            value: function(t) {
                                if (p.isValidRequest(t)) {
                                    var e = {
                                        input: {
                                            requestBody: t.getData()
                                        }
                                    };
                                    this.httpClient.post("/csds/v2/metrics", e).catch((function() {}))
                                }
                            }
                        }, {
                            key: "_getRequestPath",
                            value: function(t) {
                                return "/csds/data/" + h.translate(t)
                            }
                        }]), t
                    }(),
                    d = function() {
                        function t(e) {
                            ! function(t, e) {
                                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                            }(this, t), this.environment = e, this.setTimeout(5e3)
                        }
                        return function(t, e, n) {
                            e && function(t, e) {
                                for (var n = 0; n < e.length; n++) {
                                    var r = e[n];
                                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                                }
                            }(t.prototype, e)
                        }(t, [{
                            key: "getEnvironment",
                            value: function() {
                                return this.environment
                            }
                        }, {
                            key: "getTimeout",
                            value: function() {
                                return this.timeout
                            }
                        }, {
                            key: "setTimeout",
                            value: function(t) {
                                this.timeout = t
                            }
                        }, {
                            key: "setDevEndpoint",
                            value: function(t) {
                                this.devEndpoint = t
                            }
                        }, {
                            key: "getDevEndpoint",
                            value: function() {
                                return this.devEndpoint
                            }
                        }]), t
                    }(),
                    v = function() {
                        function t(e) {
                            ! function(t, e) {
                                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                            }(this, t), this.metrics = e, this.dimensions = {}
                        }
                        return function(t, e, n) {
                            e && function(t, e) {
                                for (var n = 0; n < e.length; n++) {
                                    var r = e[n];
                                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                                }
                            }(t.prototype, e)
                        }(t, [{
                            key: "setDimensions",
                            value: function(t) {
                                this.dimensions = t
                            }
                        }, {
                            key: "getDimensions",
                            value: function() {
                                return this.dimensions
                            }
                        }, {
                            key: "getMetrics",
                            value: function() {
                                return this.metrics
                            }
                        }]), t
                    }(),
                    b = function() {
                        function t() {
                            ! function(t, e) {
                                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                            }(this, t), this.data = []
                        }
                        return function(t, e, n) {
                            e && function(t, e) {
                                for (var n = 0; n < e.length; n++) {
                                    var r = e[n];
                                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                                }
                            }(t.prototype, e)
                        }(t, [{
                            key: "addData",
                            value: function(t) {
                                if (void 0 !== t && Array.isArray(t)) {
                                    var e = t.filter((function(t) {
                                        return p.isValidData(t)
                                    }));
                                    this.data = this.data.concat(e)
                                }
                            }
                        }, {
                            key: "getData",
                            value: function() {
                                return this.data
                            }
                        }]), t
                    }(),
                    _ = function() {
                        function t(e, n, r) {
                            ! function(e, n) {
                                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                            }(this), this.name = e, this.value = n, this.unit = r
                        }
                        return function(t, e, n) {
                            e && function(t, e) {
                                for (var n = 0; n < e.length; n++) {
                                    var r = e[n];
                                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                                }
                            }(t.prototype, e)
                        }(t, [{
                            key: "getName",
                            value: function() {
                                return this.name
                            }
                        }, {
                            key: "getValue",
                            value: function() {
                                return this.value
                            }
                        }, {
                            key: "getUnit",
                            value: function() {
                                return this.unit
                            }
                        }, {
                            key: "toString",
                            value: function() {
                                return "".concat(this.name, "@v=").concat(this.value, ":u=").concat(this.unit)
                            }
                        }]), t
                    }();
                n.d(e, "AWSMarketingClientSideDataServiceClient", (function() {
                    return y
                })), n.d(e, "AWSMarketingClientSideDataServiceClientConfig", (function() {
                    return d
                })), n.d(e, "LogDataRequest", (function() {
                    return v
                })), n.d(e, "LogDataV2Request", (function() {
                    return b
                })), n.d(e, "Metric", (function() {
                    return _
                }))
            }], t.c = n, t.d = function(e, n, r) {
                t.o(e, n) || Object.defineProperty(e, n, {
                    enumerable: !0,
                    get: r
                })
            }, t.r = function(t) {
                "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
                    value: "Module"
                }), Object.defineProperty(t, "__esModule", {
                    value: !0
                })
            }, t.t = function(e, n) {
                if (1 & n && (e = t(e)), 8 & n) return e;
                if (4 & n && "object" == typeof e && e && e.__esModule) return e;
                var r = Object.create(null);
                if (t.r(r), Object.defineProperty(r, "default", {
                        enumerable: !0,
                        value: e
                    }), 2 & n && "string" != typeof e)
                    for (var o in e) t.d(r, o, function(t) {
                        return e[t]
                    }.bind(null, o));
                return r
            }, t.n = function(e) {
                var n = e && e.__esModule ? function() {
                    return e.default
                } : function() {
                    return e
                };
                return t.d(n, "a", n), n
            }, t.o = function(t, e) {
                return Object.prototype.hasOwnProperty.call(t, e)
            }, t.p = "", t(t.s = 26);

            function t(r) {
                if (n[r]) return n[r].exports;
                var o = n[r] = {
                    i: r,
                    l: !1,
                    exports: {}
                };
                return e[r].call(o.exports, o, o.exports, t), o.l = !0, o.exports
            }
            var e, n
        }()
    }, function(t, e, n) {
        "use strict";
        t.exports = n(16)() ? Object.setPrototypeOf : n(17)
    }, function(t, e, n) {
        "use strict";
        t.exports = n(54)() ? globalThis : n(55)
    }, function(t, e, n) {
        "use strict";
        var r = Object.prototype.toString,
            o = r.call(function() {
                return arguments
            }());
        t.exports = function(t) {
            return r.call(t) === o
        }
    }, function(t, e, n) {
        "use strict";
        var r = Object.prototype.toString,
            o = r.call("");
        t.exports = function(t) {
            return "string" == typeof t || t && "object" == typeof t && (t instanceof String || r.call(t) === o) || !1
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(5),
            o = {
                object: !0,
                function: !0,
                undefined: !0
            };
        t.exports = function(t) {
            return !!r(t) && hasOwnProperty.call(o, typeof t)
        }
    }, function(t, e, n) {
        "use strict";
        t.exports = n(45)() ? Object.assign : n(46)
    }, function(t, e, n) {
        "use strict";
        var r, o = n(14),
            i = n(12),
            a = n(3),
            u = n(1),
            c = n(0),
            s = n(65),
            f = n(2),
            l = Object.defineProperty,
            p = Object.defineProperties;
        t.exports = r = function(t, e) {
            if (!(this instanceof r)) throw new TypeError("Constructor requires 'new'");
            p(this, {
                __list__: c("w", u(t)),
                __context__: c("w", e),
                __nextIndex__: c("w", 0)
            }), e && (a(e.on), e.on("_add", this._onAdd), e.on("_delete", this._onDelete), e.on("_clear", this._onClear))
        }, delete r.prototype.constructor, p(r.prototype, i({
            _next: c((function() {
                var t;
                if (this.__list__) return this.__redo__ && void 0 !== (t = this.__redo__.shift()) ? t : this.__nextIndex__ < this.__list__.length ? this.__nextIndex__++ : void this._unBind()
            })),
            next: c((function() {
                return this._createResult(this._next())
            })),
            _createResult: c((function(t) {
                return void 0 === t ? {
                    done: !0,
                    value: void 0
                } : {
                    done: !1,
                    value: this._resolve(t)
                }
            })),
            _resolve: c((function(t) {
                return this.__list__[t]
            })),
            _unBind: c((function() {
                this.__list__ = null, delete this.__redo__, this.__context__ && (this.__context__.off("_add", this._onAdd), this.__context__.off("_delete", this._onDelete), this.__context__.off("_clear", this._onClear), this.__context__ = null)
            })),
            toString: c((function() {
                return "[object " + (this[f.toStringTag] || "Object") + "]"
            }))
        }, s({
            _onAdd: c((function(t) {
                t >= this.__nextIndex__ || (++this.__nextIndex__, this.__redo__ ? (this.__redo__.forEach((function(e, n) {
                    e >= t && (this.__redo__[n] = ++e)
                }), this), this.__redo__.push(t)) : l(this, "__redo__", c("c", [t])))
            })),
            _onDelete: c((function(t) {
                var e;
                t >= this.__nextIndex__ || (--this.__nextIndex__, this.__redo__ && (-1 !== (e = this.__redo__.indexOf(t)) && this.__redo__.splice(e, 1), this.__redo__.forEach((function(e, n) {
                    e > t && (this.__redo__[n] = --e)
                }), this)))
            })),
            _onClear: c((function() {
                this.__redo__ && o.call(this.__redo__), this.__nextIndex__ = 0
            }))
        }))), l(r.prototype, f.iterator, c((function() {
            return this
        })))
    }, function(t, e, n) {
        "use strict";
        var r = n(1);
        t.exports = function() {
            return r(this).length = 0, this
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(37),
            o = Math.max;
        t.exports = function(t) {
            return o(0, r(t))
        }
    }, function(t, e, n) {
        "use strict";
        var r = Object.create,
            o = Object.getPrototypeOf,
            i = {};
        t.exports = function() {
            var t = Object.setPrototypeOf,
                e = arguments[0] || r;
            return "function" == typeof t && o(t(e(null), i)) === i
        }
    }, function(t, e, n) {
        "use strict";
        var r, o = n(41),
            i = n(1),
            a = Object.prototype.isPrototypeOf,
            u = Object.defineProperty,
            c = {
                configurable: !0,
                enumerable: !1,
                writable: !0,
                value: void 0
            };
        r = function(t, e) {
            if (i(t), null === e || o(e)) return t;
            throw new TypeError("Prototype must be null or an object")
        }, t.exports = function(t) {
            var e, n;
            return t ? (2 === t.level ? t.set ? (n = t.set, e = function(t, e) {
                return n.call(r(t, e), e), t
            }) : e = function(t, e) {
                return r(t, e).__proto__ = e, t
            } : e = function t(e, n) {
                var o;
                return r(e, n), (o = a.call(t.nullPolyfill, e)) && delete t.nullPolyfill.__proto__, null === n && (n = t.nullPolyfill), e.__proto__ = n, o && u(t.nullPolyfill, "__proto__", c), e
            }, Object.defineProperty(e, "level", {
                configurable: !1,
                enumerable: !1,
                writable: !1,
                value: t.level
            })) : null
        }(function() {
            var t, e = Object.create(null),
                n = {},
                r = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__");
            if (r) {
                try {
                    (t = r.set).call(e, n)
                } catch (t) {}
                if (Object.getPrototypeOf(e) === n) return {
                    set: t,
                    level: 2
                }
            }
            return e.__proto__ = n, Object.getPrototypeOf(e) === n ? {
                level: 2
            } : ((e = {}).__proto__ = n, Object.getPrototypeOf(e) === n && {
                level: 1
            })
        }()), n(42)
    }, function(t, e, n) {
        "use strict";
        var r = n(43),
            o = /^\s*class[\s{/}]/,
            i = Function.prototype.toString;
        t.exports = function(t) {
            return !!r(t) && !o.test(i.call(t))
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(4),
            o = Array.prototype.forEach,
            i = Object.create,
            a = function(t, e) {
                var n;
                for (n in t) e[n] = t[n]
            };
        t.exports = function(t) {
            var e = i(null);
            return o.call(arguments, (function(t) {
                r(t) && a(Object(t), e)
            })), e
        }
    }, function(t, e, n) {
        "use strict";
        t.exports = n(50)() ? String.prototype.contains : n(51)
    }, function(t, e, n) {
        "use strict";
        var r = n(57);
        t.exports = function(t) {
            if (!r(t)) throw new TypeError(t + " is not a symbol");
            return t
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(61);
        t.exports = function(t) {
            if (!r(t)) throw new TypeError(t + " is not iterable");
            return t
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(5),
            o = n(11),
            i = n(67),
            a = n(68),
            u = function(t, e) {
                return t.replace("%v", a(e))
            };
        t.exports = function(t, e, n) {
            if (!o(n)) throw new TypeError(u(e, t));
            if (!r(t)) {
                if ("default" in n) return n.default;
                if (n.isOptional) return null
            }
            var a = i(n.errorMessage);
            throw r(a) || (a = e), new TypeError(u(a, t))
        }
    }, function(t, e) {
        t.exports = function(t) {
            var e = {};

            function n(r) {
                if (e[r]) return e[r].exports;
                var o = e[r] = {
                    i: r,
                    l: !1,
                    exports: {}
                };
                return t[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports
            }
            return n.m = t, n.c = e, n.d = function(t, e, r) {
                n.o(t, e) || Object.defineProperty(t, e, {
                    enumerable: !0,
                    get: r
                })
            }, n.r = function(t) {
                "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
                    value: "Module"
                }), Object.defineProperty(t, "__esModule", {
                    value: !0
                })
            }, n.t = function(t, e) {
                if (1 & e && (t = n(t)), 8 & e) return t;
                if (4 & e && "object" == typeof t && t && t.__esModule) return t;
                var r = Object.create(null);
                if (n.r(r), Object.defineProperty(r, "default", {
                        enumerable: !0,
                        value: t
                    }), 2 & e && "string" != typeof t)
                    for (var o in t) n.d(r, o, function(e) {
                        return t[e]
                    }.bind(null, o));
                return r
            }, n.n = function(t) {
                var e = t && t.__esModule ? function() {
                    return t.default
                } : function() {
                    return t
                };
                return n.d(e, "a", e), e
            }, n.o = function(t, e) {
                return Object.prototype.hasOwnProperty.call(t, e)
            }, n.p = "", n(n.s = 0)
        }([function(t, e, n) {
            "use strict";
            n.r(e);
            var r = function() {
                    function t(e, n) {
                        ! function(e, n) {
                            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                        }(this), this.validate = e, this.metricsCollector = n, this.containersEventsInfoMap = new Map, this.isListenerAdded = !1
                    }
                    return (e = [{
                        key: "updateContainersEventsInfoMap",
                        value: function(t, e, n) {
                            var r = this.createContainersEventsInfoMap(e, n);
                            this.mergeContainersEventInfoMaps(t, r)
                        }
                    }, {
                        key: "createContainersEventsInfoMap",
                        value: function(t, e) {
                            var n = new Map;
                            if (!t || 0 === t.length) return n;
                            for (var r = 0; r < t.length; r++) {
                                var o = this.serializeEventConfig(e),
                                    i = {
                                        eventConfig: e,
                                        count: 0
                                    },
                                    a = new Map;
                                a.set(o, i);
                                var u = t[r];
                                n.set(u, a)
                            }
                            return n
                        }
                    }, {
                        key: "serializeEventConfig",
                        value: function(t) {
                            var e = {};
                            return Object.keys(t).sort().forEach((function(n) {
                                e[n] = t[n]
                            })), JSON.stringify(e)
                        }
                    }, {
                        key: "mergeContainersEventInfoMaps",
                        value: function(t, e) {
                            e.forEach((function(e, n) {
                                var r = e;
                                t.has(n) && t.get(n).forEach((function(t, e) {
                                    return r.set(e, t)
                                })), t.set(n, r)
                            }))
                        }
                    }, {
                        key: "sendMetrics",
                        value: function(t, e) {
                            this.containersEventsInfoMap.get(t).forEach((function(t) {
                                t.eventConfig.oncePerContainer && 0 !== t.count || e(t)
                            }))
                        }
                    }]) && function(t, e) {
                        for (var n = 0; n < e.length; n++) {
                            var r = e[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                        }
                    }(t.prototype, e), t;
                    var e
                }(),
                o = "click",
                i = "impression";

            function a(t) {
                return (a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                } : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                })(t)
            }

            function u(t, e, n) {
                return (u = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(t, e, n) {
                    var r = function(t, e) {
                        for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = c(t)););
                        return t
                    }(t, e);
                    if (r) {
                        var o = Object.getOwnPropertyDescriptor(r, e);
                        return o.get ? o.get.call(n) : o.value
                    }
                })(t, e, n || t)
            }

            function c(t) {
                return (c = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
                    return t.__proto__ || Object.getPrototypeOf(t)
                })(t)
            }

            function s(t, e) {
                return (s = Object.setPrototypeOf || function(t, e) {
                    return t.__proto__ = e, t
                })(t, e)
            }
            var f = {
                    oncePerContainer: !1,
                    trackNewWindowLinksOnly: !1
                },
                l = function(t) {
                    function e(t, n) {
                        return function(t, n) {
                                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                            }(this),
                            function(t, e) {
                                return !e || "object" !== a(e) && "function" != typeof e ? function(t) {
                                    if (void 0 !== t) return t;
                                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
                                }(t) : e
                            }(this, c(e).call(this, t, n))
                    }
                    return function(t, e) {
                            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
                            t.prototype = Object.create(e && e.prototype, {
                                constructor: {
                                    value: t,
                                    writable: !0,
                                    configurable: !0
                                }
                            }), e && s(t, e)
                        }(e, r),
                        function(t, e, n) {
                            e && function(t, e) {
                                for (var n = 0; n < e.length; n++) {
                                    var r = e[n];
                                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                                }
                            }(t.prototype, e)
                        }(e, [{
                            key: "track",
                            value: function(t, n) {
                                var r = Object.assign({}, f, n);
                                u(c(e.prototype), "updateContainersEventsInfoMap", this).call(this, this.containersEventsInfoMap, t, r), this.isListenerAdded || (document.addEventListener(o, this.handleClickEvent.bind(this)), this.isListenerAdded = !0)
                            }
                        }, {
                            key: "handleClickEvent",
                            value: function(t) {
                                var n = t.target,
                                    r = this.findContainerForClickTarget(n);
                                r && u(c(e.prototype), "sendMetrics", this).call(this, r, this.sendClickMetrics.bind(this, n, r))
                            }
                        }, {
                            key: "sendClickMetrics",
                            value: function(t, e, n) {
                                this.validate(t, n.eventConfig) && (this.metricsCollector.sendMetrics(o, e), n.count++)
                            }
                        }, {
                            key: "findContainerForClickTarget",
                            value: function(t) {
                                for (var e = t; e;) {
                                    if (this.containersEventsInfoMap.has(e)) return e;
                                    e = e.parentNode
                                }
                                return !1
                            }
                        }]), e
                }();
            var p = function() {
                function t() {
                    ! function(e, n) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this)
                }
                return (e = [{
                    key: "validate",
                    value: function(e, n) {
                        var r = t.findClosestAnchor(e);
                        if (!r) return !1;
                        var o = t.isAnchorUrlValid(r);
                        if (n && n.trackNewWindowLinksOnly) {
                            var i = t.isAnchorTargetValid(r);
                            return o && i
                        }
                        return o
                    }
                }, {
                    key: "isAnchorUrlValid",
                    value: function(t) {
                        var e = t.getAttribute("href");
                        return Boolean(e) && !/^(#$|javascript)/.test(e)
                    }
                }, {
                    key: "isAnchorTargetValid",
                    value: function(t) {
                        return "_blank" === t.getAttribute("target")
                    }
                }, {
                    key: "findClosestAnchor",
                    value: function(t) {
                        for (var e = t; e;) {
                            if ("A" === e.tagName) return e;
                            e = e.parentNode
                        }
                        return !1
                    }
                }]) && function(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                    }
                }(t, e), t;
                var e
            }();

            function h(t) {
                return (h = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                } : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                })(t)
            }

            function y(t, e, n) {
                return (y = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(t, e, n) {
                    var r = function(t, e) {
                        for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = d(t)););
                        return t
                    }(t, e);
                    if (r) {
                        var o = Object.getOwnPropertyDescriptor(r, e);
                        return o.get ? o.get.call(n) : o.value
                    }
                })(t, e, n || t)
            }

            function d(t) {
                return (d = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
                    return t.__proto__ || Object.getPrototypeOf(t)
                })(t)
            }

            function v(t, e) {
                return (v = Object.setPrototypeOf || function(t, e) {
                    return t.__proto__ = e, t
                })(t, e)
            }
            var b = {
                    oncePerContainer: !0,
                    impressionTime: 1e3
                },
                _ = function(t) {
                    function e(t, n) {
                        var r;
                        return function(t, n) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this), (r = function(t, e) {
                            return !e || "object" !== h(e) && "function" != typeof e ? function(t) {
                                if (void 0 !== t) return t;
                                throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
                            }(t) : e
                        }(this, d(e).call(this, t, n))).animationFrameRequestId = null, r
                    }
                    return function(t, e) {
                            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
                            t.prototype = Object.create(e && e.prototype, {
                                constructor: {
                                    value: t,
                                    writable: !0,
                                    configurable: !0
                                }
                            }), e && v(t, e)
                        }(e, r),
                        function(t, e, n) {
                            e && function(t, e) {
                                for (var n = 0; n < e.length; n++) {
                                    var r = e[n];
                                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                                }
                            }(t.prototype, e)
                        }(e, [{
                            key: "track",
                            value: function(t, n) {
                                var r = Object.assign({}, b, n);
                                y(d(e.prototype), "updateContainersEventsInfoMap", this).call(this, this.containersEventsInfoMap, t, r), this.handleImpressionEvent(), this.isListenerAdded || (window.addEventListener("scroll", this.handleImpressionEvent.bind(this), !0), window.addEventListener("resize", this.handleImpressionEvent.bind(this)), this.isListenerAdded = !0)
                            }
                        }, {
                            key: "handleImpressionEvent",
                            value: function() {
                                this.animationFrameRequestId && window.cancelAnimationFrame(this.animationFrameRequestId), this.animationFrameRequestId = window.requestAnimationFrame(this.handleDebouncedImpressionEvent.bind(this))
                            }
                        }, {
                            key: "handleDebouncedImpressionEvent",
                            value: function() {
                                var t = this;
                                this.containersEventsInfoMap.forEach((function(n, r) {
                                    y(d(e.prototype), "sendMetrics", t).call(t, r, t.sendImpressionMetrics.bind(t, r))
                                }))
                            }
                        }, {
                            key: "sendImpressionMetrics",
                            value: function(t, e) {
                                var n = this.metricsCollector.sendMetrics.bind(this.metricsCollector, i);
                                this.validate(t, e, n)
                            }
                        }]), e
                }();
            var g = function() {
                function t() {
                    ! function(e, n) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this)
                }
                return function(t, e, n) {
                    n && function(t, e) {
                        for (var n = 0; n < e.length; n++) {
                            var r = e[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                        }
                    }(t, n)
                }(t, 0, [{
                    key: "isInViewport",
                    value: function(e) {
                        var n = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 50;
                        if (n < 0 || 100 < n) throw new Error("Invalid range for viewPercentage");
                        return !!t.isElementVisible(e, window) && n < t.computeVisibleAreaPercentage(e, window)
                    }
                }, {
                    key: "computeVisibleAreaPercentage",
                    value: function(t) {
                        var e = t.getBoundingClientRect(),
                            n = window.document.documentElement.clientHeight,
                            r = window.document.documentElement.clientWidth,
                            o = Math.min(e.bottom, n) - Math.max(e.top, 0),
                            i = Math.min(e.right, r) - Math.max(e.left, 0);
                        return Math.max(o * i, 0) / (e.height * e.width) * 100
                    }
                }, {
                    key: "isElementVisible",
                    value: function(t) {
                        var e = t.getBoundingClientRect(),
                            n = window.getComputedStyle(t);
                        if (0 === e.width || 0 === e.height || "hidden" === n.visibility) return !1;
                        for (var r = t; r && "BODY" !== r.tagName;) {
                            var o = window.getComputedStyle(r),
                                i = "hidden" === o.overflow && ("0px" === o.maxHeight || "0px" === o.height),
                                a = "hidden" === o.overflow && ("0px" === o.maxWidth || "0px" === o.width);
                            if ("none" === o.display || "0" === o.opacity || i || a) return !1;
                            r = r.parentNode
                        }
                        return !0
                    }
                }]), t
            }();
            var m = function() {
                function t() {
                    ! function(e, n) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this)
                }
                return (e = [{
                    key: "validate",
                    value: function(e, n, r) {
                        var o = n.eventConfig.impressionTime;
                        if (g.isInViewport(e))
                            if (0 !== o) var i = o,
                                a = setInterval((function() {
                                    if (!((i -= 500) <= 0)) return g.isInViewport(e) ? void(i <= 500 && clearInterval(a)) : (clearTimeout(u), void clearInterval(a));
                                    clearInterval(a)
                                }), 500),
                                u = setTimeout((function() {
                                    clearInterval(a), g.isInViewport(e) && t.dedupeImpression(e, n, r)
                                }), o);
                            else t.dedupeImpression(e, n, r)
                    }
                }, {
                    key: "dedupeImpression",
                    value: function(t, e, n) {
                        e.eventConfig.oncePerContainer && 0 < e.count || (e.count++, n(t))
                    }
                }]) && function(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                    }
                }(t, e), t;
                var e
            }();
            n.d(e, "default", (function() {
                return w
            }));
            var w = function() {
                function t(e) {
                    ! function(t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }(this, t), this.clickEventHandler = new l(p.validate, e), this.impressionEventHandler = new _(m.validate, e)
                }
                return function(t, e, n) {
                    e && function(t, e) {
                        for (var n = 0; n < e.length; n++) {
                            var r = e[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                        }
                    }(t.prototype, e)
                }(t, [{
                    key: "track",
                    value: function(t, e) {
                        var n = this;
                        Object.keys(e).forEach((function(r) {
                            switch (r) {
                                case o:
                                    n.clickEventHandler.track(t, e.click);
                                    break;
                                case i:
                                    n.impressionEventHandler.track(t, e.impression);
                                    break;
                                default:
                                    throw new Error("Unsupported event type: ".concat(r))
                            }
                        }))
                    }
                }]), t
            }()
        }])
    }, function(t, e) {
        t.exports = function(t) {
            var e = {};

            function n(r) {
                if (e[r]) return e[r].exports;
                var o = e[r] = {
                    i: r,
                    l: !1,
                    exports: {}
                };
                return t[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports
            }
            return n.m = t, n.c = e, n.d = function(t, e, r) {
                n.o(t, e) || Object.defineProperty(t, e, {
                    enumerable: !0,
                    get: r
                })
            }, n.r = function(t) {
                "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
                    value: "Module"
                }), Object.defineProperty(t, "__esModule", {
                    value: !0
                })
            }, n.t = function(t, e) {
                if (1 & e && (t = n(t)), 8 & e) return t;
                if (4 & e && "object" == typeof t && t && t.__esModule) return t;
                var r = Object.create(null);
                if (n.r(r), Object.defineProperty(r, "default", {
                        enumerable: !0,
                        value: t
                    }), 2 & e && "string" != typeof t)
                    for (var o in t) n.d(r, o, function(e) {
                        return t[e]
                    }.bind(null, o));
                return r
            }, n.n = function(t) {
                var e = t && t.__esModule ? function() {
                    return t.default
                } : function() {
                    return t
                };
                return n.d(e, "a", e), e
            }, n.o = function(t, e) {
                return Object.prototype.hasOwnProperty.call(t, e)
            }, n.p = "", n(n.s = 1)
        }([function(t, e) {
            var n = function() {
                    return 1e9 * Math.random() | 0
                },
                r = Date.now() + ":" + n();

            function o(t) {
                return function() {
                    var e = localStorage[t];
                    if (!e) return null;
                    var n = e.split(/\|/);
                    return parseInt(n[1]) < Date.now() ? null : n[0]
                }
            }

            function i(t, e, n) {
                var a = t + "__MUTEX_x",
                    u = t + "__MUTEX_y",
                    c = o(u);

                function s() {
                    try {
                        e()
                    } finally {
                        localStorage.removeItem(u)
                    }
                }
                return localStorage[a] = r, c() ? (n || setTimeout((function() {
                    i(t, e)
                }), 0), !1) : (localStorage[u] = r + "|" + (Date.now() + 40), localStorage[a] !== r ? (n || setTimeout((function() {
                    c() !== r ? setTimeout((function() {
                        i(t, e)
                    }), 0) : s()
                }), 50), !1) : (s(), !0))
            }

            function a(t, e, u, c) {
                u = u || 5e3;
                var s = t + "__MUTEX",
                    f = o(s),
                    l = r + ":" + n() + "|" + (Date.now() + u);

                function p() {
                    setTimeout((function() {
                        a(t, e, u)
                    }), 10)
                }
                if (f()) return c || p(), !1;
                var h = i(t, (function() {
                    if (f()) return c || p(), !1;
                    localStorage[s] = l, c || setTimeout(y, 0)
                }), c);
                return !(!c || !h || (y(), 0));

                function y() {
                    try {
                        e()
                    } finally {
                        i(t, (function() {
                            if (localStorage[s] !== l) throw t + " was locked by a different process while I held the lock";
                            localStorage.removeItem(s)
                        }))
                    }
                }
            }
            t.exports = {
                lock: function(t, e, n) {
                    a(t, e, n, !1)
                },
                trySyncLock: function(t, e, n) {
                    return a(t, e, n, !0)
                },
                uniqueId: function() {
                    return r
                }
            }
        }, function(t, e, n) {
            "use strict";
            n.r(e);
            var r = n(0),
                o = {
                    bufferItemsSize: 70,
                    bufferFlushTime: 200,
                    bufferDataMaxAge: 18e5
                },
                i = function() {
                    function t(e, n, i) {
                        ! function(e, n) {
                            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                        }(this), this.config = Object.assign({}, o, i), this.onFlush = e, this.lockImpl = r.lock, this.lastFlushedTimestamp = (new Date).getTime(), this.bufferName = "".concat("awsm-analytics-buffer", "-").concat(n), this.hasError = !1
                    }
                    return (e = [{
                        key: "append",
                        value: function(t) {
                            var e = (new Date).getTime();
                            try {
                                this.lockImpl(this.bufferName, this.appendToStorage.bind(this, {
                                    ts: e,
                                    body: t
                                }))
                            } catch (t) {
                                throw this.hasError = !0, t
                            }
                        }
                    }, {
                        key: "appendToStorage",
                        value: function(t) {
                            var e = this.getBuffer();
                            e.push(t), this.setBuffer(e)
                        }
                    }, {
                        key: "checkBufferStatus",
                        value: function() {
                            this.flushIfOverLimit(), window.setTimeout(this.flushIfOverLimit.bind(this), this.config.bufferFlushTime)
                        }
                    }, {
                        key: "flushIfOverLimit",
                        value: function() {
                            var t = this.getBuffer();
                            if (0 !== t.length) {
                                var e = t.length > this.config.bufferItemsSize;
                                ((new Date).getTime() >= this.lastFlushedTimestamp + this.config.bufferFlushTime || e) && this.flushBuffer()
                            }
                        }
                    }, {
                        key: "flushBuffer",
                        value: function() {
                            var t = this.getBuffer();
                            this.setBuffer([]), this.lastFlushedTimestamp = (new Date).getTime();
                            var e = this.getValidRequestBodies(t);
                            this.onFlush(e)
                        }
                    }, {
                        key: "getValidRequestBodies",
                        value: function(t) {
                            var e = this;
                            return t.filter((function(t) {
                                if (!t.ts || "number" != typeof t.ts) return !1;
                                var n = (new Date).getTime() - t.ts;
                                return 0 <= n && n < e.config.bufferDataMaxAge
                            })).map((function(t) {
                                return t.body
                            }))
                        }
                    }, {
                        key: "getBuffer",
                        value: function() {
                            var t, e = [];
                            try {
                                t = window.localStorage.getItem(this.bufferName)
                            } catch (t) {
                                this.hasError = !0
                            }
                            if (!t) return e;
                            try {
                                e = JSON.parse(t)
                            } catch (t) {
                                this.setBuffer(e)
                            }
                            return e
                        }
                    }, {
                        key: "setBuffer",
                        value: function(t) {
                            var e = JSON.stringify(t);
                            try {
                                window.localStorage.setItem(this.bufferName, e)
                            } catch (t) {
                                this.hasError = !0
                            }
                        }
                    }]) && function(t, e) {
                        for (var n = 0; n < e.length; n++) {
                            var r = e[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                        }
                    }(t.prototype, e), t;
                    var e
                }();
            n.d(e, "default", (function() {
                return a
            }));
            var a = function() {
                function t(e, n, r) {
                    ! function(e, n) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this), this.buffer = new i(e, n, r), this.buffer.flushBuffer()
                }
                return (e = [{
                    key: "hasErrorInBuffer",
                    value: function() {
                        return this.buffer.hasError
                    }
                }, {
                    key: "bufferMetrics",
                    value: function(t) {
                        this.buffer.append(t), this.buffer.checkBufferStatus()
                    }
                }]) && function(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                    }
                }(t.prototype, e), t;
                var e
            }()
        }])
    }, function(t, e, n) {
        "use strict";
        n(27).polyfill()
    }, function(t, e, n) {
        "use strict";

        function r(t, e) {
            if (null == t) throw new TypeError("Cannot convert first argument to object");
            for (var n = Object(t), r = 1; r < arguments.length; r++) {
                var o = arguments[r];
                if (null != o)
                    for (var i = Object.keys(Object(o)), a = 0, u = i.length; a < u; a++) {
                        var c = i[a],
                            s = Object.getOwnPropertyDescriptor(o, c);
                        void 0 !== s && s.enumerable && (n[c] = o[c])
                    }
            }
            return n
        }
        t.exports = {
            assign: r,
            polyfill: function() {
                Object.assign || Object.defineProperty(Object, "assign", {
                    enumerable: !1,
                    configurable: !0,
                    writable: !0,
                    value: r
                })
            }
        }
    }, function(t, e, n) {
        "use strict";
        n(29)() || Object.defineProperty(n(30), "Map", {
            value: n(31),
            configurable: !0,
            enumerable: !1,
            writable: !0
        })
    }, function(t, e, n) {
        "use strict";
        t.exports = function() {
            var t, e;
            if ("function" != typeof Map) return !1;
            try {
                t = new Map([
                    ["raz", "one"],
                    ["dwa", "two"],
                    ["trzy", "three"]
                ])
            } catch (t) {
                return !1
            }
            return "[object Map]" === String(t) && (3 === t.size && ("function" == typeof t.clear && ("function" == typeof t.delete && ("function" == typeof t.entries && ("function" == typeof t.forEach && ("function" == typeof t.get && ("function" == typeof t.has && ("function" == typeof t.keys && ("function" == typeof t.set && ("function" == typeof t.values && (!1 === (e = t.entries().next()).done && (!!e.value && ("raz" === e.value[0] && "one" === e.value[1])))))))))))))
        }
    }, function(t, e) {
        var n = function() {
            if ("object" == typeof self && self) return self;
            if ("object" == typeof window && window) return window;
            throw new Error("Unable to resolve global `this`")
        };
        t.exports = function() {
            if (this) return this;
            if ("object" == typeof globalThis && globalThis) return globalThis;
            try {
                Object.defineProperty(Object.prototype, "__global__", {
                    get: function() {
                        return this
                    },
                    configurable: !0
                })
            } catch (t) {
                return n()
            }
            try {
                return __global__ || n()
            } finally {
                delete Object.prototype.__global__
            }
        }()
    }, function(t, e, n) {
        "use strict";
        var r, o = n(14),
            i = n(33),
            a = n(7),
            u = n(3),
            c = n(1),
            s = n(0),
            f = n(52),
            l = n(2),
            p = n(22),
            h = n(62),
            y = n(80),
            d = n(83),
            v = Function.prototype.call,
            b = Object.defineProperties,
            _ = Object.getPrototypeOf;
        t.exports = r = function() {
            var t, e, n, o = arguments[0];
            if (!(this instanceof r)) throw new TypeError("Constructor requires 'new'");
            return n = d && a && Map !== r ? a(new Map, _(this)) : this, null != o && p(o), b(n, {
                __mapKeysData__: s("c", t = []),
                __mapValuesData__: s("c", e = [])
            }), o ? (h(o, (function(n) {
                var r = c(n)[0];
                n = n[1], -1 === i.call(t, r) && (t.push(r), e.push(n))
            }), n), n) : n
        }, d && (a && a(r, Map), r.prototype = Object.create(Map.prototype, {
            constructor: s(r)
        })), f(b(r.prototype, {
            clear: s((function() {
                this.__mapKeysData__.length && (o.call(this.__mapKeysData__), o.call(this.__mapValuesData__), this.emit("_clear"))
            })),
            delete: s((function(t) {
                var e = i.call(this.__mapKeysData__, t);
                return -1 !== e && (this.__mapKeysData__.splice(e, 1), this.__mapValuesData__.splice(e, 1), this.emit("_delete", e, t), !0)
            })),
            entries: s((function() {
                return new y(this, "key+value")
            })),
            forEach: s((function(t) {
                var e, n, r = arguments[1];
                for (u(t), n = (e = this.entries())._next(); void 0 !== n;) v.call(t, r, this.__mapValuesData__[n], this.__mapKeysData__[n], this), n = e._next()
            })),
            get: s((function(t) {
                var e = i.call(this.__mapKeysData__, t);
                if (-1 !== e) return this.__mapValuesData__[e]
            })),
            has: s((function(t) {
                return -1 !== i.call(this.__mapKeysData__, t)
            })),
            keys: s((function() {
                return new y(this, "key")
            })),
            set: s((function(t, e) {
                var n, r = i.call(this.__mapKeysData__, t);
                return -1 === r && (r = this.__mapKeysData__.push(t) - 1, n = !0), this.__mapValuesData__[r] = e, n && this.emit("_add", r, t), this
            })),
            size: s.gs((function() {
                return this.__mapKeysData__.length
            })),
            values: s((function() {
                return new y(this, "value")
            })),
            toString: s((function() {
                return "[object Map]"
            }))
        })), Object.defineProperty(r.prototype, l.iterator, s((function() {
            return this.entries()
        }))), Object.defineProperty(r.prototype, l.toStringTag, s("c", "Map"))
    }, function(t, e, n) {
        "use strict";
        t.exports = function() {}
    }, function(t, e, n) {
        "use strict";
        var r = n(34),
            o = n(15),
            i = n(1),
            a = Array.prototype.indexOf,
            u = Object.prototype.hasOwnProperty,
            c = Math.abs,
            s = Math.floor;
        t.exports = function(t) {
            var e, n, f, l;
            if (!r(t)) return a.apply(this, arguments);
            for (n = o(i(this).length), f = arguments[1], e = f = isNaN(f) ? 0 : f >= 0 ? s(f) : o(this.length) - s(c(f)); e < n; ++e)
                if (u.call(this, e) && (l = this[e], r(l))) return e;
            return -1
        }
    }, function(t, e, n) {
        "use strict";
        t.exports = n(35)() ? Number.isNaN : n(36)
    }, function(t, e, n) {
        "use strict";
        t.exports = function() {
            var t = Number.isNaN;
            return "function" == typeof t && (!t({}) && t(NaN) && !t(34))
        }
    }, function(t, e, n) {
        "use strict";
        t.exports = function(t) {
            return t != t
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(38),
            o = Math.abs,
            i = Math.floor;
        t.exports = function(t) {
            return isNaN(t) ? 0 : 0 !== (t = Number(t)) && isFinite(t) ? r(t) * i(o(t)) : t
        }
    }, function(t, e, n) {
        "use strict";
        t.exports = n(39)() ? Math.sign : n(40)
    }, function(t, e, n) {
        "use strict";
        t.exports = function() {
            var t = Math.sign;
            return "function" == typeof t && (1 === t(10) && -1 === t(-20))
        }
    }, function(t, e, n) {
        "use strict";
        t.exports = function(t) {
            return t = Number(t), isNaN(t) || 0 === t ? t : t > 0 ? 1 : -1
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(4),
            o = {
                function: !0,
                object: !0
            };
        t.exports = function(t) {
            return r(t) && o[typeof t] || !1
        }
    }, function(t, e, n) {
        "use strict";
        var r, o, i, a, u = Object.create;
        n(16)() || (r = n(17)), t.exports = r ? 1 !== r.level ? u : (o = {}, i = {}, a = {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: void 0
        }, Object.getOwnPropertyNames(Object.prototype).forEach((function(t) {
            i[t] = "__proto__" !== t ? a : {
                configurable: !0,
                enumerable: !1,
                writable: !0,
                value: void 0
            }
        })), Object.defineProperties(o, i), Object.defineProperty(r, "nullPolyfill", {
            configurable: !1,
            enumerable: !1,
            writable: !1,
            value: o
        }), function(t, e) {
            return u(null === t ? o : t, e)
        }) : u
    }, function(t, e, n) {
        "use strict";
        var r = n(44);
        t.exports = function(t) {
            if ("function" != typeof t) return !1;
            if (!hasOwnProperty.call(t, "length")) return !1;
            try {
                if ("number" != typeof t.length) return !1;
                if ("function" != typeof t.call) return !1;
                if ("function" != typeof t.apply) return !1
            } catch (t) {
                return !1
            }
            return !r(t)
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(11);
        t.exports = function(t) {
            if (!r(t)) return !1;
            try {
                return !!t.constructor && t.constructor.prototype === t
            } catch (t) {
                return !1
            }
        }
    }, function(t, e, n) {
        "use strict";
        t.exports = function() {
            var t, e = Object.assign;
            return "function" == typeof e && (e(t = {
                foo: "raz"
            }, {
                bar: "dwa"
            }, {
                trzy: "trzy"
            }), t.foo + t.bar + t.trzy === "razdwatrzy")
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(47),
            o = n(1),
            i = Math.max;
        t.exports = function(t, e) {
            var n, a, u, c = i(arguments.length, 2);
            for (t = Object(o(t)), u = function(r) {
                    try {
                        t[r] = e[r]
                    } catch (t) {
                        n || (n = t)
                    }
                }, a = 1; a < c; ++a) e = arguments[a], r(e).forEach(u);
            if (void 0 !== n) throw n;
            return t
        }
    }, function(t, e, n) {
        "use strict";
        t.exports = n(48)() ? Object.keys : n(49)
    }, function(t, e, n) {
        "use strict";
        t.exports = function() {
            try {
                return Object.keys("primitive"), !0
            } catch (t) {
                return !1
            }
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(4),
            o = Object.keys;
        t.exports = function(t) {
            return o(r(t) ? Object(t) : t)
        }
    }, function(t, e, n) {
        "use strict";
        var r = "razdwatrzy";
        t.exports = function() {
            return "function" == typeof r.contains && (!0 === r.contains("dwa") && !1 === r.contains("foo"))
        }
    }, function(t, e, n) {
        "use strict";
        var r = String.prototype.indexOf;
        t.exports = function(t) {
            return r.call(this, t, arguments[1]) > -1
        }
    }, function(t, e, n) {
        "use strict";
        var r, o, i, a, u, c, s, f = n(0),
            l = n(3),
            p = Function.prototype.apply,
            h = Function.prototype.call,
            y = Object.create,
            d = Object.defineProperty,
            v = Object.defineProperties,
            b = Object.prototype.hasOwnProperty,
            _ = {
                configurable: !0,
                enumerable: !1,
                writable: !0
            };
        o = function(t, e) {
            var n, o;
            return l(e), o = this, r.call(this, t, n = function() {
                i.call(o, t, n), p.call(e, this, arguments)
            }), n.__eeOnceListener__ = e, this
        }, u = {
            on: r = function(t, e) {
                var n;
                return l(e), b.call(this, "__ee__") ? n = this.__ee__ : (n = _.value = y(null), d(this, "__ee__", _), _.value = null), n[t] ? "object" == typeof n[t] ? n[t].push(e) : n[t] = [n[t], e] : n[t] = e, this
            },
            once: o,
            off: i = function(t, e) {
                var n, r, o, i;
                if (l(e), !b.call(this, "__ee__")) return this;
                if (!(n = this.__ee__)[t]) return this;
                if ("object" == typeof(r = n[t]))
                    for (i = 0; o = r[i]; ++i) o !== e && o.__eeOnceListener__ !== e || (2 === r.length ? n[t] = r[i ? 0 : 1] : r.splice(i, 1));
                else r !== e && r.__eeOnceListener__ !== e || delete n[t];
                return this
            },
            emit: a = function(t) {
                var e, n, r, o, i;
                if (b.call(this, "__ee__") && (o = this.__ee__[t]))
                    if ("object" == typeof o) {
                        for (n = arguments.length, i = new Array(n - 1), e = 1; e < n; ++e) i[e - 1] = arguments[e];
                        for (o = o.slice(), e = 0; r = o[e]; ++e) p.call(r, this, i)
                    } else switch (arguments.length) {
                        case 1:
                            h.call(o, this);
                            break;
                        case 2:
                            h.call(o, this, arguments[1]);
                            break;
                        case 3:
                            h.call(o, this, arguments[1], arguments[2]);
                            break;
                        default:
                            for (n = arguments.length, i = new Array(n - 1), e = 1; e < n; ++e) i[e - 1] = arguments[e];
                            p.call(o, this, i)
                    }
            }
        }, c = {
            on: f(r),
            once: f(o),
            off: f(i),
            emit: f(a)
        }, s = v({}, c), t.exports = e = function(t) {
            return null == t ? y(s) : v(Object(t), c)
        }, e.methods = u
    }, function(t, e, n) {
        "use strict";
        var r = n(8),
            o = {
                object: !0,
                symbol: !0
            };
        t.exports = function() {
            var t, e = r.Symbol;
            if ("function" != typeof e) return !1;
            t = e("test symbol");
            try {
                String(t)
            } catch (t) {
                return !1
            }
            return !!o[typeof e.iterator] && (!!o[typeof e.toPrimitive] && !!o[typeof e.toStringTag])
        }
    }, function(t, e, n) {
        "use strict";
        t.exports = function() {
            return "object" == typeof globalThis && (!!globalThis && globalThis.Array === Array)
        }
    }, function(t, e) {
        var n = function() {
            if ("object" == typeof self && self) return self;
            if ("object" == typeof window && window) return window;
            throw new Error("Unable to resolve global `this`")
        };
        t.exports = function() {
            if (this) return this;
            try {
                Object.defineProperty(Object.prototype, "__global__", {
                    get: function() {
                        return this
                    },
                    configurable: !0
                })
            } catch (t) {
                return n()
            }
            try {
                return __global__ || n()
            } finally {
                delete Object.prototype.__global__
            }
        }()
    }, function(t, e, n) {
        "use strict";
        var r, o, i, a = n(0),
            u = n(21),
            c = n(8).Symbol,
            s = n(58),
            f = n(59),
            l = n(60),
            p = Object.create,
            h = Object.defineProperties,
            y = Object.defineProperty;
        if ("function" == typeof c) try {
            String(c()), i = !0
        } catch (t) {} else c = null;
        o = function(t) {
            if (this instanceof o) throw new TypeError("Symbol is not a constructor");
            return r(t)
        }, t.exports = r = function t(e) {
            var n;
            if (this instanceof t) throw new TypeError("Symbol is not a constructor");
            return i ? c(e) : (n = p(o.prototype), e = void 0 === e ? "" : String(e), h(n, {
                __description__: a("", e),
                __name__: a("", s(e))
            }))
        }, f(r), l(r), h(o.prototype, {
            constructor: a(r),
            toString: a("", (function() {
                return this.__name__
            }))
        }), h(r.prototype, {
            toString: a((function() {
                return "Symbol (" + u(this).__description__ + ")"
            })),
            valueOf: a((function() {
                return u(this)
            }))
        }), y(r.prototype, r.toPrimitive, a("", (function() {
            var t = u(this);
            return "symbol" == typeof t ? t : t.toString()
        }))), y(r.prototype, r.toStringTag, a("c", "Symbol")), y(o.prototype, r.toStringTag, a("c", r.prototype[r.toStringTag])), y(o.prototype, r.toPrimitive, a("c", r.prototype[r.toPrimitive]))
    }, function(t, e, n) {
        "use strict";
        t.exports = function(t) {
            return !!t && ("symbol" == typeof t || !!t.constructor && ("Symbol" === t.constructor.name && "Symbol" === t[t.constructor.toStringTag]))
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(0),
            o = Object.create,
            i = Object.defineProperty,
            a = Object.prototype,
            u = o(null);
        t.exports = function(t) {
            for (var e, n, o = 0; u[t + (o || "")];) ++o;
            return u[t += o || ""] = !0, i(a, e = "@@" + t, r.gs(null, (function(t) {
                n || (n = !0, i(this, e, r(t)), n = !1)
            }))), e
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(0),
            o = n(8).Symbol;
        t.exports = function(t) {
            return Object.defineProperties(t, {
                hasInstance: r("", o && o.hasInstance || t("hasInstance")),
                isConcatSpreadable: r("", o && o.isConcatSpreadable || t("isConcatSpreadable")),
                iterator: r("", o && o.iterator || t("iterator")),
                match: r("", o && o.match || t("match")),
                replace: r("", o && o.replace || t("replace")),
                search: r("", o && o.search || t("search")),
                species: r("", o && o.species || t("species")),
                split: r("", o && o.split || t("split")),
                toPrimitive: r("", o && o.toPrimitive || t("toPrimitive")),
                toStringTag: r("", o && o.toStringTag || t("toStringTag")),
                unscopables: r("", o && o.unscopables || t("unscopables"))
            })
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(0),
            o = n(21),
            i = Object.create(null);
        t.exports = function(t) {
            return Object.defineProperties(t, {
                for: r((function(e) {
                    return i[e] ? i[e] : i[e] = t(String(e))
                })),
                keyFor: r((function(t) {
                    var e;
                    for (e in o(t), i)
                        if (i[e] === t) return e
                }))
            })
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(9),
            o = n(4),
            i = n(10),
            a = n(2).iterator,
            u = Array.isArray;
        t.exports = function(t) {
            return !!o(t) && (!!u(t) || (!!i(t) || (!!r(t) || "function" == typeof t[a])))
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(9),
            o = n(3),
            i = n(10),
            a = n(63),
            u = Array.isArray,
            c = Function.prototype.call,
            s = Array.prototype.some;
        t.exports = function(t, e) {
            var n, f, l, p, h, y, d, v, b = arguments[2];
            if (u(t) || r(t) ? n = "array" : i(t) ? n = "string" : t = a(t), o(e), l = function() {
                    p = !0
                }, "array" !== n)
                if ("string" !== n)
                    for (f = t.next(); !f.done;) {
                        if (c.call(e, b, f.value, l), p) return;
                        f = t.next()
                    } else
                        for (y = t.length, h = 0; h < y && (d = t[h], h + 1 < y && (v = d.charCodeAt(0)) >= 55296 && v <= 56319 && (d += t[++h]), c.call(e, b, d, l), !p); ++h);
                else s.call(t, (function(t) {
                    return c.call(e, b, t, l), p
                }))
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(9),
            o = n(10),
            i = n(64),
            a = n(79),
            u = n(22),
            c = n(2).iterator;
        t.exports = function(t) {
            return "function" == typeof u(t)[c] ? t[c]() : r(t) ? new i(t) : o(t) ? new a(t) : new i(t)
        }
    }, function(t, e, n) {
        "use strict";
        var r, o = n(7),
            i = n(20),
            a = n(0),
            u = n(2),
            c = n(13),
            s = Object.defineProperty;
        r = t.exports = function(t, e) {
            if (!(this instanceof r)) throw new TypeError("Constructor requires 'new'");
            c.call(this, t), e = e ? i.call(e, "key+value") ? "key+value" : i.call(e, "key") ? "key" : "value" : "value", s(this, "__kind__", a("", e))
        }, o && o(r, c), delete r.prototype.constructor, r.prototype = Object.create(c.prototype, {
            _resolve: a((function(t) {
                return "value" === this.__kind__ ? this.__list__[t] : "key+value" === this.__kind__ ? [t, this.__list__[t]] : t
            }))
        }), s(r.prototype, u.toStringTag, a("c", "Array Iterator"))
    }, function(t, e, n) {
        "use strict";
        var r, o = n(5),
            i = n(66),
            a = n(70),
            u = n(71),
            c = n(19),
            s = n(76),
            f = Function.prototype.bind,
            l = Object.defineProperty,
            p = Object.prototype.hasOwnProperty;
        r = function(t, e, n) {
            var r, o = i(e) && a(e.value);
            return delete(r = u(e)).writable, delete r.value, r.get = function() {
                return !n.overwriteDefinition && p.call(this, t) ? o : (e.value = f.call(o, n.resolveContext ? n.resolveContext(this) : this), l(this, t, e), this[t])
            }, r
        }, t.exports = function(t) {
            var e = c(arguments[1]);
            return o(e.resolveContext) && a(e.resolveContext), s(t, (function(t, n) {
                return r(n, t, e)
            }))
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(23),
            o = n(5);
        t.exports = function(t) {
            return o(t) ? t : r(t, "Cannot use %v", arguments[1])
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(5),
            o = n(11),
            i = Object.prototype.toString;
        t.exports = function(t) {
            if (!r(t)) return null;
            if (o(t)) {
                var e = t.toString;
                if ("function" != typeof e) return null;
                if (e === i) return null
            }
            try {
                return "" + t
            } catch (t) {
                return null
            }
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(69),
            o = /[\n\r\u2028\u2029]/g;
        t.exports = function(t) {
            var e = r(t);
            return null === e ? "<Non-coercible to string value>" : (e.length > 100 && (e = e.slice(0, 99) + "…"), e = e.replace(o, (function(t) {
                switch (t) {
                    case "\n":
                        return "\\n";
                    case "\r":
                        return "\\r";
                    case "\u2028":
                        return "\\u2028";
                    case "\u2029":
                        return "\\u2029";
                    default:
                        throw new Error("Unexpected character")
                }
            })))
        }
    }, function(t, e, n) {
        "use strict";
        t.exports = function(t) {
            try {
                return t.toString()
            } catch (e) {
                try {
                    return String(t)
                } catch (t) {
                    return null
                }
            }
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(23),
            o = n(18);
        t.exports = function(t) {
            return o(t) ? t : r(t, "%v is not a plain function", arguments[1])
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(72),
            o = n(12),
            i = n(1);
        t.exports = function(t) {
            var e = Object(i(t)),
                n = arguments[1],
                a = Object(arguments[2]);
            if (e !== t && !n) return e;
            var u = {};
            return n ? r(n, (function(e) {
                (a.ensure || e in t) && (u[e] = t[e])
            })) : o(u, t), u
        }
    }, function(t, e, n) {
        "use strict";
        t.exports = n(73)() ? Array.from : n(74)
    }, function(t, e, n) {
        "use strict";
        t.exports = function() {
            var t, e, n = Array.from;
            return "function" == typeof n && (e = n(t = ["raz", "dwa"]), Boolean(e && e !== t && "dwa" === e[1]))
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(2).iterator,
            o = n(9),
            i = n(75),
            a = n(15),
            u = n(3),
            c = n(1),
            s = n(4),
            f = n(10),
            l = Array.isArray,
            p = Function.prototype.call,
            h = {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                value: null
            },
            y = Object.defineProperty;
        t.exports = function(t) {
            var e, n, d, v, b, _, g, m, w, O, j = arguments[1],
                x = arguments[2];
            if (t = Object(c(t)), s(j) && u(j), this && this !== Array && i(this)) e = this;
            else {
                if (!j) {
                    if (o(t)) return 1 !== (b = t.length) ? Array.apply(null, t) : ((v = new Array(1))[0] = t[0], v);
                    if (l(t)) {
                        for (v = new Array(b = t.length), n = 0; n < b; ++n) v[n] = t[n];
                        return v
                    }
                }
                v = []
            }
            if (!l(t))
                if (void 0 !== (w = t[r])) {
                    for (g = u(w).call(t), e && (v = new e), m = g.next(), n = 0; !m.done;) O = j ? p.call(j, x, m.value, n) : m.value, e ? (h.value = O, y(v, n, h)) : v[n] = O, m = g.next(), ++n;
                    b = n
                } else if (f(t)) {
                for (b = t.length, e && (v = new e), n = 0, d = 0; n < b; ++n) O = t[n], n + 1 < b && (_ = O.charCodeAt(0)) >= 55296 && _ <= 56319 && (O += t[++n]), O = j ? p.call(j, x, O, d) : O, e ? (h.value = O, y(v, d, h)) : v[d] = O, ++d;
                b = d
            }
            if (void 0 === b)
                for (b = a(t.length), e && (v = new e(b)), n = 0; n < b; ++n) O = j ? p.call(j, x, t[n], n) : t[n], e ? (h.value = O, y(v, n, h)) : v[n] = O;
            return e && (h.value = null, v.length = b), v
        }
    }, function(t, e, n) {
        "use strict";
        var r = Object.prototype.toString,
            o = RegExp.prototype.test.bind(/^[object [A-Za-z0-9]*Function]$/);
        t.exports = function(t) {
            return "function" == typeof t && o(r.call(t))
        }
    }, function(t, e, n) {
        "use strict";
        var r = n(3),
            o = n(77),
            i = Function.prototype.call;
        t.exports = function(t, e) {
            var n = {},
                a = arguments[2];
            return r(e), o(t, (function(t, r, o, u) {
                n[r] = i.call(e, a, t, r, o, u)
            })), n
        }
    }, function(t, e, n) {
        "use strict";
        t.exports = n(78)("forEach")
    }, function(t, e, n) {
        "use strict";
        var r = n(3),
            o = n(1),
            i = Function.prototype.bind,
            a = Function.prototype.call,
            u = Object.keys,
            c = Object.prototype.propertyIsEnumerable;
        t.exports = function(t, e) {
            return function(n, s) {
                var f, l = arguments[2],
                    p = arguments[3];
                return n = Object(o(n)), r(s), f = u(n), p && f.sort("function" == typeof p ? i.call(p, n) : void 0), "function" != typeof t && (t = f[t]), a.call(t, f, (function(t, r) {
                    return c.call(n, t) ? a.call(s, l, n[t], t, n, r) : e
                }))
            }
        }
    }, function(t, e, n) {
        "use strict";
        var r, o = n(7),
            i = n(0),
            a = n(2),
            u = n(13),
            c = Object.defineProperty;
        r = t.exports = function(t) {
            if (!(this instanceof r)) throw new TypeError("Constructor requires 'new'");
            t = String(t), u.call(this, t), c(this, "__length__", i("", t.length))
        }, o && o(r, u), delete r.prototype.constructor, r.prototype = Object.create(u.prototype, {
            _next: i((function() {
                if (this.__list__) return this.__nextIndex__ < this.__length__ ? this.__nextIndex__++ : void this._unBind()
            })),
            _resolve: i((function(t) {
                var e, n = this.__list__[t];
                return this.__nextIndex__ === this.__length__ ? n : (e = n.charCodeAt(0)) >= 55296 && e <= 56319 ? n + this.__list__[this.__nextIndex__++] : n
            }))
        }), c(r.prototype, a.toStringTag, i("c", "String Iterator"))
    }, function(t, e, n) {
        "use strict";
        var r, o = n(7),
            i = n(0),
            a = n(13),
            u = n(2).toStringTag,
            c = n(81),
            s = Object.defineProperties,
            f = a.prototype._unBind;
        r = t.exports = function(t, e) {
            if (!(this instanceof r)) return new r(t, e);
            a.call(this, t.__mapKeysData__, t), e && c[e] || (e = "key+value"), s(this, {
                __kind__: i("", e),
                __values__: i("w", t.__mapValuesData__)
            })
        }, o && o(r, a), r.prototype = Object.create(a.prototype, {
            constructor: i(r),
            _resolve: i((function(t) {
                return "value" === this.__kind__ ? this.__values__[t] : "key" === this.__kind__ ? this.__list__[t] : [this.__list__[t], this.__values__[t]]
            })),
            _unBind: i((function() {
                this.__values__ = null, f.call(this)
            })),
            toString: i((function() {
                return "[object Map Iterator]"
            }))
        }), Object.defineProperty(r.prototype, u, i("c", "Map Iterator"))
    }, function(t, e, n) {
        "use strict";
        t.exports = n(82)("key", "value", "key+value")
    }, function(t, e, n) {
        "use strict";
        var r = Array.prototype.forEach,
            o = Object.create;
        t.exports = function(t) {
            var e = o(null);
            return r.call(arguments, (function(t) {
                e[t] = !0
            })), e
        }
    }, function(t, e, n) {
        "use strict";
        t.exports = "undefined" != typeof Map && "[object Map]" === Object.prototype.toString.call(new Map)
    }, function(t, e, n) {
        "use strict";
        n.r(e), n.d(e, "AWSMarketingTargetServiceAnalyticsEventDispatcher", (function() {
            return U
        })), n.d(e, "default", (function() {
            return F
        }));
        n(26), n(28);
        var r = n(6),
            o = n(24),
            i = n.n(o),
            a = "awsm_tsa_metric_published",
            u = "awsm_tsa_put_metric",
            c = "awsm_ts_request_success";

        function s(t, e) {
            for (var n = 0; n < e.length; n++) {
                var r = e[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
            }
        }
        var f = function() {
            function t() {
                ! function(t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, t)
            }
            var e, n, r;
            return e = t, (n = [{
                key: "dispatchEvent",
                value: function(t) {
                    var e = {
                            detail: t,
                            bubbles: !0,
                            cancelable: !1
                        },
                        n = new window.CustomEvent(a, e);
                    window.dispatchEvent(n)
                }
            }]) && s(e.prototype, n), r && s(e, r), t
        }();

        function l(t) {
            return (l = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                return typeof t
            } : function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            })(t)
        }
        var p, h, y = {
                "awsm-analytics-buffer-target-service-analytics": {
                    category: "functional"
                },
                "awsm-analytics-buffer-target-service-analytics__MUTEX_x": {
                    category: "functional"
                }
            },
            d = Object.keys(y),
            v = (h = 1, function(t) {
                if (Array.isArray(t)) return t
            }(p = d) || function(t, e) {
                if (Symbol.iterator in Object(t) || "[object Arguments]" === Object.prototype.toString.call(t)) {
                    var n = [],
                        r = !0,
                        o = !1,
                        i = void 0;
                    try {
                        for (var a, u = t[Symbol.iterator](); !(r = (a = u.next()).done) && (n.push(a.value), !e || n.length !== e); r = !0);
                    } catch (t) {
                        o = !0, i = t
                    } finally {
                        try {
                            r || null == u.return || u.return()
                        } finally {
                            if (o) throw i
                        }
                    }
                    return n
                }
            }(p, h) || function() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance")
            }())[0],
            b = function() {
                try {
                    var t = function() {
                        var t, e = window.AWSC || window.top.AWSC,
                            n = window.AWS;
                        if (e && "object" === l(e.Shortbread)) t = e.Shortbread;
                        else {
                            if (!n || "object" !== l(n.Shortbread)) return !1;
                            t = n.Shortbread
                        }
                        var r = {
                            hasConsoleNavFooter: !0,
                            registry: y
                        };
                        return "function" == typeof t.getShortbreadInstance && t.getShortbreadInstance(r)
                    }();
                    return !!t && t.hasConsent(v)
                } catch (t) {
                    return !1
                }
            },
            _ = n(25),
            g = n.n(_);

        function m(t, e) {
            for (var n = 0; n < e.length; n++) {
                var r = e[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
            }
        }
        var w = function() {
                function t(e) {
                    ! function(t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }(this, t), this.sendMetricsToCSDSClient = function(t) {
                        var n = new r.LogDataV2Request;
                        n.addData(t), e.logDataV2(n)
                    };
                    this.sendMetricsThroughBuffer = this.isLocalStorageSupported() && !1, this.sendMetricsThroughBuffer && (this.analyticsClientBuffer = new g.a(this.sendMetricsToCSDSClient.bind(e), "target-service-analytics"))
                }
                var e, n, o;
                return e = t, (n = [{
                    key: "isLocalStorageSupported",
                    value: function() {
                        try {
                            return "localStorage" in window && null !== window.localStorage
                        } catch (t) {
                            return !1
                        }
                    }
                }, {
                    key: "sendMetrics",
                    value: function(t) {
                        if (b() && this.analyticsClientBuffer && !this.analyticsClientBuffer.hasErrorInBuffer()) try {
                            this.analyticsClientBuffer.bufferMetrics(t)
                        } catch (e) {
                            this.sendMetricsToCSDSClient([t])
                        } else this.sendMetricsToCSDSClient([t])
                    }
                }]) && m(e.prototype, n), o && m(e, o), t
            }(),
            O = "click",
            j = "impression",
            x = "dismiss";

        function S(t, e) {
            for (var n = 0; n < e.length; n++) {
                var r = e[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
            }
        }
        var k = function() {
            function t(e, n, r, o) {
                ! function(t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, t), this.metricsCollector = e, this.eventDispatcher = n, this.customerData = r, this.slotDiscoveryAttribute = o, this.targetServiceContentsRegistry = {}
            }
            var e, n, r;
            return e = t, (n = [{
                key: "registerTargetServiceContents",
                value: function(t) {
                    this.targetServiceContentsRegistry = new Map(t)
                }
            }, {
                key: "sendMetrics",
                value: function(t, e) {
                    var n = this.createMetricBody(t, e);
                    switch (t) {
                        case O:
                            this.metricsCollector.sendMetrics(n);
                            break;
                        case j:
                        case x:
                            this.metricsCollector.sendMetrics(n), this.eventDispatcher.dispatchEvent(n)
                    }
                }
            }, {
                key: "createMetricBody",
                value: function(t, e) {
                    var n = e.getBoundingClientRect(),
                        r = e.getAttribute(this.slotDiscoveryAttribute),
                        o = {};
                    if (this.targetServiceContentsRegistry.get(r)) {
                        var i = this.targetServiceContentsRegistry.get(r);
                        i && (o = i.metadata) && (o.slotId = r)
                    }
                    var a = {
                            metricName: t,
                            locationX: "".concat(n.left),
                            locationY: "".concat(n.top),
                            clientTimestamp: (new Date).toISOString(),
                            pageURL: document.URL,
                            namespace: "target-service"
                        },
                        u = this.getCTAUrl(e);
                    return u && (a.ctaURL = u), Object.assign({}, a, this.customerData, o)
                }
            }, {
                key: "getCTAUrl",
                value: function(t) {
                    var e = t.querySelector("a");
                    return e ? e.getAttribute("href") : t.dataset && t.dataset.ctaUrl ? t.dataset.ctaUrl : void 0
                }
            }]) && S(e.prototype, n), r && S(e, r), t
        }();

        function E(t) {
            return function(t) {
                if (Array.isArray(t)) {
                    for (var e = 0, n = new Array(t.length); e < t.length; e++) n[e] = t[e];
                    return n
                }
            }(t) || function(t) {
                if (Symbol.iterator in Object(t) || "[object Arguments]" === Object.prototype.toString.call(t)) return Array.from(t)
            }(t) || function() {
                throw new TypeError("Invalid attempt to spread non-iterable instance")
            }()
        }

        function T(t, e) {
            return function(t) {
                if (Array.isArray(t)) return t
            }(t) || function(t, e) {
                if (!(Symbol.iterator in Object(t) || "[object Arguments]" === Object.prototype.toString.call(t))) return;
                var n = [],
                    r = !0,
                    o = !1,
                    i = void 0;
                try {
                    for (var a, u = t[Symbol.iterator](); !(r = (a = u.next()).done) && (n.push(a.value), !e || n.length !== e); r = !0);
                } catch (t) {
                    o = !0, i = t
                } finally {
                    try {
                        r || null == u.return || u.return()
                    } finally {
                        if (o) throw i
                    }
                }
                return n
            }(t, e) || function() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance")
            }()
        }

        function C(t) {
            return (C = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                return typeof t
            } : function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            })(t)
        }

        function P(t, e) {
            var n = Object.keys(t);
            if (Object.getOwnPropertySymbols) {
                var r = Object.getOwnPropertySymbols(t);
                e && (r = r.filter((function(e) {
                    return Object.getOwnPropertyDescriptor(t, e).enumerable
                }))), n.push.apply(n, r)
            }
            return n
        }

        function A(t) {
            for (var e = 1; e < arguments.length; e++) {
                var n = null != arguments[e] ? arguments[e] : {};
                e % 2 ? P(Object(n), !0).forEach((function(e) {
                    M(t, e, n[e])
                })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : P(Object(n)).forEach((function(e) {
                    Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e))
                }))
            }
            return t
        }

        function M(t, e, n) {
            return e in t ? Object.defineProperty(t, e, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : t[e] = n, t
        }

        function D(t, e) {
            for (var n = 0; n < e.length; n++) {
                var r = e[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
            }
        }
        var I = !0,
            R = new Map,
            N = [],
            B = {
                click: {
                    oncePerContainer: !1,
                    trackNewWindowLinksOnly: !0
                },
                impression: {
                    oncePerContainer: !0,
                    impressionTime: 1e3
                }
            },
            L = {
                customerData: {},
                events: B,
                slotDiscoveryAttribute: "data-slot-id"
            },
            F = function() {
                function t(e) {
                    var n = this;
                    ! function(t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }(this, t);
                    var o = e ? [B, e.events].reduce(this.mergeEventConfig.bind(this), {}) : B;
                    this.config = Object.assign({}, L, A(A({}, e), {}, {
                        events: o
                    }));
                    var a = new r.AWSMarketingClientSideDataServiceClientConfig(this.config.environment),
                        u = new r.AWSMarketingClientSideDataServiceClient(a),
                        c = new w(u),
                        s = new f;
                    this.notificationManager = new k(c, s, this.config.customerData, this.config.slotDiscoveryAttribute), this.analyticsClient = new i.a(this.notificationManager), this.discoveredSlotIdNodeMap = new Map, this.mutationObserver = new MutationObserver((function() {
                        return n.handleMutation()
                    }))
                }
                var e, n, o;
                return e = t, (n = [{
                    key: "mergeEventConfig",
                    value: function(t, e) {
                        var n = this;
                        return "object" !== C(e) || Object.entries(e).forEach((function(e) {
                            var r = T(e, 2),
                                o = r[0],
                                i = r[1];
                            i && "object" === C(i) ? n.mergeEventConfig(t[o] = t[o] || {}, i) : t[o] = i
                        })), t
                    }
                }, {
                    key: "restartTracking",
                    value: function() {
                        this.discoveredSlotIdNodeMap = new Map
                    }
                }, {
                    key: "startTracking",
                    value: function() {
                        window.addEventListener(c, this.handleTargetServiceSuccessEvent.bind(this)), window.addEventListener(u, this.handlePutMetricEvent.bind(this))
                    }
                }, {
                    key: "handleTargetServiceSuccessEvent",
                    value: function(t) {
                        this.updateSlotIdsToDiscover(t.detail.contents), this.hasDiscoveredAllSlots(N) || (this.doSlotDiscovery(), this.observeMutation())
                    }
                }, {
                    key: "updateSlotIdsToDiscover",
                    value: function(t) {
                        t && (Object.keys(t).forEach((function(e) {
                            return R.set(e, t[e])
                        })), N = E(R.keys()))
                    }
                }, {
                    key: "doSlotDiscovery",
                    value: function() {
                        this.trackDiscoveredContents(N, R);
                        var t = setInterval(function() {
                            this.hasDiscoveredAllSlots(N) ? clearInterval(t) : this.trackDiscoveredContents(N, R)
                        }.bind(this), 200);
                        setTimeout((function() {
                            return clearInterval(t)
                        }), 1e3)
                    }
                }, {
                    key: "observeMutation",
                    value: function() {
                        this.mutationObserver.observe(document, {
                            childList: !0,
                            subtree: !0
                        })
                    }
                }, {
                    key: "handleMutation",
                    value: function() {
                        var t = this;
                        I && (I = !1, setTimeout((function(e, n) {
                            I = !0, t.trackDiscoveredContents(e, n)
                        }), 200, N, R))
                    }
                }, {
                    key: "hasDiscoveredAllSlots",
                    value: function(t) {
                        var e = this;
                        return t.every((function(t) {
                            e.discoveredSlotIdNodeMap.has(t)
                        }))
                    }
                }, {
                    key: "trackDiscoveredContents",
                    value: function(t, e) {
                        var n = this,
                            r = [];
                        t.forEach((function(t) {
                            var e = document.querySelector("*[".concat(n.config.slotDiscoveryAttribute, "='").concat(t, "']")),
                                o = n.slotIdNotAlreadyDiscovered(t) || n.slotNodeIsNotSameAsPreviouslyDiscovered(t, e);
                            e && o && (n.discoveredSlotIdNodeMap.set(t, e), r.push(e))
                        })), r.length > 0 && (this.notificationManager.registerTargetServiceContents(e), this.analyticsClient.track(r, this.config.events))
                    }
                }, {
                    key: "slotIdNotAlreadyDiscovered",
                    value: function(t) {
                        return !this.discoveredSlotIdNodeMap.has(t)
                    }
                }, {
                    key: "slotNodeIsNotSameAsPreviouslyDiscovered",
                    value: function(t, e) {
                        return !!e && this.discoveredSlotIdNodeMap.get(t) && this.discoveredSlotIdNodeMap.get(t) !== e
                    }
                }, {
                    key: "handlePutMetricEvent",
                    value: function(t) {
                        var e = t.detail;
                        e && this.notificationManager.sendMetrics(e.eventType, e.container)
                    }
                }]) && D(e.prototype, n), o && D(e, o), t
            }();

        function q(t, e) {
            for (var n = 0; n < e.length; n++) {
                var r = e[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
            }
        }
        var U = function() {
            function t() {
                ! function(t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, t)
            }
            var e, n, r;
            return e = t, r = [{
                key: "dispatchClick",
                value: function(e) {
                    t.dispatch(u, O, e)
                }
            }, {
                key: "dispatchDismiss",
                value: function(e) {
                    t.dispatch(u, x, e)
                }
            }, {
                key: "dispatch",
                value: function(t, e, n) {
                    if (t && e && n) {
                        var r = new window.CustomEvent(t, {
                            detail: {
                                eventType: e,
                                container: n
                            }
                        });
                        window.dispatchEvent(r)
                    }
                }
            }], (n = null) && q(e.prototype, n), r && q(e, r), t
        }()
    }])
}));