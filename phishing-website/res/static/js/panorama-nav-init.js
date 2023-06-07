/* @version: 2.8.16 */ ! function() {
    function e(e) {
        return e && e.__esModule ? e.default : e
    }
    var n = {};

    function a(e, n) {
        var a = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var t = Object.getOwnPropertySymbols(e);
            n && (t = t.filter((function(n) {
                return Object.getOwnPropertyDescriptor(e, n).enumerable
            }))), a.push.apply(a, t)
        }
        return a
    }

    function t(t) {
        for (var o = arguments, r = function(r) {
                var c = null != o[r] ? o[r] : {};
                r % 2 ? a(Object(c), !0).forEach((function(a) {
                    e(n)(t, a, c[a])
                })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(c)) : a(Object(c)).forEach((function(e) {
                    Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(c, e))
                }))
            }, c = 1; c < arguments.length; c++) r(c);
        return t
    }(n = function(e, n, a) {
        return n in e ? Object.defineProperty(e, n, {
            value: a,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[n] = a, e
    }).__esModule = !0, n.default = n, window.AWSPanorama || (window.AWSPanorama = {}), AWSPanorama.Init = function() {
        var e = "panorama",
            n = {
                cookieDomain: "aws.amazon.com",
                pluginsEnabledByDefault: !0,
                modality: "web"
            },
            a = [],
            o = ["home", "ec2", "cloud9"],
            r = window.location.hostname.includes("aws.amazon.com") && !window.location.hostname.includes("alpha-docs-aws.amazon.com"),
            c = window,
            i = function() {
                c.AWSC && c.AWSC.Clog && c.AWSC.Clog.log && (i = c.AWSC.Clog.log)
            };
        if (!c.disablePanorama) {
            var s, l, u, d, f, p, m = !(!c.ConsoleNavService && null === M("awsc-mezz"));
            if (m) {
                if (c.ConsoleNavService && c.ConsoleNavService.Model) {
                    var b = M("awsc-mezz-region"),
                        w = M("awsc-mezz-service"),
                        v = c.ConsoleNavService.Model.currentRegionId || b || "us-east-1",
                        g = c.ConsoleNavService.Model.currentService.id || w;
                    if ("aws" !== (l = "aws", u = "aws-us-gov", d = "aws-iso", f = "aws-iso-b", p = "aws-cn", (s = v).startsWith("us-gov-") ? u : s.startsWith("us-iso-") ? d : s.startsWith("us-isob-") ? f : s.startsWith("cn-") ? p : l) || a.indexOf(g) >= 0 || c.callPhantom) return;
                    var y = {
                        appEntity: "aws-console",
                        console: !0,
                        region: v,
                        service: g,
                        trackerConstants: n
                    };
                    B(v, c, document, "script", q(g, !0), e, null, null, y)
                }
            } else try {
                var h, O = document.getElementById("awsc-panorama-bundle"),
                    S = ["aws-signin"],
                    C = "canary" === function(e) {
                        try {
                            var n = document.cookie.split("; ").find((function(n) {
                                return n.split("=")[0] === e
                            }));
                            return n ? n.split("=")[1] : ""
                        } catch (e) {
                            return ""
                        }
                    }("metrics-req-cat");
                if (O && O.hasAttribute("data-config")) {
                    var E, P = O.getAttribute("data-config");
                    try {
                        E = JSON.parse(P)
                    } catch (e) {
                        P = P.replace(/'/g, '"'), E = JSON.parse(P)
                    }
                    var j = E.appEntity ? E.appEntity : "",
                        N = E.service ? E.service : "",
                        A = E.region ? E.region : "",
                        W = E.flags ? E.flags : {},
                        k = function(e) {
                            try {
                                return r && !S.includes(e) && !C
                            } catch (e) {
                                return !0
                            }
                        }(j) ? .1 : 1;
                    if (!N || !A || !j || a.indexOf(N) >= 0) return void console.warn("Panorama could not be loaded. This could be due to incorrect configuration or because the service is denylisted.");
                    if (Math.random() > k) return;
                    h = {
                        appEntity: E.appEntity,
                        console: !1,
                        region: E.region,
                        service: E.service,
                        trackerConstants: t(t({}, n), {}, {
                            flags: W
                        })
                    }
                }
                var z = {
                    appEntity: "aws-nonconsole",
                    console: !1,
                    region: "us-west-1",
                    service: "non-console",
                    trackerConstants: n
                };
                B(A || z.region, c, document, "script", q(N || z.service, !1), e, null, null, h || z)
            } catch (e) {
                console.warn("Panorama:", e)
            }
        }

        function q(e, n) {
            try {
                if (o.indexOf(e) >= 0) return "https://a.b.cdn.console.awsstatic.com/297884d5f379cc5a59342d2cdfaeaaff65a91b121ca3f20a76e5a2deb3e2c4da/6470d10d11544184b03755dfa3f7c03cbaaf5281011441cead2724fffdfe2e4a.js";
                var a = document.getElementById("awsc-panorama-bundle").getAttribute("data-url");
                return n ? a : a || "https://a.b.cdn.console.awsstatic.com/51e01ab47c657258cd787045e5127706b60e031c2e4e9f43ce80c0e594476fd6/f63832cc412e4ab182f3460afbe2db460f86d54793464b608e495f8231198f84.js"
            } catch (e) {
                console.warn("Panorama: No tracker URL found.")
            }
        }

        function D(e) {
            try {
                var n = document.createEvent("CustomEvent");
                n.initCustomEvent("onPanoramaLoad", !0, !0, {
                    enabled: e
                }), c.dispatchEvent(n), e || (c.panorama = function() {
                    console.warn("Panorama is not enabled; events will not be emitted.")
                }, c.panorama.enabled = !1, m && (c.AWSC.Clog.bufferedQueue = []))
            } catch (e) {
                i("dispatchPanoramaLoadError", 1)
            }
        }

        function M(e) {
            try {
                return document.head.querySelector("meta[name='" + e + "']").getAttribute("content")
            } catch (e) {
                return null
            }
        }

        function B(e, n, a, t, o, r, i, s, l) {
            n[r] && !n[r].enabled || (n.GlobalSnowplowNamespace = n.GlobalSnowplowNamespace || [], n.GlobalSnowplowNamespace.push(r), n[r] = function() {
                (n[r].q = n[r].q || []).push(arguments)
            }, n[r].q = n[r].q || [], n[r].trackCustomEvent = function() {
                [].unshift.call(arguments, "trackCustomEvent"), n[r].apply(this, arguments)
            }, n[r].loadTime = Date.now(), n[r].enabled = !0, i = a.createElement(t), s = a.getElementsByTagName(t)[0], i.onload = function() {
                n[r] && "function" == typeof n[r] && n[r]("openOutqueue"), D(!0)
            }, i.onerror = function() {
                D(!1)
            }, i.async = 1, i.src = o, s.parentNode.insertBefore(i, s)), c.panorama("newTracker", "cf", "https://" + e + ".prod.pr.analytics.console.aws.a2z.com", l)
        }
    }()
}();