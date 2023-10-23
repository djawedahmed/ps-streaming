!(function (e, t) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define([], t)
    : "object" == typeof exports
    ? (exports["epicgames-frontend"] = t())
    : (e["epicgames-frontend"] = t());
})(this, () =>
  (() => {
    "use strict";
    var e = {
        942: (e) => {
          const t = {
            generateIdentifier: function () {
              return Math.random().toString(36).substring(2, 12);
            },
          };
          (t.localCName = t.generateIdentifier()),
            (t.splitLines = function (e) {
              return e
                .trim()
                .split("\n")
                .map((e) => e.trim());
            }),
            (t.splitSections = function (e) {
              return e
                .split("\nm=")
                .map((e, t) => (t > 0 ? "m=" + e : e).trim() + "\r\n");
            }),
            (t.getDescription = function (e) {
              const n = t.splitSections(e);
              return n && n[0];
            }),
            (t.getMediaSections = function (e) {
              const n = t.splitSections(e);
              return n.shift(), n;
            }),
            (t.matchPrefix = function (e, n) {
              return t.splitLines(e).filter((e) => 0 === e.indexOf(n));
            }),
            (t.parseCandidate = function (e) {
              let t;
              t =
                0 === e.indexOf("a=candidate:")
                  ? e.substring(12).split(" ")
                  : e.substring(10).split(" ");
              const n = {
                foundation: t[0],
                component: { 1: "rtp", 2: "rtcp" }[t[1]] || t[1],
                protocol: t[2].toLowerCase(),
                priority: parseInt(t[3], 10),
                ip: t[4],
                address: t[4],
                port: parseInt(t[5], 10),
                type: t[7],
              };
              for (let e = 8; e < t.length; e += 2)
                switch (t[e]) {
                  case "raddr":
                    n.relatedAddress = t[e + 1];
                    break;
                  case "rport":
                    n.relatedPort = parseInt(t[e + 1], 10);
                    break;
                  case "tcptype":
                    n.tcpType = t[e + 1];
                    break;
                  case "ufrag":
                    (n.ufrag = t[e + 1]), (n.usernameFragment = t[e + 1]);
                    break;
                  default:
                    void 0 === n[t[e]] && (n[t[e]] = t[e + 1]);
                }
              return n;
            }),
            (t.writeCandidate = function (e) {
              const t = [];
              t.push(e.foundation);
              const n = e.component;
              "rtp" === n ? t.push(1) : "rtcp" === n ? t.push(2) : t.push(n),
                t.push(e.protocol.toUpperCase()),
                t.push(e.priority),
                t.push(e.address || e.ip),
                t.push(e.port);
              const s = e.type;
              return (
                t.push("typ"),
                t.push(s),
                "host" !== s &&
                  e.relatedAddress &&
                  e.relatedPort &&
                  (t.push("raddr"),
                  t.push(e.relatedAddress),
                  t.push("rport"),
                  t.push(e.relatedPort)),
                e.tcpType &&
                  "tcp" === e.protocol.toLowerCase() &&
                  (t.push("tcptype"), t.push(e.tcpType)),
                (e.usernameFragment || e.ufrag) &&
                  (t.push("ufrag"), t.push(e.usernameFragment || e.ufrag)),
                "candidate:" + t.join(" ")
              );
            }),
            (t.parseIceOptions = function (e) {
              return e.substring(14).split(" ");
            }),
            (t.parseRtpMap = function (e) {
              let t = e.substring(9).split(" ");
              const n = { payloadType: parseInt(t.shift(), 10) };
              return (
                (t = t[0].split("/")),
                (n.name = t[0]),
                (n.clockRate = parseInt(t[1], 10)),
                (n.channels = 3 === t.length ? parseInt(t[2], 10) : 1),
                (n.numChannels = n.channels),
                n
              );
            }),
            (t.writeRtpMap = function (e) {
              let t = e.payloadType;
              void 0 !== e.preferredPayloadType && (t = e.preferredPayloadType);
              const n = e.channels || e.numChannels || 1;
              return (
                "a=rtpmap:" +
                t +
                " " +
                e.name +
                "/" +
                e.clockRate +
                (1 !== n ? "/" + n : "") +
                "\r\n"
              );
            }),
            (t.parseExtmap = function (e) {
              const t = e.substring(9).split(" ");
              return {
                id: parseInt(t[0], 10),
                direction:
                  t[0].indexOf("/") > 0 ? t[0].split("/")[1] : "sendrecv",
                uri: t[1],
                attributes: t.slice(2).join(" "),
              };
            }),
            (t.writeExtmap = function (e) {
              return (
                "a=extmap:" +
                (e.id || e.preferredId) +
                (e.direction && "sendrecv" !== e.direction
                  ? "/" + e.direction
                  : "") +
                " " +
                e.uri +
                (e.attributes ? " " + e.attributes : "") +
                "\r\n"
              );
            }),
            (t.parseFmtp = function (e) {
              const t = {};
              let n;
              const s = e.substring(e.indexOf(" ") + 1).split(";");
              for (let e = 0; e < s.length; e++)
                (n = s[e].trim().split("=")), (t[n[0].trim()] = n[1]);
              return t;
            }),
            (t.writeFmtp = function (e) {
              let t = "",
                n = e.payloadType;
              if (
                (void 0 !== e.preferredPayloadType &&
                  (n = e.preferredPayloadType),
                e.parameters && Object.keys(e.parameters).length)
              ) {
                const s = [];
                Object.keys(e.parameters).forEach((t) => {
                  void 0 !== e.parameters[t]
                    ? s.push(t + "=" + e.parameters[t])
                    : s.push(t);
                }),
                  (t += "a=fmtp:" + n + " " + s.join(";") + "\r\n");
              }
              return t;
            }),
            (t.parseRtcpFb = function (e) {
              const t = e.substring(e.indexOf(" ") + 1).split(" ");
              return { type: t.shift(), parameter: t.join(" ") };
            }),
            (t.writeRtcpFb = function (e) {
              let t = "",
                n = e.payloadType;
              return (
                void 0 !== e.preferredPayloadType &&
                  (n = e.preferredPayloadType),
                e.rtcpFeedback &&
                  e.rtcpFeedback.length &&
                  e.rtcpFeedback.forEach((e) => {
                    t +=
                      "a=rtcp-fb:" +
                      n +
                      " " +
                      e.type +
                      (e.parameter && e.parameter.length
                        ? " " + e.parameter
                        : "") +
                      "\r\n";
                  }),
                t
              );
            }),
            (t.parseSsrcMedia = function (e) {
              const t = e.indexOf(" "),
                n = { ssrc: parseInt(e.substring(7, t), 10) },
                s = e.indexOf(":", t);
              return (
                s > -1
                  ? ((n.attribute = e.substring(t + 1, s)),
                    (n.value = e.substring(s + 1)))
                  : (n.attribute = e.substring(t + 1)),
                n
              );
            }),
            (t.parseSsrcGroup = function (e) {
              const t = e.substring(13).split(" ");
              return {
                semantics: t.shift(),
                ssrcs: t.map((e) => parseInt(e, 10)),
              };
            }),
            (t.getMid = function (e) {
              const n = t.matchPrefix(e, "a=mid:")[0];
              if (n) return n.substring(6);
            }),
            (t.parseFingerprint = function (e) {
              const t = e.substring(14).split(" ");
              return {
                algorithm: t[0].toLowerCase(),
                value: t[1].toUpperCase(),
              };
            }),
            (t.getDtlsParameters = function (e, n) {
              return {
                role: "auto",
                fingerprints: t
                  .matchPrefix(e + n, "a=fingerprint:")
                  .map(t.parseFingerprint),
              };
            }),
            (t.writeDtlsParameters = function (e, t) {
              let n = "a=setup:" + t + "\r\n";
              return (
                e.fingerprints.forEach((e) => {
                  n += "a=fingerprint:" + e.algorithm + " " + e.value + "\r\n";
                }),
                n
              );
            }),
            (t.parseCryptoLine = function (e) {
              const t = e.substring(9).split(" ");
              return {
                tag: parseInt(t[0], 10),
                cryptoSuite: t[1],
                keyParams: t[2],
                sessionParams: t.slice(3),
              };
            }),
            (t.writeCryptoLine = function (e) {
              return (
                "a=crypto:" +
                e.tag +
                " " +
                e.cryptoSuite +
                " " +
                ("object" == typeof e.keyParams
                  ? t.writeCryptoKeyParams(e.keyParams)
                  : e.keyParams) +
                (e.sessionParams ? " " + e.sessionParams.join(" ") : "") +
                "\r\n"
              );
            }),
            (t.parseCryptoKeyParams = function (e) {
              if (0 !== e.indexOf("inline:")) return null;
              const t = e.substring(7).split("|");
              return {
                keyMethod: "inline",
                keySalt: t[0],
                lifeTime: t[1],
                mkiValue: t[2] ? t[2].split(":")[0] : void 0,
                mkiLength: t[2] ? t[2].split(":")[1] : void 0,
              };
            }),
            (t.writeCryptoKeyParams = function (e) {
              return (
                e.keyMethod +
                ":" +
                e.keySalt +
                (e.lifeTime ? "|" + e.lifeTime : "") +
                (e.mkiValue && e.mkiLength
                  ? "|" + e.mkiValue + ":" + e.mkiLength
                  : "")
              );
            }),
            (t.getCryptoParameters = function (e, n) {
              return t.matchPrefix(e + n, "a=crypto:").map(t.parseCryptoLine);
            }),
            (t.getIceParameters = function (e, n) {
              const s = t.matchPrefix(e + n, "a=ice-ufrag:")[0],
                i = t.matchPrefix(e + n, "a=ice-pwd:")[0];
              return s && i
                ? {
                    usernameFragment: s.substring(12),
                    password: i.substring(10),
                  }
                : null;
            }),
            (t.writeIceParameters = function (e) {
              let t =
                "a=ice-ufrag:" +
                e.usernameFragment +
                "\r\na=ice-pwd:" +
                e.password +
                "\r\n";
              return e.iceLite && (t += "a=ice-lite\r\n"), t;
            }),
            (t.parseRtpParameters = function (e) {
              const n = {
                  codecs: [],
                  headerExtensions: [],
                  fecMechanisms: [],
                  rtcp: [],
                },
                s = t.splitLines(e)[0].split(" ");
              for (let i = 3; i < s.length; i++) {
                const r = s[i],
                  o = t.matchPrefix(e, "a=rtpmap:" + r + " ")[0];
                if (o) {
                  const s = t.parseRtpMap(o),
                    i = t.matchPrefix(e, "a=fmtp:" + r + " ");
                  switch (
                    ((s.parameters = i.length ? t.parseFmtp(i[0]) : {}),
                    (s.rtcpFeedback = t
                      .matchPrefix(e, "a=rtcp-fb:" + r + " ")
                      .map(t.parseRtcpFb)),
                    n.codecs.push(s),
                    s.name.toUpperCase())
                  ) {
                    case "RED":
                    case "ULPFEC":
                      n.fecMechanisms.push(s.name.toUpperCase());
                  }
                }
              }
              t.matchPrefix(e, "a=extmap:").forEach((e) => {
                n.headerExtensions.push(t.parseExtmap(e));
              });
              const i = t.matchPrefix(e, "a=rtcp-fb:* ").map(t.parseRtcpFb);
              return (
                n.codecs.forEach((e) => {
                  i.forEach((t) => {
                    e.rtcpFeedback.find(
                      (e) => e.type === t.type && e.parameter === t.parameter
                    ) || e.rtcpFeedback.push(t);
                  });
                }),
                n
              );
            }),
            (t.writeRtpDescription = function (e, n) {
              let s = "";
              (s += "m=" + e + " "),
                (s += n.codecs.length > 0 ? "9" : "0"),
                (s += " UDP/TLS/RTP/SAVPF "),
                (s +=
                  n.codecs
                    .map((e) =>
                      void 0 !== e.preferredPayloadType
                        ? e.preferredPayloadType
                        : e.payloadType
                    )
                    .join(" ") + "\r\n"),
                (s += "c=IN IP4 0.0.0.0\r\n"),
                (s += "a=rtcp:9 IN IP4 0.0.0.0\r\n"),
                n.codecs.forEach((e) => {
                  (s += t.writeRtpMap(e)),
                    (s += t.writeFmtp(e)),
                    (s += t.writeRtcpFb(e));
                });
              let i = 0;
              return (
                n.codecs.forEach((e) => {
                  e.maxptime > i && (i = e.maxptime);
                }),
                i > 0 && (s += "a=maxptime:" + i + "\r\n"),
                n.headerExtensions &&
                  n.headerExtensions.forEach((e) => {
                    s += t.writeExtmap(e);
                  }),
                s
              );
            }),
            (t.parseRtpEncodingParameters = function (e) {
              const n = [],
                s = t.parseRtpParameters(e),
                i = -1 !== s.fecMechanisms.indexOf("RED"),
                r = -1 !== s.fecMechanisms.indexOf("ULPFEC"),
                o = t
                  .matchPrefix(e, "a=ssrc:")
                  .map((e) => t.parseSsrcMedia(e))
                  .filter((e) => "cname" === e.attribute),
                a = o.length > 0 && o[0].ssrc;
              let l;
              const c = t.matchPrefix(e, "a=ssrc-group:FID").map((e) =>
                e
                  .substring(17)
                  .split(" ")
                  .map((e) => parseInt(e, 10))
              );
              c.length > 0 && c[0].length > 1 && c[0][0] === a && (l = c[0][1]),
                s.codecs.forEach((e) => {
                  if ("RTX" === e.name.toUpperCase() && e.parameters.apt) {
                    let t = {
                      ssrc: a,
                      codecPayloadType: parseInt(e.parameters.apt, 10),
                    };
                    a && l && (t.rtx = { ssrc: l }),
                      n.push(t),
                      i &&
                        ((t = JSON.parse(JSON.stringify(t))),
                        (t.fec = {
                          ssrc: a,
                          mechanism: r ? "red+ulpfec" : "red",
                        }),
                        n.push(t));
                  }
                }),
                0 === n.length && a && n.push({ ssrc: a });
              let d = t.matchPrefix(e, "b=");
              return (
                d.length &&
                  ((d =
                    0 === d[0].indexOf("b=TIAS:")
                      ? parseInt(d[0].substring(7), 10)
                      : 0 === d[0].indexOf("b=AS:")
                      ? 1e3 * parseInt(d[0].substring(5), 10) * 0.95 - 16e3
                      : void 0),
                  n.forEach((e) => {
                    e.maxBitrate = d;
                  })),
                n
              );
            }),
            (t.parseRtcpParameters = function (e) {
              const n = {},
                s = t
                  .matchPrefix(e, "a=ssrc:")
                  .map((e) => t.parseSsrcMedia(e))
                  .filter((e) => "cname" === e.attribute)[0];
              s && ((n.cname = s.value), (n.ssrc = s.ssrc));
              const i = t.matchPrefix(e, "a=rtcp-rsize");
              (n.reducedSize = i.length > 0), (n.compound = 0 === i.length);
              const r = t.matchPrefix(e, "a=rtcp-mux");
              return (n.mux = r.length > 0), n;
            }),
            (t.writeRtcpParameters = function (e) {
              let t = "";
              return (
                e.reducedSize && (t += "a=rtcp-rsize\r\n"),
                e.mux && (t += "a=rtcp-mux\r\n"),
                void 0 !== e.ssrc &&
                  e.cname &&
                  (t += "a=ssrc:" + e.ssrc + " cname:" + e.cname + "\r\n"),
                t
              );
            }),
            (t.parseMsid = function (e) {
              let n;
              const s = t.matchPrefix(e, "a=msid:");
              if (1 === s.length)
                return (
                  (n = s[0].substring(7).split(" ")),
                  { stream: n[0], track: n[1] }
                );
              const i = t
                .matchPrefix(e, "a=ssrc:")
                .map((e) => t.parseSsrcMedia(e))
                .filter((e) => "msid" === e.attribute);
              return i.length > 0
                ? ((n = i[0].value.split(" ")), { stream: n[0], track: n[1] })
                : void 0;
            }),
            (t.parseSctpDescription = function (e) {
              const n = t.parseMLine(e),
                s = t.matchPrefix(e, "a=max-message-size:");
              let i;
              s.length > 0 && (i = parseInt(s[0].substring(19), 10)),
                isNaN(i) && (i = 65536);
              const r = t.matchPrefix(e, "a=sctp-port:");
              if (r.length > 0)
                return {
                  port: parseInt(r[0].substring(12), 10),
                  protocol: n.fmt,
                  maxMessageSize: i,
                };
              const o = t.matchPrefix(e, "a=sctpmap:");
              if (o.length > 0) {
                const e = o[0].substring(10).split(" ");
                return {
                  port: parseInt(e[0], 10),
                  protocol: e[1],
                  maxMessageSize: i,
                };
              }
            }),
            (t.writeSctpDescription = function (e, t) {
              let n = [];
              return (
                (n =
                  "DTLS/SCTP" !== e.protocol
                    ? [
                        "m=" +
                          e.kind +
                          " 9 " +
                          e.protocol +
                          " " +
                          t.protocol +
                          "\r\n",
                        "c=IN IP4 0.0.0.0\r\n",
                        "a=sctp-port:" + t.port + "\r\n",
                      ]
                    : [
                        "m=" +
                          e.kind +
                          " 9 " +
                          e.protocol +
                          " " +
                          t.port +
                          "\r\n",
                        "c=IN IP4 0.0.0.0\r\n",
                        "a=sctpmap:" + t.port + " " + t.protocol + " 65535\r\n",
                      ]),
                void 0 !== t.maxMessageSize &&
                  n.push("a=max-message-size:" + t.maxMessageSize + "\r\n"),
                n.join("")
              );
            }),
            (t.generateSessionId = function () {
              return Math.random().toString().substr(2, 22);
            }),
            (t.writeSessionBoilerplate = function (e, n, s) {
              let i;
              const r = void 0 !== n ? n : 2;
              return (
                (i = e || t.generateSessionId()),
                "v=0\r\no=" +
                  (s || "thisisadapterortc") +
                  " " +
                  i +
                  " " +
                  r +
                  " IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n"
              );
            }),
            (t.getDirection = function (e, n) {
              const s = t.splitLines(e);
              for (let e = 0; e < s.length; e++)
                switch (s[e]) {
                  case "a=sendrecv":
                  case "a=sendonly":
                  case "a=recvonly":
                  case "a=inactive":
                    return s[e].substring(2);
                }
              return n ? t.getDirection(n) : "sendrecv";
            }),
            (t.getKind = function (e) {
              return t.splitLines(e)[0].split(" ")[0].substring(2);
            }),
            (t.isRejected = function (e) {
              return "0" === e.split(" ", 2)[1];
            }),
            (t.parseMLine = function (e) {
              const n = t.splitLines(e)[0].substring(2).split(" ");
              return {
                kind: n[0],
                port: parseInt(n[1], 10),
                protocol: n[2],
                fmt: n.slice(3).join(" "),
              };
            }),
            (t.parseOLine = function (e) {
              const n = t.matchPrefix(e, "o=")[0].substring(2).split(" ");
              return {
                username: n[0],
                sessionId: n[1],
                sessionVersion: parseInt(n[2], 10),
                netType: n[3],
                addressType: n[4],
                address: n[5],
              };
            }),
            (t.isValidSDP = function (e) {
              if ("string" != typeof e || 0 === e.length) return !1;
              const n = t.splitLines(e);
              for (let e = 0; e < n.length; e++)
                if (n[e].length < 2 || "=" !== n[e].charAt(1)) return !1;
              return !0;
            }),
            (e.exports = t);
        },
      },
      t = {};
    function n(s) {
      var i = t[s];
      if (void 0 !== i) return i.exports;
      var r = (t[s] = { exports: {} });
      return e[s](r, r.exports, n), r.exports;
    }
    (n.d = (e, t) => {
      for (var s in t)
        n.o(t, s) &&
          !n.o(e, s) &&
          Object.defineProperty(e, s, { enumerable: !0, get: t[s] });
    }),
      (n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
      (n.r = (e) => {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(e, "__esModule", { value: !0 });
      });
    var s = {};
    return (
      (() => {
        n.r(s), n.d(s, { PixelStreamingApplicationStyles: () => ti });
        var e,
          t,
          i,
          r = n(942),
          o = {
            d: (e, t) => {
              for (var n in t)
                o.o(t, n) &&
                  !o.o(e, n) &&
                  Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
            },
            o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
          },
          a = {};
        o.d(a, {
          Dz: () => ye,
          g$: () => I,
          Lt: () => A,
          Q9: () => O,
          qf: () => F,
          hV: () => Le,
          z$: () => Me,
          J0: () => xe,
          De: () => Se,
          $C: () => Ce,
          al: () => W,
          _W: () => V,
          tz: () => H,
          Nu: () => Te,
          zg: () => Ne,
          vp: () => ce,
          vU: () => de,
          wF: () => ee,
          rv: () => Ee,
          Nh: () => we,
          ss: () => ze,
          qW: () => ie,
          QL: () => se,
          cf: () => He,
          eM: () => Z,
          Yd: () => l,
          iM: () => C,
          qy: () => c,
          ce: () => y,
          sK: () => ue,
          Ok: () => ve,
          q5: () => Pe,
          g: () => wt,
          xl: () => J,
          I: () => Y,
          bx: () => $,
          Ib: () => M,
          Az: () => P,
          Iw: () => k,
          qY: () => L,
          db: () => R,
          mR: () => re,
          Tn: () => b,
          rV: () => te,
          gh: () => q,
          Mi: () => j,
          j: () => K,
          YB: () => X,
          i5: () => ne,
          x_: () => ge,
          Am: () => pt,
          eR: () => _,
          r8: () => Q,
          u3: () => Ge,
          vd: () => U,
          iV: () => B,
          jZ: () => z,
          SW: () => G,
          ZH: () => N,
          Ni: () => ft,
          lh: () => D,
          bq: () => E,
          $f: () => bt,
          eu: () => le,
          Ax: () => ae,
          Mc: () => oe,
        });
        class l {
          static GetStackTrace() {
            const e = new Error();
            let t = "No Stack Available for this browser";
            return e.stack && (t = e.stack.toString().replace(/Error/g, "")), t;
          }
          static SetLoggerVerbosity(e) {
            null != this.verboseLogLevel && (this.verboseLogLevel = e);
          }
          static Log(e, t, n) {
            if (n > this.verboseLogLevel) return;
            const s = `Level: Log\nMsg: ${t}\nCaller: ${e}`;
            console.log(s);
          }
          static Info(e, t, n) {
            if (n > this.verboseLogLevel) return;
            const s = `Level: Info\nMsg: ${t}`;
            console.info(s);
          }
          static Error(e, t) {
            const n = `Level: Error\nMsg: ${t}\nCaller: ${e}`;
            console.error(n);
          }
          static Warning(e, t) {
            const n = `Level: Warning\nCaller: ${e}\nMsg: ${t}`;
            console.warn(n);
          }
        }
        (l.verboseLogLevel = 5),
          ((i = e || (e = {})).LIST_STREAMERS = "listStreamers"),
          (i.SUBSCRIBE = "subscribe"),
          (i.UNSUBSCRIBE = "unsubscribe"),
          (i.ICE_CANDIDATE = "iceCandidate"),
          (i.OFFER = "offer"),
          (i.ANSWER = "answer"),
          (i.DATACHANNELREQUEST = "dataChannelRequest"),
          (i.SFURECVDATACHANNELREADY = "peerDataChannelsReady"),
          (i.PONG = "pong");
        class c {
          payload() {
            return (
              l.Log(
                l.GetStackTrace(),
                "Sending => \n" + JSON.stringify(this, void 0, 4),
                6
              ),
              JSON.stringify(this)
            );
          }
        }
        class d extends c {
          constructor() {
            super(), (this.type = e.LIST_STREAMERS);
          }
        }
        class h extends c {
          constructor(t) {
            super(), (this.type = e.SUBSCRIBE), (this.streamerId = t);
          }
        }
        class u extends c {
          constructor() {
            super(), (this.type = e.UNSUBSCRIBE);
          }
        }
        class m extends c {
          constructor(t) {
            super(), (this.type = e.PONG), (this.time = t);
          }
        }
        class g extends c {
          constructor(t) {
            super(),
              (this.type = e.OFFER),
              t && ((this.type = t.type), (this.sdp = t.sdp));
          }
        }
        class p extends c {
          constructor(t) {
            super(),
              (this.type = e.ANSWER),
              t && ((this.type = t.type), (this.sdp = t.sdp));
          }
        }
        class v extends c {
          constructor() {
            super(), (this.type = e.DATACHANNELREQUEST);
          }
        }
        class f extends c {
          constructor() {
            super(), (this.type = e.SFURECVDATACHANNELREADY);
          }
        }
        class S {
          constructor(t) {
            (this.type = e.ICE_CANDIDATE), (this.candidate = t);
          }
          payload() {
            return (
              l.Log(
                l.GetStackTrace(),
                "Sending => \n" + JSON.stringify(this, void 0, 4),
                6
              ),
              JSON.stringify(this)
            );
          }
        }
        !(function (e) {
          (e.CONFIG = "config"),
            (e.STREAMER_LIST = "streamerList"),
            (e.PLAYER_COUNT = "playerCount"),
            (e.OFFER = "offer"),
            (e.ANSWER = "answer"),
            (e.ICE_CANDIDATE = "iceCandidate"),
            (e.PEER_DATA_CHANNELS = "peerDataChannels"),
            (e.PING = "ping"),
            (e.WARNING = "warning");
        })(t || (t = {}));
        class C {}
        class y extends C {}
        class b {
          constructor() {
            this.FromUEMessageHandlers = new Map();
          }
          addMessageHandler(e, t) {
            this.FromUEMessageHandlers.set(e, t);
          }
          handleMessage(e, t) {
            this.FromUEMessageHandlers.has(e)
              ? this.FromUEMessageHandlers.get(e)(t)
              : l.Error(
                  l.GetStackTrace(),
                  `Message type of ${e} does not have a message handler registered on the frontend - ignoring message.`
                );
          }
          static setupDefaultHandlers(e) {
            e.signallingProtocol.addMessageHandler(t.PING, (n) => {
              const s = new m(new Date().getTime()).payload();
              l.Log(l.GetStackTrace(), t.PING + ": " + n, 6),
                e.webSocket.send(s);
            }),
              e.signallingProtocol.addMessageHandler(t.CONFIG, (n) => {
                l.Log(l.GetStackTrace(), t.CONFIG, 6);
                const s = JSON.parse(n);
                e.onConfig(s);
              }),
              e.signallingProtocol.addMessageHandler(t.STREAMER_LIST, (n) => {
                l.Log(l.GetStackTrace(), t.STREAMER_LIST, 6);
                const s = JSON.parse(n);
                e.onStreamerList(s);
              }),
              e.signallingProtocol.addMessageHandler(t.PLAYER_COUNT, (e) => {
                l.Log(l.GetStackTrace(), t.PLAYER_COUNT, 6);
                const n = JSON.parse(e);
                l.Log(l.GetStackTrace(), "Player Count: " + n.count, 6);
              }),
              e.signallingProtocol.addMessageHandler(t.ANSWER, (n) => {
                l.Log(l.GetStackTrace(), t.ANSWER, 6);
                const s = JSON.parse(n);
                e.onWebRtcAnswer(s);
              }),
              e.signallingProtocol.addMessageHandler(t.OFFER, (n) => {
                l.Log(l.GetStackTrace(), t.OFFER, 6);
                const s = JSON.parse(n);
                e.onWebRtcOffer(s);
              }),
              e.signallingProtocol.addMessageHandler(t.ICE_CANDIDATE, (n) => {
                l.Log(l.GetStackTrace(), t.ICE_CANDIDATE, 6);
                const s = JSON.parse(n);
                e.onIceCandidate(s.candidate);
              }),
              e.signallingProtocol.addMessageHandler(t.WARNING, (e) => {
                l.Warning(l.GetStackTrace(), `Warning received: ${e}`);
              }),
              e.signallingProtocol.addMessageHandler(
                t.PEER_DATA_CHANNELS,
                (n) => {
                  l.Log(l.GetStackTrace(), t.PEER_DATA_CHANNELS, 6);
                  const s = JSON.parse(n);
                  e.onWebRtcPeerDataChannels(s);
                }
              );
          }
        }
        class E {
          constructor() {
            (this.WS_OPEN_STATE = 1),
              (this.onOpen = new EventTarget()),
              (this.onClose = new EventTarget()),
              (this.signallingProtocol = new b()),
              b.setupDefaultHandlers(this);
          }
          connect(e) {
            l.Log(l.GetStackTrace(), e, 6);
            try {
              return (
                (this.webSocket = new WebSocket(e)),
                (this.webSocket.onopen = (e) => this.handleOnOpen(e)),
                (this.webSocket.onerror = () => this.handleOnError()),
                (this.webSocket.onclose = (e) => this.handleOnClose(e)),
                (this.webSocket.onmessage = (e) => this.handleOnMessage(e)),
                (this.webSocket.onmessagebinary = (e) =>
                  this.handleOnMessageBinary(e)),
                !0
              );
            } catch (e) {
              return l.Error(e, e), !1;
            }
          }
          handleOnMessageBinary(e) {
            e &&
              e.data &&
              e.data
                .text()
                .then((e) => {
                  const t = new MessageEvent("messageFromBinary", { data: e });
                  this.handleOnMessage(t);
                })
                .catch((e) => {
                  l.Error(
                    l.GetStackTrace(),
                    `Failed to parse binary blob from websocket, reason: ${e}`
                  );
                });
          }
          handleOnMessage(e) {
            if (e.data && e.data instanceof Blob)
              return void this.handleOnMessageBinary(e);
            const t = JSON.parse(e.data);
            l.Log(
              l.GetStackTrace(),
              "received => \n" + JSON.stringify(JSON.parse(e.data), void 0, 4),
              6
            ),
              this.signallingProtocol.handleMessage(t.type, e.data);
          }
          handleOnOpen(e) {
            l.Log(
              l.GetStackTrace(),
              "Connected to the signalling server via WebSocket",
              6
            ),
              this.onOpen.dispatchEvent(new Event("open"));
          }
          handleOnError() {
            l.Error(l.GetStackTrace(), "WebSocket error");
          }
          handleOnClose(e) {
            this.onWebSocketOncloseOverlayMessage(e),
              l.Log(
                l.GetStackTrace(),
                "Disconnected to the signalling server via WebSocket: " +
                  JSON.stringify(e.code) +
                  " - " +
                  e.reason
              ),
              this.onClose.dispatchEvent(new Event("close"));
          }
          requestStreamerList() {
            const e = new d();
            this.webSocket.send(e.payload());
          }
          sendSubscribe(e) {
            const t = new h(e);
            this.webSocket.send(t.payload());
          }
          sendUnsubscribe() {
            const e = new u();
            this.webSocket.send(e.payload());
          }
          sendWebRtcOffer(e) {
            const t = new g(e);
            this.webSocket.send(t.payload());
          }
          sendWebRtcAnswer(e) {
            const t = new p(e);
            this.webSocket.send(t.payload());
          }
          sendWebRtcDatachannelRequest() {
            const e = new v();
            this.webSocket.send(e.payload());
          }
          sendSFURecvDataChannelReady() {
            const e = new f();
            this.webSocket.send(e.payload());
          }
          sendIceCandidate(e) {
            if (
              (l.Log(l.GetStackTrace(), "Sending Ice Candidate"),
              this.webSocket &&
                this.webSocket.readyState === this.WS_OPEN_STATE)
            ) {
              const t = new S(e);
              this.webSocket.send(t.payload());
            }
          }
          close() {
            var e;
            null === (e = this.webSocket) || void 0 === e || e.close();
          }
          onWebSocketOncloseOverlayMessage(e) {}
          onConfig(e) {}
          onStreamerList(e) {}
          onIceCandidate(e) {}
          onWebRtcAnswer(e) {}
          onWebRtcOffer(e) {}
          onWebRtcPeerDataChannels(e) {}
        }
        class w {
          constructor(e) {
            (this.videoElementProvider = e),
              (this.audioElement = document.createElement("Audio"));
          }
          handleOnTrack(e) {
            l.Log(
              l.GetStackTrace(),
              "handleOnTrack " + JSON.stringify(e.streams),
              6
            );
            const t = this.videoElementProvider.getVideoElement();
            if (
              (e.track &&
                l.Log(
                  l.GetStackTrace(),
                  "Got track - " +
                    e.track.kind +
                    " id=" +
                    e.track.id +
                    " readyState=" +
                    e.track.readyState,
                  6
                ),
              "audio" != e.track.kind)
            )
              return "video" == e.track.kind && t.srcObject !== e.streams[0]
                ? ((t.srcObject = e.streams[0]),
                  void l.Log(
                    l.GetStackTrace(),
                    "Set video source from video track ontrack."
                  ))
                : void 0;
            this.CreateAudioTrack(e.streams[0]);
          }
          CreateAudioTrack(e) {
            const t = this.videoElementProvider.getVideoElement();
            t.srcObject != e &&
              t.srcObject &&
              t.srcObject !== e &&
              ((this.audioElement.srcObject = e),
              l.Log(
                l.GetStackTrace(),
                "Created new audio element to play separate audio stream."
              ));
          }
        }
        class T {
          constructor(e) {
            (this.freezeFrameHeight = 0),
              (this.freezeFrameWidth = 0),
              (this.rootDiv = e),
              (this.rootElement = document.createElement("div")),
              (this.rootElement.id = "freezeFrame"),
              (this.rootElement.style.display = "none"),
              (this.rootElement.style.pointerEvents = "none"),
              (this.rootElement.style.position = "absolute"),
              (this.rootElement.style.zIndex = "20"),
              (this.imageElement = document.createElement("img")),
              (this.imageElement.style.position = "absolute"),
              this.rootElement.appendChild(this.imageElement),
              this.rootDiv.appendChild(this.rootElement);
          }
          setElementForShow() {
            this.rootElement.style.display = "block";
          }
          setElementForHide() {
            this.rootElement.style.display = "none";
          }
          updateImageElementSource(e) {
            const t = btoa(e.reduce((e, t) => e + String.fromCharCode(t), ""));
            this.imageElement.src = "data:image/jpeg;base64," + t;
          }
          setDimensionsFromElementAndResize() {
            (this.freezeFrameHeight = this.imageElement.naturalHeight),
              (this.freezeFrameWidth = this.imageElement.naturalWidth),
              this.resize();
          }
          resize() {
            if (0 !== this.freezeFrameWidth && 0 !== this.freezeFrameHeight) {
              let e = 0,
                t = 0,
                n = 0,
                s = 0;
              const i = this.rootDiv.clientWidth / this.rootDiv.clientHeight,
                r = this.freezeFrameWidth / this.freezeFrameHeight;
              i < r
                ? ((e = this.rootDiv.clientWidth),
                  (t = Math.floor(this.rootDiv.clientWidth / r)),
                  (n = Math.floor(0.5 * (this.rootDiv.clientHeight - t))),
                  (s = 0))
                : ((e = Math.floor(this.rootDiv.clientHeight * r)),
                  (t = this.rootDiv.clientHeight),
                  (n = 0),
                  (s = Math.floor(0.5 * (this.rootDiv.clientWidth - e)))),
                (this.rootElement.style.width =
                  this.rootDiv.offsetWidth + "px"),
                (this.rootElement.style.height =
                  this.rootDiv.offsetHeight + "px"),
                (this.rootElement.style.left = "0px"),
                (this.rootElement.style.top = "0px"),
                (this.imageElement.style.width = e + "px"),
                (this.imageElement.style.height = t + "px"),
                (this.imageElement.style.left = s + "px"),
                (this.imageElement.style.top = n + "px");
            }
          }
        }
        class x {
          constructor(e) {
            (this.receiving = !1),
              (this.size = 0),
              (this.jpeg = void 0),
              (this.valid = !1),
              (this.freezeFrameDelay = 50),
              (this.freezeFrame = new T(e));
          }
          showFreezeFrame() {
            this.valid && this.freezeFrame.setElementForShow();
          }
          hideFreezeFrame() {
            (this.valid = !1), this.freezeFrame.setElementForHide();
          }
          updateFreezeFrameAndShow(e, t) {
            this.freezeFrame.updateImageElementSource(e),
              (this.freezeFrame.imageElement.onload = () => {
                this.freezeFrame.setDimensionsFromElementAndResize(), t();
              });
          }
          processFreezeFrameMessage(e, t) {
            this.receiving ||
              ((this.receiving = !0),
              (this.valid = !1),
              (this.size = 0),
              (this.jpeg = void 0)),
              (this.size = new DataView(e.slice(1, 5).buffer).getInt32(0, !0));
            const n = e.slice(5);
            if (this.jpeg) {
              const e = new Uint8Array(this.jpeg.length + n.length);
              e.set(this.jpeg, 0), e.set(n, this.jpeg.length), (this.jpeg = e);
            } else
              (this.jpeg = n),
                (this.receiving = !0),
                l.Log(
                  l.GetStackTrace(),
                  `received first chunk of freeze frame: ${this.jpeg.length}/${this.size}`,
                  6
                );
            this.jpeg.length === this.size
              ? ((this.receiving = !1),
                (this.valid = !0),
                l.Log(
                  l.GetStackTrace(),
                  `received complete freeze frame ${this.size}`,
                  6
                ),
                this.updateFreezeFrameAndShow(this.jpeg, t))
              : this.jpeg.length > this.size &&
                (l.Error(
                  l.GetStackTrace(),
                  `received bigger freeze frame than advertised: ${this.jpeg.length}/${this.size}`
                ),
                (this.jpeg = void 0),
                (this.receiving = !1));
          }
        }
        class M {
          constructor(e, t, n, s, i = () => {}) {
            (this.onChange = i),
              (this.onChangeEmit = () => {}),
              (this.id = e),
              (this.description = n),
              (this.label = t),
              (this.value = s);
          }
          set label(e) {
            (this._label = e), this.onChangeEmit(this._value);
          }
          get label() {
            return this._label;
          }
          get value() {
            return this._value;
          }
          set value(e) {
            (this._value = e),
              this.onChange(this._value, this),
              this.onChangeEmit(this._value);
          }
        }
        class P extends M {
          constructor(e, t, n, s, i, r = () => {}) {
            super(e, t, n, s, r);
            const o = new URLSearchParams(window.location.search);
            if (i && o.has(this.id)) {
              const e = this.getUrlParamFlag();
              this.flag = e;
            } else this.flag = s;
            this.useUrlParams = i;
          }
          getUrlParamFlag() {
            const e = new URLSearchParams(window.location.search);
            return (
              !!e.has(this.id) &&
              "false" !== e.get(this.id) &&
              "False" !== e.get(this.id)
            );
          }
          updateURLParams() {
            if (this.useUrlParams) {
              const e = new URLSearchParams(window.location.search);
              !0 === this.flag
                ? e.set(this.id, "true")
                : e.set(this.id, "false"),
                window.history.replaceState(
                  {},
                  "",
                  "" !== e.toString()
                    ? `${location.pathname}?${e}`
                    : `${location.pathname}`
                );
            }
          }
          enable() {
            this.flag = !0;
          }
          get flag() {
            return !!this.value;
          }
          set flag(e) {
            this.value = e;
          }
        }
        class k extends M {
          constructor(e, t, n, s, i, r, o, a = () => {}) {
            super(e, t, n, r, a), (this._min = s), (this._max = i);
            const l = new URLSearchParams(window.location.search);
            if (o && l.has(this.id)) {
              const e = Number.parseInt(l.get(this.id));
              this.number = Number.isNaN(e) ? r : e;
            } else this.number = r;
            this.useUrlParams = o;
          }
          updateURLParams() {
            if (this.useUrlParams) {
              const e = new URLSearchParams(window.location.search);
              e.set(this.id, this.number.toString()),
                window.history.replaceState(
                  {},
                  "",
                  "" !== e.toString()
                    ? `${location.pathname}?${e}`
                    : `${location.pathname}`
                );
            }
          }
          set number(e) {
            this.value = this.clamp(e);
          }
          get number() {
            return this.value;
          }
          clamp(e) {
            return Math.max(Math.min(this._max, e), this._min);
          }
          get min() {
            return this._min;
          }
          get max() {
            return this._max;
          }
          addOnChangedListener(e) {
            this.onChange = e;
          }
        }
        class R extends M {
          constructor(e, t, n, s, i, r = () => {}) {
            super(e, t, n, s, r);
            const o = new URLSearchParams(window.location.search);
            if (i && o.has(this.id)) {
              const e = this.getUrlParamText();
              this.text = e;
            } else this.text = s;
            this.useUrlParams = i;
          }
          getUrlParamText() {
            var e;
            const t = new URLSearchParams(window.location.search);
            return t.has(this.id) &&
              null !== (e = t.get(this.id)) &&
              void 0 !== e
              ? e
              : "";
          }
          updateURLParams() {
            if (this.useUrlParams) {
              const e = new URLSearchParams(window.location.search);
              e.set(this.id, this.text),
                window.history.replaceState(
                  {},
                  "",
                  "" !== e.toString()
                    ? `${location.pathname}?${e}`
                    : `${location.pathname}`
                );
            }
          }
          get text() {
            return this.value;
          }
          set text(e) {
            this.value = e;
          }
        }
        class L extends M {
          constructor(e, t, n, s, i, r, o = () => {}) {
            super(e, t, n, [s, s], o), (this.options = i);
            const a = new URLSearchParams(window.location.search),
              l = r && a.has(this.id) ? this.getUrlParamText() : s;
            (this.selected = l), (this.useUrlParams = r);
          }
          getUrlParamText() {
            var e;
            const t = new URLSearchParams(window.location.search);
            return t.has(this.id) &&
              null !== (e = t.get(this.id)) &&
              void 0 !== e
              ? e
              : "";
          }
          updateURLParams() {
            if (this.useUrlParams) {
              const e = new URLSearchParams(window.location.search);
              e.set(this.id, this.selected),
                window.history.replaceState(
                  {},
                  "",
                  "" !== e.toString()
                    ? `${location.pathname}?${e}`
                    : `${location.pathname}`
                );
            }
          }
          addOnChangedListener(e) {
            this.onChange = e;
          }
          get options() {
            return this._options;
          }
          set options(e) {
            (this._options = e), this.onChangeEmit(this.selected);
          }
          get selected() {
            return this.value;
          }
          set selected(e) {
            const t = this.options.filter((t) => -1 !== t.indexOf(e));
            t.length && (this.value = t[0]);
          }
        }
        class A extends Event {
          constructor(e) {
            super("afkWarningActivate"), (this.data = e);
          }
        }
        class F extends Event {
          constructor(e) {
            super("afkWarningUpdate"), (this.data = e);
          }
        }
        class O extends Event {
          constructor() {
            super("afkWarningDeactivate");
          }
        }
        class I extends Event {
          constructor() {
            super("afkTimedOut");
          }
        }
        class _ extends Event {
          constructor(e) {
            super("videoEncoderAvgQP"), (this.data = e);
          }
        }
        class D extends Event {
          constructor() {
            super("webRtcSdp");
          }
        }
        class U extends Event {
          constructor() {
            super("webRtcAutoConnect");
          }
        }
        class z extends Event {
          constructor() {
            super("webRtcConnecting");
          }
        }
        class B extends Event {
          constructor() {
            super("webRtcConnected");
          }
        }
        class N extends Event {
          constructor() {
            super("webRtcFailed");
          }
        }
        class G extends Event {
          constructor(e) {
            super("webRtcDisconnected"), (this.data = e);
          }
        }
        class H extends Event {
          constructor(e) {
            super("dataChannelOpen"), (this.data = e);
          }
        }
        class W extends Event {
          constructor(e) {
            super("dataChannelClose"), (this.data = e);
          }
        }
        class V extends Event {
          constructor(e) {
            super("dataChannelError"), (this.data = e);
          }
        }
        class Q extends Event {
          constructor() {
            super("videoInitialized");
          }
        }
        class q extends Event {
          constructor() {
            super("streamLoading");
          }
        }
        class j extends Event {
          constructor() {
            super("streamConnect");
          }
        }
        class K extends Event {
          constructor() {
            super("streamDisconnect");
          }
        }
        class X extends Event {
          constructor() {
            super("streamReconnect");
          }
        }
        class J extends Event {
          constructor(e) {
            super("playStreamError"), (this.data = e);
          }
        }
        class Y extends Event {
          constructor() {
            super("playStream");
          }
        }
        class $ extends Event {
          constructor(e) {
            super("playStreamRejected"), (this.data = e);
          }
        }
        class Z extends Event {
          constructor(e) {
            super("loadFreezeFrame"), (this.data = e);
          }
        }
        class ee extends Event {
          constructor() {
            super("hideFreezeFrame");
          }
        }
        class te extends Event {
          constructor(e) {
            super("statsReceived"), (this.data = e);
          }
        }
        class ne extends Event {
          constructor(e) {
            super("streamerListMessage"), (this.data = e);
          }
        }
        class se extends Event {
          constructor(e) {
            super("latencyTestResult"), (this.data = e);
          }
        }
        class ie extends Event {
          constructor(e) {
            super("initialSettings"), (this.data = e);
          }
        }
        class re extends Event {
          constructor(e) {
            super("settingsChanged"), (this.data = e);
          }
        }
        class oe extends Event {
          constructor() {
            super("xrSessionStarted");
          }
        }
        class ae extends Event {
          constructor() {
            super("xrSessionEnded");
          }
        }
        class le extends Event {
          constructor(e) {
            super("xrFrame"), (this.data = e);
          }
        }
        class ce extends EventTarget {
          dispatchEvent(e) {
            return super.dispatchEvent(e);
          }
          addEventListener(e, t) {
            super.addEventListener(e, t);
          }
          removeEventListener(e, t) {
            super.removeEventListener(e, t);
          }
        }
        class de {}
        (de.AutoConnect = "AutoConnect"),
          (de.AutoPlayVideo = "AutoPlayVideo"),
          (de.AFKDetection = "TimeoutIfIdle"),
          (de.BrowserSendOffer = "OfferToReceive"),
          (de.HoveringMouseMode = "HoveringMouse"),
          (de.ForceMonoAudio = "ForceMonoAudio"),
          (de.ForceTURN = "ForceTURN"),
          (de.FakeMouseWithTouches = "FakeMouseWithTouches"),
          (de.IsQualityController = "ControlsQuality"),
          (de.MatchViewportResolution = "MatchViewportRes"),
          (de.PreferSFU = "preferSFU"),
          (de.StartVideoMuted = "StartVideoMuted"),
          (de.SuppressBrowserKeys = "SuppressBrowserKeys"),
          (de.UseMic = "UseMic"),
          (de.KeyboardInput = "KeyboardInput"),
          (de.MouseInput = "MouseInput"),
          (de.TouchInput = "TouchInput"),
          (de.GamepadInput = "GamepadInput"),
          (de.XRControllerInput = "XRControllerInput");
        const he = (e) =>
          Object.getOwnPropertyNames(de).some((t) => de[t] === e);
        class ue {}
        (ue.AFKTimeoutSecs = "AFKTimeout"),
          (ue.MinQP = "MinQP"),
          (ue.MaxQP = "MaxQP"),
          (ue.WebRTCFPS = "WebRTCFPS"),
          (ue.WebRTCMinBitrate = "WebRTCMinBitrate"),
          (ue.WebRTCMaxBitrate = "WebRTCMaxBitrate"),
          (ue.MaxReconnectAttempts = "MaxReconnectAttempts");
        const me = (e) =>
          Object.getOwnPropertyNames(ue).some((t) => ue[t] === e);
        class ge {}
        ge.SignallingServerUrl = "ss";
        const pe = (e) =>
          Object.getOwnPropertyNames(ge).some((t) => ge[t] === e);
        class ve {}
        (ve.PreferredCodec = "PreferredCodec"), (ve.StreamerId = "StreamerId");
        const fe = (e) =>
          Object.getOwnPropertyNames(ve).some((t) => ve[t] === e);
        class Se {
          constructor(e = {}) {
            (this.flags = new Map()),
              (this.numericParameters = new Map()),
              (this.textParameters = new Map()),
              (this.optionParameters = new Map());
            const { initialSettings: t, useUrlParams: n } = e;
            (this._useUrlParams = !!n),
              this.populateDefaultSettings(this._useUrlParams),
              t && this.setSettings(t);
          }
          get useUrlParams() {
            return this._useUrlParams;
          }
          populateDefaultSettings(e) {
            this.textParameters.set(
              ge.SignallingServerUrl,
              new R(
                ge.SignallingServerUrl,
                "Signalling url",
                "Url of the signalling server",
                ("https:" === location.protocol ? "wss://" : "ws://") +
                  window.location.hostname +
                  ("80" === window.location.port || "" === window.location.port
                    ? ""
                    : `:${window.location.port}`),
                e
              )
            ),
              this.optionParameters.set(
                ve.StreamerId,
                new L(
                  ve.StreamerId,
                  "Streamer ID",
                  "The ID of the streamer to stream.",
                  "",
                  [],
                  e
                )
              ),
              this.optionParameters.set(
                ve.PreferredCodec,
                new L(
                  ve.PreferredCodec,
                  "Preferred Codec",
                  "The preferred codec to be used during codec negotiation",
                  "H264 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f",
                  (function () {
                    const e = [];
                    if (!RTCRtpReceiver.getCapabilities)
                      return e.push("Only available on Chrome"), e;
                    const t = /(VP\d|H26\d|AV1).*/;
                    return (
                      RTCRtpReceiver.getCapabilities("video").codecs.forEach(
                        (n) => {
                          const s =
                            n.mimeType.split("/")[1] +
                            " " +
                            (n.sdpFmtpLine || "");
                          null !== t.exec(s) && e.push(s);
                        }
                      ),
                      e
                    );
                  })(),
                  e
                )
              ),
              this.flags.set(
                de.AutoConnect,
                new P(
                  de.AutoConnect,
                  "Auto connect to stream",
                  "Whether we should attempt to auto connect to the signalling server or show a click to start prompt.",
                  !1,
                  e
                )
              ),
              this.flags.set(
                de.AutoPlayVideo,
                new P(
                  de.AutoPlayVideo,
                  "Auto play video",
                  "When video is ready automatically start playing it as opposed to showing a play button.",
                  !0,
                  e
                )
              ),
              this.flags.set(
                de.BrowserSendOffer,
                new P(
                  de.BrowserSendOffer,
                  "Browser send offer",
                  "Browser will initiate the WebRTC handshake by sending the offer to the streamer",
                  !1,
                  e
                )
              ),
              this.flags.set(
                de.UseMic,
                new P(
                  de.UseMic,
                  "Use microphone",
                  "Make browser request microphone access and open an input audio track.",
                  !1,
                  e
                )
              ),
              this.flags.set(
                de.StartVideoMuted,
                new P(
                  de.StartVideoMuted,
                  "Start video muted",
                  "Video will start muted if true.",
                  !1,
                  e
                )
              ),
              this.flags.set(
                de.SuppressBrowserKeys,
                new P(
                  de.SuppressBrowserKeys,
                  "Suppress browser keys",
                  "Suppress certain browser keys that we use in UE, for example F5 to show shader complexity instead of refresh the page.",
                  !0,
                  e
                )
              ),
              this.flags.set(
                de.PreferSFU,
                new P(
                  de.PreferSFU,
                  "Prefer SFU",
                  "Try to connect to the SFU instead of P2P.",
                  !1,
                  e
                )
              ),
              this.flags.set(
                de.IsQualityController,
                new P(
                  de.IsQualityController,
                  "Is quality controller?",
                  "True if this peer controls stream quality",
                  !0,
                  e
                )
              ),
              this.flags.set(
                de.ForceMonoAudio,
                new P(
                  de.ForceMonoAudio,
                  "Force mono audio",
                  "Force browser to request mono audio in the SDP",
                  !1,
                  e
                )
              ),
              this.flags.set(
                de.ForceTURN,
                new P(
                  de.ForceTURN,
                  "Force TURN",
                  "Only generate TURN/Relayed ICE candidates.",
                  !1,
                  e
                )
              ),
              this.flags.set(
                de.AFKDetection,
                new P(
                  de.AFKDetection,
                  "AFK if idle",
                  "Timeout the experience if user is AFK for a period.",
                  !1,
                  e
                )
              ),
              this.flags.set(
                de.MatchViewportResolution,
                new P(
                  de.MatchViewportResolution,
                  "Match viewport resolution",
                  "Pixel Streaming will be instructed to dynamically resize the video stream to match the size of the video element.",
                  !1,
                  e
                )
              ),
              this.flags.set(
                de.HoveringMouseMode,
                new P(
                  de.HoveringMouseMode,
                  "Control Scheme: Locked Mouse",
                  "Either locked mouse, where the pointer is consumed by the video and locked to it, or hovering mouse, where the mouse is not consumed.",
                  !1,
                  e,
                  (e, t) => {
                    t.label = `Control Scheme: ${
                      e ? "Hovering" : "Locked"
                    } Mouse`;
                  }
                )
              ),
              this.flags.set(
                de.FakeMouseWithTouches,
                new P(
                  de.FakeMouseWithTouches,
                  "Fake mouse with touches",
                  "A single finger touch is converted into a mouse event. This allows a non-touch application to be controlled partially via a touch device.",
                  !1,
                  e
                )
              ),
              this.flags.set(
                de.KeyboardInput,
                new P(
                  de.KeyboardInput,
                  "Keyboard input",
                  "If enabled, send keyboard events to streamer",
                  !0,
                  e
                )
              ),
              this.flags.set(
                de.MouseInput,
                new P(
                  de.MouseInput,
                  "Mouse input",
                  "If enabled, send mouse events to streamer",
                  !0,
                  e
                )
              ),
              this.flags.set(
                de.TouchInput,
                new P(
                  de.TouchInput,
                  "Touch input",
                  "If enabled, send touch events to streamer",
                  !0,
                  e
                )
              ),
              this.flags.set(
                de.GamepadInput,
                new P(
                  de.GamepadInput,
                  "Gamepad input",
                  "If enabled, send gamepad events to streamer",
                  !0,
                  e
                )
              ),
              this.flags.set(
                de.XRControllerInput,
                new P(
                  de.XRControllerInput,
                  "XR controller input",
                  "If enabled, send XR controller events to streamer",
                  !0,
                  e
                )
              ),
              this.numericParameters.set(
                ue.AFKTimeoutSecs,
                new k(
                  ue.AFKTimeoutSecs,
                  "AFK timeout",
                  "The time (in seconds) it takes for the application to time out if AFK timeout is enabled.",
                  0,
                  600,
                  120,
                  e
                )
              ),
              this.numericParameters.set(
                ue.MaxReconnectAttempts,
                new k(
                  ue.MaxReconnectAttempts,
                  "Max Reconnects",
                  "Maximum number of reconnects the application will attempt when a streamer disconnects.",
                  0,
                  999,
                  3,
                  e
                )
              ),
              this.numericParameters.set(
                ue.MinQP,
                new k(
                  ue.MinQP,
                  "Min QP",
                  "The lower bound for the quantization parameter (QP) of the encoder. 0 = Best quality, 51 = worst quality.",
                  0,
                  51,
                  0,
                  e
                )
              ),
              this.numericParameters.set(
                ue.MaxQP,
                new k(
                  ue.MaxQP,
                  "Max QP",
                  "The upper bound for the quantization parameter (QP) of the encoder. 0 = Best quality, 51 = worst quality.",
                  0,
                  51,
                  51,
                  e
                )
              ),
              this.numericParameters.set(
                ue.WebRTCFPS,
                new k(
                  ue.WebRTCFPS,
                  "Max FPS",
                  "The maximum FPS that WebRTC will try to transmit frames at.",
                  1,
                  999,
                  60,
                  e
                )
              ),
              this.numericParameters.set(
                ue.WebRTCMinBitrate,
                new k(
                  ue.WebRTCMinBitrate,
                  "Min Bitrate (kbps)",
                  "The minimum bitrate that WebRTC should use.",
                  0,
                  5e5,
                  0,
                  e
                )
              ),
              this.numericParameters.set(
                ue.WebRTCMaxBitrate,
                new k(
                  ue.WebRTCMaxBitrate,
                  "Max Bitrate (kbps)",
                  "The maximum bitrate that WebRTC should use.",
                  0,
                  5e5,
                  0,
                  e
                )
              );
          }
          _addOnNumericSettingChangedListener(e, t) {
            this.numericParameters.has(e) &&
              this.numericParameters.get(e).addOnChangedListener(t);
          }
          _addOnOptionSettingChangedListener(e, t) {
            this.optionParameters.has(e) &&
              this.optionParameters.get(e).addOnChangedListener(t);
          }
          getNumericSettingValue(e) {
            if (this.numericParameters.has(e))
              return this.numericParameters.get(e).number;
            throw new Error(`There is no numeric setting with the id of ${e}`);
          }
          getTextSettingValue(e) {
            if (this.textParameters.has(e))
              return this.textParameters.get(e).value;
            throw new Error(`There is no numeric setting with the id of ${e}`);
          }
          setNumericSetting(e, t) {
            if (!this.numericParameters.has(e))
              throw new Error(
                `There is no numeric setting with the id of ${e}`
              );
            this.numericParameters.get(e).number = t;
          }
          _addOnSettingChangedListener(e, t) {
            this.flags.has(e) && (this.flags.get(e).onChange = t);
          }
          _addOnTextSettingChangedListener(e, t) {
            this.textParameters.has(e) &&
              (this.textParameters.get(e).onChange = t);
          }
          getSettingOption(e) {
            return this.optionParameters.get(e);
          }
          isFlagEnabled(e) {
            return this.flags.get(e).flag;
          }
          setFlagEnabled(e, t) {
            this.flags.has(e)
              ? (this.flags.get(e).flag = t)
              : l.Warning(
                  l.GetStackTrace(),
                  `Cannot toggle flag called ${e} - it does not exist in the Config.flags map.`
                );
          }
          setTextSetting(e, t) {
            this.textParameters.has(e)
              ? (this.textParameters.get(e).text = t)
              : l.Warning(
                  l.GetStackTrace(),
                  `Cannot set text setting called ${e} - it does not exist in the Config.textParameters map.`
                );
          }
          setOptionSettingOptions(e, t) {
            this.optionParameters.has(e)
              ? (this.optionParameters.get(e).options = t)
              : l.Warning(
                  l.GetStackTrace(),
                  `Cannot set text setting called ${e} - it does not exist in the Config.optionParameters map.`
                );
          }
          setOptionSettingValue(e, t) {
            this.optionParameters.has(e)
              ? (this.optionParameters.get(e).selected = t)
              : l.Warning(
                  l.GetStackTrace(),
                  `Cannot set text setting called ${e} - it does not exist in the Config.enumParameters map.`
                );
          }
          setFlagLabel(e, t) {
            this.flags.has(e)
              ? (this.flags.get(e).label = t)
              : l.Warning(
                  l.GetStackTrace(),
                  `Cannot set label for flag called ${e} - it does not exist in the Config.flags map.`
                );
          }
          setSettings(e) {
            for (const t of Object.keys(e))
              he(t)
                ? this.setFlagEnabled(t, e[t])
                : me(t)
                ? this.setNumericSetting(t, e[t])
                : pe(t)
                ? this.setTextSetting(t, e[t])
                : fe(t) && this.setOptionSettingValue(t, e[t]);
          }
          getSettings() {
            const e = {};
            for (const [t, n] of this.flags.entries()) e[t] = n.flag;
            for (const [t, n] of this.numericParameters.entries())
              e[t] = n.number;
            for (const [t, n] of this.textParameters.entries()) e[t] = n.text;
            for (const [t, n] of this.optionParameters.entries())
              e[t] = n.selected;
            return e;
          }
          getFlags() {
            return Array.from(this.flags.values());
          }
          getTextSettings() {
            return Array.from(this.textParameters.values());
          }
          getNumericSettings() {
            return Array.from(this.numericParameters.values());
          }
          getOptionSettings() {
            return Array.from(this.optionParameters.values());
          }
          _registerOnChangeEvents(e) {
            for (const t of this.flags.keys()) {
              const n = this.flags.get(t);
              n &&
                (n.onChangeEmit = (t) =>
                  e.dispatchEvent(
                    new re({ id: n.id, type: "flag", value: t, target: n })
                  ));
            }
            for (const t of this.numericParameters.keys()) {
              const n = this.numericParameters.get(t);
              n &&
                (n.onChangeEmit = (t) =>
                  e.dispatchEvent(
                    new re({ id: n.id, type: "number", value: t, target: n })
                  ));
            }
            for (const t of this.textParameters.keys()) {
              const n = this.textParameters.get(t);
              n &&
                (n.onChangeEmit = (t) =>
                  e.dispatchEvent(
                    new re({ id: n.id, type: "text", value: t, target: n })
                  ));
            }
            for (const t of this.optionParameters.keys()) {
              const n = this.optionParameters.get(t);
              n &&
                (n.onChangeEmit = (t) =>
                  e.dispatchEvent(
                    new re({ id: n.id, type: "option", value: t, target: n })
                  ));
            }
          }
        }
        var Ce;
        !(function (e) {
          (e[(e.LockedMouse = 0)] = "LockedMouse"),
            (e[(e.HoveringMouse = 1)] = "HoveringMouse");
        })(Ce || (Ce = {}));
        class ye {
          constructor(e, t, n) {
            (this.closeTimeout = 10),
              (this.active = !1),
              (this.countdownActive = !1),
              (this.warnTimer = void 0),
              (this.countDown = 0),
              (this.countDownTimer = void 0),
              (this.config = e),
              (this.pixelStreaming = t),
              (this.onDismissAfk = n),
              (this.onAFKTimedOutCallback = () => {
                console.log(
                  "AFK timed out, did you want to override this callback?"
                );
              });
          }
          onAfkClick() {
            clearInterval(this.countDownTimer),
              (this.active || this.countdownActive) &&
                (this.startAfkWarningTimer(),
                this.pixelStreaming.dispatchEvent(new O()));
          }
          startAfkWarningTimer() {
            this.config.getNumericSettingValue(ue.AFKTimeoutSecs) > 0 &&
            this.config.isFlagEnabled(de.AFKDetection)
              ? (this.active = !0)
              : (this.active = !1),
              this.resetAfkWarningTimer();
          }
          stopAfkWarningTimer() {
            (this.active = !1),
              (this.countdownActive = !1),
              clearTimeout(this.warnTimer),
              clearInterval(this.countDownTimer);
          }
          pauseAfkWarningTimer() {
            this.active = !1;
          }
          resetAfkWarningTimer() {
            this.active &&
              this.config.isFlagEnabled(de.AFKDetection) &&
              (clearTimeout(this.warnTimer),
              (this.warnTimer = setTimeout(
                () => this.activateAfkEvent(),
                1e3 * this.config.getNumericSettingValue(ue.AFKTimeoutSecs)
              )));
          }
          activateAfkEvent() {
            this.pauseAfkWarningTimer(),
              this.pixelStreaming.dispatchEvent(
                new A({
                  countDown: this.countDown,
                  dismissAfk: this.onDismissAfk,
                })
              ),
              (this.countDown = this.closeTimeout),
              (this.countdownActive = !0),
              this.pixelStreaming.dispatchEvent(
                new F({ countDown: this.countDown })
              ),
              this.config.isFlagEnabled(de.HoveringMouseMode) ||
                (document.exitPointerLock && document.exitPointerLock()),
              (this.countDownTimer = setInterval(() => {
                this.countDown--,
                  0 == this.countDown
                    ? (this.pixelStreaming.dispatchEvent(new I()),
                      this.onAFKTimedOutCallback(),
                      l.Log(
                        l.GetStackTrace(),
                        "You have been disconnected due to inactivity"
                      ),
                      this.stopAfkWarningTimer())
                    : this.pixelStreaming.dispatchEvent(
                        new F({ countDown: this.countDown })
                      );
              }, 1e3));
          }
        }
        class be {
          constructor() {
            this.isReceivingFreezeFrame = !1;
          }
          getDataChannelInstance() {
            return this;
          }
          createDataChannel(e, t, n) {
            (this.peerConnection = e),
              (this.label = t),
              (this.datachannelOptions = n),
              null == n &&
                ((this.datachannelOptions = {}),
                (this.datachannelOptions.ordered = !0)),
              (this.dataChannel = this.peerConnection.createDataChannel(
                this.label,
                this.datachannelOptions
              )),
              this.setupDataChannel();
          }
          setupDataChannel() {
            (this.dataChannel.binaryType = "arraybuffer"),
              (this.dataChannel.onopen = (e) => this.handleOnOpen(e)),
              (this.dataChannel.onclose = (e) => this.handleOnClose(e)),
              (this.dataChannel.onmessage = (e) => this.handleOnMessage(e)),
              (this.dataChannel.onerror = (e) => this.handleOnError(e));
          }
          handleOnOpen(e) {
            var t;
            l.Log(l.GetStackTrace(), `Data Channel (${this.label}) opened.`, 7),
              this.onOpen(
                null === (t = this.dataChannel) || void 0 === t
                  ? void 0
                  : t.label,
                e
              );
          }
          handleOnClose(e) {
            var t;
            l.Log(l.GetStackTrace(), `Data Channel (${this.label}) closed.`, 7),
              this.onClose(
                null === (t = this.dataChannel) || void 0 === t
                  ? void 0
                  : t.label,
                e
              );
          }
          handleOnMessage(e) {
            l.Log(
              l.GetStackTrace(),
              `Data Channel (${this.label}) message: ${e}`,
              8
            );
          }
          handleOnError(e) {
            var t;
            l.Log(
              l.GetStackTrace(),
              `Data Channel (${this.label}) error: ${e}`,
              7
            ),
              this.onError(
                null === (t = this.dataChannel) || void 0 === t
                  ? void 0
                  : t.label,
                e
              );
          }
          onOpen(e, t) {}
          onClose(e, t) {}
          onError(e, t) {}
        }
        class Ee {}
        class we {}
        class Te {}
        class xe {}
        class Me {}
        class Pe {}
        class ke {}
        class Re {}
        class Le {
          constructor() {
            (this.inboundVideoStats = new we()),
              (this.inboundAudioStats = new Ee()),
              (this.candidatePair = new Me()),
              (this.DataChannelStats = new Te()),
              (this.outBoundVideoStats = new Pe()),
              (this.sessionStats = new ke()),
              (this.streamStats = new Re()),
              (this.codecs = new Map());
          }
          processStats(e) {
            (this.localCandidates = new Array()),
              (this.remoteCandidates = new Array()),
              e.forEach((e) => {
                switch (e.type) {
                  case "candidate-pair":
                    this.handleCandidatePair(e);
                    break;
                  case "certificate":
                  case "media-source":
                  case "media-playout":
                  case "outbound-rtp":
                  case "peer-connection":
                  case "remote-inbound-rtp":
                  case "transport":
                    break;
                  case "codec":
                    this.handleCodec(e);
                    break;
                  case "data-channel":
                    this.handleDataChannel(e);
                    break;
                  case "inbound-rtp":
                    this.handleInBoundRTP(e);
                    break;
                  case "local-candidate":
                    this.handleLocalCandidate(e);
                    break;
                  case "remote-candidate":
                    this.handleRemoteCandidate(e);
                    break;
                  case "remote-outbound-rtp":
                    this.handleRemoteOutBound(e);
                    break;
                  case "track":
                    this.handleTrack(e);
                    break;
                  case "stream":
                    this.handleStream(e);
                    break;
                  default:
                    l.Error(l.GetStackTrace(), "unhandled Stat Type"),
                      l.Log(l.GetStackTrace(), e);
                }
              });
          }
          handleStream(e) {
            this.streamStats = e;
          }
          handleCandidatePair(e) {
            (this.candidatePair.bytesReceived = e.bytesReceived),
              (this.candidatePair.bytesSent = e.bytesSent),
              (this.candidatePair.localCandidateId = e.localCandidateId),
              (this.candidatePair.remoteCandidateId = e.remoteCandidateId),
              (this.candidatePair.nominated = e.nominated),
              (this.candidatePair.readable = e.readable),
              (this.candidatePair.selected = e.selected),
              (this.candidatePair.writable = e.writable),
              (this.candidatePair.state = e.state),
              (this.candidatePair.currentRoundTripTime =
                e.currentRoundTripTime);
          }
          handleDataChannel(e) {
            (this.DataChannelStats.bytesReceived = e.bytesReceived),
              (this.DataChannelStats.bytesSent = e.bytesSent),
              (this.DataChannelStats.dataChannelIdentifier =
                e.dataChannelIdentifier),
              (this.DataChannelStats.id = e.id),
              (this.DataChannelStats.label = e.label),
              (this.DataChannelStats.messagesReceived = e.messagesReceived),
              (this.DataChannelStats.messagesSent = e.messagesSent),
              (this.DataChannelStats.protocol = e.protocol),
              (this.DataChannelStats.state = e.state),
              (this.DataChannelStats.timestamp = e.timestamp);
          }
          handleLocalCandidate(e) {
            const t = new xe();
            (t.label = "local-candidate"),
              (t.address = e.address),
              (t.port = e.port),
              (t.protocol = e.protocol),
              (t.candidateType = e.candidateType),
              (t.id = e.id),
              this.localCandidates.push(t);
          }
          handleRemoteCandidate(e) {
            const t = new xe();
            (t.label = "local-candidate"),
              (t.address = e.address),
              (t.port = e.port),
              (t.protocol = e.protocol),
              (t.id = e.id),
              (t.candidateType = e.candidateType),
              this.remoteCandidates.push(t);
          }
          handleInBoundRTP(e) {
            switch (e.kind) {
              case "video":
                (this.inboundVideoStats = e),
                  null != this.lastVideoStats &&
                    ((this.inboundVideoStats.bitrate =
                      (8 *
                        (this.inboundVideoStats.bytesReceived -
                          this.lastVideoStats.bytesReceived)) /
                      (this.inboundVideoStats.timestamp -
                        this.lastVideoStats.timestamp)),
                    (this.inboundVideoStats.bitrate = Math.floor(
                      this.inboundVideoStats.bitrate
                    ))),
                  (this.lastVideoStats = Object.assign(
                    {},
                    this.inboundVideoStats
                  ));
                break;
              case "audio":
                (this.inboundAudioStats = e),
                  null != this.lastAudioStats &&
                    ((this.inboundAudioStats.bitrate =
                      (8 *
                        (this.inboundAudioStats.bytesReceived -
                          this.lastAudioStats.bytesReceived)) /
                      (this.inboundAudioStats.timestamp -
                        this.lastAudioStats.timestamp)),
                    (this.inboundAudioStats.bitrate = Math.floor(
                      this.inboundAudioStats.bitrate
                    ))),
                  (this.lastAudioStats = Object.assign(
                    {},
                    this.inboundAudioStats
                  ));
                break;
              default:
                l.Log(l.GetStackTrace(), "Kind is not handled");
            }
          }
          handleRemoteOutBound(e) {
            "video" === e.kind &&
              ((this.outBoundVideoStats.bytesSent = e.bytesSent),
              (this.outBoundVideoStats.id = e.id),
              (this.outBoundVideoStats.localId = e.localId),
              (this.outBoundVideoStats.packetsSent = e.packetsSent),
              (this.outBoundVideoStats.remoteTimestamp = e.remoteTimestamp),
              (this.outBoundVideoStats.timestamp = e.timestamp));
          }
          handleTrack(e) {
            "track" !== e.type ||
              ("video_label" !== e.trackIdentifier && "video" !== e.kind) ||
              ((this.inboundVideoStats.framesDropped = e.framesDropped),
              (this.inboundVideoStats.framesReceived = e.framesReceived),
              (this.inboundVideoStats.frameHeight = e.frameHeight),
              (this.inboundVideoStats.frameWidth = e.frameWidth));
          }
          handleCodec(e) {
            const t = e.id,
              n = `${e.mimeType.replace("video/", "").replace("audio/", "")}${
                e.sdpFmtpLine ? ` ${e.sdpFmtpLine}` : ""
              }`;
            this.codecs.set(t, n);
          }
          handleSessionStatistics(e, t, n) {
            const s = Date.now() - e;
            this.sessionStats.runTime = new Date(s)
              .toISOString()
              .substr(11, 8)
              .toString();
            const i = null === t ? "Not sent yet" : t ? "true" : "false";
            (this.sessionStats.controlsStreamInput = i),
              (this.sessionStats.videoEncoderAvgQP = n);
          }
          isNumber(e) {
            return "number" == typeof e && isFinite(e);
          }
        }
        const Ae =
          ((Fe = {
            parseRtpParameters: () => r.parseRtpParameters,
            splitSections: () => r.splitSections,
          }),
          (Oe = {}),
          o.d(Oe, Fe),
          Oe);
        var Fe,
          Oe,
          Ie,
          _e,
          De = function (e, t, n, s) {
            return new (n || (n = Promise))(function (i, r) {
              function o(e) {
                try {
                  l(s.next(e));
                } catch (e) {
                  r(e);
                }
              }
              function a(e) {
                try {
                  l(s.throw(e));
                } catch (e) {
                  r(e);
                }
              }
              function l(e) {
                var t;
                e.done
                  ? i(e.value)
                  : ((t = e.value),
                    t instanceof n
                      ? t
                      : new n(function (e) {
                          e(t);
                        })).then(o, a);
              }
              l((s = s.apply(e, t || [])).next());
            });
          };
        class Ue {
          constructor(e, t, n) {
            (this.config = t), this.createPeerConnection(e, n);
          }
          createPeerConnection(e, t) {
            this.config.isFlagEnabled(de.ForceTURN) &&
              ((e.iceTransportPolicy = "relay"),
              l.Log(
                l.GetStackTrace(),
                "Forcing TURN usage by setting ICE Transport Policy in peer connection config."
              )),
              (this.peerConnection = new RTCPeerConnection(e)),
              (this.peerConnection.onsignalingstatechange = (e) =>
                this.handleSignalStateChange(e)),
              (this.peerConnection.oniceconnectionstatechange = (e) =>
                this.handleIceConnectionStateChange(e)),
              (this.peerConnection.onicegatheringstatechange = (e) =>
                this.handleIceGatheringStateChange(e)),
              (this.peerConnection.ontrack = (e) => this.handleOnTrack(e)),
              (this.peerConnection.onicecandidate = (e) =>
                this.handleIceCandidate(e)),
              (this.peerConnection.ondatachannel = (e) =>
                this.handleDataChannel(e)),
              (this.aggregatedStats = new Le()),
              (this.preferredCodec = t),
              (this.updateCodecSelection = !0);
          }
          createOffer(e, t) {
            return De(this, void 0, void 0, function* () {
              l.Log(l.GetStackTrace(), "Create Offer", 6);
              const n =
                  "localhost" === location.hostname ||
                  "127.0.0.1" === location.hostname,
                s = "https:" === location.protocol;
              let i = t.isFlagEnabled(de.UseMic);
              !i ||
                n ||
                s ||
                ((i = !1),
                l.Error(
                  l.GetStackTrace(),
                  "Microphone access in the browser will not work if you are not on HTTPS or localhost. Disabling mic access."
                ),
                l.Error(
                  l.GetStackTrace(),
                  "For testing you can enable HTTP microphone access Chrome by visiting chrome://flags/ and enabling 'unsafely-treat-insecure-origin-as-secure'"
                )),
                this.setupTransceiversAsync(i).finally(() => {
                  var t;
                  null === (t = this.peerConnection) ||
                    void 0 === t ||
                    t
                      .createOffer(e)
                      .then((e) => {
                        var t;
                        this.showTextOverlayConnecting(),
                          (e.sdp = this.mungeSDP(e.sdp, i)),
                          null === (t = this.peerConnection) ||
                            void 0 === t ||
                            t.setLocalDescription(e),
                          this.onSendWebRTCOffer(e);
                      })
                      .catch(() => {
                        this.showTextOverlaySetupFailure();
                      });
                });
            });
          }
          receiveOffer(e, t) {
            var n;
            return De(this, void 0, void 0, function* () {
              l.Log(l.GetStackTrace(), "Receive Offer", 6),
                null === (n = this.peerConnection) ||
                  void 0 === n ||
                  n.setRemoteDescription(e).then(() => {
                    const e =
                        "localhost" === location.hostname ||
                        "127.0.0.1" === location.hostname,
                      n = "https:" === location.protocol;
                    let s = t.isFlagEnabled(de.UseMic);
                    !s ||
                      e ||
                      n ||
                      ((s = !1),
                      l.Error(
                        l.GetStackTrace(),
                        "Microphone access in the browser will not work if you are not on HTTPS or localhost. Disabling mic access."
                      ),
                      l.Error(
                        l.GetStackTrace(),
                        "For testing you can enable HTTP microphone access Chrome by visiting chrome://flags/ and enabling 'unsafely-treat-insecure-origin-as-secure'"
                      )),
                      this.setupTransceiversAsync(s).finally(() => {
                        var e;
                        null === (e = this.peerConnection) ||
                          void 0 === e ||
                          e
                            .createAnswer()
                            .then((e) => {
                              var t;
                              return (
                                (e.sdp = this.mungeSDP(e.sdp, s)),
                                null === (t = this.peerConnection) ||
                                void 0 === t
                                  ? void 0
                                  : t.setLocalDescription(e)
                              );
                            })
                            .then(() => {
                              var e;
                              this.onSendWebRTCAnswer(
                                null === (e = this.peerConnection) ||
                                  void 0 === e
                                  ? void 0
                                  : e.currentLocalDescription
                              );
                            })
                            .catch(() => {
                              l.Error(
                                l.GetStackTrace(),
                                "createAnswer() failed"
                              );
                            });
                      });
                  }),
                this.config.setOptionSettingOptions(
                  ve.PreferredCodec,
                  this.parseAvailableCodecs(e).filter((e) =>
                    this.config
                      .getSettingOption(ve.PreferredCodec)
                      .options.includes(e)
                  )
                );
            });
          }
          receiveAnswer(e) {
            var t;
            null === (t = this.peerConnection) ||
              void 0 === t ||
              t.setRemoteDescription(e),
              this.config.setOptionSettingOptions(
                ve.PreferredCodec,
                this.parseAvailableCodecs(e).filter((e) =>
                  this.config
                    .getSettingOption(ve.PreferredCodec)
                    .options.includes(e)
                )
              );
          }
          generateStats() {
            var e;
            null === (e = this.peerConnection) ||
              void 0 === e ||
              e.getStats(null).then((e) => {
                this.aggregatedStats.processStats(e),
                  this.onVideoStats(this.aggregatedStats),
                  this.updateCodecSelection &&
                    this.config.setOptionSettingValue(
                      ve.PreferredCodec,
                      this.aggregatedStats.codecs.get(
                        this.aggregatedStats.inboundVideoStats.codecId
                      )
                    );
              });
          }
          close() {
            this.peerConnection &&
              (this.peerConnection.close(), (this.peerConnection = null));
          }
          mungeSDP(e, t) {
            const n = e;
            n.replace(
              /(a=fmtp:\d+ .*level-asymmetry-allowed=.*)\r\n/gm,
              "$1;x-google-start-bitrate=10000;x-google-max-bitrate=100000\r\n"
            );
            let s = "";
            return (
              (s += "maxaveragebitrate=510000;"),
              t && (s += "sprop-maxcapturerate=48000;"),
              (s += this.config.isFlagEnabled(de.ForceMonoAudio)
                ? "stereo=0;"
                : "stereo=1;"),
              (s += "useinbandfec=1"),
              n.replace("useinbandfec=1", s),
              n
            );
          }
          handleOnIce(e) {
            var t;
            l.Log(l.GetStackTrace(), "peerconnection handleOnIce", 6),
              this.config.isFlagEnabled(de.ForceTURN) &&
              e.candidate.indexOf("relay") < 0
                ? l.Info(
                    l.GetStackTrace(),
                    `Dropping candidate because it was not TURN relay. | Type= ${e.type} | Protocol= ${e.protocol} | Address=${e.address} | Port=${e.port} |`,
                    6
                  )
                : null === (t = this.peerConnection) ||
                  void 0 === t ||
                  t.addIceCandidate(e);
          }
          handleSignalStateChange(e) {
            l.Log(l.GetStackTrace(), "signaling state change: " + e, 6);
          }
          handleIceConnectionStateChange(e) {
            l.Log(l.GetStackTrace(), "ice connection state change: " + e, 6),
              this.onIceConnectionStateChange(e);
          }
          handleIceGatheringStateChange(e) {
            l.Log(
              l.GetStackTrace(),
              "ice gathering state change: " + JSON.stringify(e),
              6
            );
          }
          handleOnTrack(e) {
            this.onTrack(e);
          }
          handleIceCandidate(e) {
            this.onPeerIceCandidate(e);
          }
          handleDataChannel(e) {
            this.onDataChannel(e);
          }
          onTrack(e) {}
          onIceConnectionStateChange(e) {}
          onPeerIceCandidate(e) {}
          onDataChannel(e) {}
          setupTransceiversAsync(e) {
            var t, n, s, i, r, o, a, l, c;
            return De(this, void 0, void 0, function* () {
              const d =
                (null === (t = this.peerConnection) || void 0 === t
                  ? void 0
                  : t.getTransceivers().length) > 0;
              if (
                (null === (n = this.peerConnection) ||
                  void 0 === n ||
                  n.addTransceiver("video", { direction: "recvonly" }),
                RTCRtpReceiver.getCapabilities && "" != this.preferredCodec)
              )
                for (const e of null !==
                  (i =
                    null === (s = this.peerConnection) || void 0 === s
                      ? void 0
                      : s.getTransceivers()) && void 0 !== i
                  ? i
                  : [])
                  if (
                    e &&
                    e.receiver &&
                    e.receiver.track &&
                    "video" === e.receiver.track.kind
                  ) {
                    const t = this.preferredCodec.split(" "),
                      n = [
                        {
                          mimeType: "video/" + t[0],
                          clockRate: 9e4,
                          sdpFmtpLine: t[1] ? t[1] : "",
                        },
                      ];
                    this.config
                      .getSettingOption(ve.PreferredCodec)
                      .options.filter((e) => e != this.preferredCodec)
                      .forEach((e) => {
                        const t = e.split(" ");
                        n.push({
                          mimeType: "video/" + t[0],
                          clockRate: 9e4,
                          sdpFmtpLine: t[1] ? t[1] : "",
                        });
                      });
                    for (const e of n)
                      "" === e.sdpFmtpLine && delete e.sdpFmtpLine;
                    e.setCodecPreferences(n);
                  }
              if (e) {
                const t = {
                    video: !1,
                    audio: !!e && {
                      autoGainControl: !1,
                      channelCount: 1,
                      echoCancellation: !1,
                      latency: 0,
                      noiseSuppression: !1,
                      sampleRate: 48e3,
                      sampleSize: 16,
                      volume: 1,
                    },
                  },
                  n = yield navigator.mediaDevices.getUserMedia(t);
                if (n)
                  if (d) {
                    for (const e of null !==
                      (a =
                        null === (o = this.peerConnection) || void 0 === o
                          ? void 0
                          : o.getTransceivers()) && void 0 !== a
                      ? a
                      : [])
                      if (
                        e &&
                        e.receiver &&
                        e.receiver.track &&
                        "audio" === e.receiver.track.kind
                      )
                        for (const t of n.getTracks())
                          t.kind &&
                            "audio" == t.kind &&
                            (e.sender.replaceTrack(t),
                            (e.direction = "sendrecv"));
                  } else
                    for (const e of n.getTracks())
                      e.kind &&
                        "audio" == e.kind &&
                        (null === (l = this.peerConnection) ||
                          void 0 === l ||
                          l.addTransceiver(e, { direction: "sendrecv" }));
                else
                  null === (c = this.peerConnection) ||
                    void 0 === c ||
                    c.addTransceiver("audio", { direction: "recvonly" });
              } else null === (r = this.peerConnection) || void 0 === r || r.addTransceiver("audio", { direction: "recvonly" });
            });
          }
          onVideoStats(e) {}
          onSendWebRTCOffer(e) {}
          onSendWebRTCAnswer(e) {}
          showTextOverlayConnecting() {}
          showTextOverlaySetupFailure() {}
          parseAvailableCodecs(e) {
            if (!RTCRtpReceiver.getCapabilities)
              return ["Only available on Chrome"];
            const t = [],
              n = (0, Ae.splitSections)(e.sdp);
            return (
              n.shift(),
              n.forEach((e) => {
                const { codecs: n } = (0, Ae.parseRtpParameters)(e),
                  s = /(VP\d|H26\d|AV1).*/;
                n.forEach((e) => {
                  const n =
                    e.name +
                    " " +
                    Object.keys(e.parameters || {})
                      .map((t) => t + "=" + e.parameters[t])
                      .join(";");
                  if (null !== s.exec(n)) {
                    "VP9" == e.name && (e.parameters = { "profile-id": "0" });
                    const n =
                      e.name +
                      " " +
                      Object.keys(e.parameters || {})
                        .map((t) => t + "=" + e.parameters[t])
                        .join(";");
                    t.push(n);
                  }
                });
              }),
              t
            );
          }
        }
        class ze {
          constructor() {
            (this.PixelStreamingSettings = new Be()),
              (this.EncoderSettings = new Ne()),
              (this.WebRTCSettings = new Ge());
          }
          ueCompatible() {
            null != this.WebRTCSettings.MaxFPS &&
              (this.WebRTCSettings.FPS = this.WebRTCSettings.MaxFPS);
          }
        }
        class Be {}
        class Ne {}
        class Ge {}
        class He {
          constructor() {
            (this.ReceiptTimeMs = null),
              (this.TransmissionTimeMs = null),
              (this.PreCaptureTimeMs = null),
              (this.PostCaptureTimeMs = null),
              (this.PreEncodeTimeMs = null),
              (this.PostEncodeTimeMs = null),
              (this.EncodeMs = null),
              (this.CaptureToSendMs = null),
              (this.testStartTimeMs = 0),
              (this.browserReceiptTimeMs = 0),
              (this.latencyExcludingDecode = 0),
              (this.testDuration = 0),
              (this.networkLatency = 0),
              (this.browserSendLatency = 0),
              (this.frameDisplayDeltaTimeMs = 0),
              (this.endToEndLatency = 0),
              (this.encodeLatency = 0);
          }
          setFrameDisplayDeltaTime(e) {
            0 == this.frameDisplayDeltaTimeMs &&
              (this.frameDisplayDeltaTimeMs = Math.round(e));
          }
          processFields() {
            null != this.EncodeMs ||
              (null == this.PreEncodeTimeMs && null == this.PostEncodeTimeMs) ||
              (l.Log(
                l.GetStackTrace(),
                `Setting Encode Ms \n ${this.PostEncodeTimeMs} \n ${this.PreEncodeTimeMs}`,
                6
              ),
              (this.EncodeMs = this.PostEncodeTimeMs - this.PreEncodeTimeMs)),
              null != this.CaptureToSendMs ||
                (null == this.PreCaptureTimeMs &&
                  null == this.PostCaptureTimeMs) ||
                (l.Log(
                  l.GetStackTrace(),
                  `Setting CaptureToSendMs Ms \n ${this.PostCaptureTimeMs} \n ${this.PreCaptureTimeMs}`,
                  6
                ),
                (this.CaptureToSendMs =
                  this.PostCaptureTimeMs - this.PreCaptureTimeMs));
          }
        }
        class We {
          static setExtensionFromBytes(e, t) {
            t.receiving ||
              ((t.mimetype = ""),
              (t.extension = ""),
              (t.receiving = !0),
              (t.valid = !1),
              (t.size = 0),
              (t.data = []),
              (t.timestampStart = new Date().getTime()),
              l.Log(l.GetStackTrace(), "Received first chunk of file", 6));
            const n = new TextDecoder("utf-16").decode(e.slice(1));
            l.Log(l.GetStackTrace(), n, 6), (t.extension = n);
          }
          static setMimeTypeFromBytes(e, t) {
            t.receiving ||
              ((t.mimetype = ""),
              (t.extension = ""),
              (t.receiving = !0),
              (t.valid = !1),
              (t.size = 0),
              (t.data = []),
              (t.timestampStart = new Date().getTime()),
              l.Log(l.GetStackTrace(), "Received first chunk of file", 6));
            const n = new TextDecoder("utf-16").decode(e.slice(1));
            l.Log(l.GetStackTrace(), n, 6), (t.mimetype = n);
          }
          static setContentsFromBytes(e, t) {
            if (!t.receiving) return;
            t.size = Math.ceil(
              new DataView(e.slice(1, 5).buffer).getInt32(0, !0) / 16379
            );
            const n = e.slice(5);
            if (
              (t.data.push(n),
              l.Log(
                l.GetStackTrace(),
                `Received file chunk: ${t.data.length}/${t.size}`,
                6
              ),
              t.data.length === t.size)
            ) {
              (t.receiving = !1),
                (t.valid = !0),
                l.Log(l.GetStackTrace(), "Received complete file", 6);
              const e = new Date().getTime() - t.timestampStart,
                n = Math.round((16 * t.size * 1024) / e);
              l.Log(
                l.GetStackTrace(),
                `Average transfer bitrate: ${n}kb/s over ${e / 1e3} seconds`,
                6
              );
              const s = new Blob(t.data, { type: t.mimetype }),
                i = document.createElement("a");
              i.setAttribute("href", URL.createObjectURL(s)),
                i.setAttribute("download", `transfer.${t.extension}`),
                document.body.append(i),
                i.remove();
            } else
              t.data.length > t.size &&
                ((t.receiving = !1),
                l.Error(
                  l.GetStackTrace(),
                  `Received bigger file than advertised: ${t.data.length}/${t.size}`
                ));
          }
        }
        class Ve {
          constructor() {
            (this.mimetype = ""),
              (this.extension = ""),
              (this.receiving = !1),
              (this.size = 0),
              (this.data = []),
              (this.valid = !1);
          }
        }
        class Qe {}
        (Qe.mainButton = 0),
          (Qe.auxiliaryButton = 1),
          (Qe.secondaryButton = 2),
          (Qe.fourthButton = 3),
          (Qe.fifthButton = 4);
        class qe {}
        (qe.primaryButton = 1),
          (qe.secondaryButton = 2),
          (qe.auxiliaryButton = 4),
          (qe.fourthButton = 8),
          (qe.fifthButton = 16);
        class je {
          constructor() {
            this.unregisterCallbacks = [];
          }
          addUnregisterCallback(e) {
            this.unregisterCallbacks.push(e);
          }
          unregisterAll() {
            for (const e of this.unregisterCallbacks) e();
            this.unregisterCallbacks = [];
          }
        }
        class Ke {
          constructor(e, t, n) {
            (this.touchEventListenerTracker = new je()),
              (this.toStreamerMessagesProvider = e),
              (this.videoElementProvider = t),
              (this.coordinateConverter = n);
            const s = (e) => this.onTouchStart(e),
              i = (e) => this.onTouchEnd(e),
              r = (e) => this.onTouchMove(e);
            document.addEventListener("touchstart", s, { passive: !1 }),
              document.addEventListener("touchend", i, { passive: !1 }),
              document.addEventListener("touchmove", r, { passive: !1 }),
              this.touchEventListenerTracker.addUnregisterCallback(() =>
                document.removeEventListener("touchstart", s)
              ),
              this.touchEventListenerTracker.addUnregisterCallback(() =>
                document.removeEventListener("touchend", i)
              ),
              this.touchEventListenerTracker.addUnregisterCallback(() =>
                document.removeEventListener("touchmove", r)
              );
          }
          unregisterTouchEvents() {
            this.touchEventListenerTracker.unregisterAll();
          }
          setVideoElementParentClientRect(e) {
            this.videoElementParentClientRect = e;
          }
          onTouchStart(e) {
            if (this.videoElementProvider.isVideoReady()) {
              if (null == this.fakeTouchFinger) {
                const t = e.changedTouches[0];
                this.fakeTouchFinger = new Xe(
                  t.identifier,
                  t.clientX - this.videoElementParentClientRect.left,
                  t.clientY - this.videoElementParentClientRect.top
                );
                const n = this.videoElementProvider.getVideoParentElement(),
                  s = new MouseEvent("mouseenter", t);
                n.dispatchEvent(s);
                const i = this.coordinateConverter.normalizeAndQuantizeUnsigned(
                  this.fakeTouchFinger.x,
                  this.fakeTouchFinger.y
                );
                this.toStreamerMessagesProvider.toStreamerHandlers.get(
                  "MouseDown"
                )([Qe.mainButton, i.x, i.y]);
              }
              e.preventDefault();
            }
          }
          onTouchEnd(e) {
            if (!this.videoElementProvider.isVideoReady()) return;
            const t = this.videoElementProvider.getVideoParentElement(),
              n = this.toStreamerMessagesProvider.toStreamerHandlers;
            for (let s = 0; s < e.changedTouches.length; s++) {
              const i = e.changedTouches[s];
              if (i.identifier === this.fakeTouchFinger.id) {
                const e = i.clientX - this.videoElementParentClientRect.left,
                  s = i.clientY - this.videoElementParentClientRect.top,
                  r = this.coordinateConverter.normalizeAndQuantizeUnsigned(
                    e,
                    s
                  );
                n.get("MouseUp")([Qe.mainButton, r.x, r.y]);
                const o = new MouseEvent("mouseleave", i);
                t.dispatchEvent(o), (this.fakeTouchFinger = null);
                break;
              }
            }
            e.preventDefault();
          }
          onTouchMove(e) {
            if (!this.videoElementProvider.isVideoReady()) return;
            const t = this.toStreamerMessagesProvider.toStreamerHandlers;
            for (let n = 0; n < e.touches.length; n++) {
              const s = e.touches[n];
              if (s.identifier === this.fakeTouchFinger.id) {
                const e = s.clientX - this.videoElementParentClientRect.left,
                  n = s.clientY - this.videoElementParentClientRect.top,
                  i = this.coordinateConverter.normalizeAndQuantizeUnsigned(
                    e,
                    n
                  ),
                  r = this.coordinateConverter.normalizeAndQuantizeSigned(
                    e - this.fakeTouchFinger.x,
                    n - this.fakeTouchFinger.y
                  );
                t.get("MouseMove")([i.x, i.y, r.x, r.y]),
                  (this.fakeTouchFinger.x = e),
                  (this.fakeTouchFinger.y = n);
                break;
              }
            }
            e.preventDefault();
          }
        }
        class Xe {
          constructor(e, t, n) {
            (this.id = e), (this.x = t), (this.y = n);
          }
        }
        class Je {}
        (Je.backSpace = 8),
          (Je.shift = 16),
          (Je.control = 17),
          (Je.alt = 18),
          (Je.rightShift = 253),
          (Je.rightControl = 254),
          (Je.rightAlt = 255);
        class Ye {
          constructor(e, t, n) {
            (this.keyboardEventListenerTracker = new je()),
              (this.CodeToKeyCode = {
                Escape: 27,
                Digit0: 48,
                Digit1: 49,
                Digit2: 50,
                Digit3: 51,
                Digit4: 52,
                Digit5: 53,
                Digit6: 54,
                Digit7: 55,
                Digit8: 56,
                Digit9: 57,
                Minus: 173,
                Equal: 187,
                Backspace: 8,
                Tab: 9,
                KeyQ: 81,
                KeyW: 87,
                KeyE: 69,
                KeyR: 82,
                KeyT: 84,
                KeyY: 89,
                KeyU: 85,
                KeyI: 73,
                KeyO: 79,
                KeyP: 80,
                BracketLeft: 219,
                BracketRight: 221,
                Enter: 13,
                ControlLeft: 17,
                KeyA: 65,
                KeyS: 83,
                KeyD: 68,
                KeyF: 70,
                KeyG: 71,
                KeyH: 72,
                KeyJ: 74,
                KeyK: 75,
                KeyL: 76,
                Semicolon: 186,
                Quote: 222,
                Backquote: 192,
                ShiftLeft: 16,
                Backslash: 220,
                KeyZ: 90,
                KeyX: 88,
                KeyC: 67,
                KeyV: 86,
                KeyB: 66,
                KeyN: 78,
                KeyM: 77,
                Comma: 188,
                Period: 190,
                Slash: 191,
                ShiftRight: 253,
                AltLeft: 18,
                Space: 32,
                CapsLock: 20,
                F1: 112,
                F2: 113,
                F3: 114,
                F4: 115,
                F5: 116,
                F6: 117,
                F7: 118,
                F8: 119,
                F9: 120,
                F10: 121,
                F11: 122,
                F12: 123,
                Pause: 19,
                ScrollLock: 145,
                NumpadDivide: 111,
                NumpadMultiply: 106,
                NumpadSubtract: 109,
                NumpadAdd: 107,
                NumpadDecimal: 110,
                Numpad9: 105,
                Numpad8: 104,
                Numpad7: 103,
                Numpad6: 102,
                Numpad5: 101,
                Numpad4: 100,
                Numpad3: 99,
                Numpad2: 98,
                Numpad1: 97,
                Numpad0: 96,
                NumLock: 144,
                ControlRight: 254,
                AltRight: 255,
                Home: 36,
                End: 35,
                ArrowUp: 38,
                ArrowLeft: 37,
                ArrowRight: 39,
                ArrowDown: 40,
                PageUp: 33,
                PageDown: 34,
                Insert: 45,
                Delete: 46,
                ContextMenu: 93,
              }),
              (this.toStreamerMessagesProvider = e),
              (this.config = t),
              (this.activeKeysProvider = n);
          }
          registerKeyBoardEvents() {
            const e = (e) => this.handleOnKeyDown(e),
              t = (e) => this.handleOnKeyUp(e),
              n = (e) => this.handleOnKeyPress(e);
            document.addEventListener("keydown", e),
              document.addEventListener("keyup", t),
              document.addEventListener("keypress", n),
              this.keyboardEventListenerTracker.addUnregisterCallback(() =>
                document.removeEventListener("keydown", e)
              ),
              this.keyboardEventListenerTracker.addUnregisterCallback(() =>
                document.removeEventListener("keyup", t)
              ),
              this.keyboardEventListenerTracker.addUnregisterCallback(() =>
                document.removeEventListener("keypress", n)
              );
          }
          unregisterKeyBoardEvents() {
            this.keyboardEventListenerTracker.unregisterAll();
          }
          handleOnKeyDown(e) {
            const t = this.getKeycode(e);
            t &&
              (l.Log(
                l.GetStackTrace(),
                `key down ${t}, repeat = ${e.repeat}`,
                6
              ),
              this.toStreamerMessagesProvider.toStreamerHandlers.get("KeyDown")(
                [this.getKeycode(e), e.repeat ? 1 : 0]
              ),
              this.activeKeysProvider.getActiveKeys().push(t),
              t === Je.backSpace &&
                document.dispatchEvent(
                  new KeyboardEvent("keypress", { charCode: Je.backSpace })
                ),
              this.config.isFlagEnabled(de.SuppressBrowserKeys) &&
                this.isKeyCodeBrowserKey(t) &&
                e.preventDefault());
          }
          handleOnKeyUp(e) {
            const t = this.getKeycode(e);
            t &&
              (l.Log(l.GetStackTrace(), `key up ${t}`, 6),
              this.toStreamerMessagesProvider.toStreamerHandlers.get("KeyUp")([
                t,
                e.repeat ? 1 : 0,
              ]),
              this.config.isFlagEnabled(de.SuppressBrowserKeys) &&
                this.isKeyCodeBrowserKey(t) &&
                e.preventDefault());
          }
          handleOnKeyPress(e) {
            if (!("charCode" in e))
              return void l.Warning(
                l.GetStackTrace(),
                "KeyboardEvent.charCode is deprecated in this browser, cannot send key press."
              );
            const t = e.charCode;
            l.Log(l.GetStackTrace(), `key press ${t}`, 6),
              this.toStreamerMessagesProvider.toStreamerHandlers.get(
                "KeyPress"
              )([t]);
          }
          getKeycode(e) {
            if (!("keyCode" in e)) {
              const t = e;
              return t.code in this.CodeToKeyCode
                ? this.CodeToKeyCode[t.code]
                : (l.Warning(
                    l.GetStackTrace(),
                    `Keyboard code of ${t.code} is not supported in our mapping, ignoring this key.`
                  ),
                  null);
            }
            return e.keyCode === Je.shift && "ShiftRight" === e.code
              ? Je.rightShift
              : e.keyCode === Je.control && "ControlRight" === e.code
              ? Je.rightControl
              : e.keyCode === Je.alt && "AltRight" === e.code
              ? Je.rightAlt
              : e.keyCode;
          }
          isKeyCodeBrowserKey(e) {
            return (e >= 112 && e <= 123) || 9 === e;
          }
        }
        class $e {
          constructor(e, t, n) {
            (this.x = 0),
              (this.y = 0),
              (this.updateMouseMovePositionEvent = (e) => {
                this.updateMouseMovePosition(e);
              }),
              (this.mouseEventListenerTracker = new je()),
              (this.videoElementProvider = e),
              (this.mouseController = t),
              (this.activeKeysProvider = n);
            const s = this.videoElementProvider.getVideoParentElement();
            (this.x = s.getBoundingClientRect().width / 2),
              (this.y = s.getBoundingClientRect().height / 2),
              (this.coord =
                this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(
                  this.x,
                  this.y
                ));
          }
          unregisterMouseEvents() {
            this.mouseEventListenerTracker.unregisterAll();
          }
          lockStateChange() {
            const e = this.videoElementProvider.getVideoParentElement(),
              t =
                this.mouseController.toStreamerMessagesProvider
                  .toStreamerHandlers;
            if (
              document.pointerLockElement === e ||
              document.mozPointerLockElement === e
            )
              l.Log(l.GetStackTrace(), "Pointer locked", 6),
                document.addEventListener(
                  "mousemove",
                  this.updateMouseMovePositionEvent,
                  !1
                ),
                this.mouseEventListenerTracker.addUnregisterCallback(() =>
                  document.removeEventListener(
                    "mousemove",
                    this.updateMouseMovePositionEvent,
                    !1
                  )
                );
            else {
              l.Log(
                l.GetStackTrace(),
                "The pointer lock status is now unlocked",
                6
              ),
                document.removeEventListener(
                  "mousemove",
                  this.updateMouseMovePositionEvent,
                  !1
                );
              let e = this.activeKeysProvider.getActiveKeys();
              const n = new Set(e),
                s = [];
              n.forEach((e) => {
                s[e];
              }),
                s.forEach((e) => {
                  t.get("KeyUp")([e]);
                }),
                (e = []);
            }
          }
          updateMouseMovePosition(e) {
            if (!this.videoElementProvider.isVideoReady()) return;
            const t =
                this.mouseController.toStreamerMessagesProvider
                  .toStreamerHandlers,
              n = this.videoElementProvider.getVideoParentElement().clientWidth,
              s =
                this.videoElementProvider.getVideoParentElement().clientHeight;
            (this.x += e.movementX),
              (this.y += e.movementY),
              this.x > n && (this.x -= n),
              this.y > s && (this.y -= s),
              this.x < 0 && (this.x = n + this.x),
              this.y < 0 && (this.y = s - this.y),
              (this.coord =
                this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(
                  this.x,
                  this.y
                ));
            const i =
              this.mouseController.coordinateConverter.normalizeAndQuantizeSigned(
                e.movementX,
                e.movementY
              );
            t.get("MouseMove")([this.coord.x, this.coord.y, i.x, i.y]);
          }
          handleMouseDown(e) {
            this.videoElementProvider.isVideoReady() &&
              this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get(
                "MouseDown"
              )([e.button, this.coord.x, this.coord.y]);
          }
          handleMouseUp(e) {
            this.videoElementProvider.isVideoReady() &&
              this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get(
                "MouseUp"
              )([e.button, this.coord.x, this.coord.y]);
          }
          handleMouseWheel(e) {
            this.videoElementProvider.isVideoReady() &&
              this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get(
                "MouseWheel"
              )([e.wheelDelta, this.coord.x, this.coord.y]);
          }
          handleMouseDouble(e) {
            this.videoElementProvider.isVideoReady() &&
              this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get(
                "MouseDouble"
              )([e.button, this.coord.x, this.coord.y]);
          }
          handlePressMouseButtons(e) {
            this.videoElementProvider.isVideoReady() &&
              this.mouseController.pressMouseButtons(e.buttons, this.x, this.y);
          }
          handleReleaseMouseButtons(e) {
            this.videoElementProvider.isVideoReady() &&
              this.mouseController.releaseMouseButtons(
                e.buttons,
                this.x,
                this.y
              );
          }
        }
        class Ze {
          constructor(e) {
            this.mouseController = e;
          }
          unregisterMouseEvents() {}
          updateMouseMovePosition(e) {
            if (!this.mouseController.videoElementProvider.isVideoReady())
              return;
            l.Log(l.GetStackTrace(), "MouseMove", 6);
            const t =
                this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(
                  e.offsetX,
                  e.offsetY
                ),
              n =
                this.mouseController.coordinateConverter.normalizeAndQuantizeSigned(
                  e.movementX,
                  e.movementY
                );
            this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get(
              "MouseMove"
            )([t.x, t.y, n.x, n.y]),
              e.preventDefault();
          }
          handleMouseDown(e) {
            if (!this.mouseController.videoElementProvider.isVideoReady())
              return;
            l.Log(l.GetStackTrace(), "onMouse Down", 6);
            const t =
              this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(
                e.offsetX,
                e.offsetY
              );
            this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get(
              "MouseDown"
            )([e.button, t.x, t.y]),
              e.preventDefault();
          }
          handleMouseUp(e) {
            if (!this.mouseController.videoElementProvider.isVideoReady())
              return;
            const t =
              this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(
                e.offsetX,
                e.offsetY
              );
            this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get(
              "MouseUp"
            )([e.button, t.x, t.y]),
              e.preventDefault();
          }
          handleContextMenu(e) {
            if (!this.mouseController.videoElementProvider.isVideoReady())
              return;
            const t =
              this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(
                e.offsetX,
                e.offsetY
              );
            this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get(
              "MouseUp"
            )([e.button, t.x, t.y]),
              e.preventDefault();
          }
          handleMouseWheel(e) {
            if (!this.mouseController.videoElementProvider.isVideoReady())
              return;
            const t =
              this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(
                e.offsetX,
                e.offsetY
              );
            this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get(
              "MouseWheel"
            )([e.wheelDelta, t.x, t.y]),
              e.preventDefault();
          }
          handleMouseDouble(e) {
            if (!this.mouseController.videoElementProvider.isVideoReady())
              return;
            const t =
              this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(
                e.offsetX,
                e.offsetY
              );
            this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get(
              "MouseDouble"
            )([e.button, t.x, t.y]);
          }
          handlePressMouseButtons(e) {
            this.mouseController.videoElementProvider.isVideoReady() &&
              this.mouseController.pressMouseButtons(
                e.buttons,
                e.offsetX,
                e.offsetY
              );
          }
          handleReleaseMouseButtons(e) {
            this.mouseController.videoElementProvider.isVideoReady() &&
              this.mouseController.releaseMouseButtons(
                e.buttons,
                e.offsetX,
                e.offsetY
              );
          }
        }
        class et {
          constructor(e, t, n, s) {
            (this.mouseEventListenerTracker = new je()),
              (this.toStreamerMessagesProvider = e),
              (this.coordinateConverter = n),
              (this.videoElementProvider = t),
              (this.activeKeysProvider = s),
              this.registerMouseEnterAndLeaveEvents();
          }
          unregisterMouseEvents() {
            this.mouseEventListenerTracker.unregisterAll();
          }
          registerLockedMouseEvents(e) {
            const t = this.videoElementProvider.getVideoParentElement(),
              n = new $e(this.videoElementProvider, e, this.activeKeysProvider);
            if (
              ((t.requestPointerLock =
                t.requestPointerLock || t.mozRequestPointerLock),
              (document.exitPointerLock =
                document.exitPointerLock || document.mozExitPointerLock),
              t.requestPointerLock)
            ) {
              const e = () => {
                t.requestPointerLock();
              };
              t.addEventListener("click", e),
                this.mouseEventListenerTracker.addUnregisterCallback(() =>
                  t.removeEventListener("click", e)
                );
            }
            const s = () => n.lockStateChange();
            document.addEventListener("pointerlockchange", s, !1),
              document.addEventListener("mozpointerlockchange", s, !1),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                document.removeEventListener("pointerlockchange", s, !1)
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                document.removeEventListener("mozpointerlockchange", s, !1)
              );
            const i = (e) => n.handleMouseDown(e),
              r = (e) => n.handleMouseUp(e),
              o = (e) => n.handleMouseWheel(e),
              a = (e) => n.handleMouseDouble(e);
            t.addEventListener("mousedown", i),
              t.addEventListener("mouseup", r),
              t.addEventListener("wheel", o),
              t.addEventListener("dblclick", a),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                t.removeEventListener("mousedown", i)
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                t.removeEventListener("mouseup", r)
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                t.removeEventListener("wheel", o)
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                t.removeEventListener("dblclick", a)
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                n.unregisterMouseEvents()
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() => {
                !document.exitPointerLock ||
                  (document.pointerLockElement !== t &&
                    document.mozPointerLockElement !== t) ||
                  document.exitPointerLock();
              });
          }
          registerHoveringMouseEvents(e) {
            const t = this.videoElementProvider.getVideoParentElement(),
              n = new Ze(e),
              s = (e) => n.updateMouseMovePosition(e),
              i = (e) => n.handleMouseDown(e),
              r = (e) => n.handleMouseUp(e),
              o = (e) => n.handleContextMenu(e),
              a = (e) => n.handleMouseWheel(e),
              l = (e) => n.handleMouseDouble(e);
            t.addEventListener("mousemove", s),
              t.addEventListener("mousedown", i),
              t.addEventListener("mouseup", r),
              t.addEventListener("contextmenu", o),
              t.addEventListener("wheel", a),
              t.addEventListener("dblclick", l),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                t.removeEventListener("mousemove", s)
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                t.removeEventListener("mousedown", i)
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                t.removeEventListener("mouseup", r)
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                t.removeEventListener("contextmenu", o)
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                t.removeEventListener("wheel", a)
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                t.removeEventListener("dblclick", l)
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                n.unregisterMouseEvents()
              );
          }
          registerMouseEnterAndLeaveEvents() {
            const e = this.videoElementProvider.getVideoParentElement(),
              t = (e) => {
                this.videoElementProvider.isVideoReady() &&
                  (l.Log(l.GetStackTrace(), "Mouse Entered", 6),
                  this.sendMouseEnter(),
                  this.pressMouseButtons(e.buttons, e.x, e.y));
              },
              n = (e) => {
                this.videoElementProvider.isVideoReady() &&
                  (l.Log(l.GetStackTrace(), "Mouse Left", 6),
                  this.sendMouseLeave(),
                  this.releaseMouseButtons(e.buttons, e.x, e.y));
              };
            e.addEventListener("mouseenter", t),
              e.addEventListener("mouseleave", n),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                e.removeEventListener("mouseenter", t)
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                e.removeEventListener("mouseleave", n)
              );
          }
          releaseMouseButtons(e, t, n) {
            const s = this.coordinateConverter.normalizeAndQuantizeUnsigned(
              t,
              n
            );
            e & qe.primaryButton && this.sendMouseUp(Qe.mainButton, s.x, s.y),
              e & qe.secondaryButton &&
                this.sendMouseUp(Qe.secondaryButton, s.x, s.y),
              e & qe.auxiliaryButton &&
                this.sendMouseUp(Qe.auxiliaryButton, s.x, s.y),
              e & qe.fourthButton &&
                this.sendMouseUp(Qe.fourthButton, s.x, s.y),
              e & qe.fifthButton && this.sendMouseUp(Qe.fifthButton, s.x, s.y);
          }
          pressMouseButtons(e, t, n) {
            if (!this.videoElementProvider.isVideoReady()) return;
            const s = this.coordinateConverter.normalizeAndQuantizeUnsigned(
              t,
              n
            );
            e & qe.primaryButton && this.sendMouseDown(Qe.mainButton, s.x, s.y),
              e & qe.secondaryButton &&
                this.sendMouseDown(Qe.secondaryButton, s.x, s.y),
              e & qe.auxiliaryButton &&
                this.sendMouseDown(Qe.auxiliaryButton, s.x, s.y),
              e & qe.fourthButton &&
                this.sendMouseDown(Qe.fourthButton, s.x, s.y),
              e & qe.fifthButton &&
                this.sendMouseDown(Qe.fifthButton, s.x, s.y);
          }
          sendMouseEnter() {
            this.videoElementProvider.isVideoReady() &&
              this.toStreamerMessagesProvider.toStreamerHandlers.get(
                "MouseEnter"
              )();
          }
          sendMouseLeave() {
            this.videoElementProvider.isVideoReady() &&
              this.toStreamerMessagesProvider.toStreamerHandlers.get(
                "MouseLeave"
              )();
          }
          sendMouseDown(e, t, n) {
            this.videoElementProvider.isVideoReady() &&
              (l.Log(
                l.GetStackTrace(),
                `mouse button ${e} down at (${t}, ${n})`,
                6
              ),
              this.toStreamerMessagesProvider.toStreamerHandlers.get(
                "MouseDown"
              )([e, t, n]));
          }
          sendMouseUp(e, t, n) {
            if (!this.videoElementProvider.isVideoReady()) return;
            l.Log(l.GetStackTrace(), `mouse button ${e} up at (${t}, ${n})`, 6);
            const s = this.coordinateConverter.normalizeAndQuantizeUnsigned(
              t,
              n
            );
            this.toStreamerMessagesProvider.toStreamerHandlers.get("MouseUp")([
              e,
              s.x,
              s.y,
            ]);
          }
        }
        class tt {
          constructor(e, t, n) {
            (this.fingers = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]),
              (this.fingerIds = new Map()),
              (this.maxByteValue = 255),
              (this.touchEventListenerTracker = new je()),
              (this.toStreamerMessagesProvider = e),
              (this.videoElementProvider = t),
              (this.coordinateConverter = n),
              (this.videoElementParent = t.getVideoElement());
            const s = (e) => this.onTouchStart(e),
              i = (e) => this.onTouchEnd(e),
              r = (e) => this.onTouchMove(e);
            this.videoElementParent.addEventListener("touchstart", s, {
              passive: !1,
            }),
              this.videoElementParent.addEventListener("touchend", i, {
                passive: !1,
              }),
              this.videoElementParent.addEventListener("touchmove", r, {
                passive: !1,
              }),
              this.touchEventListenerTracker.addUnregisterCallback(() =>
                this.videoElementParent.removeEventListener("touchstart", s)
              ),
              this.touchEventListenerTracker.addUnregisterCallback(() =>
                this.videoElementParent.removeEventListener("touchend", i)
              ),
              this.touchEventListenerTracker.addUnregisterCallback(() =>
                this.videoElementParent.removeEventListener("touchmove", r)
              ),
              l.Log(l.GetStackTrace(), "Touch Events Registered", 6);
            const o = (e) => {
              e.preventDefault();
            };
            document.addEventListener("touchmove", o, { passive: !1 }),
              this.touchEventListenerTracker.addUnregisterCallback(() =>
                document.removeEventListener("touchmove", o)
              );
          }
          unregisterTouchEvents() {
            this.touchEventListenerTracker.unregisterAll();
          }
          rememberTouch(e) {
            const t = this.fingers.pop();
            void 0 === t &&
              l.Log(l.GetStackTrace(), "exhausted touch identifiers", 6),
              this.fingerIds.set(e.identifier, t);
          }
          forgetTouch(e) {
            this.fingers.push(this.fingerIds.get(e.identifier)),
              this.fingers.sort(function (e, t) {
                return t - e;
              }),
              this.fingerIds.delete(e.identifier);
          }
          onTouchStart(e) {
            if (this.videoElementProvider.isVideoReady()) {
              for (let t = 0; t < e.changedTouches.length; t++)
                this.rememberTouch(e.changedTouches[t]);
              l.Log(l.GetStackTrace(), "touch start", 6),
                this.emitTouchData("TouchStart", e.changedTouches),
                e.preventDefault();
            }
          }
          onTouchEnd(e) {
            if (this.videoElementProvider.isVideoReady()) {
              l.Log(l.GetStackTrace(), "touch end", 6),
                this.emitTouchData("TouchEnd", e.changedTouches);
              for (let t = 0; t < e.changedTouches.length; t++)
                this.forgetTouch(e.changedTouches[t]);
              e.preventDefault();
            }
          }
          onTouchMove(e) {
            this.videoElementProvider.isVideoReady() &&
              (l.Log(l.GetStackTrace(), "touch move", 6),
              this.emitTouchData("TouchMove", e.touches),
              e.preventDefault());
          }
          emitTouchData(e, t) {
            if (!this.videoElementProvider.isVideoReady()) return;
            const n = this.videoElementProvider.getVideoParentElement(),
              s = this.toStreamerMessagesProvider.toStreamerHandlers;
            for (let i = 0; i < t.length; i++) {
              const r = 1,
                o = t[i],
                a = o.clientX - n.offsetLeft,
                c = o.clientY - n.offsetTop;
              l.Log(
                l.GetStackTrace(),
                `F${this.fingerIds.get(o.identifier)}=(${a}, ${c})`,
                6
              );
              const d = this.coordinateConverter.normalizeAndQuantizeUnsigned(
                a,
                c
              );
              switch (e) {
                case "TouchStart":
                  s.get("TouchStart")([
                    r,
                    d.x,
                    d.y,
                    this.fingerIds.get(o.identifier),
                    this.maxByteValue * o.force,
                    d.inRange ? 1 : 0,
                  ]);
                  break;
                case "TouchEnd":
                  s.get("TouchEnd")([
                    r,
                    d.x,
                    d.y,
                    this.fingerIds.get(o.identifier),
                    this.maxByteValue * o.force,
                    d.inRange ? 1 : 0,
                  ]);
                  break;
                case "TouchMove":
                  s.get("TouchMove")([
                    r,
                    d.x,
                    d.y,
                    this.fingerIds.get(o.identifier),
                    this.maxByteValue * o.force,
                    d.inRange ? 1 : 0,
                  ]);
              }
            }
          }
        }
        class nt {
          constructor(e) {
            (this.gamePadEventListenerTracker = new je()),
              (this.toStreamerMessagesProvider = e),
              (this.requestAnimationFrame = (
                window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.requestAnimationFrame
              ).bind(window));
            const t = window;
            if ("GamepadEvent" in t) {
              const e = (e) => this.gamePadConnectHandler(e),
                t = (e) => this.gamePadDisconnectHandler(e);
              window.addEventListener("gamepadconnected", e),
                window.addEventListener("gamepaddisconnected", t),
                this.gamePadEventListenerTracker.addUnregisterCallback(() =>
                  window.removeEventListener("gamepadconnected", e)
                ),
                this.gamePadEventListenerTracker.addUnregisterCallback(() =>
                  window.removeEventListener("gamepaddisconnected", t)
                );
            } else if ("WebKitGamepadEvent" in t) {
              const e = (e) => this.gamePadConnectHandler(e),
                t = (e) => this.gamePadDisconnectHandler(e);
              window.addEventListener("webkitgamepadconnected", e),
                window.addEventListener("webkitgamepaddisconnected", t),
                this.gamePadEventListenerTracker.addUnregisterCallback(() =>
                  window.removeEventListener("webkitgamepadconnected", e)
                ),
                this.gamePadEventListenerTracker.addUnregisterCallback(() =>
                  window.removeEventListener("webkitgamepaddisconnected", t)
                );
            }
            if (((this.controllers = []), navigator.getGamepads))
              for (const e of navigator.getGamepads())
                e &&
                  this.gamePadConnectHandler(
                    new GamepadEvent("gamepadconnected", { gamepad: e })
                  );
          }
          unregisterGamePadEvents() {
            this.gamePadEventListenerTracker.unregisterAll();
            for (const e of this.controllers)
              void 0 !== e.id && this.onGamepadDisconnected(e.id);
            (this.controllers = []),
              (this.onGamepadConnected = () => {}),
              (this.onGamepadDisconnected = () => {});
          }
          gamePadConnectHandler(e) {
            l.Log(l.GetStackTrace(), "Gamepad connect handler", 6);
            const t = e.gamepad,
              n = { currentState: t, prevState: t, id: void 0 };
            this.controllers.push(n),
              (this.controllers[t.index].currentState = t),
              (this.controllers[t.index].prevState = t),
              l.Log(l.GetStackTrace(), "gamepad: " + t.id + " connected", 6),
              window.requestAnimationFrame(() => this.updateStatus()),
              this.onGamepadConnected();
          }
          gamePadDisconnectHandler(e) {
            l.Log(l.GetStackTrace(), "Gamepad disconnect handler", 6),
              l.Log(
                l.GetStackTrace(),
                "gamepad: " + e.gamepad.id + " disconnected",
                6
              );
            const t = this.controllers[e.gamepad.index];
            delete this.controllers[e.gamepad.index],
              (this.controllers = this.controllers.filter((e) => void 0 !== e)),
              this.onGamepadDisconnected(t.id);
          }
          scanGamePads() {
            const e = navigator.getGamepads
              ? navigator.getGamepads()
              : navigator.webkitGetGamepads
              ? navigator.webkitGetGamepads()
              : [];
            for (let t = 0; t < e.length; t++)
              e[t] &&
                e[t].index in this.controllers &&
                (this.controllers[e[t].index].currentState = e[t]);
          }
          updateStatus() {
            this.scanGamePads();
            const e = this.toStreamerMessagesProvider.toStreamerHandlers;
            for (const t of this.controllers) {
              const n = void 0 === t.id ? this.controllers.indexOf(t) : t.id,
                s = t.currentState;
              for (let s = 0; s < t.currentState.buttons.length; s++) {
                const i = t.currentState.buttons[s],
                  r = t.prevState.buttons[s];
                i.pressed
                  ? s == Ie.LeftTrigger
                    ? e.get("GamepadAnalog")([n, 5, i.value])
                    : s == Ie.RightTrigger
                    ? e.get("GamepadAnalog")([n, 6, i.value])
                    : e.get("GamepadButtonPressed")([n, s, r.pressed ? 1 : 0])
                  : !i.pressed &&
                    r.pressed &&
                    (s == Ie.LeftTrigger
                      ? e.get("GamepadAnalog")([n, 5, 0])
                      : s == Ie.RightTrigger
                      ? e.get("GamepadAnalog")([n, 6, 0])
                      : e.get("GamepadButtonReleased")([n, s]));
              }
              for (let t = 0; t < s.axes.length; t += 2) {
                const i = parseFloat(s.axes[t].toFixed(4)),
                  r = -parseFloat(s.axes[t + 1].toFixed(4));
                e.get("GamepadAnalog")([n, t + 1, i]),
                  e.get("GamepadAnalog")([n, t + 2, r]);
              }
              this.controllers[n].prevState = s;
            }
            this.controllers.length > 0 &&
              this.requestAnimationFrame(() => this.updateStatus());
          }
          onGamepadResponseReceived(e) {
            for (const t of this.controllers)
              if (void 0 === t.id) {
                t.id = e;
                break;
              }
          }
          onGamepadConnected() {}
          onGamepadDisconnected(e) {}
        }
        !(function (e) {
          (e[(e.RightClusterBottomButton = 0)] = "RightClusterBottomButton"),
            (e[(e.RightClusterRightButton = 1)] = "RightClusterRightButton"),
            (e[(e.RightClusterLeftButton = 2)] = "RightClusterLeftButton"),
            (e[(e.RightClusterTopButton = 3)] = "RightClusterTopButton"),
            (e[(e.LeftShoulder = 4)] = "LeftShoulder"),
            (e[(e.RightShoulder = 5)] = "RightShoulder"),
            (e[(e.LeftTrigger = 6)] = "LeftTrigger"),
            (e[(e.RightTrigger = 7)] = "RightTrigger"),
            (e[(e.SelectOrBack = 8)] = "SelectOrBack"),
            (e[(e.StartOrForward = 9)] = "StartOrForward"),
            (e[(e.LeftAnalogPress = 10)] = "LeftAnalogPress"),
            (e[(e.RightAnalogPress = 11)] = "RightAnalogPress"),
            (e[(e.LeftClusterTopButton = 12)] = "LeftClusterTopButton"),
            (e[(e.LeftClusterBottomButton = 13)] = "LeftClusterBottomButton"),
            (e[(e.LeftClusterLeftButton = 14)] = "LeftClusterLeftButton"),
            (e[(e.LeftClusterRightButton = 15)] = "LeftClusterRightButton"),
            (e[(e.CentreButton = 16)] = "CentreButton"),
            (e[(e.LeftStickHorizontal = 0)] = "LeftStickHorizontal"),
            (e[(e.LeftStickVertical = 1)] = "LeftStickVertical"),
            (e[(e.RightStickHorizontal = 2)] = "RightStickHorizontal"),
            (e[(e.RightStickVertical = 3)] = "RightStickVertical");
        })(Ie || (Ie = {}));
        class st {
          constructor(e, t, n) {
            (this.activeKeys = new it()),
              (this.toStreamerMessagesProvider = e),
              (this.videoElementProvider = t),
              (this.coordinateConverter = n);
          }
          registerKeyBoard(e) {
            l.Log(l.GetStackTrace(), "Register Keyboard Events", 7);
            const t = new Ye(
              this.toStreamerMessagesProvider,
              e,
              this.activeKeys
            );
            return t.registerKeyBoardEvents(), t;
          }
          registerMouse(e) {
            l.Log(l.GetStackTrace(), "Register Mouse Events", 7);
            const t = new et(
              this.toStreamerMessagesProvider,
              this.videoElementProvider,
              this.coordinateConverter,
              this.activeKeys
            );
            switch (e) {
              case Ce.LockedMouse:
                t.registerLockedMouseEvents(t);
                break;
              case Ce.HoveringMouse:
                t.registerHoveringMouseEvents(t);
                break;
              default:
                l.Info(
                  l.GetStackTrace(),
                  "unknown Control Scheme Type Defaulting to Locked Mouse Events"
                ),
                  t.registerLockedMouseEvents(t);
            }
            return t;
          }
          registerTouch(e, t) {
            if ((l.Log(l.GetStackTrace(), "Registering Touch", 6), e)) {
              const e = new Ke(
                this.toStreamerMessagesProvider,
                this.videoElementProvider,
                this.coordinateConverter
              );
              return e.setVideoElementParentClientRect(t), e;
            }
            return new tt(
              this.toStreamerMessagesProvider,
              this.videoElementProvider,
              this.coordinateConverter
            );
          }
          registerGamePad() {
            return (
              l.Log(l.GetStackTrace(), "Register Game Pad", 7),
              new nt(this.toStreamerMessagesProvider)
            );
          }
        }
        class it {
          constructor() {
            (this.activeKeys = []), (this.activeKeys = []);
          }
          getActiveKeys() {
            return this.activeKeys;
          }
        }
        class rt {
          constructor(e, t) {
            (this.lastTimeResized = new Date().getTime()),
              (this.videoElement = document.createElement("video")),
              (this.config = t),
              (this.videoElement.id = "streamingVideo"),
              (this.videoElement.disablePictureInPicture = !0),
              (this.videoElement.playsInline = !0),
              (this.videoElement.style.width = "100%"),
              (this.videoElement.style.height = "100%"),
              (this.videoElement.style.position = "absolute"),
              (this.videoElement.style.pointerEvents = "all"),
              e.appendChild(this.videoElement),
              (this.onResizePlayerCallback = () => {
                console.log(
                  "Resolution changed, restyling player, did you forget to override this function?"
                );
              }),
              (this.onMatchViewportResolutionCallback = () => {
                console.log(
                  "Resolution changed and match viewport resolution is turned on, did you forget to override this function?"
                );
              }),
              (this.videoElement.onclick = () => {
                this.videoElement.paused && this.videoElement.play();
              }),
              (this.videoElement.onloadedmetadata = () => {
                this.onVideoInitialized();
              }),
              window.addEventListener(
                "resize",
                () => this.resizePlayerStyle(),
                !0
              ),
              window.addEventListener("orientationchange", () =>
                this.onOrientationChange()
              );
          }
          play() {
            return (
              (this.videoElement.muted = this.config.isFlagEnabled(
                de.StartVideoMuted
              )),
              (this.videoElement.autoplay = this.config.isFlagEnabled(
                de.AutoPlayVideo
              )),
              this.videoElement.play()
            );
          }
          isPaused() {
            return this.videoElement.paused;
          }
          isVideoReady() {
            return (
              void 0 !== this.videoElement.readyState &&
              this.videoElement.readyState > 0
            );
          }
          hasVideoSource() {
            return (
              void 0 !== this.videoElement.srcObject &&
              null !== this.videoElement.srcObject
            );
          }
          getVideoElement() {
            return this.videoElement;
          }
          getVideoParentElement() {
            return this.videoElement.parentElement;
          }
          setVideoEnabled(e) {
            this.videoElement.srcObject
              .getTracks()
              .forEach((t) => (t.enabled = e));
          }
          onVideoInitialized() {}
          onOrientationChange() {
            clearTimeout(this.orientationChangeTimeout),
              (this.orientationChangeTimeout = window.setTimeout(() => {
                this.resizePlayerStyle();
              }, 500));
          }
          resizePlayerStyle() {
            const e = this.getVideoParentElement();
            e &&
              (this.updateVideoStreamSize(),
              e.classList.contains("fixed-size") ||
                this.resizePlayerStyleToFillParentElement(),
              this.onResizePlayerCallback());
          }
          resizePlayerStyleToFillParentElement() {
            this.getVideoParentElement().setAttribute(
              "style",
              "top: 0px; left: 0px; width: 100%; height: 100%; cursor: default;"
            );
          }
          updateVideoStreamSize() {
            if (this.config.isFlagEnabled(de.MatchViewportResolution))
              if (new Date().getTime() - this.lastTimeResized > 300) {
                const e = this.getVideoParentElement();
                if (!e) return;
                this.onMatchViewportResolutionCallback(
                  e.clientWidth,
                  e.clientHeight
                ),
                  (this.lastTimeResized = new Date().getTime());
              } else
                l.Log(l.GetStackTrace(), "Resizing too often - skipping", 6),
                  clearTimeout(this.resizeTimeoutHandle),
                  (this.resizeTimeoutHandle = window.setTimeout(
                    () => this.updateVideoStreamSize(),
                    100
                  ));
          }
        }
        class ot {
          constructor() {
            (this.map = new Map()), (this.reverseMap = new Map());
          }
          getFromKey(e) {
            return this.map.get(e);
          }
          getFromValue(e) {
            return this.reverseMap.get(e);
          }
          add(e, t) {
            this.map.set(e, t), this.reverseMap.set(t, e);
          }
          remove(e, t) {
            this.map.delete(e), this.reverseMap.delete(t);
          }
        }
        class at {
          constructor() {
            (this.toStreamerHandlers = new Map()),
              (this.fromStreamerHandlers = new Map()),
              (this.toStreamerMessages = new ot()),
              (this.fromStreamerMessages = new ot());
          }
          populateDefaultProtocol() {
            this.toStreamerMessages.add("IFrameRequest", {
              id: 0,
              byteLength: 0,
              structure: [],
            }),
              this.toStreamerMessages.add("RequestQualityControl", {
                id: 1,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add("FpsRequest", {
                id: 2,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add("AverageBitrateRequest", {
                id: 3,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add("StartStreaming", {
                id: 4,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add("StopStreaming", {
                id: 5,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add("LatencyTest", {
                id: 6,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add("RequestInitialSettings", {
                id: 7,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add("TestEcho", {
                id: 8,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add("UIInteraction", {
                id: 50,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add("Command", {
                id: 51,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add("KeyDown", {
                id: 60,
                byteLength: 2,
                structure: ["uint8", "uint8"],
              }),
              this.toStreamerMessages.add("KeyUp", {
                id: 61,
                byteLength: 1,
                structure: ["uint8"],
              }),
              this.toStreamerMessages.add("KeyPress", {
                id: 62,
                byteLength: 2,
                structure: ["uint16"],
              }),
              this.toStreamerMessages.add("MouseEnter", {
                id: 70,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add("MouseLeave", {
                id: 71,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add("MouseDown", {
                id: 72,
                byteLength: 5,
                structure: ["uint8", "uint16", "uint16"],
              }),
              this.toStreamerMessages.add("MouseUp", {
                id: 73,
                byteLength: 5,
                structure: ["uint8", "uint16", "uint16"],
              }),
              this.toStreamerMessages.add("MouseMove", {
                id: 74,
                byteLength: 8,
                structure: ["uint16", "uint16", "int16", "int16"],
              }),
              this.toStreamerMessages.add("MouseWheel", {
                id: 75,
                byteLength: 6,
                structure: ["int16", "uint16", "uint16"],
              }),
              this.toStreamerMessages.add("MouseDouble", {
                id: 76,
                byteLength: 5,
                structure: ["uint8", "uint16", "uint16"],
              }),
              this.toStreamerMessages.add("TouchStart", {
                id: 80,
                byteLength: 8,
                structure: [
                  "uint8",
                  "uint16",
                  "uint16",
                  "uint8",
                  "uint8",
                  "uint8",
                ],
              }),
              this.toStreamerMessages.add("TouchEnd", {
                id: 81,
                byteLength: 8,
                structure: [
                  "uint8",
                  "uint16",
                  "uint16",
                  "uint8",
                  "uint8",
                  "uint8",
                ],
              }),
              this.toStreamerMessages.add("TouchMove", {
                id: 82,
                byteLength: 8,
                structure: [
                  "uint8",
                  "uint16",
                  "uint16",
                  "uint8",
                  "uint8",
                  "uint8",
                ],
              }),
              this.toStreamerMessages.add("GamepadConnected", {
                id: 93,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add("GamepadButtonPressed", {
                id: 90,
                byteLength: 3,
                structure: ["uint8", "uint8", "uint8"],
              }),
              this.toStreamerMessages.add("GamepadButtonReleased", {
                id: 91,
                byteLength: 3,
                structure: ["uint8", "uint8", "uint8"],
              }),
              this.toStreamerMessages.add("GamepadAnalog", {
                id: 92,
                byteLength: 10,
                structure: ["uint8", "uint8", "double"],
              }),
              this.toStreamerMessages.add("GamepadDisconnected", {
                id: 94,
                byteLength: 1,
                structure: ["uint8"],
              }),
              this.fromStreamerMessages.add("QualityControlOwnership", 0),
              this.fromStreamerMessages.add("Response", 1),
              this.fromStreamerMessages.add("Command", 2),
              this.fromStreamerMessages.add("FreezeFrame", 3),
              this.fromStreamerMessages.add("UnfreezeFrame", 4),
              this.fromStreamerMessages.add("VideoEncoderAvgQP", 5),
              this.fromStreamerMessages.add("LatencyTest", 6),
              this.fromStreamerMessages.add("InitialSettings", 7),
              this.fromStreamerMessages.add("FileExtension", 8),
              this.fromStreamerMessages.add("FileMimeType", 9),
              this.fromStreamerMessages.add("FileContents", 10),
              this.fromStreamerMessages.add("TestEcho", 11),
              this.fromStreamerMessages.add("InputControlOwnership", 12),
              this.fromStreamerMessages.add("GamepadResponse", 13),
              this.fromStreamerMessages.add("Protocol", 255);
          }
          registerMessageHandler(e, t, n) {
            switch (e) {
              case _e.ToStreamer:
                this.toStreamerHandlers.set(t, n);
                break;
              case _e.FromStreamer:
                this.fromStreamerHandlers.set(t, n);
                break;
              default:
                l.Log(l.GetStackTrace(), `Unknown message direction ${e}`);
            }
          }
        }
        !(function (e) {
          (e[(e.ToStreamer = 0)] = "ToStreamer"),
            (e[(e.FromStreamer = 1)] = "FromStreamer");
        })(_e || (_e = {}));
        class lt {
          constructor() {
            this.responseEventListeners = new Map();
          }
          addResponseEventListener(e, t) {
            this.responseEventListeners.set(e, t);
          }
          removeResponseEventListener(e) {
            this.responseEventListeners.delete(e);
          }
          onResponse(e) {
            l.Log(
              l.GetStackTrace(),
              "DataChannelReceiveMessageType.Response",
              6
            );
            const t = new TextDecoder("utf-16").decode(e.slice(1));
            l.Log(l.GetStackTrace(), t, 6),
              this.responseEventListeners.forEach((e) => {
                e(t);
              });
          }
        }
        class ct {
          constructor(e, t) {
            (this.dataChannelSender = e),
              (this.toStreamerMessagesMapProvider = t);
          }
          sendLatencyTest(e) {
            this.sendDescriptor("LatencyTest", e);
          }
          emitCommand(e) {
            this.sendDescriptor("Command", e);
          }
          emitUIInteraction(e) {
            this.sendDescriptor("UIInteraction", e);
          }
          sendDescriptor(e, t) {
            const n = JSON.stringify(t),
              s =
                this.toStreamerMessagesMapProvider.toStreamerMessages.getFromKey(
                  e
                );
            void 0 === s &&
              l.Error(
                l.GetStackTrace(),
                `Attempted to emit descriptor with message type: ${e}, but the frontend hasn't been configured to send such a message. Check you've added the message type in your cpp`
              ),
              l.Log(l.GetStackTrace(), "Sending: " + t, 6);
            const i = new DataView(new ArrayBuffer(3 + 2 * n.length));
            let r = 0;
            i.setUint8(r, s.id), r++, i.setUint16(r, n.length, !0), (r += 2);
            for (let e = 0; e < n.length; e++)
              i.setUint16(r, n.charCodeAt(e), !0), (r += 2);
            this.dataChannelSender.canSend()
              ? this.dataChannelSender.sendData(i.buffer)
              : l.Info(
                  l.GetStackTrace(),
                  `Data channel cannot send yet, skipping sending descriptor message: ${e} - ${n}`
                );
          }
        }
        class dt {
          constructor(e, t) {
            (this.dataChannelSender = e),
              (this.toStreamerMessagesMapProvider = t);
          }
          sendMessageToStreamer(e, t) {
            void 0 === t && (t = []);
            const n =
              this.toStreamerMessagesMapProvider.toStreamerMessages.getFromKey(
                e
              );
            if (void 0 === n)
              return void l.Error(
                l.GetStackTrace(),
                `Attempted to send a message to the streamer with message type: ${e}, but the frontend hasn't been configured to send such a message. Check you've added the message type in your cpp`
              );
            const s = new DataView(new ArrayBuffer(n.byteLength + 1));
            s.setUint8(0, n.id);
            let i = 1;
            t.forEach((e, t) => {
              switch (n.structure[t]) {
                case "uint8":
                  s.setUint8(i, e), (i += 1);
                  break;
                case "uint16":
                  s.setUint16(i, e, !0), (i += 2);
                  break;
                case "int16":
                  s.setInt16(i, e, !0), (i += 2);
                  break;
                case "float":
                  s.setFloat32(i, e, !0), (i += 4);
                  break;
                case "double":
                  s.setFloat64(i, e, !0), (i += 8);
              }
            }),
              this.dataChannelSender.canSend()
                ? this.dataChannelSender.sendData(s.buffer)
                : l.Info(
                    l.GetStackTrace(),
                    `Data channel cannot send yet, skipping sending message: ${e} - ${new Uint8Array(
                      s.buffer
                    )}`
                  );
          }
        }
        class ht {
          constructor(e) {
            this.sendMessageController = e;
          }
          SendRequestQualityControl() {
            this.sendMessageController.sendMessageToStreamer(
              "RequestQualityControl"
            );
          }
          SendMaxFpsRequest() {
            this.sendMessageController.sendMessageToStreamer("FpsRequest");
          }
          SendAverageBitrateRequest() {
            this.sendMessageController.sendMessageToStreamer(
              "AverageBitrateRequest"
            );
          }
          SendStartStreaming() {
            this.sendMessageController.sendMessageToStreamer("StartStreaming");
          }
          SendStopStreaming() {
            this.sendMessageController.sendMessageToStreamer("StopStreaming");
          }
          SendRequestInitialSettings() {
            this.sendMessageController.sendMessageToStreamer(
              "RequestInitialSettings"
            );
          }
        }
        class ut {
          constructor(e) {
            this.dataChannelProvider = e;
          }
          canSend() {
            return (
              void 0 !==
                this.dataChannelProvider.getDataChannelInstance().dataChannel &&
              "open" ==
                this.dataChannelProvider.getDataChannelInstance().dataChannel
                  .readyState
            );
          }
          sendData(e) {
            const t = this.dataChannelProvider.getDataChannelInstance();
            "open" == t.dataChannel.readyState
              ? (t.dataChannel.send(e),
                l.Log(
                  l.GetStackTrace(),
                  `Message Sent: ${new Uint8Array(e)}`,
                  6
                ),
                this.resetAfkWarningTimerOnDataSend())
              : l.Error(
                  l.GetStackTrace(),
                  `Message Failed: ${new Uint8Array(e)}`
                );
          }
          resetAfkWarningTimerOnDataSend() {}
        }
        class mt {
          constructor(e) {
            (this.videoElementProvider = e),
              (this.normalizeAndQuantizeUnsignedFunc = () => {
                throw new Error(
                  "Normalize and quantize unsigned, method not implemented."
                );
              }),
              (this.normalizeAndQuantizeSignedFunc = () => {
                throw new Error(
                  "Normalize and unquantize signed, method not implemented."
                );
              }),
              (this.denormalizeAndUnquantizeUnsignedFunc = () => {
                throw new Error(
                  "Denormalize and unquantize unsigned, method not implemented."
                );
              });
          }
          normalizeAndQuantizeUnsigned(e, t) {
            return this.normalizeAndQuantizeUnsignedFunc(e, t);
          }
          unquantizeAndDenormalizeUnsigned(e, t) {
            return this.denormalizeAndUnquantizeUnsignedFunc(e, t);
          }
          normalizeAndQuantizeSigned(e, t) {
            return this.normalizeAndQuantizeSignedFunc(e, t);
          }
          setupNormalizeAndQuantize() {
            if (
              ((this.videoElementParent =
                this.videoElementProvider.getVideoParentElement()),
              (this.videoElement = this.videoElementProvider.getVideoElement()),
              this.videoElementParent && this.videoElement)
            ) {
              const e =
                  this.videoElementParent.clientHeight /
                  this.videoElementParent.clientWidth,
                t =
                  this.videoElement.videoHeight / this.videoElement.videoWidth;
              e > t
                ? (l.Log(
                    l.GetStackTrace(),
                    "Setup Normalize and Quantize for playerAspectRatio > videoAspectRatio",
                    6
                  ),
                  (this.ratio = e / t),
                  (this.normalizeAndQuantizeUnsignedFunc = (e, t) =>
                    this.normalizeAndQuantizeUnsignedPlayerBigger(e, t)),
                  (this.normalizeAndQuantizeSignedFunc = (e, t) =>
                    this.normalizeAndQuantizeSignedPlayerBigger(e, t)),
                  (this.denormalizeAndUnquantizeUnsignedFunc = (e, t) =>
                    this.denormalizeAndUnquantizeUnsignedPlayerBigger(e, t)))
                : (l.Log(
                    l.GetStackTrace(),
                    "Setup Normalize and Quantize for playerAspectRatio <= videoAspectRatio",
                    6
                  ),
                  (this.ratio = t / e),
                  (this.normalizeAndQuantizeUnsignedFunc = (e, t) =>
                    this.normalizeAndQuantizeUnsignedPlayerSmaller(e, t)),
                  (this.normalizeAndQuantizeSignedFunc = (e, t) =>
                    this.normalizeAndQuantizeSignedPlayerSmaller(e, t)),
                  (this.denormalizeAndUnquantizeUnsignedFunc = (e, t) =>
                    this.denormalizeAndUnquantizeUnsignedPlayerSmaller(e, t)));
            }
          }
          normalizeAndQuantizeUnsignedPlayerBigger(e, t) {
            const n = e / this.videoElementParent.clientWidth,
              s =
                this.ratio * (t / this.videoElementParent.clientHeight - 0.5) +
                0.5;
            return n < 0 || n > 1 || s < 0 || s > 1
              ? new gt(!1, 65535, 65535)
              : new gt(!0, 65536 * n, 65536 * s);
          }
          denormalizeAndUnquantizeUnsignedPlayerBigger(e, t) {
            const n = e / 65536,
              s = (t / 65536 - 0.5) / this.ratio + 0.5;
            return new pt(
              n * this.videoElementParent.clientWidth,
              s * this.videoElementParent.clientHeight
            );
          }
          normalizeAndQuantizeSignedPlayerBigger(e, t) {
            const n = e / (0.5 * this.videoElementParent.clientWidth),
              s =
                (this.ratio * t) / (0.5 * this.videoElementParent.clientHeight);
            return new vt(32767 * n, 32767 * s);
          }
          normalizeAndQuantizeUnsignedPlayerSmaller(e, t) {
            const n =
                this.ratio * (e / this.videoElementParent.clientWidth - 0.5) +
                0.5,
              s = t / this.videoElementParent.clientHeight;
            return n < 0 || n > 1 || s < 0 || s > 1
              ? new gt(!1, 65535, 65535)
              : new gt(!0, 65536 * n, 65536 * s);
          }
          denormalizeAndUnquantizeUnsignedPlayerSmaller(e, t) {
            const n = (e / 65536 - 0.5) / this.ratio + 0.5,
              s = t / 65536;
            return new pt(
              n * this.videoElementParent.clientWidth,
              s * this.videoElementParent.clientHeight
            );
          }
          normalizeAndQuantizeSignedPlayerSmaller(e, t) {
            const n =
                (this.ratio * e) / (0.5 * this.videoElementParent.clientWidth),
              s = t / (0.5 * this.videoElementParent.clientHeight);
            return new vt(32767 * n, 32767 * s);
          }
        }
        class gt {
          constructor(e, t, n) {
            (this.inRange = e), (this.x = t), (this.y = n);
          }
        }
        class pt {
          constructor(e, t) {
            (this.x = e), (this.y = t);
          }
        }
        class vt {
          constructor(e, t) {
            (this.x = e), (this.y = t);
          }
        }
        class ft {
          constructor(e, t) {
            (this.shouldShowPlayOverlay = !0),
              (this.config = e),
              (this.pixelStreaming = t),
              (this.responseController = new lt()),
              (this.file = new Ve()),
              (this.sdpConstraints = {
                offerToReceiveAudio: !0,
                offerToReceiveVideo: !0,
              }),
              (this.afkController = new ye(
                this.config,
                this.pixelStreaming,
                this.onAfkTriggered.bind(this)
              )),
              (this.afkController.onAFKTimedOutCallback = () => {
                this.setDisconnectMessageOverride(
                  "You have been disconnected due to inactivity"
                ),
                  this.closeSignalingServer();
              }),
              (this.freezeFrameController = new x(
                this.pixelStreaming.videoElementParent
              )),
              (this.videoPlayer = new rt(
                this.pixelStreaming.videoElementParent,
                this.config
              )),
              (this.videoPlayer.onVideoInitialized = () =>
                this.handleVideoInitialized()),
              (this.videoPlayer.onMatchViewportResolutionCallback = (e, t) => {
                const n = { "Resolution.Width": e, "Resolution.Height": t };
                this.sendDescriptorController.emitCommand(n);
              }),
              (this.videoPlayer.onResizePlayerCallback = () => {
                this.setUpMouseAndFreezeFrame();
              }),
              (this.streamController = new w(this.videoPlayer)),
              (this.coordinateConverter = new mt(this.videoPlayer)),
              (this.sendrecvDataChannelController = new be()),
              (this.recvDataChannelController = new be()),
              this.registerDataChannelEventEmitters(
                this.sendrecvDataChannelController
              ),
              this.registerDataChannelEventEmitters(
                this.recvDataChannelController
              ),
              (this.dataChannelSender = new ut(
                this.sendrecvDataChannelController
              )),
              (this.dataChannelSender.resetAfkWarningTimerOnDataSend = () =>
                this.afkController.resetAfkWarningTimer()),
              (this.streamMessageController = new at()),
              (this.webSocketController = new E()),
              (this.webSocketController.onConfig = (e) =>
                this.handleOnConfigMessage(e)),
              (this.webSocketController.onStreamerList = (e) =>
                this.handleStreamerListMessage(e)),
              (this.webSocketController.onWebSocketOncloseOverlayMessage = (
                e
              ) => {
                this.pixelStreaming._onDisconnect(
                  `Websocket disconnect (${e.code}) ${
                    "" != e.reason ? "- " + e.reason : ""
                  }`
                ),
                  this.setVideoEncoderAvgQP(0);
              }),
              this.webSocketController.onOpen.addEventListener("open", () => {
                this.config.isFlagEnabled(de.BrowserSendOffer) ||
                  this.webSocketController.requestStreamerList();
              }),
              this.webSocketController.onClose.addEventListener("close", () => {
                this.afkController.stopAfkWarningTimer(),
                  this.statsTimerHandle &&
                    void 0 !== this.statsTimerHandle &&
                    window.clearInterval(this.statsTimerHandle),
                  this.setTouchInputEnabled(!1),
                  this.setMouseInputEnabled(!1),
                  this.setKeyboardInputEnabled(!1),
                  this.setGamePadInputEnabled(!1),
                  this.shouldReconnect &&
                    this.config.getNumericSettingValue(
                      ue.MaxReconnectAttempts
                    ) > 0 &&
                    ((this.isReconnecting = !0),
                    this.reconnectAttempt++,
                    this.restartStreamAutomatically());
              }),
              (this.sendDescriptorController = new ct(
                this.dataChannelSender,
                this.streamMessageController
              )),
              (this.sendMessageController = new dt(
                this.dataChannelSender,
                this.streamMessageController
              )),
              (this.toStreamerMessagesController = new ht(
                this.sendMessageController
              )),
              this.registerMessageHandlers(),
              this.streamMessageController.populateDefaultProtocol(),
              (this.inputClassesFactory = new st(
                this.streamMessageController,
                this.videoPlayer,
                this.coordinateConverter
              )),
              (this.isUsingSFU = !1),
              (this.isQualityController = !1),
              (this.preferredCodec = ""),
              (this.shouldReconnect = !0),
              (this.isReconnecting = !1),
              (this.reconnectAttempt = 0),
              this.config._addOnOptionSettingChangedListener(
                ve.StreamerId,
                (e) => {
                  "" !== e &&
                    (this.peerConnectionController.peerConnection.close(),
                    this.peerConnectionController.createPeerConnection(
                      this.peerConfig,
                      this.preferredCodec
                    ),
                    (this.subscribedStream = e),
                    this.webSocketController.sendSubscribe(e));
                }
              ),
              this.setVideoEncoderAvgQP(-1),
              (this.signallingUrlBuilder = () => {
                let e = this.config.getTextSettingValue(ge.SignallingServerUrl);
                return (
                  this.config.isFlagEnabled(de.BrowserSendOffer) &&
                    (e += "?" + de.BrowserSendOffer + "=true"),
                  e
                );
              });
          }
          requestUnquantizedAndDenormalizeUnsigned(e, t) {
            return this.coordinateConverter.unquantizeAndDenormalizeUnsigned(
              e,
              t
            );
          }
          handleOnMessage(e) {
            const t = new Uint8Array(e.data);
            l.Log(l.GetStackTrace(), "Message incoming:" + t, 6);
            const n =
              this.streamMessageController.fromStreamerMessages.getFromValue(
                t[0]
              );
            this.streamMessageController.fromStreamerHandlers.get(n)(e.data);
          }
          registerMessageHandlers() {
            this.streamMessageController.registerMessageHandler(
              _e.FromStreamer,
              "QualityControlOwnership",
              (e) => this.onQualityControlOwnership(e)
            ),
              this.streamMessageController.registerMessageHandler(
                _e.FromStreamer,
                "Response",
                (e) => this.responseController.onResponse(e)
              ),
              this.streamMessageController.registerMessageHandler(
                _e.FromStreamer,
                "Command",
                (e) => {
                  this.onCommand(e);
                }
              ),
              this.streamMessageController.registerMessageHandler(
                _e.FromStreamer,
                "FreezeFrame",
                (e) => this.onFreezeFrameMessage(e)
              ),
              this.streamMessageController.registerMessageHandler(
                _e.FromStreamer,
                "UnfreezeFrame",
                () => this.invalidateFreezeFrameAndEnableVideo()
              ),
              this.streamMessageController.registerMessageHandler(
                _e.FromStreamer,
                "VideoEncoderAvgQP",
                (e) => this.handleVideoEncoderAvgQP(e)
              ),
              this.streamMessageController.registerMessageHandler(
                _e.FromStreamer,
                "LatencyTest",
                (e) => this.handleLatencyTestResult(e)
              ),
              this.streamMessageController.registerMessageHandler(
                _e.FromStreamer,
                "InitialSettings",
                (e) => this.handleInitialSettings(e)
              ),
              this.streamMessageController.registerMessageHandler(
                _e.FromStreamer,
                "FileExtension",
                (e) => this.onFileExtension(e)
              ),
              this.streamMessageController.registerMessageHandler(
                _e.FromStreamer,
                "FileMimeType",
                (e) => this.onFileMimeType(e)
              ),
              this.streamMessageController.registerMessageHandler(
                _e.FromStreamer,
                "FileContents",
                (e) => this.onFileContents(e)
              ),
              this.streamMessageController.registerMessageHandler(
                _e.FromStreamer,
                "TestEcho",
                () => {}
              ),
              this.streamMessageController.registerMessageHandler(
                _e.FromStreamer,
                "InputControlOwnership",
                (e) => this.onInputControlOwnership(e)
              ),
              this.streamMessageController.registerMessageHandler(
                _e.FromStreamer,
                "GamepadResponse",
                (e) => this.onGamepadResponse(e)
              ),
              this.streamMessageController.registerMessageHandler(
                _e.FromStreamer,
                "Protocol",
                (e) => this.onProtocolMessage(e)
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "IFrameRequest",
                () =>
                  this.sendMessageController.sendMessageToStreamer(
                    "IFrameRequest"
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "RequestQualityControl",
                () =>
                  this.sendMessageController.sendMessageToStreamer(
                    "RequestQualityControl"
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "FpsRequest",
                () =>
                  this.sendMessageController.sendMessageToStreamer("FpsRequest")
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "AverageBitrateRequest",
                () =>
                  this.sendMessageController.sendMessageToStreamer(
                    "AverageBitrateRequest"
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "StartStreaming",
                () =>
                  this.sendMessageController.sendMessageToStreamer(
                    "StartStreaming"
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "StopStreaming",
                () =>
                  this.sendMessageController.sendMessageToStreamer(
                    "StopStreaming"
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "LatencyTest",
                () =>
                  this.sendMessageController.sendMessageToStreamer(
                    "LatencyTest"
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "RequestInitialSettings",
                () =>
                  this.sendMessageController.sendMessageToStreamer(
                    "RequestInitialSettings"
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "TestEcho",
                () => {}
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "UIInteraction",
                (e) => this.sendDescriptorController.emitUIInteraction(e)
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "Command",
                (e) => this.sendDescriptorController.emitCommand(e)
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "KeyDown",
                (e) =>
                  this.sendMessageController.sendMessageToStreamer("KeyDown", e)
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "KeyUp",
                (e) =>
                  this.sendMessageController.sendMessageToStreamer("KeyUp", e)
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "KeyPress",
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    "KeyPress",
                    e
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "MouseEnter",
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    "MouseEnter",
                    e
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "MouseLeave",
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    "MouseLeave",
                    e
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "MouseDown",
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    "MouseDown",
                    e
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "MouseUp",
                (e) =>
                  this.sendMessageController.sendMessageToStreamer("MouseUp", e)
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "MouseMove",
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    "MouseMove",
                    e
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "MouseWheel",
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    "MouseWheel",
                    e
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "MouseDouble",
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    "MouseDouble",
                    e
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "TouchStart",
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    "TouchStart",
                    e
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "TouchEnd",
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    "TouchEnd",
                    e
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "TouchMove",
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    "TouchMove",
                    e
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "GamepadConnected",
                () =>
                  this.sendMessageController.sendMessageToStreamer(
                    "GamepadConnected"
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "GamepadButtonPressed",
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    "GamepadButtonPressed",
                    e
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "GamepadButtonReleased",
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    "GamepadButtonReleased",
                    e
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "GamepadAnalog",
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    "GamepadAnalog",
                    e
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "GamepadDisconnected",
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    "GamepadDisconnected",
                    e
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "XRHMDTransform",
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    "XRHMDTransform",
                    e
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "XRControllerTransform",
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    "XRControllerTransform",
                    e
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "XRSystem",
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    "XRSystem",
                    e
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "XRButtonTouched",
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    "XRButtonTouched",
                    e
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "XRButtonPressed",
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    "XRButtonPressed",
                    e
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "XRButtonReleased",
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    "XRButtonReleased",
                    e
                  )
              ),
              this.streamMessageController.registerMessageHandler(
                _e.ToStreamer,
                "XRAnalog",
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    "XRAnalog",
                    e
                  )
              );
          }
          onCommand(e) {
            l.Log(
              l.GetStackTrace(),
              "DataChannelReceiveMessageType.Command",
              6
            );
            const t = new TextDecoder("utf-16").decode(e.slice(1));
            l.Log(l.GetStackTrace(), "Data Channel Command: " + t, 6);
            const n = JSON.parse(t);
            "onScreenKeyboard" === n.command &&
              this.pixelStreaming._activateOnScreenKeyboard(n);
          }
          onProtocolMessage(e) {
            try {
              const t = new TextDecoder("utf-16").decode(e.slice(1)),
                n = JSON.parse(t);
              Object.prototype.hasOwnProperty.call(n, "Direction") ||
                l.Error(
                  l.GetStackTrace(),
                  "Malformed protocol received. Ensure the protocol message contains a direction"
                );
              const s = n.Direction;
              delete n.Direction,
                l.Log(
                  l.GetStackTrace(),
                  `Received new ${
                    s == _e.FromStreamer ? "FromStreamer" : "ToStreamer"
                  } protocol. Updating existing protocol...`
                ),
                Object.keys(n).forEach((e) => {
                  const t = n[e];
                  switch (s) {
                    case _e.ToStreamer:
                      if (
                        !Object.prototype.hasOwnProperty.call(t, "id") ||
                        !Object.prototype.hasOwnProperty.call(t, "byteLength")
                      )
                        return void l.Error(
                          l.GetStackTrace(),
                          `ToStreamer->${e} protocol definition was malformed as it didn't contain at least an id and a byteLength\n\n                                           Definition was: ${JSON.stringify(
                            t,
                            null,
                            2
                          )}`
                        );
                      if (
                        t.byteLength > 0 &&
                        !Object.prototype.hasOwnProperty.call(t, "structure")
                      )
                        return void l.Error(
                          l.GetStackTrace(),
                          `ToStreamer->${e} protocol definition was malformed as it specified a byteLength but no accompanying structure`
                        );
                      this.streamMessageController.toStreamerHandlers.get(e)
                        ? this.streamMessageController.toStreamerMessages.add(
                            e,
                            t
                          )
                        : l.Error(
                            l.GetStackTrace(),
                            `There was no registered handler for "${e}" - try adding one using registerMessageHandler(MessageDirection.ToStreamer, "${e}", myHandler)`
                          );
                      break;
                    case _e.FromStreamer:
                      if (!Object.prototype.hasOwnProperty.call(t, "id"))
                        return void l.Error(
                          l.GetStackTrace(),
                          `FromStreamer->${e} protocol definition was malformed as it didn't contain at least an id\n\n                            Definition was: ${JSON.stringify(
                            t,
                            null,
                            2
                          )}`
                        );
                      this.streamMessageController.fromStreamerHandlers.get(e)
                        ? this.streamMessageController.fromStreamerMessages.add(
                            e,
                            t.id
                          )
                        : l.Error(
                            l.GetStackTrace(),
                            `There was no registered handler for "${t}" - try adding one using registerMessageHandler(MessageDirection.FromStreamer, "${e}", myHandler)`
                          );
                      break;
                    default:
                      l.Error(l.GetStackTrace(), `Unknown direction: ${s}`);
                  }
                }),
                this.toStreamerMessagesController.SendRequestInitialSettings(),
                this.toStreamerMessagesController.SendRequestQualityControl();
            } catch (e) {
              l.Log(l.GetStackTrace(), e);
            }
          }
          onInputControlOwnership(e) {
            const t = new Uint8Array(e);
            l.Log(
              l.GetStackTrace(),
              "DataChannelReceiveMessageType.InputControlOwnership",
              6
            );
            const n = new Boolean(t[1]).valueOf();
            l.Log(
              l.GetStackTrace(),
              `Received input controller message - will your input control the stream: ${n}`
            ),
              this.pixelStreaming._onInputControlOwnership(n);
          }
          onGamepadResponse(e) {
            const t = new TextDecoder("utf-16").decode(e.slice(1)),
              n = JSON.parse(t);
            this.gamePadController.onGamepadResponseReceived(n.controllerId);
          }
          onAfkTriggered() {
            this.afkController.onAfkClick(),
              this.videoPlayer.isPaused() &&
                this.videoPlayer.hasVideoSource() &&
                this.playStream();
          }
          setAfkEnabled(e) {
            e
              ? this.onAfkTriggered()
              : this.afkController.stopAfkWarningTimer();
          }
          restartStreamAutomatically() {
            if (this.webSocketController)
              if (
                this.webSocketController.webSocket &&
                this.webSocketController.webSocket.readyState !==
                  WebSocket.CLOSED
              ) {
                (this.pixelStreaming._showActionOrErrorOnDisconnect = !1),
                  this.setDisconnectMessageOverride("Restarting stream..."),
                  this.closeSignalingServer();
                const e = setTimeout(() => {
                  this.pixelStreaming._onWebRtcAutoConnect(),
                    this.connectToSignallingServer(),
                    clearTimeout(e);
                }, 3e3);
              } else
                l.Log(
                  l.GetStackTrace(),
                  "A websocket connection has not been made yet so we will start the stream"
                ),
                  this.pixelStreaming._onWebRtcAutoConnect(),
                  this.connectToSignallingServer();
            else
              l.Log(
                l.GetStackTrace(),
                "The Web Socket Controller does not exist so this will not work right now."
              );
          }
          loadFreezeFrameOrShowPlayOverlay() {
            this.pixelStreaming.dispatchEvent(
              new Z({
                shouldShowPlayOverlay: this.shouldShowPlayOverlay,
                isValid: this.freezeFrameController.valid,
                jpegData: this.freezeFrameController.jpeg,
              })
            ),
              !0 === this.shouldShowPlayOverlay
                ? (l.Log(l.GetStackTrace(), "showing play overlay"),
                  this.resizePlayerStyle())
                : (l.Log(l.GetStackTrace(), "showing freeze frame"),
                  this.freezeFrameController.showFreezeFrame()),
              setTimeout(() => {
                this.videoPlayer.setVideoEnabled(!1);
              }, this.freezeFrameController.freezeFrameDelay);
          }
          onFreezeFrameMessage(e) {
            l.Log(
              l.GetStackTrace(),
              "DataChannelReceiveMessageType.FreezeFrame",
              6
            );
            const t = new Uint8Array(e);
            this.freezeFrameController.processFreezeFrameMessage(t, () =>
              this.loadFreezeFrameOrShowPlayOverlay()
            );
          }
          invalidateFreezeFrameAndEnableVideo() {
            l.Log(
              l.GetStackTrace(),
              "DataChannelReceiveMessageType.FreezeFrame",
              6
            ),
              setTimeout(() => {
                this.pixelStreaming.dispatchEvent(new ee()),
                  this.freezeFrameController.hideFreezeFrame();
              }, this.freezeFrameController.freezeFrameDelay),
              this.videoPlayer.getVideoElement() &&
                this.videoPlayer.setVideoEnabled(!0);
          }
          onFileExtension(e) {
            const t = new Uint8Array(e);
            We.setExtensionFromBytes(t, this.file);
          }
          onFileMimeType(e) {
            const t = new Uint8Array(e);
            We.setMimeTypeFromBytes(t, this.file);
          }
          onFileContents(e) {
            const t = new Uint8Array(e);
            We.setContentsFromBytes(t, this.file);
          }
          playStream() {
            if (!this.videoPlayer.getVideoElement()) {
              const e =
                "Could not play video stream because the video player was not initialized correctly.";
              return (
                this.pixelStreaming.dispatchEvent(new J({ message: e })),
                l.Error(l.GetStackTrace(), e),
                this.setDisconnectMessageOverride(
                  "Stream not initialized correctly"
                ),
                void this.closeSignalingServer()
              );
            }
            this.videoPlayer.hasVideoSource()
              ? (this.setTouchInputEnabled(
                  this.config.isFlagEnabled(de.TouchInput)
                ),
                this.pixelStreaming.dispatchEvent(new Y()),
                this.streamController.audioElement.srcObject
                  ? ((this.streamController.audioElement.muted =
                      this.config.isFlagEnabled(de.StartVideoMuted)),
                    this.streamController.audioElement
                      .play()
                      .then(() => {
                        this.playVideo();
                      })
                      .catch((e) => {
                        l.Log(l.GetStackTrace(), e),
                          l.Log(
                            l.GetStackTrace(),
                            "Browser does not support autoplaying video without interaction - to resolve this we are going to show the play button overlay."
                          ),
                          this.pixelStreaming.dispatchEvent(
                            new $({ reason: e })
                          );
                      }))
                  : this.playVideo(),
                (this.shouldShowPlayOverlay = !1),
                this.freezeFrameController.showFreezeFrame())
              : l.Warning(
                  l.GetStackTrace(),
                  "Cannot play stream, the video element has no srcObject to play."
                );
          }
          playVideo() {
            this.videoPlayer.play().catch((e) => {
              this.streamController.audioElement.srcObject &&
                this.streamController.audioElement.pause(),
                l.Log(l.GetStackTrace(), e),
                l.Log(
                  l.GetStackTrace(),
                  "Browser does not support autoplaying video without interaction - to resolve this we are going to show the play button overlay."
                ),
                this.pixelStreaming.dispatchEvent(new $({ reason: e }));
            });
          }
          autoPlayVideoOrSetUpPlayOverlay() {
            this.config.isFlagEnabled(de.AutoPlayVideo) && this.playStream(),
              this.resizePlayerStyle();
          }
          connectToSignallingServer() {
            const e = this.signallingUrlBuilder();
            this.webSocketController.connect(e);
          }
          startSession(e) {
            if (
              ((this.peerConfig = e),
              this.config.isFlagEnabled(de.ForceTURN) &&
                !this.checkTurnServerAvailability(e))
            )
              return (
                l.Info(
                  l.GetStackTrace(),
                  "No turn server was found in the Peer Connection Options. TURN cannot be forced, closing connection. Please use STUN instead"
                ),
                this.setDisconnectMessageOverride(
                  "TURN cannot be forced, closing connection. Please use STUN instead."
                ),
                void this.closeSignalingServer()
              );
            (this.peerConnectionController = new Ue(
              this.peerConfig,
              this.config,
              this.preferredCodec
            )),
              (this.peerConnectionController.onVideoStats = (e) =>
                this.handleVideoStats(e)),
              (this.peerConnectionController.onSendWebRTCOffer = (e) =>
                this.handleSendWebRTCOffer(e)),
              (this.peerConnectionController.onSendWebRTCAnswer = (e) =>
                this.handleSendWebRTCAnswer(e)),
              (this.peerConnectionController.onPeerIceCandidate = (e) =>
                this.handleSendIceCandidate(e)),
              (this.peerConnectionController.onDataChannel = (e) =>
                this.handleDataChannel(e)),
              (this.peerConnectionController.showTextOverlayConnecting = () =>
                this.pixelStreaming._onWebRtcConnecting()),
              (this.peerConnectionController.showTextOverlaySetupFailure = () =>
                this.pixelStreaming._onWebRtcFailed());
            let t = !1;
            (this.peerConnectionController.onIceConnectionStateChange = () => {
              !t &&
                ["connected", "completed"].includes(
                  this.peerConnectionController.peerConnection
                    .iceConnectionState
                ) &&
                (this.pixelStreaming._onWebRtcConnected(), (t = !0));
            }),
              (this.peerConnectionController.onTrack = (e) =>
                this.streamController.handleOnTrack(e)),
              this.config.isFlagEnabled(de.BrowserSendOffer) &&
                (this.sendrecvDataChannelController.createDataChannel(
                  this.peerConnectionController.peerConnection,
                  "cirrus",
                  this.datachannelOptions
                ),
                (this.sendrecvDataChannelController.handleOnMessage = (e) =>
                  this.handleOnMessage(e)),
                this.peerConnectionController.createOffer(
                  this.sdpConstraints,
                  this.config
                ));
          }
          checkTurnServerAvailability(e) {
            if (!e.iceServers)
              return (
                l.Info(l.GetStackTrace(), "A turn sever was not found"), !1
              );
            for (const t of e.iceServers)
              for (const e of t.urls)
                if (e.includes("turn"))
                  return (
                    l.Log(l.GetStackTrace(), `A turn sever was found at ${e}`),
                    !0
                  );
            return l.Info(l.GetStackTrace(), "A turn sever was not found"), !1;
          }
          handleOnConfigMessage(e) {
            this.resizePlayerStyle(),
              this.startSession(e.peerConnectionOptions),
              (this.webSocketController.onWebRtcAnswer = (e) =>
                this.handleWebRtcAnswer(e)),
              (this.webSocketController.onWebRtcOffer = (e) =>
                this.handleWebRtcOffer(e)),
              (this.webSocketController.onWebRtcPeerDataChannels = (e) =>
                this.handleWebRtcSFUPeerDatachannels(e)),
              (this.webSocketController.onIceCandidate = (e) =>
                this.handleIceCandidate(e));
          }
          handleStreamerListMessage(e) {
            if (
              (l.Log(l.GetStackTrace(), `Got streamer list ${e.ids}`, 6),
              this.isReconnecting)
            )
              e.ids.includes(this.subscribedStream)
                ? ((this.isReconnecting = !1),
                  (this.reconnectAttempt = 0),
                  this.webSocketController.sendSubscribe(this.subscribedStream))
                : this.reconnectAttempt <
                  this.config.getNumericSettingValue(ue.MaxReconnectAttempts)
                ? (this.reconnectAttempt++,
                  setTimeout(() => {
                    this.webSocketController.requestStreamerList();
                  }, 2e3))
                : ((this.reconnectAttempt = 0),
                  (this.isReconnecting = !1),
                  (this.shouldReconnect = !1),
                  this.webSocketController.close(),
                  this.config.setOptionSettingValue(ve.StreamerId, ""),
                  this.config.setOptionSettingOptions(ve.StreamerId, []));
            else {
              const t = [...e.ids];
              t.unshift(""),
                this.config.setOptionSettingOptions(ve.StreamerId, t);
              const n = new URLSearchParams(window.location.search);
              let s = null;
              1 == e.ids.length
                ? (s = e.ids[0])
                : this.config.isFlagEnabled(de.PreferSFU) &&
                  e.ids.includes("SFU")
                ? (s = "SFU")
                : n.has(ve.StreamerId) &&
                  e.ids.includes(n.get(ve.StreamerId)) &&
                  (s = n.get(ve.StreamerId)),
                null !== s &&
                  this.config.setOptionSettingValue(ve.StreamerId, s),
                this.pixelStreaming.dispatchEvent(
                  new ne({ messageStreamerList: e, autoSelectedStreamerId: s })
                );
            }
          }
          handleWebRtcAnswer(e) {
            l.Log(l.GetStackTrace(), `Got answer sdp ${e.sdp}`, 6);
            const t = { sdp: e.sdp, type: "answer" };
            this.peerConnectionController.receiveAnswer(t),
              this.handlePostWebrtcNegotiation();
          }
          handleWebRtcOffer(e) {
            l.Log(l.GetStackTrace(), `Got offer sdp ${e.sdp}`, 6),
              (this.isUsingSFU = !!e.sfu && e.sfu),
              this.isUsingSFU &&
                (this.peerConnectionController.preferredCodec = "");
            const t = { sdp: e.sdp, type: "offer" };
            this.peerConnectionController.receiveOffer(t, this.config),
              this.handlePostWebrtcNegotiation();
          }
          handleWebRtcSFUPeerDatachannels(e) {
            const t = { ordered: !0, negotiated: !0, id: e.sendStreamId },
              n = e.sendStreamId != e.recvStreamId;
            if (
              (this.sendrecvDataChannelController.createDataChannel(
                this.peerConnectionController.peerConnection,
                n ? "send-datachannel" : "datachannel",
                t
              ),
              n)
            ) {
              const t = { ordered: !0, negotiated: !0, id: e.recvStreamId };
              this.recvDataChannelController.createDataChannel(
                this.peerConnectionController.peerConnection,
                "recv-datachannel",
                t
              ),
                (this.recvDataChannelController.handleOnOpen = () =>
                  this.webSocketController.sendSFURecvDataChannelReady()),
                (this.recvDataChannelController.handleOnMessage = (e) =>
                  this.handleOnMessage(e));
            } else
              this.sendrecvDataChannelController.handleOnMessage = (e) =>
                this.handleOnMessage(e);
          }
          handlePostWebrtcNegotiation() {
            this.afkController.startAfkWarningTimer(),
              this.pixelStreaming._onWebRtcSdp(),
              this.statsTimerHandle &&
                void 0 !== this.statsTimerHandle &&
                window.clearInterval(this.statsTimerHandle),
              (this.statsTimerHandle = window.setInterval(
                () => this.getStats(),
                1e3
              )),
              this.setMouseInputEnabled(
                this.config.isFlagEnabled(de.MouseInput)
              ),
              this.setKeyboardInputEnabled(
                this.config.isFlagEnabled(de.KeyboardInput)
              ),
              this.setGamePadInputEnabled(
                this.config.isFlagEnabled(de.GamepadInput)
              );
          }
          handleIceCandidate(e) {
            l.Log(l.GetStackTrace(), "Web RTC Controller: onWebRtcIce", 6);
            const t = new RTCIceCandidate(e);
            this.peerConnectionController.handleOnIce(t);
          }
          handleSendIceCandidate(e) {
            l.Log(l.GetStackTrace(), "OnIceCandidate", 6),
              e.candidate &&
                e.candidate.candidate &&
                this.webSocketController.sendIceCandidate(e.candidate);
          }
          handleDataChannel(e) {
            l.Log(
              l.GetStackTrace(),
              "Data channel created for us by browser as we are a receiving peer.",
              6
            ),
              (this.sendrecvDataChannelController.dataChannel = e.channel),
              this.sendrecvDataChannelController.setupDataChannel(),
              (this.sendrecvDataChannelController.handleOnMessage = (e) =>
                this.handleOnMessage(e));
          }
          handleSendWebRTCOffer(e) {
            l.Log(l.GetStackTrace(), "Sending the offer to the Server", 6),
              this.webSocketController.sendWebRtcOffer(e);
          }
          handleSendWebRTCAnswer(e) {
            l.Log(l.GetStackTrace(), "Sending the answer to the Server", 6),
              this.webSocketController.sendWebRtcAnswer(e),
              this.isUsingSFU &&
                this.webSocketController.sendWebRtcDatachannelRequest();
          }
          setUpMouseAndFreezeFrame() {
            (this.videoElementParentClientRect = this.videoPlayer
              .getVideoParentElement()
              .getBoundingClientRect()),
              this.coordinateConverter.setupNormalizeAndQuantize(),
              this.freezeFrameController.freezeFrame.resize();
          }
          closeSignalingServer() {
            var e;
            (this.shouldReconnect = !1),
              null === (e = this.webSocketController) ||
                void 0 === e ||
                e.close();
          }
          closePeerConnection() {
            var e;
            null === (e = this.peerConnectionController) ||
              void 0 === e ||
              e.close();
          }
          close() {
            this.closeSignalingServer(), this.closePeerConnection();
          }
          getStats() {
            this.peerConnectionController.generateStats();
          }
          sendLatencyTest() {
            (this.latencyStartTime = Date.now()),
              this.sendDescriptorController.sendLatencyTest({
                StartTime: this.latencyStartTime,
              });
          }
          sendEncoderMinQP(e) {
            l.Log(l.GetStackTrace(), `MinQP=${e}\n`, 6),
              null != e &&
                this.sendDescriptorController.emitCommand({
                  "Encoder.MinQP": e,
                });
          }
          sendEncoderMaxQP(e) {
            l.Log(l.GetStackTrace(), `MaxQP=${e}\n`, 6),
              null != e &&
                this.sendDescriptorController.emitCommand({
                  "Encoder.MaxQP": e,
                });
          }
          sendWebRTCMinBitrate(e) {
            l.Log(l.GetStackTrace(), `WebRTC Min Bitrate=${e}`, 6),
              null != e &&
                this.sendDescriptorController.emitCommand({
                  "WebRTC.MinBitrate": e,
                });
          }
          sendWebRTCMaxBitrate(e) {
            l.Log(l.GetStackTrace(), `WebRTC Max Bitrate=${e}`, 6),
              null != e &&
                this.sendDescriptorController.emitCommand({
                  "WebRTC.MaxBitrate": e,
                });
          }
          sendWebRTCFps(e) {
            l.Log(l.GetStackTrace(), `WebRTC FPS=${e}`, 6),
              null != e &&
                (this.sendDescriptorController.emitCommand({ "WebRTC.Fps": e }),
                this.sendDescriptorController.emitCommand({
                  "WebRTC.MaxFps": e,
                }));
          }
          sendShowFps() {
            l.Log(
              l.GetStackTrace(),
              "----   Sending show stat to UE   ----",
              6
            ),
              this.sendDescriptorController.emitCommand({ "stat.fps": "" });
          }
          sendIframeRequest() {
            l.Log(
              l.GetStackTrace(),
              "----   Sending Request for an IFrame  ----",
              6
            ),
              this.streamMessageController.toStreamerHandlers.get(
                "IFrameRequest"
              )();
          }
          emitUIInteraction(e) {
            l.Log(
              l.GetStackTrace(),
              "----   Sending custom UIInteraction message   ----",
              6
            ),
              this.sendDescriptorController.emitUIInteraction(e);
          }
          emitCommand(e) {
            l.Log(
              l.GetStackTrace(),
              "----   Sending custom Command message   ----",
              6
            ),
              this.sendDescriptorController.emitCommand(e);
          }
          emitConsoleCommand(e) {
            l.Log(
              l.GetStackTrace(),
              "----   Sending custom Command:ConsoleCommand message   ----",
              6
            ),
              this.sendDescriptorController.emitCommand({ ConsoleCommand: e });
          }
          sendRequestQualityControlOwnership() {
            l.Log(
              l.GetStackTrace(),
              "----   Sending Request to Control Quality  ----",
              6
            ),
              this.toStreamerMessagesController.SendRequestQualityControl();
          }
          handleLatencyTestResult(e) {
            l.Log(
              l.GetStackTrace(),
              "DataChannelReceiveMessageType.latencyTest",
              6
            );
            const t = new TextDecoder("utf-16").decode(e.slice(1)),
              n = new He();
            Object.assign(n, JSON.parse(t)),
              n.processFields(),
              (n.testStartTimeMs = this.latencyStartTime),
              (n.browserReceiptTimeMs = Date.now()),
              (n.latencyExcludingDecode = ~~(
                n.browserReceiptTimeMs - n.testStartTimeMs
              )),
              (n.testDuration = ~~(n.TransmissionTimeMs - n.ReceiptTimeMs)),
              (n.networkLatency = ~~(
                n.latencyExcludingDecode - n.testDuration
              )),
              n.frameDisplayDeltaTimeMs &&
                n.browserReceiptTimeMs &&
                (n.endToEndLatency =
                  (n.frameDisplayDeltaTimeMs,
                  n.networkLatency,
                  ~~+n.CaptureToSendMs)),
              this.pixelStreaming._onLatencyTestResult(n);
          }
          handleInitialSettings(e) {
            l.Log(
              l.GetStackTrace(),
              "DataChannelReceiveMessageType.InitialSettings",
              6
            );
            const t = new TextDecoder("utf-16").decode(e.slice(1)),
              n = JSON.parse(t),
              s = new ze();
            n.Encoder && (s.EncoderSettings = n.Encoder),
              n.WebRTC && (s.WebRTCSettings = n.WebRTC),
              n.PixelStreaming && (s.PixelStreamingSettings = n.PixelStreaming),
              n.ConfigOptions &&
                void 0 !== n.ConfigOptions.DefaultToHover &&
                this.config.setFlagEnabled(
                  de.HoveringMouseMode,
                  !!n.ConfigOptions.DefaultToHover
                ),
              s.ueCompatible(),
              l.Log(l.GetStackTrace(), t, 6),
              this.pixelStreaming._onInitialSettings(s);
          }
          handleVideoEncoderAvgQP(e) {
            l.Log(
              l.GetStackTrace(),
              "DataChannelReceiveMessageType.VideoEncoderAvgQP",
              6
            );
            const t = Number(new TextDecoder("utf-16").decode(e.slice(1)));
            this.setVideoEncoderAvgQP(t);
          }
          handleVideoInitialized() {
            this.pixelStreaming._onVideoInitialized(),
              this.autoPlayVideoOrSetUpPlayOverlay(),
              this.resizePlayerStyle(),
              this.videoPlayer.updateVideoStreamSize();
          }
          onQualityControlOwnership(e) {
            const t = new Uint8Array(e);
            l.Log(
              l.GetStackTrace(),
              "DataChannelReceiveMessageType.QualityControlOwnership",
              6
            ),
              (this.isQualityController = new Boolean(t[1]).valueOf()),
              l.Log(
                l.GetStackTrace(),
                `Received quality controller message, will control quality: ${this.isQualityController}`
              ),
              this.pixelStreaming._onQualityControlOwnership(
                this.isQualityController
              );
          }
          handleVideoStats(e) {
            this.pixelStreaming._onVideoStats(e);
          }
          resizePlayerStyle() {
            this.videoPlayer.resizePlayerStyle();
          }
          getDisconnectMessageOverride() {
            return this.disconnectMessageOverride;
          }
          setDisconnectMessageOverride(e) {
            this.disconnectMessageOverride = e;
          }
          setPreferredCodec(e) {
            (this.preferredCodec = e),
              this.peerConnectionController &&
                ((this.peerConnectionController.preferredCodec = e),
                (this.peerConnectionController.updateCodecSelection = !1));
          }
          setVideoEncoderAvgQP(e) {
            (this.videoAvgQp = e),
              this.pixelStreaming._onVideoEncoderAvgQP(this.videoAvgQp);
          }
          setKeyboardInputEnabled(e) {
            var t;
            null === (t = this.keyboardController) ||
              void 0 === t ||
              t.unregisterKeyBoardEvents(),
              e &&
                (this.keyboardController =
                  this.inputClassesFactory.registerKeyBoard(this.config));
          }
          setMouseInputEnabled(e) {
            var t;
            if (
              (null === (t = this.mouseController) ||
                void 0 === t ||
                t.unregisterMouseEvents(),
              e)
            ) {
              const e = this.config.isFlagEnabled(de.HoveringMouseMode)
                ? Ce.HoveringMouse
                : Ce.LockedMouse;
              this.mouseController = this.inputClassesFactory.registerMouse(e);
            }
          }
          setTouchInputEnabled(e) {
            var t;
            null === (t = this.touchController) ||
              void 0 === t ||
              t.unregisterTouchEvents(),
              e &&
                (this.touchController = this.inputClassesFactory.registerTouch(
                  this.config.isFlagEnabled(de.FakeMouseWithTouches),
                  this.videoElementParentClientRect
                ));
          }
          setGamePadInputEnabled(e) {
            var t;
            null === (t = this.gamePadController) ||
              void 0 === t ||
              t.unregisterGamePadEvents(),
              e &&
                ((this.gamePadController =
                  this.inputClassesFactory.registerGamePad()),
                (this.gamePadController.onGamepadConnected = () => {
                  this.streamMessageController.toStreamerHandlers.get(
                    "GamepadConnected"
                  )();
                }),
                (this.gamePadController.onGamepadDisconnected = (e) => {
                  this.streamMessageController.toStreamerHandlers.get(
                    "GamepadDisconnected"
                  )([e]);
                }));
          }
          registerDataChannelEventEmitters(e) {
            (e.onOpen = (e, t) =>
              this.pixelStreaming.dispatchEvent(new H({ label: e, event: t }))),
              (e.onClose = (e, t) =>
                this.pixelStreaming.dispatchEvent(
                  new W({ label: e, event: t })
                )),
              (e.onError = (e, t) =>
                this.pixelStreaming.dispatchEvent(
                  new V({ label: e, event: t })
                ));
          }
        }
        class St {
          static vertexShader() {
            return "\n\t\tattribute vec2 a_position;\n\t\tattribute vec2 a_texCoord;\n\n\t\t// input\n\t\tuniform vec2 u_resolution;\n\t\tuniform vec4 u_offset;\n\n\t\t//\n\t\tvarying vec2 v_texCoord;\n\n\t\tvoid main() {\n\t\t   // convert the rectangle from pixels to 0.0 to 1.0\n\t\t   vec2 zeroToOne = a_position / u_resolution;\n\n\t\t   // convert from 0->1 to 0->2\n\t\t   vec2 zeroToTwo = zeroToOne * 2.0;\n\n\t\t   // convert from 0->2 to -1->+1 (clipspace)\n\t\t   vec2 clipSpace = zeroToTwo - 1.0;\n\n\t\t   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\n\t\t   // pass the texCoord to the fragment shader\n\t\t   // The GPU will interpolate this value between points.\n\t\t   v_texCoord = (a_texCoord * u_offset.xy) + u_offset.zw;\n\t\t}\n\t\t";
          }
          static fragmentShader() {
            return "\n\t\tprecision mediump float;\n\n\t\t// our texture\n\t\tuniform sampler2D u_image;\n\n\t\t// the texCoords passed in from the vertex shader.\n\t\tvarying vec2 v_texCoord;\n\n\t\tvoid main() {\n\t\t   gl_FragColor = texture2D(u_image, v_texCoord);\n\t\t}\n\t\t";
          }
        }
        class Ct {
          static deepCopyGamepad(e) {
            return JSON.parse(
              JSON.stringify({
                buttons: e.buttons.map((e) =>
                  JSON.parse(
                    JSON.stringify({ pressed: e.pressed, touched: e.touched })
                  )
                ),
                axes: e.axes,
              })
            );
          }
        }
        class yt {
          constructor(e) {
            (this.toStreamerMessagesProvider = e), (this.controllers = []);
          }
          updateStatus(e, t, n) {
            if (e.gamepad) {
              const s = t.getPose(e.gripSpace, n);
              if (!s) return;
              let i = 0;
              e.profiles.includes("htc-vive")
                ? (i = 1)
                : e.profiles.includes("oculus-touch") && (i = 2),
                this.toStreamerMessagesProvider.toStreamerHandlers.get(
                  "XRSystem"
                )([i]);
              let r = 2;
              switch (e.handedness) {
                case "left":
                  r = 0;
                  break;
                case "right":
                  r = 1;
              }
              const o = s.transform.matrix,
                a = [];
              for (let e = 0; e < 16; e++) a[e] = new Float32Array([o[e]])[0];
              this.toStreamerMessagesProvider.toStreamerHandlers.get(
                "XRControllerTransform"
              )([
                a[0],
                a[4],
                a[8],
                a[12],
                a[1],
                a[5],
                a[9],
                a[13],
                a[2],
                a[6],
                a[10],
                a[14],
                a[3],
                a[7],
                a[11],
                a[15],
                r,
              ]),
                void 0 === this.controllers[r] &&
                  ((this.controllers[r] = {
                    prevState: void 0,
                    currentState: void 0,
                    id: void 0,
                  }),
                  (this.controllers[r].prevState = Ct.deepCopyGamepad(
                    e.gamepad
                  ))),
                (this.controllers[r].currentState = Ct.deepCopyGamepad(
                  e.gamepad
                ));
              const l = this.controllers[r],
                c = l.currentState,
                d = l.prevState;
              for (let e = 0; e < c.buttons.length; e++) {
                const t = c.buttons[e],
                  n = d.buttons[e];
                t.pressed
                  ? this.toStreamerMessagesProvider.toStreamerHandlers.get(
                      "XRButtonPressed"
                    )([r, e, n.pressed ? 1 : 0])
                  : !t.pressed &&
                    n.pressed &&
                    this.toStreamerMessagesProvider.toStreamerHandlers.get(
                      "XRButtonReleased"
                    )([r, e, 0]),
                  t.touched && !t.pressed
                    ? this.toStreamerMessagesProvider.toStreamerHandlers.get(
                        "XRButtonPressed"
                      )([r, 3, n.touched ? 1 : 0])
                    : !t.touched &&
                      n.touched &&
                      this.toStreamerMessagesProvider.toStreamerHandlers.get(
                        "XRButtonReleased"
                      )([r, 3, 0]);
              }
              for (let e = 0; e < c.axes.length; e++)
                this.toStreamerMessagesProvider.toStreamerHandlers.get(
                  "XRAnalog"
                )([r, e, c.axes[e]]);
              this.controllers[r].prevState = c;
            }
          }
        }
        class bt {
          constructor(e) {
            (this.xrSession = null),
              (this.webRtcController = e),
              (this.xrControllers = []),
              (this.xrGamepadController = new yt(
                this.webRtcController.streamMessageController
              )),
              (this.onSessionEnded = new EventTarget()),
              (this.onSessionStarted = new EventTarget()),
              (this.onFrame = new EventTarget());
          }
          xrClicked() {
            this.xrSession
              ? this.xrSession.end()
              : navigator.xr.requestSession("immersive-vr").then((e) => {
                  this.onXrSessionStarted(e);
                });
          }
          onXrSessionEnded() {
            l.Log(l.GetStackTrace(), "XR Session ended"),
              (this.xrSession = null),
              this.onSessionEnded.dispatchEvent(new Event("xrSessionEnded"));
          }
          onXrSessionStarted(e) {
            l.Log(l.GetStackTrace(), "XR Session started"),
              (this.xrSession = e),
              this.xrSession.addEventListener("end", () => {
                this.onXrSessionEnded();
              });
            const t = document.createElement("canvas");
            (this.gl = t.getContext("webgl2", { xrCompatible: !0 })),
              this.xrSession.updateRenderState({
                baseLayer: new XRWebGLLayer(this.xrSession, this.gl),
              });
            const n = this.gl.createShader(this.gl.VERTEX_SHADER);
            this.gl.shaderSource(n, St.vertexShader()),
              this.gl.compileShader(n);
            const s = this.gl.createShader(this.gl.FRAGMENT_SHADER);
            this.gl.shaderSource(s, St.fragmentShader()),
              this.gl.compileShader(s);
            const i = this.gl.createProgram();
            this.gl.attachShader(i, n),
              this.gl.attachShader(i, s),
              this.gl.linkProgram(i),
              this.gl.useProgram(i),
              (this.positionLocation = this.gl.getAttribLocation(
                i,
                "a_position"
              )),
              (this.texcoordLocation = this.gl.getAttribLocation(
                i,
                "a_texCoord"
              )),
              (this.positionBuffer = this.gl.createBuffer()),
              this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer),
              this.gl.enableVertexAttribArray(this.positionLocation);
            const r = this.gl.createTexture();
            this.gl.bindTexture(this.gl.TEXTURE_2D, r),
              this.gl.texParameteri(
                this.gl.TEXTURE_2D,
                this.gl.TEXTURE_WRAP_S,
                this.gl.CLAMP_TO_EDGE
              ),
              this.gl.texParameteri(
                this.gl.TEXTURE_2D,
                this.gl.TEXTURE_WRAP_T,
                this.gl.CLAMP_TO_EDGE
              ),
              this.gl.texParameteri(
                this.gl.TEXTURE_2D,
                this.gl.TEXTURE_MIN_FILTER,
                this.gl.NEAREST
              ),
              this.gl.texParameteri(
                this.gl.TEXTURE_2D,
                this.gl.TEXTURE_MAG_FILTER,
                this.gl.NEAREST
              ),
              (this.texcoordBuffer = this.gl.createBuffer()),
              (this.resolutionLocation = this.gl.getUniformLocation(
                i,
                "u_resolution"
              )),
              (this.offsetLocation = this.gl.getUniformLocation(i, "u_offset")),
              e.requestReferenceSpace("local").then((e) => {
                (this.xrRefSpace = e),
                  this.xrSession.requestAnimationFrame((e, t) =>
                    this.onXrFrame(e, t)
                  );
              }),
              this.onSessionStarted.dispatchEvent(
                new Event("xrSessionStarted")
              );
          }
          onXrFrame(e, t) {
            const n = t.getViewerPose(this.xrRefSpace);
            if (n) {
              const e = n.transform.matrix,
                t = [];
              for (let n = 0; n < 16; n++) t[n] = new Float32Array([e[n]])[0];
              this.webRtcController.streamMessageController.toStreamerHandlers.get(
                "XRHMDTransform"
              )([
                t[0],
                t[4],
                t[8],
                t[12],
                t[1],
                t[5],
                t[9],
                t[13],
                t[2],
                t[6],
                t[10],
                t[14],
                t[3],
                t[7],
                t[11],
                t[15],
              ]);
              const s = this.xrSession.renderState.baseLayer;
              this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, s.framebuffer),
                this.gl.texImage2D(
                  this.gl.TEXTURE_2D,
                  0,
                  this.gl.RGBA,
                  this.gl.RGBA,
                  this.gl.UNSIGNED_BYTE,
                  this.webRtcController.videoPlayer.getVideoElement()
                ),
                this.render(
                  this.webRtcController.videoPlayer.getVideoElement()
                );
            }
            this.webRtcController.config.isFlagEnabled(de.XRControllerInput) &&
              this.xrSession.inputSources.forEach((e, n, s) => {
                this.xrGamepadController.updateStatus(e, t, this.xrRefSpace);
              }, this),
              this.xrSession.requestAnimationFrame((e, t) =>
                this.onXrFrame(e, t)
              ),
              this.onFrame.dispatchEvent(new le({ time: e, frame: t }));
          }
          render(e) {
            if (!this.gl) return;
            const t = this.xrSession.renderState.baseLayer;
            let n, s, i, r, o;
            this.gl.viewport(0, 0, t.framebufferWidth, t.framebufferHeight),
              this.gl.uniform4f(this.offsetLocation, 1, 1, 0, 0),
              this.gl.bufferData(
                this.gl.ARRAY_BUFFER,
                new Float32Array([
                  0,
                  0,
                  e.videoWidth,
                  0,
                  0,
                  e.videoHeight,
                  0,
                  e.videoHeight,
                  e.videoWidth,
                  0,
                  e.videoWidth,
                  e.videoHeight,
                ]),
                this.gl.STATIC_DRAW
              ),
              this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer),
              this.gl.bufferData(
                this.gl.ARRAY_BUFFER,
                new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
                this.gl.STATIC_DRAW
              ),
              this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer),
              (n = 2),
              (s = this.gl.FLOAT),
              (i = !1),
              (r = 0),
              (o = 0),
              this.gl.vertexAttribPointer(this.positionLocation, n, s, i, r, o),
              this.gl.enableVertexAttribArray(this.texcoordLocation),
              this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer),
              (n = 2),
              (s = this.gl.FLOAT),
              (i = !1),
              (r = 0),
              (o = 0),
              this.gl.vertexAttribPointer(this.texcoordLocation, n, s, i, r, o),
              this.gl.uniform2f(
                this.resolutionLocation,
                e.videoWidth,
                e.videoHeight
              );
            const a = this.gl.TRIANGLES;
            (o = 0), this.gl.drawArrays(a, o, 6);
          }
          static isSessionSupported(e) {
            return navigator.xr
              ? navigator.xr.isSessionSupported(e)
              : new Promise(() => !1);
          }
        }
        class Et {
          constructor(e) {
            (this.editTextButton = null),
              (this.hiddenInput = null),
              "ontouchstart" in document.documentElement &&
                this.createOnScreenKeyboardHelpers(e);
          }
          unquantizeAndDenormalizeUnsigned(e, t) {
            return null;
          }
          createOnScreenKeyboardHelpers(e) {
            this.hiddenInput ||
              ((this.hiddenInput = document.createElement("input")),
              (this.hiddenInput.id = "hiddenInput"),
              (this.hiddenInput.maxLength = 0),
              e.appendChild(this.hiddenInput)),
              this.editTextButton ||
                ((this.editTextButton = document.createElement("button")),
                (this.editTextButton.id = "editTextButton"),
                (this.editTextButton.innerHTML = "edit text"),
                e.appendChild(this.editTextButton),
                this.editTextButton.classList.add("hiddenState"),
                this.editTextButton.addEventListener("touchend", (e) => {
                  this.hiddenInput.focus(), e.preventDefault();
                }));
          }
          showOnScreenKeyboard(e) {
            if (e.showOnScreenKeyboard) {
              this.editTextButton.classList.remove("hiddenState");
              const t = this.unquantizeAndDenormalizeUnsigned(e.x, e.y);
              (this.editTextButton.style.top = t.y.toString() + "px"),
                (this.editTextButton.style.left = (t.x - 40).toString() + "px");
            } else
              this.editTextButton.classList.add("hiddenState"),
                this.hiddenInput.blur();
          }
        }
        class wt {
          constructor(e, t) {
            (this._showActionOrErrorOnDisconnect = !0),
              (this.allowConsoleCommands = !1),
              (this.config = e),
              (null == t ? void 0 : t.videoElementParent) &&
                (this._videoElementParent = t.videoElementParent),
              (this._eventEmitter = new ce()),
              this.configureSettings(),
              this.setWebRtcPlayerController(new ft(this.config, this)),
              (this.onScreenKeyboardHelper = new Et(this.videoElementParent)),
              (this.onScreenKeyboardHelper.unquantizeAndDenormalizeUnsigned = (
                e,
                t
              ) =>
                this._webRtcController.requestUnquantizedAndDenormalizeUnsigned(
                  e,
                  t
                )),
              (this._activateOnScreenKeyboard = (e) =>
                this.onScreenKeyboardHelper.showOnScreenKeyboard(e)),
              (this._webXrController = new bt(this._webRtcController));
          }
          get videoElementParent() {
            return (
              this._videoElementParent ||
                ((this._videoElementParent = document.createElement("div")),
                (this._videoElementParent.id = "videoElementParent")),
              this._videoElementParent
            );
          }
          configureSettings() {
            this.config._addOnSettingChangedListener(
              de.IsQualityController,
              (e) => {
                !0 !== e ||
                  this._webRtcController.isQualityController ||
                  this._webRtcController.sendRequestQualityControlOwnership();
              }
            ),
              this.config._addOnSettingChangedListener(de.AFKDetection, (e) => {
                this._webRtcController.setAfkEnabled(e);
              }),
              this.config._addOnSettingChangedListener(
                de.MatchViewportResolution,
                () => {
                  this._webRtcController.videoPlayer.updateVideoStreamSize();
                }
              ),
              this.config._addOnSettingChangedListener(
                de.HoveringMouseMode,
                (e) => {
                  this.config.setFlagLabel(
                    de.HoveringMouseMode,
                    `Control Scheme: ${e ? "Hovering" : "Locked"} Mouse`
                  ),
                    this._webRtcController.setMouseInputEnabled(
                      this.config.isFlagEnabled(de.MouseInput)
                    );
                }
              ),
              this.config._addOnSettingChangedListener(
                de.KeyboardInput,
                (e) => {
                  this._webRtcController.setKeyboardInputEnabled(e);
                }
              ),
              this.config._addOnSettingChangedListener(de.MouseInput, (e) => {
                this._webRtcController.setMouseInputEnabled(e);
              }),
              this.config._addOnSettingChangedListener(de.TouchInput, (e) => {
                this._webRtcController.setTouchInputEnabled(e);
              }),
              this.config._addOnSettingChangedListener(de.GamepadInput, (e) => {
                this._webRtcController.setGamePadInputEnabled(e);
              }),
              this.config._addOnNumericSettingChangedListener(ue.MinQP, (e) => {
                l.Log(
                  l.GetStackTrace(),
                  "--------  Sending MinQP  --------",
                  7
                ),
                  this._webRtcController.sendEncoderMinQP(e),
                  l.Log(
                    l.GetStackTrace(),
                    "-------------------------------------------",
                    7
                  );
              }),
              this.config._addOnNumericSettingChangedListener(ue.MaxQP, (e) => {
                l.Log(
                  l.GetStackTrace(),
                  "--------  Sending encoder settings  --------",
                  7
                ),
                  this._webRtcController.sendEncoderMaxQP(e),
                  l.Log(
                    l.GetStackTrace(),
                    "-------------------------------------------",
                    7
                  );
              }),
              this.config._addOnNumericSettingChangedListener(
                ue.WebRTCMinBitrate,
                (e) => {
                  l.Log(
                    l.GetStackTrace(),
                    "--------  Sending web rtc settings  --------",
                    7
                  ),
                    this._webRtcController.sendWebRTCMinBitrate(1e3 * e),
                    l.Log(
                      l.GetStackTrace(),
                      "-------------------------------------------",
                      7
                    );
                }
              ),
              this.config._addOnNumericSettingChangedListener(
                ue.WebRTCMaxBitrate,
                (e) => {
                  l.Log(
                    l.GetStackTrace(),
                    "--------  Sending web rtc settings  --------",
                    7
                  ),
                    this._webRtcController.sendWebRTCMaxBitrate(1e3 * e),
                    l.Log(
                      l.GetStackTrace(),
                      "-------------------------------------------",
                      7
                    );
                }
              ),
              this.config._addOnNumericSettingChangedListener(
                ue.WebRTCFPS,
                (e) => {
                  l.Log(
                    l.GetStackTrace(),
                    "--------  Sending web rtc settings  --------",
                    7
                  ),
                    this._webRtcController.sendWebRTCFps(e),
                    l.Log(
                      l.GetStackTrace(),
                      "-------------------------------------------",
                      7
                    );
                }
              ),
              this.config._addOnOptionSettingChangedListener(
                ve.PreferredCodec,
                (e) => {
                  this._webRtcController &&
                    this._webRtcController.setPreferredCodec(e);
                }
              ),
              this.config._registerOnChangeEvents(this._eventEmitter);
          }
          _activateOnScreenKeyboard(e) {
            throw new Error("Method not implemented.");
          }
          _onInputControlOwnership(e) {
            this._inputController = e;
          }
          setWebRtcPlayerController(e) {
            (this._webRtcController = e),
              this._webRtcController.setPreferredCodec(
                this.config.getSettingOption(ve.PreferredCodec).selected
              ),
              this._webRtcController.resizePlayerStyle(),
              this.checkForAutoConnect();
          }
          connect() {
            this._eventEmitter.dispatchEvent(new j()),
              this._webRtcController.connectToSignallingServer();
          }
          reconnect() {
            this._eventEmitter.dispatchEvent(new X()),
              this._webRtcController.restartStreamAutomatically();
          }
          disconnect() {
            this._eventEmitter.dispatchEvent(new K()),
              this._webRtcController.close();
          }
          play() {
            this._onStreamLoading(), this._webRtcController.playStream();
          }
          checkForAutoConnect() {
            this.config.isFlagEnabled(de.AutoConnect) &&
              (this._onWebRtcAutoConnect(),
              this._webRtcController.connectToSignallingServer());
          }
          _onWebRtcAutoConnect() {
            this._eventEmitter.dispatchEvent(new U()),
              (this._showActionOrErrorOnDisconnect = !0);
          }
          _onWebRtcSdp() {
            this._eventEmitter.dispatchEvent(new D());
          }
          _onStreamLoading() {
            this._eventEmitter.dispatchEvent(new q());
          }
          _onDisconnect(e) {
            "" != this._webRtcController.getDisconnectMessageOverride() &&
              void 0 !==
                this._webRtcController.getDisconnectMessageOverride() &&
              null != this._webRtcController.getDisconnectMessageOverride() &&
              ((e = this._webRtcController.getDisconnectMessageOverride()),
              this._webRtcController.setDisconnectMessageOverride("")),
              this._eventEmitter.dispatchEvent(
                new G({
                  eventString: e,
                  showActionOrErrorOnDisconnect:
                    this._showActionOrErrorOnDisconnect,
                })
              ),
              0 == this._showActionOrErrorOnDisconnect &&
                (this._showActionOrErrorOnDisconnect = !0);
          }
          _onWebRtcConnecting() {
            this._eventEmitter.dispatchEvent(new z());
          }
          _onWebRtcConnected() {
            this._eventEmitter.dispatchEvent(new B());
          }
          _onWebRtcFailed() {
            this._eventEmitter.dispatchEvent(new N());
          }
          _onVideoInitialized() {
            this._eventEmitter.dispatchEvent(new Q()),
              (this._videoStartTime = Date.now());
          }
          _onLatencyTestResult(e) {
            this._eventEmitter.dispatchEvent(new se({ latencyTimings: e }));
          }
          _onVideoStats(e) {
            (this._videoStartTime && void 0 !== this._videoStartTime) ||
              (this._videoStartTime = Date.now()),
              e.handleSessionStatistics(
                this._videoStartTime,
                this._inputController,
                this._webRtcController.videoAvgQp
              ),
              this._eventEmitter.dispatchEvent(new te({ aggregatedStats: e }));
          }
          _onVideoEncoderAvgQP(e) {
            this._eventEmitter.dispatchEvent(new _({ avgQP: e }));
          }
          _onInitialSettings(e) {
            var t;
            this._eventEmitter.dispatchEvent(new ie({ settings: e })),
              e.PixelStreamingSettings &&
                ((this.allowConsoleCommands =
                  null !==
                    (t =
                      e.PixelStreamingSettings.AllowPixelStreamingCommands) &&
                  void 0 !== t &&
                  t),
                !1 === this.allowConsoleCommands &&
                  l.Info(
                    l.GetStackTrace(),
                    "-AllowPixelStreamingCommands=false, sending arbitrary console commands from browser to UE is disabled."
                  ));
            const n = this.config.useUrlParams,
              s = new URLSearchParams(window.location.search);
            e.EncoderSettings &&
              (this.config.setNumericSetting(
                ue.MinQP,
                n && s.has(ue.MinQP)
                  ? Number.parseInt(s.get(ue.MinQP))
                  : e.EncoderSettings.MinQP
              ),
              this.config.setNumericSetting(
                ue.MaxQP,
                n && s.has(ue.MaxQP)
                  ? Number.parseInt(s.get(ue.MaxQP))
                  : e.EncoderSettings.MaxQP
              )),
              e.WebRTCSettings &&
                (this.config.setNumericSetting(
                  ue.WebRTCMinBitrate,
                  n && s.has(ue.WebRTCMinBitrate)
                    ? Number.parseInt(s.get(ue.WebRTCMinBitrate)) / 1e3
                    : e.WebRTCSettings.MinBitrate / 1e3
                ),
                this.config.setNumericSetting(
                  ue.WebRTCMaxBitrate,
                  n && s.has(ue.WebRTCMaxBitrate)
                    ? Number.parseInt(s.get(ue.WebRTCMaxBitrate)) / 1e3
                    : e.WebRTCSettings.MaxBitrate / 1e3
                ),
                this.config.setNumericSetting(
                  ue.WebRTCFPS,
                  n && s.has(ue.WebRTCFPS)
                    ? Number.parseInt(s.get(ue.WebRTCFPS))
                    : e.WebRTCSettings.FPS
                ));
          }
          _onQualityControlOwnership(e) {
            this.config.setFlagEnabled(de.IsQualityController, e);
          }
          requestLatencyTest() {
            return (
              !!this._webRtcController.videoPlayer.isVideoReady() &&
              (this._webRtcController.sendLatencyTest(), !0)
            );
          }
          requestShowFps() {
            return (
              !!this._webRtcController.videoPlayer.isVideoReady() &&
              (this._webRtcController.sendShowFps(), !0)
            );
          }
          requestIframe() {
            return (
              !!this._webRtcController.videoPlayer.isVideoReady() &&
              (this._webRtcController.sendIframeRequest(), !0)
            );
          }
          emitUIInteraction(e) {
            return (
              !!this._webRtcController.videoPlayer.isVideoReady() &&
              (this._webRtcController.emitUIInteraction(e), !0)
            );
          }
          emitCommand(e) {
            return !(
              !this._webRtcController.videoPlayer.isVideoReady() ||
              (!this.allowConsoleCommands && "ConsoleCommand" in e) ||
              (this._webRtcController.emitCommand(e), 0)
            );
          }
          emitConsoleCommand(e) {
            return !(
              !this.allowConsoleCommands ||
              !this._webRtcController.videoPlayer.isVideoReady() ||
              (this._webRtcController.emitConsoleCommand(e), 0)
            );
          }
          addResponseEventListener(e, t) {
            this._webRtcController.responseController.addResponseEventListener(
              e,
              t
            );
          }
          removeResponseEventListener(e) {
            this._webRtcController.responseController.removeResponseEventListener(
              e
            );
          }
          dispatchEvent(e) {
            return this._eventEmitter.dispatchEvent(e);
          }
          addEventListener(e, t) {
            this._eventEmitter.addEventListener(e, t);
          }
          removeEventListener(e, t) {
            this._eventEmitter.removeEventListener(e, t);
          }
          toggleXR() {
            this.webXrController.xrClicked();
          }
          setSignallingUrlBuilder(e) {
            this._webRtcController.signallingUrlBuilder = e;
          }
          get webSocketController() {
            return this._webRtcController.webSocketController;
          }
          get webXrController() {
            return this._webXrController;
          }
        }
        var Tt = a.De,
          xt = a.vU,
          Mt = a.Yd,
          Pt = a.sK,
          kt = a.Ok,
          Rt = a.g,
          Lt = a.Az,
          At = a.x_,
          Ft = a.$f;
        function Ot() {
          return (
            (Ot = Object.assign
              ? Object.assign.bind()
              : function (e) {
                  for (var t = 1; t < arguments.length; t++) {
                    var n = arguments[t];
                    for (var s in n)
                      Object.prototype.hasOwnProperty.call(n, s) &&
                        (e[s] = n[s]);
                  }
                  return e;
                }),
            Ot.apply(this, arguments)
          );
        }
        var It =
          "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
            ? function (e) {
                return typeof e;
              }
            : function (e) {
                return e &&
                  "function" == typeof Symbol &&
                  e.constructor === Symbol &&
                  e !== Symbol.prototype
                  ? "symbol"
                  : typeof e;
              };
        const _t =
          "object" ===
            ("undefined" == typeof window ? "undefined" : It(window)) &&
          "object" ===
            ("undefined" == typeof document ? "undefined" : It(document)) &&
          9 === document.nodeType;
        function Dt(e) {
          return (
            (Dt =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (e) {
                    return typeof e;
                  }
                : function (e) {
                    return e &&
                      "function" == typeof Symbol &&
                      e.constructor === Symbol &&
                      e !== Symbol.prototype
                      ? "symbol"
                      : typeof e;
                  }),
            Dt(e)
          );
        }
        function Ut(e, t) {
          for (var n = 0; n < t.length; n++) {
            var s = t[n];
            (s.enumerable = s.enumerable || !1),
              (s.configurable = !0),
              "value" in s && (s.writable = !0),
              Object.defineProperty(
                e,
                ((i = s.key),
                (r = void 0),
                (r = (function (e, t) {
                  if ("object" !== Dt(e) || null === e) return e;
                  var n = e[Symbol.toPrimitive];
                  if (void 0 !== n) {
                    var s = n.call(e, "string");
                    if ("object" !== Dt(s)) return s;
                    throw new TypeError(
                      "@@toPrimitive must return a primitive value."
                    );
                  }
                  return String(e);
                })(i)),
                "symbol" === Dt(r) ? r : String(r)),
                s
              );
          }
          var i, r;
        }
        function zt(e, t, n) {
          return (
            t && Ut(e.prototype, t),
            n && Ut(e, n),
            Object.defineProperty(e, "prototype", { writable: !1 }),
            e
          );
        }
        function Bt(e, t) {
          return (
            (Bt = Object.setPrototypeOf
              ? Object.setPrototypeOf.bind()
              : function (e, t) {
                  return (e.__proto__ = t), e;
                }),
            Bt(e, t)
          );
        }
        function Nt(e, t) {
          (e.prototype = Object.create(t.prototype)),
            (e.prototype.constructor = e),
            Bt(e, t);
        }
        function Gt(e) {
          if (void 0 === e)
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called"
            );
          return e;
        }
        var Ht = {}.constructor;
        function Wt(e) {
          if (null == e || "object" != typeof e) return e;
          if (Array.isArray(e)) return e.map(Wt);
          if (e.constructor !== Ht) return e;
          var t = {};
          for (var n in e) t[n] = Wt(e[n]);
          return t;
        }
        function Vt(e, t, n) {
          void 0 === e && (e = "unnamed");
          var s = n.jss,
            i = Wt(t);
          return s.plugins.onCreateRule(e, i, n) || (e[0], null);
        }
        var Qt = function (e, t) {
            for (var n = "", s = 0; s < e.length && "!important" !== e[s]; s++)
              n && (n += t), (n += e[s]);
            return n;
          },
          qt = function (e) {
            if (!Array.isArray(e)) return e;
            var t = "";
            if (Array.isArray(e[0]))
              for (var n = 0; n < e.length && "!important" !== e[n]; n++)
                t && (t += ", "), (t += Qt(e[n], " "));
            else t = Qt(e, ", ");
            return "!important" === e[e.length - 1] && (t += " !important"), t;
          };
        function jt(e) {
          return e && !1 === e.format
            ? { linebreak: "", space: "" }
            : { linebreak: "\n", space: " " };
        }
        function Kt(e, t) {
          for (var n = "", s = 0; s < t; s++) n += "  ";
          return n + e;
        }
        function Xt(e, t, n) {
          void 0 === n && (n = {});
          var s = "";
          if (!t) return s;
          var i = n.indent,
            r = void 0 === i ? 0 : i,
            o = t.fallbacks;
          !1 === n.format && (r = -1 / 0);
          var a = jt(n),
            l = a.linebreak,
            c = a.space;
          if ((e && r++, o))
            if (Array.isArray(o))
              for (var d = 0; d < o.length; d++) {
                var h = o[d];
                for (var u in h) {
                  var m = h[u];
                  null != m &&
                    (s && (s += l), (s += Kt(u + ":" + c + qt(m) + ";", r)));
                }
              }
            else
              for (var g in o) {
                var p = o[g];
                null != p &&
                  (s && (s += l), (s += Kt(g + ":" + c + qt(p) + ";", r)));
              }
          for (var v in t) {
            var f = t[v];
            null != f &&
              "fallbacks" !== v &&
              (s && (s += l), (s += Kt(v + ":" + c + qt(f) + ";", r)));
          }
          return (s || n.allowEmpty) && e
            ? (s && (s = "" + l + s + l),
              Kt("" + e + c + "{" + s, --r) + Kt("}", r))
            : s;
        }
        var Jt = /([[\].#*$><+~=|^:(),"'`\s])/g,
          Yt = "undefined" != typeof CSS && CSS.escape,
          $t = function (e) {
            return Yt ? Yt(e) : e.replace(Jt, "\\$1");
          },
          Zt = (function () {
            function e(e, t, n) {
              (this.type = "style"), (this.isProcessed = !1);
              var s = n.sheet,
                i = n.Renderer;
              (this.key = e),
                (this.options = n),
                (this.style = t),
                s
                  ? (this.renderer = s.renderer)
                  : i && (this.renderer = new i());
            }
            return (
              (e.prototype.prop = function (e, t, n) {
                if (void 0 === t) return this.style[e];
                var s = !!n && n.force;
                if (!s && this.style[e] === t) return this;
                var i = t;
                (n && !1 === n.process) ||
                  (i = this.options.jss.plugins.onChangeValue(t, e, this));
                var r = null == i || !1 === i,
                  o = e in this.style;
                if (r && !o && !s) return this;
                var a = r && o;
                if (
                  (a ? delete this.style[e] : (this.style[e] = i),
                  this.renderable && this.renderer)
                )
                  return (
                    a
                      ? this.renderer.removeProperty(this.renderable, e)
                      : this.renderer.setProperty(this.renderable, e, i),
                    this
                  );
                var l = this.options.sheet;
                return l && l.attached, this;
              }),
              e
            );
          })(),
          en = (function (e) {
            function t(t, n, s) {
              var i;
              i = e.call(this, t, n, s) || this;
              var r = s.selector,
                o = s.scoped,
                a = s.sheet,
                l = s.generateId;
              return (
                r
                  ? (i.selectorText = r)
                  : !1 !== o &&
                    ((i.id = l(Gt(Gt(i)), a)),
                    (i.selectorText = "." + $t(i.id))),
                i
              );
            }
            Nt(t, e);
            var n = t.prototype;
            return (
              (n.applyTo = function (e) {
                var t = this.renderer;
                if (t) {
                  var n = this.toJSON();
                  for (var s in n) t.setProperty(e, s, n[s]);
                }
                return this;
              }),
              (n.toJSON = function () {
                var e = {};
                for (var t in this.style) {
                  var n = this.style[t];
                  "object" != typeof n
                    ? (e[t] = n)
                    : Array.isArray(n) && (e[t] = qt(n));
                }
                return e;
              }),
              (n.toString = function (e) {
                var t = this.options.sheet,
                  n = t && t.options.link ? Ot({}, e, { allowEmpty: !0 }) : e;
                return Xt(this.selectorText, this.style, n);
              }),
              zt(t, [
                {
                  key: "selector",
                  set: function (e) {
                    if (e !== this.selectorText) {
                      this.selectorText = e;
                      var t = this.renderer,
                        n = this.renderable;
                      n && t && (t.setSelector(n, e) || t.replaceRule(n, this));
                    }
                  },
                  get: function () {
                    return this.selectorText;
                  },
                },
              ]),
              t
            );
          })(Zt),
          tn = {
            onCreateRule: function (e, t, n) {
              return "@" === e[0] || (n.parent && "keyframes" === n.parent.type)
                ? null
                : new en(e, t, n);
            },
          },
          nn = { indent: 1, children: !0 },
          sn = /@([\w-]+)/,
          rn = (function () {
            function e(e, t, n) {
              (this.type = "conditional"),
                (this.isProcessed = !1),
                (this.key = e);
              var s = e.match(sn);
              for (var i in ((this.at = s ? s[1] : "unknown"),
              (this.query = n.name || "@" + this.at),
              (this.options = n),
              (this.rules = new Rn(Ot({}, n, { parent: this }))),
              t))
                this.rules.add(i, t[i]);
              this.rules.process();
            }
            var t = e.prototype;
            return (
              (t.getRule = function (e) {
                return this.rules.get(e);
              }),
              (t.indexOf = function (e) {
                return this.rules.indexOf(e);
              }),
              (t.addRule = function (e, t, n) {
                var s = this.rules.add(e, t, n);
                return s
                  ? (this.options.jss.plugins.onProcessRule(s), s)
                  : null;
              }),
              (t.replaceRule = function (e, t, n) {
                var s = this.rules.replace(e, t, n);
                return s && this.options.jss.plugins.onProcessRule(s), s;
              }),
              (t.toString = function (e) {
                void 0 === e && (e = nn);
                var t = jt(e).linebreak;
                if (
                  (null == e.indent && (e.indent = nn.indent),
                  null == e.children && (e.children = nn.children),
                  !1 === e.children)
                )
                  return this.query + " {}";
                var n = this.rules.toString(e);
                return n ? this.query + " {" + t + n + t + "}" : "";
              }),
              e
            );
          })(),
          on = /@media|@supports\s+/,
          an = {
            onCreateRule: function (e, t, n) {
              return on.test(e) ? new rn(e, t, n) : null;
            },
          },
          ln = { indent: 1, children: !0 },
          cn = /@keyframes\s+([\w-]+)/,
          dn = (function () {
            function e(e, t, n) {
              (this.type = "keyframes"),
                (this.at = "@keyframes"),
                (this.isProcessed = !1);
              var s = e.match(cn);
              s && s[1] ? (this.name = s[1]) : (this.name = "noname"),
                (this.key = this.type + "-" + this.name),
                (this.options = n);
              var i = n.scoped,
                r = n.sheet,
                o = n.generateId;
              for (var a in ((this.id = !1 === i ? this.name : $t(o(this, r))),
              (this.rules = new Rn(Ot({}, n, { parent: this }))),
              t))
                this.rules.add(a, t[a], Ot({}, n, { parent: this }));
              this.rules.process();
            }
            return (
              (e.prototype.toString = function (e) {
                void 0 === e && (e = ln);
                var t = jt(e).linebreak;
                if (
                  (null == e.indent && (e.indent = ln.indent),
                  null == e.children && (e.children = ln.children),
                  !1 === e.children)
                )
                  return this.at + " " + this.id + " {}";
                var n = this.rules.toString(e);
                return (
                  n && (n = "" + t + n + t),
                  this.at + " " + this.id + " {" + n + "}"
                );
              }),
              e
            );
          })(),
          hn = /@keyframes\s+/,
          un = /\$([\w-]+)/g,
          mn = function (e, t) {
            return "string" == typeof e
              ? e.replace(un, function (e, n) {
                  return n in t ? t[n] : e;
                })
              : e;
          },
          gn = function (e, t, n) {
            var s = e[t],
              i = mn(s, n);
            i !== s && (e[t] = i);
          },
          pn = {
            onCreateRule: function (e, t, n) {
              return "string" == typeof e && hn.test(e)
                ? new dn(e, t, n)
                : null;
            },
            onProcessStyle: function (e, t, n) {
              return "style" === t.type && n
                ? ("animation-name" in e &&
                    gn(e, "animation-name", n.keyframes),
                  "animation" in e && gn(e, "animation", n.keyframes),
                  e)
                : e;
            },
            onChangeValue: function (e, t, n) {
              var s = n.options.sheet;
              if (!s) return e;
              switch (t) {
                case "animation":
                case "animation-name":
                  return mn(e, s.keyframes);
                default:
                  return e;
              }
            },
          },
          vn = (function (e) {
            function t() {
              return e.apply(this, arguments) || this;
            }
            return (
              Nt(t, e),
              (t.prototype.toString = function (e) {
                var t = this.options.sheet,
                  n = t && t.options.link ? Ot({}, e, { allowEmpty: !0 }) : e;
                return Xt(this.key, this.style, n);
              }),
              t
            );
          })(Zt),
          fn = {
            onCreateRule: function (e, t, n) {
              return n.parent && "keyframes" === n.parent.type
                ? new vn(e, t, n)
                : null;
            },
          },
          Sn = (function () {
            function e(e, t, n) {
              (this.type = "font-face"),
                (this.at = "@font-face"),
                (this.isProcessed = !1),
                (this.key = e),
                (this.style = t),
                (this.options = n);
            }
            return (
              (e.prototype.toString = function (e) {
                var t = jt(e).linebreak;
                if (Array.isArray(this.style)) {
                  for (var n = "", s = 0; s < this.style.length; s++)
                    (n += Xt(this.at, this.style[s])),
                      this.style[s + 1] && (n += t);
                  return n;
                }
                return Xt(this.at, this.style, e);
              }),
              e
            );
          })(),
          Cn = /@font-face/,
          yn = {
            onCreateRule: function (e, t, n) {
              return Cn.test(e) ? new Sn(e, t, n) : null;
            },
          },
          bn = (function () {
            function e(e, t, n) {
              (this.type = "viewport"),
                (this.at = "@viewport"),
                (this.isProcessed = !1),
                (this.key = e),
                (this.style = t),
                (this.options = n);
            }
            return (
              (e.prototype.toString = function (e) {
                return Xt(this.key, this.style, e);
              }),
              e
            );
          })(),
          En = {
            onCreateRule: function (e, t, n) {
              return "@viewport" === e || "@-ms-viewport" === e
                ? new bn(e, t, n)
                : null;
            },
          },
          wn = (function () {
            function e(e, t, n) {
              (this.type = "simple"),
                (this.isProcessed = !1),
                (this.key = e),
                (this.value = t),
                (this.options = n);
            }
            return (
              (e.prototype.toString = function (e) {
                if (Array.isArray(this.value)) {
                  for (var t = "", n = 0; n < this.value.length; n++)
                    (t += this.key + " " + this.value[n] + ";"),
                      this.value[n + 1] && (t += "\n");
                  return t;
                }
                return this.key + " " + this.value + ";";
              }),
              e
            );
          })(),
          Tn = { "@charset": !0, "@import": !0, "@namespace": !0 },
          xn = {
            onCreateRule: function (e, t, n) {
              return e in Tn ? new wn(e, t, n) : null;
            },
          },
          Mn = [tn, an, pn, fn, yn, En, xn],
          Pn = { process: !0 },
          kn = { force: !0, process: !0 },
          Rn = (function () {
            function e(e) {
              (this.map = {}),
                (this.raw = {}),
                (this.index = []),
                (this.counter = 0),
                (this.options = e),
                (this.classes = e.classes),
                (this.keyframes = e.keyframes);
            }
            var t = e.prototype;
            return (
              (t.add = function (e, t, n) {
                var s = this.options,
                  i = s.parent,
                  r = s.sheet,
                  o = s.jss,
                  a = s.Renderer,
                  l = s.generateId,
                  c = s.scoped,
                  d = Ot(
                    {
                      classes: this.classes,
                      parent: i,
                      sheet: r,
                      jss: o,
                      Renderer: a,
                      generateId: l,
                      scoped: c,
                      name: e,
                      keyframes: this.keyframes,
                      selector: void 0,
                    },
                    n
                  ),
                  h = e;
                e in this.raw && (h = e + "-d" + this.counter++),
                  (this.raw[h] = t),
                  h in this.classes && (d.selector = "." + $t(this.classes[h]));
                var u = Vt(h, t, d);
                if (!u) return null;
                this.register(u);
                var m = void 0 === d.index ? this.index.length : d.index;
                return this.index.splice(m, 0, u), u;
              }),
              (t.replace = function (e, t, n) {
                var s = this.get(e),
                  i = this.index.indexOf(s);
                s && this.remove(s);
                var r = n;
                return (
                  -1 !== i && (r = Ot({}, n, { index: i })), this.add(e, t, r)
                );
              }),
              (t.get = function (e) {
                return this.map[e];
              }),
              (t.remove = function (e) {
                this.unregister(e),
                  delete this.raw[e.key],
                  this.index.splice(this.index.indexOf(e), 1);
              }),
              (t.indexOf = function (e) {
                return this.index.indexOf(e);
              }),
              (t.process = function () {
                var e = this.options.jss.plugins;
                this.index.slice(0).forEach(e.onProcessRule, e);
              }),
              (t.register = function (e) {
                (this.map[e.key] = e),
                  e instanceof en
                    ? ((this.map[e.selector] = e),
                      e.id && (this.classes[e.key] = e.id))
                    : e instanceof dn &&
                      this.keyframes &&
                      (this.keyframes[e.name] = e.id);
              }),
              (t.unregister = function (e) {
                delete this.map[e.key],
                  e instanceof en
                    ? (delete this.map[e.selector], delete this.classes[e.key])
                    : e instanceof dn && delete this.keyframes[e.name];
              }),
              (t.update = function () {
                var e, t, n;
                if (
                  ("string" ==
                  typeof (arguments.length <= 0 ? void 0 : arguments[0])
                    ? ((e = arguments.length <= 0 ? void 0 : arguments[0]),
                      (t = arguments.length <= 1 ? void 0 : arguments[1]),
                      (n = arguments.length <= 2 ? void 0 : arguments[2]))
                    : ((t = arguments.length <= 0 ? void 0 : arguments[0]),
                      (n = arguments.length <= 1 ? void 0 : arguments[1]),
                      (e = null)),
                  e)
                )
                  this.updateOne(this.get(e), t, n);
                else
                  for (var s = 0; s < this.index.length; s++)
                    this.updateOne(this.index[s], t, n);
              }),
              (t.updateOne = function (t, n, s) {
                void 0 === s && (s = Pn);
                var i = this.options,
                  r = i.jss.plugins,
                  o = i.sheet;
                if (t.rules instanceof e) t.rules.update(n, s);
                else {
                  var a = t.style;
                  if (
                    (r.onUpdate(n, t, o, s), s.process && a && a !== t.style)
                  ) {
                    for (var l in (r.onProcessStyle(t.style, t, o), t.style)) {
                      var c = t.style[l];
                      c !== a[l] && t.prop(l, c, kn);
                    }
                    for (var d in a) {
                      var h = t.style[d],
                        u = a[d];
                      null == h && h !== u && t.prop(d, null, kn);
                    }
                  }
                }
              }),
              (t.toString = function (e) {
                for (
                  var t = "",
                    n = this.options.sheet,
                    s = !!n && n.options.link,
                    i = jt(e).linebreak,
                    r = 0;
                  r < this.index.length;
                  r++
                ) {
                  var o = this.index[r].toString(e);
                  (o || s) && (t && (t += i), (t += o));
                }
                return t;
              }),
              e
            );
          })(),
          Ln = (function () {
            function e(e, t) {
              for (var n in ((this.attached = !1),
              (this.deployed = !1),
              (this.classes = {}),
              (this.keyframes = {}),
              (this.options = Ot({}, t, {
                sheet: this,
                parent: this,
                classes: this.classes,
                keyframes: this.keyframes,
              })),
              t.Renderer && (this.renderer = new t.Renderer(this)),
              (this.rules = new Rn(this.options)),
              e))
                this.rules.add(n, e[n]);
              this.rules.process();
            }
            var t = e.prototype;
            return (
              (t.attach = function () {
                return (
                  this.attached ||
                    (this.renderer && this.renderer.attach(),
                    (this.attached = !0),
                    this.deployed || this.deploy()),
                  this
                );
              }),
              (t.detach = function () {
                return this.attached
                  ? (this.renderer && this.renderer.detach(),
                    (this.attached = !1),
                    this)
                  : this;
              }),
              (t.addRule = function (e, t, n) {
                var s = this.queue;
                this.attached && !s && (this.queue = []);
                var i = this.rules.add(e, t, n);
                return i
                  ? (this.options.jss.plugins.onProcessRule(i),
                    this.attached
                      ? this.deployed
                        ? (s
                            ? s.push(i)
                            : (this.insertRule(i),
                              this.queue &&
                                (this.queue.forEach(this.insertRule, this),
                                (this.queue = void 0))),
                          i)
                        : i
                      : ((this.deployed = !1), i))
                  : null;
              }),
              (t.replaceRule = function (e, t, n) {
                var s = this.rules.get(e);
                if (!s) return this.addRule(e, t, n);
                var i = this.rules.replace(e, t, n);
                return (
                  i && this.options.jss.plugins.onProcessRule(i),
                  this.attached
                    ? this.deployed
                      ? (this.renderer &&
                          (i
                            ? s.renderable &&
                              this.renderer.replaceRule(s.renderable, i)
                            : this.renderer.deleteRule(s)),
                        i)
                      : i
                    : ((this.deployed = !1), i)
                );
              }),
              (t.insertRule = function (e) {
                this.renderer && this.renderer.insertRule(e);
              }),
              (t.addRules = function (e, t) {
                var n = [];
                for (var s in e) {
                  var i = this.addRule(s, e[s], t);
                  i && n.push(i);
                }
                return n;
              }),
              (t.getRule = function (e) {
                return this.rules.get(e);
              }),
              (t.deleteRule = function (e) {
                var t = "object" == typeof e ? e : this.rules.get(e);
                return (
                  !(!t || (this.attached && !t.renderable)) &&
                  (this.rules.remove(t),
                  !(this.attached && t.renderable && this.renderer) ||
                    this.renderer.deleteRule(t.renderable))
                );
              }),
              (t.indexOf = function (e) {
                return this.rules.indexOf(e);
              }),
              (t.deploy = function () {
                return (
                  this.renderer && this.renderer.deploy(),
                  (this.deployed = !0),
                  this
                );
              }),
              (t.update = function () {
                var e;
                return (e = this.rules).update.apply(e, arguments), this;
              }),
              (t.updateOne = function (e, t, n) {
                return this.rules.updateOne(e, t, n), this;
              }),
              (t.toString = function (e) {
                return this.rules.toString(e);
              }),
              e
            );
          })(),
          An = (function () {
            function e() {
              (this.plugins = { internal: [], external: [] }),
                (this.registry = {});
            }
            var t = e.prototype;
            return (
              (t.onCreateRule = function (e, t, n) {
                for (var s = 0; s < this.registry.onCreateRule.length; s++) {
                  var i = this.registry.onCreateRule[s](e, t, n);
                  if (i) return i;
                }
                return null;
              }),
              (t.onProcessRule = function (e) {
                if (!e.isProcessed) {
                  for (
                    var t = e.options.sheet, n = 0;
                    n < this.registry.onProcessRule.length;
                    n++
                  )
                    this.registry.onProcessRule[n](e, t);
                  e.style && this.onProcessStyle(e.style, e, t),
                    (e.isProcessed = !0);
                }
              }),
              (t.onProcessStyle = function (e, t, n) {
                for (var s = 0; s < this.registry.onProcessStyle.length; s++)
                  t.style = this.registry.onProcessStyle[s](t.style, t, n);
              }),
              (t.onProcessSheet = function (e) {
                for (var t = 0; t < this.registry.onProcessSheet.length; t++)
                  this.registry.onProcessSheet[t](e);
              }),
              (t.onUpdate = function (e, t, n, s) {
                for (var i = 0; i < this.registry.onUpdate.length; i++)
                  this.registry.onUpdate[i](e, t, n, s);
              }),
              (t.onChangeValue = function (e, t, n) {
                for (
                  var s = e, i = 0;
                  i < this.registry.onChangeValue.length;
                  i++
                )
                  s = this.registry.onChangeValue[i](s, t, n);
                return s;
              }),
              (t.use = function (e, t) {
                void 0 === t && (t = { queue: "external" });
                var n = this.plugins[t.queue];
                -1 === n.indexOf(e) &&
                  (n.push(e),
                  (this.registry = []
                    .concat(this.plugins.external, this.plugins.internal)
                    .reduce(
                      function (e, t) {
                        for (var n in t) n in e && e[n].push(t[n]);
                        return e;
                      },
                      {
                        onCreateRule: [],
                        onProcessRule: [],
                        onProcessStyle: [],
                        onProcessSheet: [],
                        onChangeValue: [],
                        onUpdate: [],
                      }
                    )));
              }),
              e
            );
          })(),
          Fn = (function () {
            function e() {
              this.registry = [];
            }
            var t = e.prototype;
            return (
              (t.add = function (e) {
                var t = this.registry,
                  n = e.options.index;
                if (-1 === t.indexOf(e))
                  if (0 === t.length || n >= this.index) t.push(e);
                  else
                    for (var s = 0; s < t.length; s++)
                      if (t[s].options.index > n) return void t.splice(s, 0, e);
              }),
              (t.reset = function () {
                this.registry = [];
              }),
              (t.remove = function (e) {
                var t = this.registry.indexOf(e);
                this.registry.splice(t, 1);
              }),
              (t.toString = function (e) {
                for (
                  var t = void 0 === e ? {} : e,
                    n = t.attached,
                    s = (function (e, t) {
                      if (null == e) return {};
                      var n,
                        s,
                        i = {},
                        r = Object.keys(e);
                      for (s = 0; s < r.length; s++)
                        (n = r[s]), t.indexOf(n) >= 0 || (i[n] = e[n]);
                      return i;
                    })(t, ["attached"]),
                    i = jt(s).linebreak,
                    r = "",
                    o = 0;
                  o < this.registry.length;
                  o++
                ) {
                  var a = this.registry[o];
                  (null != n && a.attached !== n) ||
                    (r && (r += i), (r += a.toString(s)));
                }
                return r;
              }),
              zt(e, [
                {
                  key: "index",
                  get: function () {
                    return 0 === this.registry.length
                      ? 0
                      : this.registry[this.registry.length - 1].options.index;
                  },
                },
              ]),
              e
            );
          })(),
          On = new Fn(),
          In =
            "undefined" != typeof globalThis
              ? globalThis
              : "undefined" != typeof window && window.Math === Math
              ? window
              : "undefined" != typeof self && self.Math === Math
              ? self
              : Function("return this")(),
          _n = "2f1acc6c3a606b082e5eef5e54414ffb";
        null == In[_n] && (In[_n] = 0);
        var Dn = In[_n]++,
          Un = function (e) {
            void 0 === e && (e = {});
            var t = 0;
            return function (n, s) {
              t += 1;
              var i = "",
                r = "";
              return (
                s &&
                  (s.options.classNamePrefix && (r = s.options.classNamePrefix),
                  null != s.options.jss.id && (i = String(s.options.jss.id))),
                e.minify
                  ? "" + (r || "c") + Dn + i + t
                  : r + n.key + "-" + Dn + (i ? "-" + i : "") + "-" + t
              );
            };
          },
          zn = function (e) {
            var t;
            return function () {
              return t || (t = e()), t;
            };
          },
          Bn = function (e, t) {
            try {
              return e.attributeStyleMap
                ? e.attributeStyleMap.get(t)
                : e.style.getPropertyValue(t);
            } catch (e) {
              return "";
            }
          },
          Nn = function (e, t, n) {
            try {
              var s = n;
              if ((Array.isArray(n) && (s = qt(n)), e.attributeStyleMap))
                e.attributeStyleMap.set(t, s);
              else {
                var i = s ? s.indexOf("!important") : -1,
                  r = i > -1 ? s.substr(0, i - 1) : s;
                e.style.setProperty(t, r, i > -1 ? "important" : "");
              }
            } catch (e) {
              return !1;
            }
            return !0;
          },
          Gn = function (e, t) {
            try {
              e.attributeStyleMap
                ? e.attributeStyleMap.delete(t)
                : e.style.removeProperty(t);
            } catch (e) {}
          },
          Hn = function (e, t) {
            return (e.selectorText = t), e.selectorText === t;
          },
          Wn = zn(function () {
            return document.querySelector("head");
          });
        var Vn = zn(function () {
            var e = document.querySelector('meta[property="csp-nonce"]');
            return e ? e.getAttribute("content") : null;
          }),
          Qn = function (e, t, n) {
            try {
              "insertRule" in e
                ? e.insertRule(t, n)
                : "appendRule" in e && e.appendRule(t);
            } catch (e) {
              return !1;
            }
            return e.cssRules[n];
          },
          qn = function (e, t) {
            var n = e.cssRules.length;
            return void 0 === t || t > n ? n : t;
          },
          jn = (function () {
            function e(e) {
              (this.getPropertyValue = Bn),
                (this.setProperty = Nn),
                (this.removeProperty = Gn),
                (this.setSelector = Hn),
                (this.hasInsertedRules = !1),
                (this.cssRules = []),
                e && On.add(e),
                (this.sheet = e);
              var t,
                n = this.sheet ? this.sheet.options : {},
                s = n.media,
                i = n.meta,
                r = n.element;
              (this.element =
                r ||
                (((t = document.createElement("style")).textContent = "\n"),
                t)),
                this.element.setAttribute("data-jss", ""),
                s && this.element.setAttribute("media", s),
                i && this.element.setAttribute("data-meta", i);
              var o = Vn();
              o && this.element.setAttribute("nonce", o);
            }
            var t = e.prototype;
            return (
              (t.attach = function () {
                if (!this.element.parentNode && this.sheet) {
                  !(function (e, t) {
                    var n = t.insertionPoint,
                      s = (function (e) {
                        var t = On.registry;
                        if (t.length > 0) {
                          var n = (function (e, t) {
                            for (var n = 0; n < e.length; n++) {
                              var s = e[n];
                              if (
                                s.attached &&
                                s.options.index > t.index &&
                                s.options.insertionPoint === t.insertionPoint
                              )
                                return s;
                            }
                            return null;
                          })(t, e);
                          if (n && n.renderer)
                            return {
                              parent: n.renderer.element.parentNode,
                              node: n.renderer.element,
                            };
                          if (
                            ((n = (function (e, t) {
                              for (var n = e.length - 1; n >= 0; n--) {
                                var s = e[n];
                                if (
                                  s.attached &&
                                  s.options.insertionPoint === t.insertionPoint
                                )
                                  return s;
                              }
                              return null;
                            })(t, e)),
                            n && n.renderer)
                          )
                            return {
                              parent: n.renderer.element.parentNode,
                              node: n.renderer.element.nextSibling,
                            };
                        }
                        var s = e.insertionPoint;
                        if (s && "string" == typeof s) {
                          var i = (function (e) {
                            for (
                              var t = Wn(), n = 0;
                              n < t.childNodes.length;
                              n++
                            ) {
                              var s = t.childNodes[n];
                              if (8 === s.nodeType && s.nodeValue.trim() === e)
                                return s;
                            }
                            return null;
                          })(s);
                          if (i)
                            return {
                              parent: i.parentNode,
                              node: i.nextSibling,
                            };
                        }
                        return !1;
                      })(t);
                    if (!1 !== s && s.parent) s.parent.insertBefore(e, s.node);
                    else if (n && "number" == typeof n.nodeType) {
                      var i = n,
                        r = i.parentNode;
                      r && r.insertBefore(e, i.nextSibling);
                    } else Wn().appendChild(e);
                  })(this.element, this.sheet.options);
                  var e = Boolean(this.sheet && this.sheet.deployed);
                  this.hasInsertedRules &&
                    e &&
                    ((this.hasInsertedRules = !1), this.deploy());
                }
              }),
              (t.detach = function () {
                if (this.sheet) {
                  var e = this.element.parentNode;
                  e && e.removeChild(this.element),
                    this.sheet.options.link &&
                      ((this.cssRules = []), (this.element.textContent = "\n"));
                }
              }),
              (t.deploy = function () {
                var e = this.sheet;
                e &&
                  (e.options.link
                    ? this.insertRules(e.rules)
                    : (this.element.textContent = "\n" + e.toString() + "\n"));
              }),
              (t.insertRules = function (e, t) {
                for (var n = 0; n < e.index.length; n++)
                  this.insertRule(e.index[n], n, t);
              }),
              (t.insertRule = function (e, t, n) {
                if ((void 0 === n && (n = this.element.sheet), e.rules)) {
                  var s = e,
                    i = n;
                  if ("conditional" === e.type || "keyframes" === e.type) {
                    var r = qn(n, t);
                    if (!1 === (i = Qn(n, s.toString({ children: !1 }), r)))
                      return !1;
                    this.refCssRule(e, r, i);
                  }
                  return this.insertRules(s.rules, i), i;
                }
                var o = e.toString();
                if (!o) return !1;
                var a = qn(n, t),
                  l = Qn(n, o, a);
                return (
                  !1 !== l &&
                  ((this.hasInsertedRules = !0), this.refCssRule(e, a, l), l)
                );
              }),
              (t.refCssRule = function (e, t, n) {
                (e.renderable = n),
                  e.options.parent instanceof Ln &&
                    this.cssRules.splice(t, 0, n);
              }),
              (t.deleteRule = function (e) {
                var t = this.element.sheet,
                  n = this.indexOf(e);
                return (
                  -1 !== n && (t.deleteRule(n), this.cssRules.splice(n, 1), !0)
                );
              }),
              (t.indexOf = function (e) {
                return this.cssRules.indexOf(e);
              }),
              (t.replaceRule = function (e, t) {
                var n = this.indexOf(e);
                return (
                  -1 !== n &&
                  (this.element.sheet.deleteRule(n),
                  this.cssRules.splice(n, 1),
                  this.insertRule(t, n))
                );
              }),
              (t.getRules = function () {
                return this.element.sheet.cssRules;
              }),
              e
            );
          })(),
          Kn = 0,
          Xn = (function () {
            function e(e) {
              (this.id = Kn++),
                (this.version = "10.9.2"),
                (this.plugins = new An()),
                (this.options = {
                  id: { minify: !1 },
                  createGenerateId: Un,
                  Renderer: _t ? jn : null,
                  plugins: [],
                }),
                (this.generateId = Un({ minify: !1 }));
              for (var t = 0; t < Mn.length; t++)
                this.plugins.use(Mn[t], { queue: "internal" });
              this.setup(e);
            }
            var t = e.prototype;
            return (
              (t.setup = function (e) {
                return (
                  void 0 === e && (e = {}),
                  e.createGenerateId &&
                    (this.options.createGenerateId = e.createGenerateId),
                  e.id && (this.options.id = Ot({}, this.options.id, e.id)),
                  (e.createGenerateId || e.id) &&
                    (this.generateId = this.options.createGenerateId(
                      this.options.id
                    )),
                  null != e.insertionPoint &&
                    (this.options.insertionPoint = e.insertionPoint),
                  "Renderer" in e && (this.options.Renderer = e.Renderer),
                  e.plugins && this.use.apply(this, e.plugins),
                  this
                );
              }),
              (t.createStyleSheet = function (e, t) {
                void 0 === t && (t = {});
                var n = t.index;
                "number" != typeof n && (n = 0 === On.index ? 0 : On.index + 1);
                var s = new Ln(
                  e,
                  Ot({}, t, {
                    jss: this,
                    generateId: t.generateId || this.generateId,
                    insertionPoint: this.options.insertionPoint,
                    Renderer: this.options.Renderer,
                    index: n,
                  })
                );
                return this.plugins.onProcessSheet(s), s;
              }),
              (t.removeStyleSheet = function (e) {
                return e.detach(), On.remove(e), this;
              }),
              (t.createRule = function (e, t, n) {
                if (
                  (void 0 === t && (t = {}),
                  void 0 === n && (n = {}),
                  "object" == typeof e)
                )
                  return this.createRule(void 0, e, t);
                var s = Ot({}, n, {
                  name: e,
                  jss: this,
                  Renderer: this.options.Renderer,
                });
                s.generateId || (s.generateId = this.generateId),
                  s.classes || (s.classes = {}),
                  s.keyframes || (s.keyframes = {});
                var i = Vt(e, t, s);
                return i && this.plugins.onProcessRule(i), i;
              }),
              (t.use = function () {
                for (
                  var e = this, t = arguments.length, n = new Array(t), s = 0;
                  s < t;
                  s++
                )
                  n[s] = arguments[s];
                return (
                  n.forEach(function (t) {
                    e.plugins.use(t);
                  }),
                  this
                );
              }),
              e
            );
          })();
        "object" == typeof CSS && null != CSS && CSS;
        const Jn = new Xn(undefined);
        var Yn = "@global",
          $n = "@global ",
          Zn = (function () {
            function e(e, t, n) {
              for (var s in ((this.type = "global"),
              (this.at = Yn),
              (this.isProcessed = !1),
              (this.key = e),
              (this.options = n),
              (this.rules = new Rn(Ot({}, n, { parent: this }))),
              t))
                this.rules.add(s, t[s]);
              this.rules.process();
            }
            var t = e.prototype;
            return (
              (t.getRule = function (e) {
                return this.rules.get(e);
              }),
              (t.addRule = function (e, t, n) {
                var s = this.rules.add(e, t, n);
                return s && this.options.jss.plugins.onProcessRule(s), s;
              }),
              (t.replaceRule = function (e, t, n) {
                var s = this.rules.replace(e, t, n);
                return s && this.options.jss.plugins.onProcessRule(s), s;
              }),
              (t.indexOf = function (e) {
                return this.rules.indexOf(e);
              }),
              (t.toString = function (e) {
                return this.rules.toString(e);
              }),
              e
            );
          })(),
          es = (function () {
            function e(e, t, n) {
              (this.type = "global"),
                (this.at = Yn),
                (this.isProcessed = !1),
                (this.key = e),
                (this.options = n);
              var s = e.substr($n.length);
              this.rule = n.jss.createRule(s, t, Ot({}, n, { parent: this }));
            }
            return (
              (e.prototype.toString = function (e) {
                return this.rule ? this.rule.toString(e) : "";
              }),
              e
            );
          })(),
          ts = /\s*,\s*/g;
        function ns(e, t) {
          for (var n = e.split(ts), s = "", i = 0; i < n.length; i++)
            (s += t + " " + n[i].trim()), n[i + 1] && (s += ", ");
          return s;
        }
        const ss = function () {
          return {
            onCreateRule: function (e, t, n) {
              if (!e) return null;
              if (e === Yn) return new Zn(e, t, n);
              if ("@" === e[0] && e.substr(0, $n.length) === $n)
                return new es(e, t, n);
              var s = n.parent;
              return (
                s &&
                  ("global" === s.type ||
                    (s.options.parent && "global" === s.options.parent.type)) &&
                  (n.scoped = !1),
                n.selector || !1 !== n.scoped || (n.selector = e),
                null
              );
            },
            onProcessRule: function (e, t) {
              "style" === e.type &&
                t &&
                ((function (e, t) {
                  var n = e.options,
                    s = e.style,
                    i = s ? s[Yn] : null;
                  if (i) {
                    for (var r in i)
                      t.addRule(
                        r,
                        i[r],
                        Ot({}, n, { selector: ns(r, e.selector) })
                      );
                    delete s[Yn];
                  }
                })(e, t),
                (function (e, t) {
                  var n = e.options,
                    s = e.style;
                  for (var i in s)
                    if ("@" === i[0] && i.substr(0, Yn.length) === Yn) {
                      var r = ns(i.substr(Yn.length), e.selector);
                      t.addRule(r, s[i], Ot({}, n, { selector: r })),
                        delete s[i];
                    }
                })(e, t));
            },
          };
        };
        var is = /[A-Z]/g,
          rs = /^ms-/,
          os = {};
        function as(e) {
          return "-" + e.toLowerCase();
        }
        const ls = function (e) {
          if (os.hasOwnProperty(e)) return os[e];
          var t = e.replace(is, as);
          return (os[e] = rs.test(t) ? "-" + t : t);
        };
        function cs(e) {
          var t = {};
          for (var n in e) t[0 === n.indexOf("--") ? n : ls(n)] = e[n];
          return (
            e.fallbacks &&
              (Array.isArray(e.fallbacks)
                ? (t.fallbacks = e.fallbacks.map(cs))
                : (t.fallbacks = cs(e.fallbacks))),
            t
          );
        }
        const ds = function () {
          return {
            onProcessStyle: function (e) {
              if (Array.isArray(e)) {
                for (var t = 0; t < e.length; t++) e[t] = cs(e[t]);
                return e;
              }
              return cs(e);
            },
            onChangeValue: function (e, t, n) {
              if (0 === t.indexOf("--")) return e;
              var s = ls(t);
              return t === s ? e : (n.prop(s, e), null);
            },
          };
        };
        var hs = {
            d: (e, t) => {
              for (var n in t)
                hs.o(t, n) &&
                  !hs.o(e, n) &&
                  Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
            },
            o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
          },
          us = {};
        hs.d(us, {
          ym: () => xs,
          EW: () => Ss,
          Mx: () => Xs,
          L3: () => Ks,
          rl: () => Cs,
          NR: () => ys,
          f1: () => Ts,
          IY: () => ws,
          RZ: () => fs,
          XY: () => Zs,
          Fk: () => bs,
          Zh: () => Hs,
          ek: () => Ws,
          MG: () => Vs,
          gE: () => qs,
          tW: () => Qs,
          wr: () => Es,
          QT: () => vs,
        });
        const ms =
          ((gs = {
            Flags: () => xt,
            Logger: () => Mt,
            NumericParameters: () => Pt,
            OptionParameters: () => kt,
            SettingFlag: () => Lt,
            TextParameters: () => At,
            WebXRController: () => Ft,
          }),
          (ps = {}),
          hs.d(ps, gs),
          ps);
        var gs, ps, vs;
        class fs {
          constructor(e, t, n) {
            (this.rootDiv = e),
              (this.rootElement = t),
              (this.textElement = n),
              this.rootElement.appendChild(this.textElement),
              this.hide(),
              this.rootDiv.appendChild(this.rootElement);
          }
          show() {
            this.rootElement.classList.remove("hiddenState");
          }
          hide() {
            this.rootElement.classList.add("hiddenState");
          }
        }
        class Ss extends fs {
          constructor(e, t, n) {
            super(e, t, n),
              (this.onActionCallback = () => {
                ms.Logger.Info(
                  ms.Logger.GetStackTrace(),
                  "Did you forget to set the onAction callback in your overlay?"
                );
              });
          }
          update(e) {
            (null == e && null == e) || (this.textElement.innerHTML = e);
          }
          onAction(e) {
            this.onActionCallback = e;
          }
          activate() {
            this.onActionCallback();
          }
        }
        class Cs extends Ss {
          static createRootElement() {
            const e = document.createElement("div");
            return (
              (e.id = "connectOverlay"), (e.className = "clickableState"), e
            );
          }
          static createContentElement() {
            const e = document.createElement("div");
            return (
              (e.id = "connectButton"), (e.innerHTML = "Click to start"), e
            );
          }
          constructor(e) {
            super(e, Cs.createRootElement(), Cs.createContentElement()),
              this.rootElement.addEventListener("click", () => {
                this.activate();
              });
          }
        }
        class ys extends Ss {
          static createRootElement() {
            const e = document.createElement("div");
            return (
              (e.id = "disconnectOverlay"), (e.className = "clickableState"), e
            );
          }
          static createContentElement() {
            const e = document.createElement("div");
            return (
              (e.id = "disconnectButton"), (e.innerHTML = "Click To Restart"), e
            );
          }
          constructor(e) {
            super(e, ys.createRootElement(), ys.createContentElement()),
              this.rootElement.addEventListener("click", () => {
                this.activate();
              });
          }
        }
        class bs extends Ss {
          static createRootElement() {
            const e = document.createElement("div");
            return (e.id = "playOverlay"), (e.className = "clickableState"), e;
          }
          static createContentElement() {
            const e = document.createElement("img");
            return (
              (e.id = "playButton"),
              (e.src =
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPEAAAD5CAYAAAD2mNNkAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMjHxIGmVAAASgklEQVR4Xu2dC7BdVX2HqUCCIRASCPjAFIQREBRBBSRYbFOt8lIrFUWRFqXWsT5wbItUqFWs0KqIMPKoYEWpRS06KDjS1BeVFkVQbCw+wCfiAwGhCKWP9PuZtU24uTe59zz22Y/vm/nGkXtz7jlrr9+sdfZea/03Wb169QtxGW62iYi0D8L7NbwYj8EdcdPyIxFpA4T2P/F/8Ua8CI/GhPnXyq+ISJMhrAlxxX9hRuYL8Sh8SPk1EWkqBHXdEFfcg6vw3fhs3Kb8uog0DQI6XYgr8rOvYsJ8OM4v/0xEmkIJ6ob4P8zIfANegCvQMIs0BQK5sRBXJMy/wIzM5+ByXFBeRkQmBUGcbYjX5S5MmM/AA3CL8nIiUjcEcJAQV9yBX8a/wSeiz5hF6obgDRPikGfMCfOX8DTcu7y0iNQBoRs2xBX/g3diwvwm3Kn8CREZJ4RtVCGuqMKcu9kn4xJ09ZfIuCBgow5xyJ3sTLNzAywrwF6J26NhFhk1BGscIV6XhPluvA6Pxx3KnxaRUUCoxh3iioQ5z5n/BY/FJeUtiMgwEKa6QlyRMN+Hn8Hn4ZblrYjIIBCiukMc8p25Ws6ZMD+zvB0RmSsEaBIhnkrew5V4EHrCiMhcKAFqCv+Nl+J+uBC9my2yMQhKk0Jcke/M78Gsy06YH1TerohMhYA0McQVP8Nz8UDcCl2bLTIVgtHkEFd8D8/E/XFrdGQWqSAQbQhxyKOpm/B03Ac9MkgkEIa2hLgiN78S5lPx0bgIvQEm/YUAtC3EFQnzzfgnuDc6zZZ+Qsdva4jX5Sv4atwXHZmlX9DhuxDikC2Qn8dXYUbmReUjinQbOntXQlyRTRafwldgwrxV+agi3YRO3rUQV/wcV+LL8DHoyZzSTejcXQ1xRc7/uhyzl3kv3Lx8dJFuQKfueohDnjFnZP4o/j7m0ZQH4Es3oDP3IcQV2f6YMF+COZjgUeiZ2dJu6MR9CvG63ILvx4zMCfO80iQi7YLO29cQV3wb34spsr4rumBE2gWdtu8hDln99S1MXeYX4M6leUSaDx3WEK8lRdYT5lR/zPlfnswpzYeOaojXJ4cSfB3Pw+fgtug0W5oJndMQT0/uZGeaXZVyfTZuV5pNpDnQMQ3xxsk0O9Ufz8ZDcdvSfCKThw5piGdP2ioF496JT0c3WcjkKR1T5kYWjCTM78DfQheMyOSgAxriwch35lR/vAbPwOXozS+pHzqeIR6Oal12wvx2fBy6yULqgw5niEdDwpyR+VpMkfXsmHIpp4wfOpohHj234RfwFNwDnWbL+KCDGeLxkJH5p3g1vg53K00uMlroXIZ4vGTBSMJ8FeZkzmWl6UVGA53KENfD/ZiyNCmynvO/FpdLIDIcdCZDXC8ZmfOd+d/wJejZXzIcdCJDXD95xpwjdnP+V74zH4Wu/pLBoPMY4smSMN+FKbJ+BBpmmRt0GkPcDBLmu/FjeAi6lFNmB53FEDeHTLPzaCoj80dwBfqMWTYMncQQN5esAPsw7lcul8j60EEMcfPJDbD3YU7l3KxcOpE10CkMcTvIVDvfmc/E3XELtPqjGOKWkhVgp+GemDD7vbnP0AEMcXtJkfU34GNxAToy9xEuvCFuP6vwJMyOqYXl0kpf4KIb4m5QncyZTRapZGGY+wIX2xB3i3vxOswmi13QaXbX4QIb4m6SY3a/iMdh7mYb5q7ChTXE3aXaaLESq7rMW5ZLL12Bi2qI+8E9eDkmzLuhYe4KXExD3B8yMt+Ol+KL0CLrXYCLaIj7R8J8K16CR6PLOdsMF88Q95fsmPoRXozPxdzNdvVX2+CiGWLJza+EOXWZj8Sd0APw2wIXyxBLqPYy34LnY8K8DA1z0+EiGWKZSgJ9I74LU2R9R3Sa3VS4OIZYZqJaynkWpsj6w0u3kSbBhTHEsjHuwxswpVwPw6Wl+0gT4IIYYpkNmWKnr1yPqf54KG5VupFMknJhRGZLwpzVX6n++DZ8GrpjapJwAQyxDELCnB1TqWTx1/gUdGSeBDS8IZZBSZBjzv76PP4VHoSGuU5ocEMsoyBhTsG4VH98Ix6A80s3k3FCQxtiGSVZMPIT/CwmzPuhz5jHCQ1siGUcZClnwvxpPAX3LF1ORg2Na4hlXGSKnQUjCfNn8PX4CNy0dD8ZBTSoIZZxkzBXI/Pn8ATMumzDPApoSEMsdZEw5zvzDzHT7JdjwuzZX8NAAxpimQSZZifMn8Tj8aGlS8pcofEMsUyKjMw5lTOnjHwcc2TQktI1ZbbQaIZYJk3CnE0WGZmvwOeh+5hnC41liKUpVCNzwvwJPBy9+bUxaCRDLE0jYb4fU/0x0+yD8cGly8pUaBxDLE0kQa7CfCfmML8D0SN2p0KjGGJpOglztWgkh/k9CT1it4LGMMTSFhLmLBrJ3exzcJ/SjfsNDWGIpY0k0D/AM/GRpTv3ExrAEEubqVaAnY5LsX93s/nQhli6QLUF8nWYI3bnYT+Wc/JBDbF0heqO9jfwlfhInI/dDjMf0BBLF0mYr8NsskiNqS2wm2Hmgxli6TJ5zpwjg/4Qd8buLRrhQxli6QM5ZjdHBh2H+c7cnUUjfBhDLH0hU+y7cCU+H7OXeV6JQnvhQxhi6RsJc0bmy/BZ+MsbYCUS7YM3b4ilryTM2QL5QUzBuHxnbt80mzdtiEVWr74NL8KUck2R9faMzLxZQyyyhozMWcp5If4uJszNP5yAN2mIRR5IVn/djOfhEdjsw/x4c4ZYZHryjPkmPBsPwYeV2DQL3pghFpmZTLFzZFDCnLrMz8DtsTkbLXgzhlhk4yTM2cu8CrNjKiNzwjz5OlO8CUMsMjcS5qzLfgumyPr2JU6TgTdgiEUGoyqynrrMv42TOTObP2yIRQYn0+ws5bwaU8r1N3HrEq964A8aYpHhSZjvwBSMS5gPwnrWZfOHDLHI6Mgz5hyxm4Jxf4kH4HjDzB8wxCKjJ2HONPuf8c9xHxzPXmZe2BCLjIdMsWMqWfwTnoiPwdGOzLygIRYZPwlzVWPqtbgXjmbBCC9kiEXqI8+Ys8nicnwN7laiODi8iCEWqZeMylmXnTCnYFxO5tyxRHLu8I8NschkSJizLvv7mJH5pbgY57Zjin9giEUmSzUyfw9TZP1Y3LZEdOPwy4ZYpBkkzKn++B38KB6F25Wozgy/ZIhFmkXCnLO/vosfwpwysqhEdn34oSEWaSYJ8y8w0+wP4GG4/oIR/qMhFmk2VZgzzU6Ys2Nq7T5m/o8hFmkHCXO2PybMF+O++CBDLNIuEuSsy8535lvxZEMs0j6qWszZJbXUEIu0i1vwrZhqFZv5nVikPWTqfA5mF9QDD+fjPxhikeaR777xdrwAn1Aiuz780BCLNIvsdMqBAqkNtRw3XBeKXzDEIpMno27Cezdeik/GBSWmG4ZfNMQikyPhzXrpVGXM6R8rcG7lVfkHhlikfhLe7FzKo6KV+Hu45m7zXOEfGmKReske4oT3k3gMblniOBi8gCEWqYeMvD/GK/F43KHEcDh4IUMsMl5yw+pHmLOoX4aDH8UzHbygIRYZD/nem5H3KjwBd8LRV1HkRQ2xyGjJ3eacNZ1iayfhr+P46hnz4oZYZDRk2pzwph7TX+CuOP76xfwRQywyHNlVVIX3VHx8iVc98AcNscjgZJFGypq+GffHwZ71DgN/1BCLzJ2f47/iWzBlTId71jsM/HFDLDI7crf5HrwG34YHY70FxaeDN2GIRTZMwpvjcK7Fd+BTcfLhreDNGGKRmcnIez2+Ew/FhTi3MivjhjdkiEXWJ0fEfhXPwmfi4hKZ5sGbM8Qia8n65lX4LkzlhYeVqDQX3qQhFlnzrPc/8FzMtsBl2Kxp80zwRg2x9J0cxn4epoBZlkjW/6x3GHjDhlj6SJZI5gTJ9+DzMeHdvMSiXfDGDbH0iWpbYMqgJLy7YLtG3qnwAQyx9IVsC7wEX4C74/h2FtUJH8QQS9fJUTg5QfI43APnle7fDfhAhli6So5//Ri+GBPeya1vHid8MEMsXSMH0X0CX4J74cLS3bsJH9AQS1fITavs6f1VeLEdz3qHgQ9piKXtZHNC1jfnELpfTpux++Gt4MMaYmkrmTZ/GV+LCW+3p80zwQc3xNI2skTyBswhdHtic7YFTgIawBBLm7gRT8HH4dbYn2nzTNAIhljaQCrkvwkT3tywGv8pkm2BxjDE0lRyokbOsjoDUyE/N6wM71RoFEMsTSPhvRPfjY/GBei0eSZoHEMsTeJ2/ADug+3cVVQ3NJQhliaQkfcf8SnoqDsXaDBDLJMij4ruxcvwaejIOwg0nCGWusnyyIT3CjwM+7lIY1TQgIZY6iA3qzLyZmdRSn0eic09QbJN0JCGWMZJwpuR9w78Er4Qu7klcFLQoIZYxkXq9OZuc2oWZXNCv5dHjgsa1hDLqKnCm2qB2Zzw0NLdZBzQwIZYRkWmzT/DhPdE3KV0MxknNLQhlmHJ996ENwXHsjkhq6xcHlkXNLYhlkFJeHPDKhvyszkh4W338a9thEY3xDJX8qgoGxMS3tTpfSzOL11K6obGN8QyWxLeLI/MtDmlPvdHp82ThotgiGU2ZOStwrsCXSLZFLgYhlg2xF2Yc6zOxqejCzWaBhfFEMt0pMj2VzB1eg/BJaXLSNPg4hhiqcjd5izUSIX8lPp8Fi4tXUWaChfJEEtIhfwU2b4QU2R7O3RfbxvgQhnifpOD17+JCW9KfS5F7zi3CS6YIe4nOXj9W/h3eAw+vHQJaRtcPEPcL/Ks92a8CI/FXdFpc5vhAhri/vB9/Hv8A3wUukSyC3AhDXH3+Sn+Ax6PqZDvEskuwQU1xN2kOgonJ0im1Gc2J2xRLrt0CS6sIe4W1c6ij2NG3lROmFcut3QRLrAh7g4J75X4R7g3Gt4+wIU2xO0n0+ZP4aswBcdc39wnuOCGuL3kWe/n8DW4Ly4ql1X6BBfeELeTL+AJ+ATcBn3W21e4+Ia4PeSO89fwT/GJuAhdItl36ASGuPlkZ9G38fWYo3Ay8hpeWQOdwRA3lxwBexO+GVPq07Insj50DEPcTLK++e2Yc6wWo995ZXroHIa4WdyKOQpnOWbavGm5VCLTQycxxM0gp0iej0/G3LAyvDI76CyGeHJUx+G8Hw9Ewytzh05jiCdDDqK7HA/Aheh3XhkMOo8hrpe096fxd9D9vDI8pVPJ+LkXP4vPQafMMjroUIZ4fOQ7b9Y3X4U5x8oi2zJ66FiGePRkeWROkfwiHoee3Szjgw5miEdDRt14D+bw9ZfjDqWZRcYHHc0QD091FE6OgP0z9OB1qQ86myEenKxtTngz8r4BHXmlfuh4hnjuJLwp9Zlqgafh7qU5ReqHDmiIZ0+mzVkeeQO+FR9fmlFkctARDfHsSJ3ef8dqZ5GH0EkzoDMa4pnJ3ea0T07TOAezvnlBaTqRZlA6qTyQhDdrm1fhBXgwGl5pJnROQ7yW6jlvwvtefAZuXppKpJmUTitrp80p9Zn1zQ8uTSTSbOisfQ9xps2pkJ/wPhe3K00j0g7otH0N8f34dXwfHo0W2ZZ2QuftY4izPDKnabwIH4Ee/yrthQ7clxBnldUP8BJ8MSa87uuV9kNH7nqIc4ZVwvshfCkuQ8Mr3YEO3dUQZ4nkD/HDmFKfe5SPLNIt6NxdDHHC+xF8BabsiSOvdBc6eJdCfBtehglvimz7rFe6Dx29CyHOQo0r8NWYOr0W2Zb+QIdva4izRDLPeldi6vSm1OfC8rFE+gMdv40hznu+GlMhfz/cEj0OR/oJnb9NIc57vQZPxCehI69ICUbTydnN1+LJmPAuKW9fRAhEk0OcZ73XYw6hOwg9v1lkKgSjqSHO5oRT8TdwKbq+WWQ6CEeTQpw7zlmocTqmTm/Ob7bomMiGICRNCHGmzT/BszClPjPyuspKZDYQlkmH+Mf4t7gct0enzSJzgdBMKsQJ70X4VHTkFRkUwlN3iFM54YN4KG6LHkQnMgyEqK4Q51nvpZjwZuQ1vCKjgDDVEeIr8XBMeL3bLDJKCNW4QpyR9zo8ArdBb1iJjAPCNeoQJ7ypFngszkc3JoiME0I2qhDnWW8Kjv0xujFBpC4I3DAhzgqrHESXUp/Z0/uQ8rIiUhcEb5AQJ7z34TfwJNy5vJyI1A0BnG2IE9yYsiffwTfizuh3XpFJQghnE+J83014v4upkL8r+qhIpAkQxg2FOOHNzzNtPhf3REdekSZRQjqVTJtzguSNeD4eWH5dRJoGAZ0a4rvxm3ghrkCnzSJNhpBWIc7/plpgwpudRZ7dLNIGCOvtJbwX42G4uPxIRNoAoU2d3iNxUflPItIaNtnk/wEGBoMdpECGHAAAAABJRU5ErkJggg=="),
              (e.alt = "Start Streaming"),
              e
            );
          }
          constructor(e) {
            super(e, bs.createRootElement(), bs.createContentElement()),
              this.rootElement.addEventListener("click", () => {
                this.activate();
              });
          }
        }
        class Es extends fs {
          constructor(e, t, n) {
            super(e, t, n);
          }
          update(e) {
            (null == e && null == e) || (this.textElement.innerHTML = e);
          }
        }
        class ws extends Es {
          static createRootElement() {
            const e = document.createElement("div");
            return (
              (e.id = "infoOverlay"), (e.className = "textDisplayState"), e
            );
          }
          static createContentElement() {
            const e = document.createElement("div");
            return (e.id = "messageOverlayInner"), e;
          }
          constructor(e) {
            super(e, ws.createRootElement(), ws.createContentElement());
          }
        }
        class Ts extends Es {
          static createRootElement() {
            const e = document.createElement("div");
            return (
              (e.id = "errorOverlay"), (e.className = "textDisplayState"), e
            );
          }
          static createContentElement() {
            const e = document.createElement("div");
            return (e.id = "errorOverlayInner"), e;
          }
          constructor(e) {
            super(e, Ts.createRootElement(), Ts.createContentElement());
          }
        }
        class xs extends Ss {
          static createRootElement() {
            const e = document.createElement("div");
            return (e.id = "afkOverlay"), (e.className = "clickableState"), e;
          }
          static createContentElement() {
            const e = document.createElement("div");
            return (
              (e.id = "afkOverlayInner"),
              (e.innerHTML =
                '<center>No activity detected<br>Disconnecting in <span id="afkCountDownNumber"></span> seconds<br>Click to continue<br></center>'),
              e
            );
          }
          constructor(e) {
            super(e, xs.createRootElement(), xs.createContentElement()),
              this.rootElement.addEventListener("click", () => {
                this.activate();
              });
          }
          updateCountdown(e) {
            this.textElement.innerHTML = `<center>No activity detected<br>Disconnecting in <span id="afkCountDownNumber">${e}</span> seconds<br>Click to continue<br></center>`;
          }
        }
        class Ms {
          get rootElement() {
            return this._rootElement;
          }
          set rootElement(e) {
            (e.onclick = () => this.toggleFullscreen()),
              (this._rootElement = e);
          }
          constructor() {
            (this.isFullscreen = !1),
              document.addEventListener(
                "webkitfullscreenchange",
                () => this.onFullscreenChange(),
                !1
              ),
              document.addEventListener(
                "mozfullscreenchange",
                () => this.onFullscreenChange(),
                !1
              ),
              document.addEventListener(
                "fullscreenchange",
                () => this.onFullscreenChange(),
                !1
              ),
              document.addEventListener(
                "MSFullscreenChange",
                () => this.onFullscreenChange(),
                !1
              );
          }
          toggleFullscreen() {
            if (
              document.fullscreenElement ||
              document.webkitFullscreenElement ||
              document.mozFullScreenElement ||
              document.msFullscreenElement
            )
              document.exitFullscreen
                ? document.exitFullscreen()
                : document.mozCancelFullScreen
                ? document.mozCancelFullScreen()
                : document.webkitExitFullscreen
                ? document.webkitExitFullscreen()
                : document.msExitFullscreen && document.msExitFullscreen();
            else {
              const e = this.fullscreenElement;
              if (!e) return;
              e.requestFullscreen
                ? e.requestFullscreen()
                : e.mozRequestFullscreen
                ? e.mozRequestFullscreen()
                : e.webkitRequestFullscreen
                ? e.webkitRequestFullscreen()
                : e.msRequestFullscreen
                ? e.msRequestFullscreen()
                : e.webkitEnterFullscreen && e.webkitEnterFullscreen();
            }
            this.onFullscreenChange();
          }
          onFullscreenChange() {
            this.isFullscreen =
              document.webkitIsFullScreen ||
              document.mozFullScreen ||
              (document.msFullscreenElement &&
                null !== document.msFullscreenElement) ||
              (document.fullscreenElement &&
                null !== document.fullscreenElement);
          }
        }
        class Ps extends Ms {
          constructor(e) {
            super(), (this.rootElement = e);
          }
        }
        class ks extends Ms {
          constructor() {
            super();
            const e = document.createElement("button");
            (e.type = "button"),
              e.classList.add("UiTool"),
              (e.id = "fullscreen-btn"),
              e.appendChild(this.maximizeIcon),
              e.appendChild(this.minimizeIcon),
              e.appendChild(this.tooltipText),
              (this.rootElement = e);
          }
          get tooltipText() {
            return (
              this._tooltipText ||
                ((this._tooltipText = document.createElement("span")),
                this._tooltipText.classList.add("tooltiptext"),
                (this._tooltipText.innerHTML = "Fullscreen")),
              this._tooltipText
            );
          }
          get maximizeIcon() {
            if (!this._maximizeIcon) {
              (this._maximizeIcon = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
              )),
                this._maximizeIcon.setAttributeNS(null, "id", "maximizeIcon"),
                this._maximizeIcon.setAttributeNS(null, "x", "0px"),
                this._maximizeIcon.setAttributeNS(null, "y", "0px"),
                this._maximizeIcon.setAttributeNS(
                  null,
                  "viewBox",
                  "0 0 384.97 384.97"
                );
              const e = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "g"
              );
              e.classList.add("svgIcon"), this._maximizeIcon.appendChild(e);
              const t = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
              );
              t.setAttributeNS(
                null,
                "d",
                "M384.97,12.03c0-6.713-5.317-12.03-12.03-12.03H264.847c-6.833,0-11.922,5.39-11.934,12.223c0,6.821,5.101,11.838,11.934,11.838h96.062l-0.193,96.519c0,6.833,5.197,12.03,12.03,12.03c6.833-0.012,12.03-5.197,12.03-12.03l0.193-108.369c0-0.036-0.012-0.06-0.012-0.084C384.958,12.09,384.97,12.066,384.97,12.03z"
              );
              const n = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
              );
              n.setAttributeNS(
                null,
                "d",
                "M120.496,0H12.403c-0.036,0-0.06,0.012-0.096,0.012C12.283,0.012,12.247,0,12.223,0C5.51,0,0.192,5.317,0.192,12.03L0,120.399c0,6.833,5.39,11.934,12.223,11.934c6.821,0,11.838-5.101,11.838-11.934l0.192-96.339h96.242c6.833,0,12.03-5.197,12.03-12.03C132.514,5.197,127.317,0,120.496,0z"
              );
              const s = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
              );
              s.setAttributeNS(
                null,
                "d",
                "M120.123,360.909H24.061v-96.242c0-6.833-5.197-12.03-12.03-12.03S0,257.833,0,264.667v108.092c0,0.036,0.012,0.06,0.012,0.084c0,0.036-0.012,0.06-0.012,0.096c0,6.713,5.317,12.03,12.03,12.03h108.092c6.833,0,11.922-5.39,11.934-12.223C132.057,365.926,126.956,360.909,120.123,360.909z"
              );
              const i = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
              );
              i.setAttributeNS(
                null,
                "d",
                "M372.747,252.913c-6.833,0-11.85,5.101-11.838,11.934v96.062h-96.242c-6.833,0-12.03,5.197-12.03,12.03s5.197,12.03,12.03,12.03h108.092c0.036,0,0.06-0.012,0.084-0.012c0.036-0.012,0.06,0.012,0.096,0.012c6.713,0,12.03-5.317,12.03-12.03V264.847C384.97,258.014,379.58,252.913,372.747,252.913z"
              ),
                e.appendChild(t),
                e.appendChild(n),
                e.appendChild(s),
                e.appendChild(i);
            }
            return this._maximizeIcon;
          }
          get minimizeIcon() {
            if (!this._minimizeIcon) {
              (this._minimizeIcon = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
              )),
                this._minimizeIcon.setAttributeNS(null, "id", "minimizeIcon"),
                this._minimizeIcon.setAttributeNS(null, "x", "0px"),
                this._minimizeIcon.setAttributeNS(null, "y", "0px"),
                this._minimizeIcon.setAttributeNS(
                  null,
                  "viewBox",
                  "0 0 385.331 385.331"
                );
              const e = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "g"
              );
              e.classList.add("svgIcon"), this._minimizeIcon.appendChild(e);
              const t = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
              );
              t.setAttributeNS(
                null,
                "d",
                "M264.943,156.665h108.273c6.833,0,11.934-5.39,11.934-12.211c0-6.833-5.101-11.85-11.934-11.838h-96.242V36.181c0-6.833-5.197-12.03-12.03-12.03s-12.03,5.197-12.03,12.03v108.273c0,0.036,0.012,0.06,0.012,0.084c0,0.036-0.012,0.06-0.012,0.096C252.913,151.347,258.23,156.677,264.943,156.665z"
              );
              const n = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
              );
              n.setAttributeNS(
                null,
                "d",
                "M120.291,24.247c-6.821,0-11.838,5.113-11.838,11.934v96.242H12.03c-6.833,0-12.03,5.197-12.03,12.03c0,6.833,5.197,12.03,12.03,12.03h108.273c0.036,0,0.06-0.012,0.084-0.012c0.036,0,0.06,0.012,0.096,0.012c6.713,0,12.03-5.317,12.03-12.03V36.181C132.514,29.36,127.124,24.259,120.291,24.247z"
              );
              const s = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
              );
              s.setAttributeNS(
                null,
                "d",
                "M120.387,228.666H12.115c-6.833,0.012-11.934,5.39-11.934,12.223c0,6.833,5.101,11.85,11.934,11.838h96.242v96.423c0,6.833,5.197,12.03,12.03,12.03c6.833,0,12.03-5.197,12.03-12.03V240.877c0-0.036-0.012-0.06-0.012-0.084c0-0.036,0.012-0.06,0.012-0.096C132.418,233.983,127.1,228.666,120.387,228.666z"
              );
              const i = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
              );
              i.setAttributeNS(
                null,
                "d",
                "M373.3,228.666H265.028c-0.036,0-0.06,0.012-0.084,0.012c-0.036,0-0.06-0.012-0.096-0.012c-6.713,0-12.03,5.317-12.03,12.03v108.273c0,6.833,5.39,11.922,12.223,11.934c6.821,0.012,11.838-5.101,11.838-11.922v-96.242H373.3c6.833,0,12.03-5.197,12.03-12.03S380.134,228.678,373.3,228.666z"
              ),
                e.appendChild(t),
                e.appendChild(n),
                e.appendChild(s),
                e.appendChild(i);
            }
            return this._minimizeIcon;
          }
          onFullscreenChange() {
            super.onFullscreenChange();
            const e = this.minimizeIcon,
              t = this.maximizeIcon;
            this.isFullscreen
              ? ((e.style.display = "inline"),
                (e.style.transform = "translate(0, 0)"),
                (t.style.display = "none"))
              : ((e.style.display = "none"),
                (t.style.display = "inline"),
                (t.style.transform = "translate(0, 0)"));
          }
        }
        class Rs {
          get rootElement() {
            return (
              this._rootElement ||
                ((this._rootElement = document.createElement("button")),
                (this._rootElement.type = "button"),
                this._rootElement.classList.add("UiTool"),
                (this._rootElement.id = "settingsBtn"),
                this._rootElement.appendChild(this.settingsIcon),
                this._rootElement.appendChild(this.tooltipText)),
              this._rootElement
            );
          }
          get tooltipText() {
            return (
              this._tooltipText ||
                ((this._tooltipText = document.createElement("span")),
                this._tooltipText.classList.add("tooltiptext"),
                (this._tooltipText.innerHTML = "Settings")),
              this._tooltipText
            );
          }
          get settingsIcon() {
            if (!this._settingsIcon) {
              (this._settingsIcon = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
              )),
                this._settingsIcon.setAttributeNS(null, "id", "settingsIcon"),
                this._settingsIcon.setAttributeNS(null, "x", "0px"),
                this._settingsIcon.setAttributeNS(null, "y", "0px"),
                this._settingsIcon.setAttributeNS(
                  null,
                  "viewBox",
                  "0 0 478.703 478.703"
                );
              const e = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "g"
              );
              e.classList.add("svgIcon"), this._settingsIcon.appendChild(e);
              const t = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
              );
              t.setAttributeNS(
                null,
                "d",
                "M454.2,189.101l-33.6-5.7c-3.5-11.3-8-22.2-13.5-32.6l19.8-27.7c8.4-11.8,7.1-27.9-3.2-38.1l-29.8-29.8\t\t\tc-5.6-5.6-13-8.7-20.9-8.7c-6.2,0-12.1,1.9-17.1,5.5l-27.8,19.8c-10.8-5.7-22.1-10.4-33.8-13.9l-5.6-33.2\t\t\tc-2.4-14.3-14.7-24.7-29.2-24.7h-42.1c-14.5,0-26.8,10.4-29.2,24.7l-5.8,34c-11.2,3.5-22.1,8.1-32.5,13.7l-27.5-19.8\t\t\tc-5-3.6-11-5.5-17.2-5.5c-7.9,0-15.4,3.1-20.9,8.7l-29.9,29.8c-10.2,10.2-11.6,26.3-3.2,38.1l20,28.1\t\t\tc-5.5,10.5-9.9,21.4-13.3,32.7l-33.2,5.6c-14.3,2.4-24.7,14.7-24.7,29.2v42.1c0,14.5,10.4,26.8,24.7,29.2l34,5.8\t\t\tc3.5,11.2,8.1,22.1,13.7,32.5l-19.7,27.4c-8.4,11.8-7.1,27.9,3.2,38.1l29.8,29.8c5.6,5.6,13,8.7,20.9,8.7c6.2,0,12.1-1.9,17.1-5.5\t\t\tl28.1-20c10.1,5.3,20.7,9.6,31.6,13l5.6,33.6c2.4,14.3,14.7,24.7,29.2,24.7h42.2c14.5,0,26.8-10.4,29.2-24.7l5.7-33.6\t\t\tc11.3-3.5,22.2-8,32.6-13.5l27.7,19.8c5,3.6,11,5.5,17.2,5.5l0,0c7.9,0,15.3-3.1,20.9-8.7l29.8-29.8c10.2-10.2,11.6-26.3,3.2-38.1\t\t\tl-19.8-27.8c5.5-10.5,10.1-21.4,13.5-32.6l33.6-5.6c14.3-2.4,24.7-14.7,24.7-29.2v-42.1\t\t\tC478.9,203.801,468.5,191.501,454.2,189.101z M451.9,260.401c0,1.3-0.9,2.4-2.2,2.6l-42,7c-5.3,0.9-9.5,4.8-10.8,9.9\t\t\tc-3.8,14.7-9.6,28.8-17.4,41.9c-2.7,4.6-2.5,10.3,0.6,14.7l24.7,34.8c0.7,1,0.6,2.5-0.3,3.4l-29.8,29.8c-0.7,0.7-1.4,0.8-1.9,0.8\t\t\tc-0.6,0-1.1-0.2-1.5-0.5l-34.7-24.7c-4.3-3.1-10.1-3.3-14.7-0.6c-13.1,7.8-27.2,13.6-41.9,17.4c-5.2,1.3-9.1,5.6-9.9,10.8l-7.1,42\t\t\tc-0.2,1.3-1.3,2.2-2.6,2.2h-42.1c-1.3,0-2.4-0.9-2.6-2.2l-7-42c-0.9-5.3-4.8-9.5-9.9-10.8c-14.3-3.7-28.1-9.4-41-16.8\t\t\tc-2.1-1.2-4.5-1.8-6.8-1.8c-2.7,0-5.5,0.8-7.8,2.5l-35,24.9c-0.5,0.3-1,0.5-1.5,0.5c-0.4,0-1.2-0.1-1.9-0.8l-29.8-29.8\t\t\tc-0.9-0.9-1-2.3-0.3-3.4l24.6-34.5c3.1-4.4,3.3-10.2,0.6-14.8c-7.8-13-13.8-27.1-17.6-41.8c-1.4-5.1-5.6-9-10.8-9.9l-42.3-7.2\t\t\tc-1.3-0.2-2.2-1.3-2.2-2.6v-42.1c0-1.3,0.9-2.4,2.2-2.6l41.7-7c5.3-0.9,9.6-4.8,10.9-10c3.7-14.7,9.4-28.9,17.1-42\t\t\tc2.7-4.6,2.4-10.3-0.7-14.6l-24.9-35c-0.7-1-0.6-2.5,0.3-3.4l29.8-29.8c0.7-0.7,1.4-0.8,1.9-0.8c0.6,0,1.1,0.2,1.5,0.5l34.5,24.6\t\t\tc4.4,3.1,10.2,3.3,14.8,0.6c13-7.8,27.1-13.8,41.8-17.6c5.1-1.4,9-5.6,9.9-10.8l7.2-42.3c0.2-1.3,1.3-2.2,2.6-2.2h42.1\t\t\tc1.3,0,2.4,0.9,2.6,2.2l7,41.7c0.9,5.3,4.8,9.6,10,10.9c15.1,3.8,29.5,9.7,42.9,17.6c4.6,2.7,10.3,2.5,14.7-0.6l34.5-24.8\t\t\tc0.5-0.3,1-0.5,1.5-0.5c0.4,0,1.2,0.1,1.9,0.8l29.8,29.8c0.9,0.9,1,2.3,0.3,3.4l-24.7,34.7c-3.1,4.3-3.3,10.1-0.6,14.7\t\t\tc7.8,13.1,13.6,27.2,17.4,41.9c1.3,5.2,5.6,9.1,10.8,9.9l42,7.1c1.3,0.2,2.2,1.3,2.2,2.6v42.1H451.9z"
              );
              const n = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
              );
              n.setAttributeNS(
                null,
                "d",
                "M239.4,136.001c-57,0-103.3,46.3-103.3,103.3s46.3,103.3,103.3,103.3s103.3-46.3,103.3-103.3S296.4,136.001,239.4,136.001z M239.4,315.601c-42.1,0-76.3-34.2-76.3-76.3s34.2-76.3,76.3-76.3s76.3,34.2,76.3,76.3S281.5,315.601,239.4,315.601z"
              ),
                e.appendChild(t),
                e.appendChild(n);
            }
            return this._settingsIcon;
          }
        }
        class Ls {
          get rootElement() {
            return (
              this._rootElement ||
                ((this._rootElement = document.createElement("button")),
                (this._rootElement.type = "button"),
                this._rootElement.classList.add("UiTool"),
                (this._rootElement.id = "statsBtn"),
                this._rootElement.appendChild(this.statsIcon),
                this._rootElement.appendChild(this.tooltipText)),
              this._rootElement
            );
          }
          get tooltipText() {
            return (
              this._tooltipText ||
                ((this._tooltipText = document.createElement("span")),
                this._tooltipText.classList.add("tooltiptext"),
                (this._tooltipText.innerHTML = "Information")),
              this._tooltipText
            );
          }
          get statsIcon() {
            if (!this._statsIcon) {
              (this._statsIcon = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
              )),
                this._statsIcon.setAttributeNS(null, "id", "statsIcon"),
                this._statsIcon.setAttributeNS(null, "x", "0px"),
                this._statsIcon.setAttributeNS(null, "y", "0px"),
                this._statsIcon.setAttributeNS(null, "viewBox", "0 0 330 330");
              const e = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "g"
              );
              e.classList.add("svgIcon"), this._statsIcon.appendChild(e);
              const t = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
              );
              t.setAttributeNS(
                null,
                "d",
                "M165,0.008C74.019,0.008,0,74.024,0,164.999c0,90.977,74.019,164.992,165,164.992s165-74.015,165-164.992C330,74.024,255.981,0.008,165,0.008z M165,299.992c-74.439,0-135-60.557-135-134.992S90.561,30.008,165,30.008s135,60.557,135,134.991C300,239.436,239.439,299.992,165,299.992z"
              );
              const n = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
              );
              n.setAttributeNS(
                null,
                "d",
                "M165,130.008c-8.284,0-15,6.716-15,15v99.983c0,8.284,6.716,15,15,15s15-6.716,15-15v-99.983C180,136.725,173.284,130.008,165,130.008z"
              );
              const s = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
              );
              s.setAttributeNS(
                null,
                "d",
                "M165,70.011c-3.95,0-7.811,1.6-10.61,4.39c-2.79,2.79-4.39,6.66-4.39,10.61s1.6,7.81,4.39,10.61c2.79,2.79,6.66,4.39,10.61,4.39s7.81-1.6,10.609-4.39c2.79-2.8,4.391-6.66,4.391-10.61s-1.601-7.82-4.391-10.61C172.81,71.61,168.95,70.011,165,70.011z"
              ),
                e.appendChild(t),
                e.appendChild(n),
                e.appendChild(s);
            }
            return this._statsIcon;
          }
        }
        class As {
          get rootElement() {
            return (
              this._rootElement ||
                ((this._rootElement = document.createElement("button")),
                (this._rootElement.type = "button"),
                this._rootElement.classList.add("UiTool"),
                (this._rootElement.id = "xrBtn"),
                this._rootElement.appendChild(this.xrIcon),
                this._rootElement.appendChild(this.tooltipText)),
              this._rootElement
            );
          }
          get tooltipText() {
            return (
              this._tooltipText ||
                ((this._tooltipText = document.createElement("span")),
                this._tooltipText.classList.add("tooltiptext"),
                (this._tooltipText.innerHTML = "XR")),
              this._tooltipText
            );
          }
          get xrIcon() {
            if (!this._xrIcon) {
              (this._xrIcon = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
              )),
                this._xrIcon.setAttributeNS(null, "id", "xrIcon"),
                this._xrIcon.setAttributeNS(null, "x", "0px"),
                this._xrIcon.setAttributeNS(null, "y", "0px"),
                this._xrIcon.setAttributeNS(null, "viewBox", "0 0 100 100");
              const e = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "g"
              );
              e.classList.add("svgIcon"), this._xrIcon.appendChild(e);
              const t = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
              );
              t.setAttributeNS(
                null,
                "d",
                "M29 41c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9zm0 14c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm42-14c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9zm0 14c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm12-31H17c-6.6 0-12 5.4-12 12v28c0 6.6 5.4 12 12 12h14.5c3.5 0 6.8-1.5 9-4.1l3.5-4c1.5-1.7 3.7-2.7 6-2.7s4.5 1 6 2.7l3.5 4c2.3 2.6 5.6 4.1 9 4.1H83c6.6 0 12-5.4 12-12V36c0-6.6-5.4-12-12-12zm8 40c0 4.4-3.6 8-8 8H68.5c-2.3 0-4.5-1-6-2.7l-3.5-4c-2.3-2.6-5.6-4.1-9-4.1-3.5 0-6.8 1.5-9 4.1l-3.5 4C36 71 33.8 72 31.5 72H17c-4.4 0-8-3.6-8-8V36c0-4.4 3.6-8 8-8h66c4.4 0 8 3.6 8 8v28z"
              ),
                e.appendChild(t);
            }
            return this._xrIcon;
          }
        }
        function Fs(e) {
          return !e || (!!e && e.isEnabled);
        }
        function Os(e) {
          return null == e || e.creationMode === vs.CreateDefaultElement;
        }
        !(function (e) {
          (e[(e.CreateDefaultElement = 0)] = "CreateDefaultElement"),
            (e[(e.UseCustomElement = 1)] = "UseCustomElement"),
            (e[(e.Disable = 2)] = "Disable");
        })(vs || (vs = {}));
        class Is {
          constructor(e) {
            (e && !Os(e.statsButtonType)) || (this.statsIcon = new Ls()),
              (e && !Os(e.settingsButtonType)) ||
                (this.settingsIcon = new Rs()),
              (e && !Os(e.fullscreenButtonType)) ||
                (this.fullscreenIcon = new ks()),
              (e && !Os(e.xrIconType)) || (this.xrIcon = new As());
          }
          get rootElement() {
            return (
              this._rootElement ||
                ((this._rootElement = document.createElement("div")),
                (this._rootElement.id = "controls"),
                this.fullscreenIcon &&
                  this._rootElement.appendChild(
                    this.fullscreenIcon.rootElement
                  ),
                this.settingsIcon &&
                  this._rootElement.appendChild(this.settingsIcon.rootElement),
                this.statsIcon &&
                  this._rootElement.appendChild(this.statsIcon.rootElement),
                this.xrIcon &&
                  ms.WebXRController.isSessionSupported("immersive-vr").then(
                    (e) => {
                      e &&
                        this._rootElement.appendChild(this.xrIcon.rootElement);
                    }
                  )),
              this._rootElement
            );
          }
        }
        class _s {
          constructor(e, t) {
            (this._label = e), (this._buttonText = t);
          }
          addOnClickListener(e) {
            this.button.addEventListener("click", e);
          }
          get button() {
            return (
              this._button ||
                ((this._button = document.createElement("input")),
                (this._button.type = "button"),
                (this._button.value = this._buttonText),
                this._button.classList.add("overlay-button"),
                this._button.classList.add("btn-flat")),
              this._button
            );
          }
          get rootElement() {
            if (!this._rootElement) {
              (this._rootElement = document.createElement("div")),
                this._rootElement.classList.add("setting");
              const e = document.createElement("div");
              (e.innerText = this._label), this._rootElement.appendChild(e);
              const t = document.createElement("label");
              t.classList.add("btn-overlay"),
                this._rootElement.appendChild(t),
                t.appendChild(this.button);
            }
            return this._rootElement;
          }
        }
        class Ds {
          constructor() {
            this._rootElement = null;
          }
          get rootElement() {
            if (!this._rootElement) {
              (this._rootElement = document.createElement("div")),
                (this._rootElement.id = "settings-panel"),
                this._rootElement.classList.add("panel-wrap");
              const e = document.createElement("div");
              e.classList.add("panel"), this._rootElement.appendChild(e);
              const t = document.createElement("div");
              (t.id = "settingsHeading"),
                (t.textContent = "Settings"),
                e.appendChild(t),
                e.appendChild(this.settingsCloseButton),
                e.appendChild(this.settingsContentElement);
            }
            return this._rootElement;
          }
          get settingsContentElement() {
            return (
              this._settingsContentElement ||
                ((this._settingsContentElement = document.createElement("div")),
                (this._settingsContentElement.id = "settingsContent")),
              this._settingsContentElement
            );
          }
          get settingsCloseButton() {
            return (
              this._settingsCloseButton ||
                ((this._settingsCloseButton = document.createElement("div")),
                (this._settingsCloseButton.id = "settingsClose")),
              this._settingsCloseButton
            );
          }
          show() {
            this.rootElement.classList.contains("panel-wrap-visible") ||
              this.rootElement.classList.add("panel-wrap-visible");
          }
          toggleVisibility() {
            this.rootElement.classList.toggle("panel-wrap-visible");
          }
          hide() {
            this.rootElement.classList.contains("panel-wrap-visible") &&
              this.rootElement.classList.remove("panel-wrap-visible");
          }
        }
        class Us {
          get rootElement() {
            if (!this._rootElement) {
              (this._rootElement = document.createElement("section")),
                this._rootElement.classList.add("settingsContainer");
              const e = document.createElement("div");
              (e.id = "latencyTestHeader"),
                e.classList.add("settings-text"),
                e.classList.add("settingsHeader"),
                this._rootElement.appendChild(e);
              const t = document.createElement("div");
              (t.innerHTML = "Latency Test"),
                e.appendChild(t),
                e.appendChild(this.latencyTestButton);
              const n = document.createElement("div");
              (n.id = "latencyTestContainer"),
                n.classList.add("d-none"),
                this._rootElement.appendChild(n),
                n.appendChild(this.latencyTestResultsElement);
            }
            return this._rootElement;
          }
          get latencyTestResultsElement() {
            return (
              this._latencyTestResultsElement ||
                ((this._latencyTestResultsElement =
                  document.createElement("div")),
                (this._latencyTestResultsElement.id = "latencyStatsResults"),
                this._latencyTestResultsElement.classList.add("StatsResult")),
              this._latencyTestResultsElement
            );
          }
          get latencyTestButton() {
            return (
              this._latencyTestButton ||
                ((this._latencyTestButton = document.createElement("input")),
                (this._latencyTestButton.type = "button"),
                (this._latencyTestButton.value = "Run Test"),
                (this._latencyTestButton.id = "btn-start-latency-test"),
                this._latencyTestButton.classList.add("streamTools-button"),
                this._latencyTestButton.classList.add("btn-flat")),
              this._latencyTestButton
            );
          }
          handleTestResult(e) {
            ms.Logger.Log(ms.Logger.GetStackTrace(), e.toString(), 6);
            let t = "";
            (t += "<div>Net latency RTT (ms): " + e.networkLatency + "</div>"),
              (t += "<div>UE Encode (ms): " + e.EncodeMs + "</div>"),
              (t += "<div>UE Capture (ms): " + e.CaptureToSendMs + "</div>"),
              (t +=
                "<div>Browser send latency (ms): " +
                e.browserSendLatency +
                "</div>"),
              (t +=
                e.frameDisplayDeltaTimeMs && e.browserReceiptTimeMs
                  ? "<div>Browser receive latency (ms): " +
                    e.frameDisplayDeltaTimeMs +
                    "</div>"
                  : ""),
              (t +=
                "<div>Total latency (excluding browser) (ms): " +
                e.latencyExcludingDecode +
                "</div>"),
              (t += e.endToEndLatency
                ? "<div>Total latency (ms): " + e.endToEndLatency + "</div>"
                : ""),
              (this.latencyTestResultsElement.innerHTML = t);
          }
        }
        class zs {
          static formatBytes(e, t) {
            if (0 === e) return "0";
            const n = t < 0 ? 0 : t,
              s = Math.floor(Math.log(e) / Math.log(1024));
            return (
              parseFloat((e / Math.pow(1024, s)).toFixed(n)) +
              " " +
              ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"][
                s
              ]
            );
          }
        }
        class Bs {}
        class Ns {
          constructor() {
            (this.statsMap = new Map()), (this.latencyTest = new Us());
          }
          get rootElement() {
            if (!this._rootElement) {
              (this._rootElement = document.createElement("div")),
                (this._rootElement.id = "stats-panel"),
                this._rootElement.classList.add("panel-wrap");
              const e = document.createElement("div");
              e.classList.add("panel"), this._rootElement.appendChild(e);
              const t = document.createElement("div");
              (t.id = "statsHeading"),
                (t.textContent = "Information"),
                e.appendChild(t),
                e.appendChild(this.statsCloseButton),
                e.appendChild(this.statsContentElement);
            }
            return this._rootElement;
          }
          get statsContentElement() {
            if (!this._statsContentElement) {
              (this._statsContentElement = document.createElement("div")),
                (this._statsContentElement.id = "statsContent");
              const e = document.createElement("div");
              (e.id = "streamToolsStats"), e.classList.add("container");
              const t = document.createElement("div");
              (t.id = "ControlStats"), t.classList.add("row");
              const n = document.createElement("section");
              (n.id = "statistics"), n.classList.add("settingsContainer");
              const s = document.createElement("div");
              (s.id = "statisticsHeader"),
                s.classList.add("settings-text"),
                s.classList.add("settingsHeader");
              const i = document.createElement("div");
              (i.innerHTML = "Session Stats"),
                this._statsContentElement.appendChild(e),
                e.appendChild(t),
                t.appendChild(n),
                n.appendChild(s),
                s.appendChild(i),
                n.appendChild(this.statisticsContainer),
                t.appendChild(this.latencyTest.rootElement);
            }
            return this._statsContentElement;
          }
          get statisticsContainer() {
            return (
              this._statisticsContainer ||
                ((this._statisticsContainer = document.createElement("div")),
                (this._statisticsContainer.id = "statisticsContainer"),
                this._statisticsContainer.classList.add("d-none"),
                this._statisticsContainer.appendChild(this.statsResult)),
              this._statisticsContainer
            );
          }
          get statsResult() {
            return (
              this._statsResult ||
                ((this._statsResult = document.createElement("div")),
                (this._statsResult.id = "statisticsResult"),
                this._statsResult.classList.add("StatsResult")),
              this._statsResult
            );
          }
          get statsCloseButton() {
            return (
              this._statsCloseButton ||
                ((this._statsCloseButton = document.createElement("div")),
                (this._statsCloseButton.id = "statsClose")),
              this._statsCloseButton
            );
          }
          show() {
            this.rootElement.classList.contains("panel-wrap-visible") ||
              this.rootElement.classList.add("panel-wrap-visible");
          }
          toggleVisibility() {
            this.rootElement.classList.toggle("panel-wrap-visible");
          }
          hide() {
            this.rootElement.classList.contains("panel-wrap-visible") &&
              this.rootElement.classList.remove("panel-wrap-visible");
          }
          handleStats(e) {
            var t, n, s, i, r;
            const o = new Intl.NumberFormat(window.navigator.language, {
                maximumFractionDigits: 0,
              }),
              a = zs.formatBytes(e.inboundVideoStats.bytesReceived, 2);
            this.addOrUpdateStat("InboundDataStat", "Received", a);
            const l = Object.prototype.hasOwnProperty.call(
              e.inboundVideoStats,
              "packetsLost"
            )
              ? o.format(e.inboundVideoStats.packetsLost)
              : "Chrome only";
            this.addOrUpdateStat("PacketsLostStat", "Packets Lost", l),
              e.inboundVideoStats.bitrate &&
                this.addOrUpdateStat(
                  "VideoBitrateStat",
                  "Video Bitrate (kbps)",
                  e.inboundVideoStats.bitrate.toString()
                ),
              e.inboundAudioStats.bitrate &&
                this.addOrUpdateStat(
                  "AudioBitrateStat",
                  "Audio Bitrate (kbps)",
                  e.inboundAudioStats.bitrate.toString()
                );
            const c =
              Object.prototype.hasOwnProperty.call(
                e.inboundVideoStats,
                "frameWidth"
              ) &&
              e.inboundVideoStats.frameWidth &&
              Object.prototype.hasOwnProperty.call(
                e.inboundVideoStats,
                "frameHeight"
              ) &&
              e.inboundVideoStats.frameHeight
                ? e.inboundVideoStats.frameWidth +
                  "x" +
                  e.inboundVideoStats.frameHeight
                : "Chrome only";
            this.addOrUpdateStat("VideoResStat", "Video resolution", c);
            const d = Object.prototype.hasOwnProperty.call(
              e.inboundVideoStats,
              "framesDecoded"
            )
              ? o.format(e.inboundVideoStats.framesDecoded)
              : "Chrome only";
            this.addOrUpdateStat("FramesDecodedStat", "Frames Decoded", d),
              e.inboundVideoStats.framesPerSecond &&
                this.addOrUpdateStat(
                  "FramerateStat",
                  "Framerate",
                  e.inboundVideoStats.framesPerSecond.toString()
                ),
              this.addOrUpdateStat(
                "FramesDroppedStat",
                "Frames dropped",
                null === (t = e.inboundVideoStats.framesDropped) || void 0 === t
                  ? void 0
                  : t.toString()
              ),
              e.inboundVideoStats.codecId &&
                this.addOrUpdateStat(
                  "VideoCodecStat",
                  "Video codec",
                  null !==
                    (s =
                      null ===
                        (n = e.codecs.get(e.inboundVideoStats.codecId)) ||
                      void 0 === n
                        ? void 0
                        : n.split(" ")[0]) && void 0 !== s
                    ? s
                    : ""
                ),
              e.inboundAudioStats.codecId &&
                this.addOrUpdateStat(
                  "AudioCodecStat",
                  "Audio codec",
                  null !==
                    (r =
                      null ===
                        (i = e.codecs.get(e.inboundAudioStats.codecId)) ||
                      void 0 === i
                        ? void 0
                        : i.split(" ")[0]) && void 0 !== r
                    ? r
                    : ""
                );
            const h =
              Object.prototype.hasOwnProperty.call(
                e.candidatePair,
                "currentRoundTripTime"
              ) && e.isNumber(e.candidatePair.currentRoundTripTime)
                ? o.format(1e3 * e.candidatePair.currentRoundTripTime)
                : "Can't calculate";
            this.addOrUpdateStat("RTTStat", "Net RTT (ms)", h),
              this.addOrUpdateStat(
                "DurationStat",
                "Duration",
                e.sessionStats.runTime
              ),
              this.addOrUpdateStat(
                "ControlsInputStat",
                "Controls stream input",
                e.sessionStats.controlsStreamInput
              ),
              this.addOrUpdateStat(
                "QPStat",
                "Video quantization parameter",
                e.sessionStats.videoEncoderAvgQP.toString()
              ),
              ms.Logger.Log(
                ms.Logger.GetStackTrace(),
                `--------- Stats ---------\n ${e}\n------------------------`,
                6
              );
          }
          addOrUpdateStat(e, t, n) {
            const s = `${t}: ${n}`;
            if (this.statsMap.has(e)) {
              const t = this.statsMap.get(e);
              void 0 !== t && (t.element.innerHTML = s);
            } else {
              const i = new Bs();
              (i.id = e),
                (i.stat = n),
                (i.title = t),
                (i.element = document.createElement("div")),
                (i.element.innerHTML = s),
                this.statsResult.appendChild(i.element),
                this.statsMap.set(e, i);
            }
          }
        }
        class Gs {
          constructor() {
            (this.videoEncoderAvgQP = -1),
              (this.statsText = ""),
              (this.color = ""),
              (this.orangeQP = 26),
              (this.redQP = 35);
          }
          get rootElement() {
            return (
              this._rootElement ||
                ((this._rootElement = document.createElement("div")),
                (this._rootElement.id = "connection"),
                this._rootElement.classList.add("UiTool"),
                this._rootElement.appendChild(this.qualityStatus),
                this._rootElement.appendChild(this.qualityText),
                this.updateQpTooltip(-1)),
              this._rootElement
            );
          }
          get qualityText() {
            return (
              this._qualityText ||
                ((this._qualityText = document.createElement("span")),
                (this._qualityText.id = "qualityText"),
                this._qualityText.classList.add("tooltiptext")),
              this._qualityText
            );
          }
          get qualityStatus() {
            return (
              this._qualityStatus ||
                ((this._qualityStatus = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "svg"
                )),
                this._qualityStatus.setAttributeNS(
                  null,
                  "id",
                  "connectionStrength"
                ),
                this._qualityStatus.setAttributeNS(null, "x", "0px"),
                this._qualityStatus.setAttributeNS(null, "y", "0px"),
                this._qualityStatus.setAttributeNS(
                  null,
                  "viewBox",
                  "0 0 494.45 494.45"
                ),
                this.qualityStatus.appendChild(this.dot),
                this.qualityStatus.appendChild(this.middle),
                this.qualityStatus.appendChild(this.outer),
                this.qualityStatus.appendChild(this.inner)),
              this._qualityStatus
            );
          }
          get dot() {
            return (
              this._dot ||
                ((this._dot = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "circle"
                )),
                this._dot.setAttributeNS(null, "id", "dot"),
                this._dot.setAttributeNS(null, "cx", "247.125"),
                this._dot.setAttributeNS(null, "cy", "398.925"),
                this._dot.setAttributeNS(null, "r", "35.3")),
              this._dot
            );
          }
          get outer() {
            return (
              this._outer ||
                ((this._outer = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "path"
                )),
                this._outer.setAttributeNS(null, "id", "outer"),
                this._outer.setAttributeNS(
                  null,
                  "d",
                  "M467.925,204.625c-6.8,0-13.5-2.6-18.7-7.8c-111.5-111.4-292.7-111.4-404.1,0c-10.3,10.3-27.1,10.3-37.4,0s-10.3-27.1,0-37.4c64-64,149-99.2,239.5-99.2s175.5,35.2,239.5,99.2c10.3,10.3,10.3,27.1,0,37.4C481.425,202.025,474.625,204.625,467.925,204.625z"
                )),
              this._outer
            );
          }
          get middle() {
            return (
              this._middle ||
                ((this._middle = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "path"
                )),
                this._middle.setAttributeNS(null, "id", "middle"),
                this._middle.setAttributeNS(
                  null,
                  "d",
                  "M395.225,277.325c-6.8,0-13.5-2.6-18.7-7.8c-71.4-71.3-187.4-71.3-258.8,0c-10.3,10.3-27.1,10.3-37.4,0s-10.3-27.1,0-37.4c92-92,241.6-92,333.6,0c10.3,10.3,10.3,27.1,0,37.4C408.725,274.725,401.925,277.325,395.225,277.325z"
                )),
              this._middle
            );
          }
          get inner() {
            return (
              this._inner ||
                ((this._inner = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "path"
                )),
                this._inner.setAttributeNS(null, "id", "inner"),
                this._inner.setAttributeNS(
                  null,
                  "d",
                  "M323.625,348.825c-6.8,0-13.5-2.6-18.7-7.8c-15.4-15.4-36-23.9-57.8-23.9s-42.4,8.5-57.8,23.9c-10.3,10.3-27.1,10.3-37.4,0c-10.3-10.3-10.3-27.1,0-37.4c25.4-25.4,59.2-39.4,95.2-39.4s69.8,14,95.2,39.5c10.3,10.3,10.3,27.1,0,37.4C337.225,346.225,330.425,348.825,323.625,348.825z"
                )),
              this._inner
            );
          }
          blinkVideoQualityStatus(e) {
            let t = e,
              n = 1;
            const s = setInterval(() => {
              (n -= 0.1),
                (this.qualityText.style.opacity = String(
                  Math.abs(2 * (n - 0.5))
                )),
                n <= 0.1 && (0 == --t ? clearInterval(s) : (n = 1));
            }, 100 / e);
          }
          updateQpTooltip(e) {
            (this.videoEncoderAvgQP = e),
              e > this.redQP
                ? ((this.color = "red"),
                  this.blinkVideoQualityStatus(2),
                  (this.statsText = `<div style="color: ${this.color}">Poor encoding quality</div>`),
                  this.outer.setAttributeNS(null, "fill", "#3c3b40"),
                  this.middle.setAttributeNS(null, "fill", "#3c3b40"),
                  this.inner.setAttributeNS(null, "fill", this.color),
                  this.dot.setAttributeNS(null, "fill", this.color))
                : e > this.orangeQP
                ? ((this.color = "orange"),
                  this.blinkVideoQualityStatus(1),
                  (this.statsText = `<div style="color: ${this.color}">Blocky encoding quality</div>`),
                  this.outer.setAttributeNS(null, "fill", "#3c3b40"),
                  this.middle.setAttributeNS(null, "fill", this.color),
                  this.inner.setAttributeNS(null, "fill", this.color),
                  this.dot.setAttributeNS(null, "fill", this.color))
                : e <= 0
                ? ((this.color = "#b0b0b0"),
                  this.outer.setAttributeNS(null, "fill", "#3c3b40"),
                  this.middle.setAttributeNS(null, "fill", "#3c3b40"),
                  this.inner.setAttributeNS(null, "fill", "#3c3b40"),
                  this.dot.setAttributeNS(null, "fill", "#3c3b40"),
                  (this.statsText = `<div style="color: ${this.color}">Not connected</div>`))
                : ((this.color = "lime"),
                  (this.qualityStatus.style.opacity = "1"),
                  (this.statsText = `<div style="color: ${this.color}">Clear encoding quality</div>`),
                  this.outer.setAttributeNS(null, "fill", this.color),
                  this.middle.setAttributeNS(null, "fill", this.color),
                  this.inner.setAttributeNS(null, "fill", this.color),
                  this.dot.setAttributeNS(null, "fill", this.color)),
              (this.qualityText.innerHTML = this.statsText);
          }
        }
        class Hs {
          constructor(e) {
            this._setting = e;
          }
          get setting() {
            return this._setting;
          }
          get rootElement() {
            return (
              this._rootElement ||
                (this._rootElement = document.createElement("div")),
              this._rootElement
            );
          }
        }
        class Ws extends Hs {
          constructor(e) {
            super(e), (this.label = e.label), (this.flag = e.flag);
          }
          get setting() {
            return this._setting;
          }
          get settingsTextElem() {
            return (
              this._settingsTextElem ||
                ((this._settingsTextElem = document.createElement("div")),
                (this._settingsTextElem.innerText = this.setting._label),
                (this._settingsTextElem.title = this.setting.description)),
              this._settingsTextElem
            );
          }
          get checkbox() {
            return (
              this._checkbox ||
                ((this._checkbox = document.createElement("input")),
                (this._checkbox.type = "checkbox")),
              this._checkbox
            );
          }
          get rootElement() {
            if (!this._rootElement) {
              (this._rootElement = document.createElement("div")),
                (this._rootElement.id = this.setting.id),
                this._rootElement.classList.add("setting"),
                this._rootElement.appendChild(this.settingsTextElem);
              const e = document.createElement("label");
              e.classList.add("tgl-switch"),
                this._rootElement.appendChild(e),
                (this.checkbox.title = this.setting.description),
                this.checkbox.classList.add("tgl"),
                this.checkbox.classList.add("tgl-flat");
              const t = document.createElement("div");
              t.classList.add("tgl-slider"),
                e.appendChild(this.checkbox),
                e.appendChild(t),
                this.checkbox.addEventListener("change", () => {
                  this.setting.flag !== this.checkbox.checked &&
                    ((this.setting.flag = this.checkbox.checked),
                    this.setting.updateURLParams());
                });
            }
            return this._rootElement;
          }
          set flag(e) {
            this.checkbox.checked = e;
          }
          get flag() {
            return this.checkbox.checked;
          }
          set label(e) {
            this.settingsTextElem.innerText = e;
          }
          get label() {
            return this.settingsTextElem.innerText;
          }
        }
        class Vs extends Hs {
          constructor(e) {
            super(e),
              (this.label = this.setting.label),
              (this.number = this.setting.number);
          }
          get setting() {
            return this._setting;
          }
          get settingsTextElem() {
            return (
              this._settingsTextElem ||
                ((this._settingsTextElem = document.createElement("label")),
                (this._settingsTextElem.innerText = this.setting.label),
                (this._settingsTextElem.title = this.setting.description)),
              this._settingsTextElem
            );
          }
          get spinner() {
            return (
              this._spinner ||
                ((this._spinner = document.createElement("input")),
                (this._spinner.type = "number"),
                (this._spinner.min = this.setting.min.toString()),
                (this._spinner.max = this.setting.max.toString()),
                (this._spinner.value = this.setting.number.toString()),
                (this._spinner.title = this.setting.description),
                this._spinner.classList.add("form-control")),
              this._spinner
            );
          }
          get rootElement() {
            return (
              this._rootElement ||
                ((this._rootElement = document.createElement("div")),
                this._rootElement.classList.add("setting"),
                this._rootElement.classList.add("form-group"),
                this._rootElement.appendChild(this.settingsTextElem),
                this._rootElement.appendChild(this.spinner),
                (this.spinner.onchange = (e) => {
                  const t = e.target,
                    n = Number.parseInt(t.value);
                  Number.isNaN(n)
                    ? (ms.Logger.Warning(
                        ms.Logger.GetStackTrace(),
                        `Could not parse value change into a valid number - value was ${t.value}, resetting value to ${this.setting.min}`
                      ),
                      this.setting.number !== this.setting.min &&
                        (this.setting.number = this.setting.min))
                    : this.setting.number !== n &&
                      ((this.setting.number = n),
                      this.setting.updateURLParams());
                })),
              this._rootElement
            );
          }
          set number(e) {
            this.spinner.value = this.setting.clamp(e).toString();
          }
          get number() {
            return +this.spinner.value;
          }
          set label(e) {
            this.settingsTextElem.innerText = e;
          }
          get label() {
            return this.settingsTextElem.innerText;
          }
        }
        class Qs extends Hs {
          constructor(e) {
            super(e),
              (this.label = this.setting.label),
              (this.text = this.setting.text);
          }
          get setting() {
            return this._setting;
          }
          get settingsTextElem() {
            return (
              this._settingsTextElem ||
                ((this._settingsTextElem = document.createElement("div")),
                (this._settingsTextElem.innerText = this.setting.label),
                (this._settingsTextElem.title = this.setting.description)),
              this._settingsTextElem
            );
          }
          get textbox() {
            return (
              this._textbox ||
                ((this._textbox = document.createElement("input")),
                this._textbox.classList.add("form-control"),
                (this._textbox.type = "textbox")),
              this._textbox
            );
          }
          get rootElement() {
            if (!this._rootElement) {
              (this._rootElement = document.createElement("div")),
                (this._rootElement.id = this.setting.id),
                this._rootElement.classList.add("setting"),
                this._rootElement.appendChild(this.settingsTextElem);
              const e = document.createElement("label");
              this._rootElement.appendChild(e),
                (this.textbox.title = this.setting.description),
                e.appendChild(this.textbox),
                this.textbox.addEventListener("input", () => {
                  this.setting.text !== this.textbox.value &&
                    ((this.setting.text = this.textbox.value),
                    this.setting.updateURLParams());
                });
            }
            return this._rootElement;
          }
          set text(e) {
            this.textbox.value = e;
          }
          get text() {
            return this.textbox.value;
          }
          set label(e) {
            this.settingsTextElem.innerText = e;
          }
          get label() {
            return this.settingsTextElem.innerText;
          }
        }
        class qs extends Hs {
          constructor(e) {
            super(e),
              (this.label = this.setting.label),
              (this.options = this.setting.options),
              (this.selected = this.setting.selected);
          }
          get setting() {
            return this._setting;
          }
          get selector() {
            return (
              this._selector ||
                ((this._selector = document.createElement("select")),
                this._selector.classList.add("form-control"),
                this._selector.classList.add("settings-option")),
              this._selector
            );
          }
          get settingsTextElem() {
            return (
              this._settingsTextElem ||
                ((this._settingsTextElem = document.createElement("div")),
                (this._settingsTextElem.innerText = this.setting.label),
                (this._settingsTextElem.title = this.setting.description)),
              this._settingsTextElem
            );
          }
          set label(e) {
            this.settingsTextElem.innerText = e;
          }
          get label() {
            return this.settingsTextElem.innerText;
          }
          get rootElement() {
            if (!this._rootElement) {
              (this._rootElement = document.createElement("div")),
                (this._rootElement.id = this.setting.id),
                this._rootElement.classList.add("setting"),
                this._rootElement.classList.add("form-group"),
                this._rootElement.appendChild(this.settingsTextElem);
              const e = document.createElement("label");
              this._rootElement.appendChild(e),
                (this.selector.title = this.setting.description),
                e.appendChild(this.selector),
                (this.selector.onchange = () => {
                  this.setting.selected !== this.selector.value &&
                    ((this.setting.selected = this.selector.value),
                    this.setting.updateURLParams());
                });
            }
            return this._rootElement;
          }
          set options(e) {
            for (let e = this.selector.options.length - 1; e >= 0; e--)
              this.selector.remove(e);
            e.forEach((e) => {
              const t = document.createElement("option");
              (t.value = e), (t.innerHTML = e), this.selector.appendChild(t);
            });
          }
          get options() {
            return [...this.selector.options].map((e) => e.value);
          }
          set selected(e) {
            const t = this.options.filter((t) => -1 !== t.indexOf(e));
            t.length && (this.selector.value = t[0]);
          }
          get selected() {
            return this.selector.value;
          }
          disable() {
            this.selector.disabled = !0;
          }
          enable() {
            this.selector.disabled = !1;
          }
        }
        const js = "LightMode";
        class Ks {
          constructor(e) {
            (this.customFlags = new Map()),
              (this.flagsUi = new Map()),
              (this.numericParametersUi = new Map()),
              (this.textParametersUi = new Map()),
              (this.optionParametersUi = new Map()),
              this.createCustomUISettings(e.useUrlParams),
              this.registerSettingsUIComponents(e);
          }
          createCustomUISettings(e) {
            this.customFlags.set(
              js,
              new ms.SettingFlag(
                js,
                "Color Scheme: Dark Mode",
                "Page styling will be either light or dark",
                !1,
                e,
                (e, t) => {
                  t.label = `Color Scheme: ${e ? "Light" : "Dark"} Mode`;
                }
              )
            );
          }
          registerSettingsUIComponents(e) {
            for (const t of e.getFlags()) this.flagsUi.set(t.id, new Ws(t));
            for (const e of Array.from(this.customFlags.values()))
              this.flagsUi.set(e.id, new Ws(e));
            for (const t of e.getTextSettings())
              this.textParametersUi.set(t.id, new Qs(t));
            for (const t of e.getNumericSettings())
              this.numericParametersUi.set(t.id, new Vs(t));
            for (const t of e.getOptionSettings())
              this.optionParametersUi.set(t.id, new qs(t));
          }
          buildSectionWithHeading(e, t) {
            const n = document.createElement("section");
            n.classList.add("settingsContainer");
            const s = document.createElement("div");
            return (
              s.classList.add("settingsHeader"),
              s.classList.add("settings-text"),
              (s.textContent = t),
              n.appendChild(s),
              e.appendChild(n),
              n
            );
          }
          populateSettingsElement(e) {
            const t = this.buildSectionWithHeading(e, "Pixel Streaming");
            this.addSettingText(
              t,
              this.textParametersUi.get(ms.TextParameters.SignallingServerUrl)
            ),
              this.addSettingOption(
                t,
                this.optionParametersUi.get(ms.OptionParameters.StreamerId)
              ),
              this.addSettingFlag(t, this.flagsUi.get(ms.Flags.AutoConnect)),
              this.addSettingFlag(t, this.flagsUi.get(ms.Flags.AutoPlayVideo)),
              this.addSettingFlag(
                t,
                this.flagsUi.get(ms.Flags.BrowserSendOffer)
              ),
              this.addSettingFlag(t, this.flagsUi.get(ms.Flags.UseMic)),
              this.addSettingFlag(
                t,
                this.flagsUi.get(ms.Flags.StartVideoMuted)
              ),
              this.addSettingFlag(t, this.flagsUi.get(ms.Flags.PreferSFU)),
              this.addSettingFlag(
                t,
                this.flagsUi.get(ms.Flags.IsQualityController)
              ),
              this.addSettingFlag(t, this.flagsUi.get(ms.Flags.ForceMonoAudio)),
              this.addSettingFlag(t, this.flagsUi.get(ms.Flags.ForceTURN)),
              this.addSettingFlag(
                t,
                this.flagsUi.get(ms.Flags.SuppressBrowserKeys)
              ),
              this.addSettingFlag(t, this.flagsUi.get(ms.Flags.AFKDetection)),
              this.addSettingNumeric(
                t,
                this.numericParametersUi.get(
                  ms.NumericParameters.AFKTimeoutSecs
                )
              ),
              this.addSettingNumeric(
                t,
                this.numericParametersUi.get(
                  ms.NumericParameters.MaxReconnectAttempts
                )
              );
            const n = this.buildSectionWithHeading(e, "UI");
            this.addSettingFlag(
              n,
              this.flagsUi.get(ms.Flags.MatchViewportResolution)
            ),
              this.addSettingFlag(
                n,
                this.flagsUi.get(ms.Flags.HoveringMouseMode)
              ),
              this.addSettingFlag(n, this.flagsUi.get(js));
            const s = this.buildSectionWithHeading(e, "Input");
            this.addSettingFlag(s, this.flagsUi.get(ms.Flags.KeyboardInput)),
              this.addSettingFlag(s, this.flagsUi.get(ms.Flags.MouseInput)),
              this.addSettingFlag(s, this.flagsUi.get(ms.Flags.TouchInput)),
              this.addSettingFlag(s, this.flagsUi.get(ms.Flags.GamepadInput)),
              this.addSettingFlag(
                s,
                this.flagsUi.get(ms.Flags.XRControllerInput)
              );
            const i = this.buildSectionWithHeading(e, "Encoder");
            this.addSettingNumeric(
              i,
              this.numericParametersUi.get(ms.NumericParameters.MinQP)
            ),
              this.addSettingNumeric(
                i,
                this.numericParametersUi.get(ms.NumericParameters.MaxQP)
              );
            const r = this.optionParametersUi.get(
              ms.OptionParameters.PreferredCodec
            );
            this.addSettingOption(
              i,
              this.optionParametersUi.get(ms.OptionParameters.PreferredCodec)
            ),
              r &&
                [...r.selector.options]
                  .map((e) => e.value)
                  .includes("Only available on Chrome") &&
                r.disable();
            const o = this.buildSectionWithHeading(e, "WebRTC");
            this.addSettingNumeric(
              o,
              this.numericParametersUi.get(ms.NumericParameters.WebRTCFPS)
            ),
              this.addSettingNumeric(
                o,
                this.numericParametersUi.get(
                  ms.NumericParameters.WebRTCMinBitrate
                )
              ),
              this.addSettingNumeric(
                o,
                this.numericParametersUi.get(
                  ms.NumericParameters.WebRTCMaxBitrate
                )
              );
          }
          addSettingText(e, t) {
            t &&
              (e.appendChild(t.rootElement),
              this.textParametersUi.set(t.setting.id, t));
          }
          addSettingFlag(e, t) {
            t &&
              (e.appendChild(t.rootElement), this.flagsUi.set(t.setting.id, t));
          }
          addSettingNumeric(e, t) {
            t &&
              (e.appendChild(t.rootElement),
              this.numericParametersUi.set(t.setting.id, t));
          }
          addSettingOption(e, t) {
            t &&
              (e.appendChild(t.rootElement),
              this.optionParametersUi.set(t.setting.id, t));
          }
          onSettingsChanged({ data: { id: e, target: t, type: n } }) {
            if ("flag" === n) {
              const n = e,
                s = t,
                i = this.flagsUi.get(n);
              i &&
                (i.flag !== s.flag && (i.flag = s.flag),
                i.label !== s.label && (i.label = s.label));
            } else if ("number" === n) {
              const n = e,
                s = t,
                i = this.numericParametersUi.get(n);
              i &&
                (i.number !== s.number && (i.number = s.number),
                i.label !== s.label && (i.label = s.label));
            } else if ("text" === n) {
              const n = e,
                s = t,
                i = this.textParametersUi.get(n);
              i &&
                (i.text !== s.text && (i.text = s.text),
                i.label !== s.label && (i.label = s.label));
            } else if ("option" === n) {
              const n = e,
                s = t,
                i = this.optionParametersUi.get(n);
              if (i) {
                const e = i.options,
                  t = s.options;
                (e.length === t.length && e.every((e) => t.includes(e))) ||
                  (i.options = s.options),
                  i.selected !== s.selected && (i.selected = s.selected),
                  i.label !== s.label && (i.label = s.label);
              }
            }
          }
          addCustomFlagOnSettingChangedListener(e, t) {
            this.customFlags.has(e) && (this.customFlags.get(e).onChange = t);
          }
          setCustomFlagLabel(e, t) {
            this.customFlags.has(e)
              ? ((this.customFlags.get(e).label = t),
                (this.flagsUi.get(e).label = t))
              : ms.Logger.Warning(
                  ms.Logger.GetStackTrace(),
                  `Cannot set label for flag called ${e} - it does not exist in the Config.flags map.`
                );
          }
          isCustomFlagEnabled(e) {
            return this.customFlags.get(e).flag;
          }
        }
        class Xs {
          constructor(e) {
            (this._options = e),
              (this.stream = e.stream),
              (this.onColorModeChanged = e.onColorModeChanged),
              (this.configUI = new Ks(this.stream.config)),
              this.createOverlays(),
              Fs(e.statsPanelConfig) &&
                ((this.statsPanel = new Ns()),
                this.uiFeaturesElement.appendChild(
                  this.statsPanel.rootElement
                )),
              Fs(e.settingsPanelConfig) &&
                ((this.settingsPanel = new Ds()),
                this.uiFeaturesElement.appendChild(
                  this.settingsPanel.rootElement
                ),
                this.configureSettings()),
              (e.videoQpIndicatorConfig &&
                e.videoQpIndicatorConfig.disableIndicator) ||
                ((this.videoQpIndicator = new Gs()),
                this.uiFeaturesElement.appendChild(
                  this.videoQpIndicator.rootElement
                )),
              this.createButtons(),
              this.registerCallbacks(),
              this.showConnectOrAutoConnectOverlays(),
              this.setColorMode(this.configUI.isCustomFlagEnabled(js));
          }
          createOverlays() {
            (this.disconnectOverlay = new ys(this.stream.videoElementParent)),
              (this.connectOverlay = new Cs(this.stream.videoElementParent)),
              (this.playOverlay = new bs(this.stream.videoElementParent)),
              (this.infoOverlay = new ws(this.stream.videoElementParent)),
              (this.errorOverlay = new Ts(this.stream.videoElementParent)),
              (this.afkOverlay = new xs(this.stream.videoElementParent)),
              this.disconnectOverlay.onAction(() => this.stream.reconnect()),
              this.connectOverlay.onAction(() => this.stream.connect()),
              this.playOverlay.onAction(() => this.stream.play());
          }
          createButtons() {
            const e = {
                statsButtonType: this._options.statsPanelConfig
                  ? this._options.statsPanelConfig.visibilityButtonConfig
                  : void 0,
                settingsButtonType: this._options.settingsPanelConfig
                  ? this._options.settingsPanelConfig.visibilityButtonConfig
                  : void 0,
                fullscreenButtonType: this._options.fullScreenControlsConfig,
                xrIconType: this._options.xrControlsConfig,
              },
              t = new Is(e);
            this.uiFeaturesElement.appendChild(t.rootElement);
            const n =
              this._options.fullScreenControlsConfig &&
              this._options.fullScreenControlsConfig.creationMode ===
                vs.UseCustomElement
                ? new Ps(this._options.fullScreenControlsConfig.customElement)
                : t.fullscreenIcon;
            n &&
              (n.fullscreenElement = /iPhone|iPod/.test(navigator.userAgent)
                ? this.stream.videoElementParent.getElementsByTagName(
                    "video"
                  )[0]
                : this.rootElement);
            const s = t.settingsIcon
              ? t.settingsIcon.rootElement
              : this._options.settingsPanelConfig.visibilityButtonConfig
                  .customElement;
            s && (s.onclick = () => this.settingsClicked()),
              this.settingsPanel &&
                (this.settingsPanel.settingsCloseButton.onclick = () =>
                  this.settingsClicked());
            const i = t.xrIcon
              ? t.xrIcon.rootElement
              : this._options.xrControlsConfig.creationMode ===
                vs.UseCustomElement
              ? this._options.xrControlsConfig.customElement
              : void 0;
            i && (i.onclick = () => this.stream.toggleXR());
            const r = t.statsIcon
              ? t.statsIcon.rootElement
              : this._options.statsPanelConfig.visibilityButtonConfig
                  .customElement;
            if (
              (r && (r.onclick = () => this.statsClicked()),
              this.statsPanel &&
                (this.statsPanel.statsCloseButton.onclick = () =>
                  this.statsClicked()),
              this.settingsPanel)
            ) {
              const e = new _s("Show FPS", "Toggle");
              e.addOnClickListener(() => {
                this.stream.requestShowFps();
              });
              const t = new _s("Restart Stream", "Restart");
              t.addOnClickListener(() => {
                this.stream.reconnect();
              });
              const n = new _s("Request keyframe", "Request");
              n.addOnClickListener(() => {
                this.stream.requestIframe();
              });
              const s = this.configUI.buildSectionWithHeading(
                this.settingsPanel.settingsContentElement,
                "Commands"
              );
              s.appendChild(e.rootElement),
                s.appendChild(n.rootElement),
                s.appendChild(t.rootElement);
            }
          }
          configureSettings() {
            this.configUI.populateSettingsElement(
              this.settingsPanel.settingsContentElement
            ),
              this.configUI.addCustomFlagOnSettingChangedListener(js, (e) => {
                this.configUI.setCustomFlagLabel(
                  js,
                  `Color Scheme: ${e ? "Light" : "Dark"} Mode`
                ),
                  this.setColorMode(e);
              });
          }
          registerCallbacks() {
            this.stream.addEventListener(
              "afkWarningActivate",
              ({ data: { countDown: e, dismissAfk: t } }) =>
                this.showAfkOverlay(e, t)
            ),
              this.stream.addEventListener(
                "afkWarningUpdate",
                ({ data: { countDown: e } }) =>
                  this.afkOverlay.updateCountdown(e)
              ),
              this.stream.addEventListener("afkWarningDeactivate", () =>
                this.afkOverlay.hide()
              ),
              this.stream.addEventListener("afkTimedOut", () =>
                this.afkOverlay.hide()
              ),
              this.stream.addEventListener(
                "videoEncoderAvgQP",
                ({ data: { avgQP: e } }) => this.onVideoEncoderAvgQP(e)
              ),
              this.stream.addEventListener("webRtcSdp", () =>
                this.onWebRtcSdp()
              ),
              this.stream.addEventListener("webRtcAutoConnect", () =>
                this.onWebRtcAutoConnect()
              ),
              this.stream.addEventListener("webRtcConnecting", () =>
                this.onWebRtcConnecting()
              ),
              this.stream.addEventListener("webRtcConnected", () =>
                this.onWebRtcConnected()
              ),
              this.stream.addEventListener("webRtcFailed", () =>
                this.onWebRtcFailed()
              ),
              this.stream.addEventListener(
                "webRtcDisconnected",
                ({
                  data: { eventString: e, showActionOrErrorOnDisconnect: t },
                }) => this.onDisconnect(e, t)
              ),
              this.stream.addEventListener("videoInitialized", () =>
                this.onVideoInitialized()
              ),
              this.stream.addEventListener("streamLoading", () =>
                this.onStreamLoading()
              ),
              this.stream.addEventListener(
                "playStreamError",
                ({ data: { message: e } }) => this.onPlayStreamError(e)
              ),
              this.stream.addEventListener("playStream", () =>
                this.onPlayStream()
              ),
              this.stream.addEventListener(
                "playStreamRejected",
                ({ data: { reason: e } }) => this.onPlayStreamRejected(e)
              ),
              this.stream.addEventListener(
                "loadFreezeFrame",
                ({ data: { shouldShowPlayOverlay: e } }) =>
                  this.onLoadFreezeFrame(e)
              ),
              this.stream.addEventListener(
                "statsReceived",
                ({ data: { aggregatedStats: e } }) => this.onStatsReceived(e)
              ),
              this.stream.addEventListener(
                "latencyTestResult",
                ({ data: { latencyTimings: e } }) =>
                  this.onLatencyTestResults(e)
              ),
              this.stream.addEventListener(
                "streamerListMessage",
                ({
                  data: { messageStreamerList: e, autoSelectedStreamerId: t },
                }) => this.handleStreamerListMessage(e, t)
              ),
              this.stream.addEventListener("settingsChanged", (e) =>
                this.configUI.onSettingsChanged(e)
              );
          }
          get rootElement() {
            return (
              this._rootElement ||
                ((this._rootElement = document.createElement("div")),
                (this._rootElement.id = "playerUI"),
                this._rootElement.classList.add("noselect"),
                this._rootElement.appendChild(this.stream.videoElementParent),
                this._rootElement.appendChild(this.uiFeaturesElement)),
              this._rootElement
            );
          }
          get uiFeaturesElement() {
            return (
              this._uiFeatureElement ||
                ((this._uiFeatureElement = document.createElement("div")),
                (this._uiFeatureElement.id = "uiFeatures")),
              this._uiFeatureElement
            );
          }
          showDisconnectOverlay(e) {
            this.hideCurrentOverlay(),
              this.updateDisconnectOverlay(e),
              this.disconnectOverlay.show(),
              (this.currentOverlay = this.disconnectOverlay);
          }
          updateDisconnectOverlay(e) {
            this.disconnectOverlay.update(e);
          }
          onDisconnectionAction() {
            this.disconnectOverlay.activate();
          }
          hideCurrentOverlay() {
            null != this.currentOverlay &&
              (this.currentOverlay.hide(), (this.currentOverlay = null));
          }
          showConnectOverlay() {
            this.hideCurrentOverlay(),
              this.connectOverlay.show(),
              (this.currentOverlay = this.connectOverlay);
          }
          showPlayOverlay() {
            this.hideCurrentOverlay(),
              this.playOverlay.show(),
              (this.currentOverlay = this.playOverlay);
          }
          showTextOverlay(e) {
            this.hideCurrentOverlay(),
              this.infoOverlay.update(e),
              this.infoOverlay.show(),
              (this.currentOverlay = this.infoOverlay);
          }
          showErrorOverlay(e) {
            this.hideCurrentOverlay(),
              this.errorOverlay.update(e),
              this.errorOverlay.show(),
              (this.currentOverlay = this.errorOverlay);
          }
          settingsClicked() {
            this.statsPanel.hide(), this.settingsPanel.toggleVisibility();
          }
          statsClicked() {
            this.settingsPanel.hide(), this.statsPanel.toggleVisibility();
          }
          onConnectAction() {
            this.connectOverlay.activate();
          }
          onPlayAction() {
            this.playOverlay.activate();
          }
          showAfkOverlay(e, t) {
            this.hideCurrentOverlay(),
              this.afkOverlay.updateCountdown(e),
              this.afkOverlay.onAction(() => t()),
              this.afkOverlay.show(),
              (this.currentOverlay = this.afkOverlay);
          }
          showConnectOrAutoConnectOverlays() {
            this.stream.config.isFlagEnabled(ms.Flags.AutoConnect) ||
              this.showConnectOverlay();
          }
          onWebRtcAutoConnect() {
            this.showTextOverlay("Auto Connecting Now");
          }
          onWebRtcSdp() {
            this.showTextOverlay("WebRTC Connection Negotiated");
          }
          onStreamLoading() {
            const e = document.createElement("span");
            (e.className = "visually-hidden"), (e.innerHTML = "Loading...");
            const t = document.createElement("div");
            (t.id = "loading-spinner"),
              (t.className = "spinner-border ms-2"),
              t.setAttribute("role", "status"),
              t.appendChild(e),
              this.showTextOverlay("Loading Stream " + t.outerHTML);
          }
          onDisconnect(e, t) {
            0 == t
              ? this.showErrorOverlay(`Disconnected: ${e}`)
              : this.showDisconnectOverlay(
                  `Disconnected: ${e}  <div class="clickableState">Click To Restart</div>`
                ),
              (this.statsPanel.latencyTest.latencyTestButton.onclick =
                () => {});
          }
          onWebRtcConnecting() {
            this.showTextOverlay("Starting connection to server, please wait");
          }
          onWebRtcConnected() {
            this.showTextOverlay("WebRTC connected, waiting for video");
          }
          onWebRtcFailed() {
            this.showErrorOverlay("Unable to setup video");
          }
          onLoadFreezeFrame(e) {
            !0 === e &&
              (ms.Logger.Log(ms.Logger.GetStackTrace(), "showing play overlay"),
              this.showPlayOverlay());
          }
          onPlayStream() {
            this.hideCurrentOverlay();
          }
          onPlayStreamError(e) {
            this.showErrorOverlay(e);
          }
          onPlayStreamRejected(e) {
            this.showPlayOverlay();
          }
          onVideoInitialized() {
            this.stream.config.isFlagEnabled(ms.Flags.AutoPlayVideo) ||
              this.showPlayOverlay(),
              (this.statsPanel.latencyTest.latencyTestButton.onclick = () => {
                this.stream.requestLatencyTest();
              });
          }
          onVideoEncoderAvgQP(e) {
            this.videoQpIndicator && this.videoQpIndicator.updateQpTooltip(e);
          }
          onInitialSettings(e) {
            e.PixelStreamingSettings &&
              e.PixelStreamingSettings.DisableLatencyTest &&
              ((this.statsPanel.latencyTest.latencyTestButton.disabled = !0),
              (this.statsPanel.latencyTest.latencyTestButton.title =
                "Disabled by -PixelStreamingDisableLatencyTester=true"),
              ms.Logger.Info(
                ms.Logger.GetStackTrace(),
                "-PixelStreamingDisableLatencyTester=true, requesting latency report from the the browser to UE is disabled."
              ));
          }
          onStatsReceived(e) {
            this.statsPanel.handleStats(e);
          }
          onLatencyTestResults(e) {
            this.statsPanel.latencyTest.handleTestResult(e);
          }
          handleStreamerListMessage(e, t) {
            null === t &&
              (0 === e.ids.length
                ? this.showDisconnectOverlay(
                    'No streamers connected. <div class="clickableState">Click To Restart</div>'
                  )
                : this.showTextOverlay(
                    "Multiple streamers detected. Use the dropdown in the settings menu to select the streamer"
                  ));
          }
          setColorMode(e) {
            this.onColorModeChanged && this.onColorModeChanged(e);
          }
        }
        const Js = ((e) => {
            var t = {};
            return hs.d(t, e), t;
          })({ default: () => Jn }),
          Ys = ((e) => {
            var t = {};
            return hs.d(t, e), t;
          })({ default: () => ss }),
          $s = ((e) => {
            var t = {};
            return hs.d(t, e), t;
          })({ default: () => ds });
        class Zs {
          constructor(e) {
            (this.defaultLightModePalette = {
              "--color0": "#e2e0dd80",
              "--color1": "#FFFFFF",
              "--color2": "#000000",
              "--color3": "#0585fe",
              "--color4": "#35b350",
              "--color5": "#ffab00",
              "--color6": "#e1e2dd",
              "--color7": "#c3c4bf",
            }),
              (this.defaultDarkModePalette = {
                "--color0": "#1D1F2280",
                "--color1": "#000000",
                "--color2": "#FFFFFF",
                "--color3": "#0585fe",
                "--color4": "#35b350",
                "--color5": "#ffab00",
                "--color6": "#1e1d22",
                "--color7": "#3c3b40",
              }),
              (this.defaultStyles = {
                ":root": {
                  "--color0": "#1D1F2280",
                  "--color1": "#000000",
                  "--color2": "#FFFFFF",
                  "--color3": "#0585fe",
                  "--color4": "#35b350",
                  "--color5": "#ffab00",
                  "--color6": "#1e1d22",
                  "--color7": "#3c3b40",
                  "--color8": "#41008c",
                  "--color9": "#3e0070",
                  "--color10": "#2e0052",
                  "--color11": "rgba(65,0,139,1)",
                },
                ".noselect": { userSelect: "none" },
                "#playerUI": {
                  width: "100%",
                  height: "100%",
                  position: "relative",
                },
                "#videoElementParent": {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  backgroundColor: "var(--color1)",
                },
                "#uiFeatures": {
                  width: "100%",
                  height: "100%",
                  zIndex: "30",
                  position: "relative",
                  color: "var(--color2)",
                  pointerEvents: "none",
                  overflow: "hidden",
                },
                ".UiTool .tooltiptext": {
                  visibility: "hidden",
                  width: "auto",
                  color: "var(--color2)",
                  textAlign: "center",
                  borderRadius: "15px",
                  padding: "0px 10px",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.75rem",
                  letterSpacing: "0.75px",
                  position: "absolute",
                  top: "0",
                  transform: "translateY(25%)",
                  left: "125%",
                  zIndex: "20",
                },
                ".UiTool:hover .tooltiptext": {
                  visibility: "visible",
                  backgroundColor: "var(--color7)",
                },
                "#connection .tooltiptext": {
                  top: "125%",
                  transform: "translateX(-25%)",
                  left: "0",
                  zIndex: "20",
                  padding: "5px 10px",
                },
                "#connection": {
                  position: "absolute",
                  bottom: "8%",
                  left: "5%",
                  fontFamily: "'Michroma', sans-serif",
                  height: "3rem",
                  width: "3rem",
                  pointerEvents: "all",
                },
                "#settings-panel .tooltiptext": {
                  display: "block",
                  top: "125%",
                  transform: "translateX(-50%)",
                  left: "0",
                  zIndex: "20",
                  padding: "5px 10px",
                  border: "3px solid var(--color3)",
                  width: "max-content",
                  fallbacks: [
                    { width: "max-content" },
                    { border: "3px solid var(--color3)" },
                    { padding: "5px 10px" },
                    { zIndex: "20" },
                    { left: "0" },
                    { transform: "translateX(-50%)" },
                    { top: "125%" },
                    { display: "block" },
                  ],
                },
                "#controls": {
                  position: "absolute",
                  top: "3%",
                  left: "2%",
                  fontFamily: "'Michroma', sans-serif",
                  pointerEvents: "all",
                  display: "block",
                },
                "#controls>*": {
                  marginBottom: "0.5rem",
                  borderRadius: "50%",
                  display: "block",
                  height: "2rem",
                  lineHeight: "1.75rem",
                  padding: "0.5rem",
                },
                "#controls #additionalinfo": {
                  textAlign: "center",
                  fontFamily: "'Montserrat', sans-serif",
                },
                "#fullscreen-btn": { padding: "0.6rem !important" },
                "#minimizeIcon": { display: "none" },
                "#settingsBtn, #statsBtn": { cursor: "pointer" },
                "#uiFeatures button": {
                  backgroundColor: "var(--color7)",
                  border: "1px solid var(--color7)",
                  color: "var(--color2)",
                  position: "relative",
                  width: "3rem",
                  height: "3rem",
                  padding: "0.5rem",
                  textAlign: "center",
                },
                "#uiFeatures button:hover": {
                  backgroundColor: "var(--color3)",
                  border: "3px solid var(--color3)",
                  transition: "0.25s ease",
                  paddingLeft: "0.55rem",
                  paddingTop: "0.55rem",
                },
                "#uiFeatures button:active": {
                  border: "3px solid var(--color3)",
                  backgroundColor: "var(--color7)",
                  paddingLeft: "0.55rem",
                  paddingTop: "0.55rem",
                },
                ".btn-flat": {
                  backgroundColor: "transparent",
                  color: "var(--color2)",
                  fontFamily: "'Montserrat'",
                  fontWeight: "bold",
                  border: "3px solid var(--color3)",
                  borderRadius: "1rem",
                  fontSize: "0.75rem",
                  paddingLeft: "0.5rem",
                  paddingRight: "0.5rem",
                  cursor: "pointer",
                  textAlign: "center",
                },
                ".btn-flat:hover": {
                  backgroundColor: "var(--color3)",
                  transition: "ease 0.3s",
                },
                ".btn-flat:disabled": {
                  background: "var(--color7)",
                  borderColor: "var(--color3)",
                  color: "var(--color3)",
                  cursor: "default",
                },
                ".btn-flat:active": { backgroundColor: "transparent" },
                ".btn-flat:focus": { outline: "none" },
                "#uiFeatures img": { width: "100%", height: "100%" },
                ".panel-wrap": {
                  position: "absolute",
                  top: "0",
                  bottom: "0",
                  right: "0",
                  height: "100%",
                  minWidth: "20vw",
                  maxWidth: "100vw",
                  transform: "translateX(100%)",
                  transition: ".3s ease-out",
                  pointerEvents: "all",
                  backdropFilter: "blur(10px)",
                  webkitBackdropFilter: "blur(10px)",
                  overflowY: "auto",
                  overflowX: "hidden",
                  backgroundColor: "var(--color0)",
                },
                ".panel-wrap-visible": { transform: "translateX(0%)" },
                ".panel": { overflowY: "auto", padding: "1em" },
                "#settingsHeading, #statsHeading": {
                  display: "inline-block",
                  fontSize: "2em",
                  marginBlockStart: "0.67em",
                  marginBlockEnd: "0.67em",
                  marginInlineStart: "0px",
                  marginInlineEnd: "0px",
                  position: "relative",
                  padding: "0 0 0 2rem",
                },
                "#settingsClose, #statsClose": {
                  margin: "0.5rem",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                  paddingRight: "0.5rem",
                  fontSize: "2em",
                  float: "right",
                },
                "#settingsClose:after, #statsClose:after": {
                  paddingLeft: "0.5rem",
                  display: "inline-block",
                  content: '"\\00d7"',
                },
                "#settingsClose:hover, #statsClose:hover": {
                  color: "var(--color3)",
                  transition: "ease 0.3s",
                },
                "#settingsContent, #statsContent": {
                  marginLeft: "2rem",
                  marginRight: "2rem",
                },
                ".setting": {
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: "0.15rem 10px 0.15rem 10px",
                },
                ".settings-text": {
                  color: "var(--color2)",
                  verticalAlign: "middle",
                  fontWeight: "normal",
                },
                ".settings-option": {
                  width: "100%",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
                "#connectOverlay, #playOverlay, #infoOverlay, #errorOverlay, #afkOverlay, #disconnectOverlay":
                  {
                    zIndex: "30",
                    position: "absolute",
                    color: "var(--color2)",
                    fontSize: "1.8em",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "var(--color1)",
                    alignItems: "center",
                    justifyContent: "center",
                    textTransform: "uppercase",
                  },
                ".clickableState": {
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  cursor: "pointer",
                },
                ".textDisplayState": { display: "flex" },
                ".hiddenState": { display: "none" },
                "#playButton, #connectButton": {
                  display: "inline-block",
                  height: "auto",
                  zIndex: "30",
                },
                "img#playButton": { maxWidth: "241px", width: "10%" },
                "#uiInteraction": { position: "fixed" },
                "#UIInteractionButtonBoundary": { padding: "2px" },
                "#UIInteractionButton": { cursor: "pointer" },
                "#hiddenInput": {
                  position: "absolute",
                  left: "-10%",
                  width: "0px",
                  opacity: "0",
                },
                "#editTextButton": {
                  position: "absolute",
                  height: "40px",
                  width: "40px",
                },
                ".btn-overlay": {
                  verticalAlign: "middle",
                  display: "inline-block",
                },
                ".tgl-switch": {
                  verticalAlign: "middle",
                  display: "inline-block",
                },
                ".tgl-switch .tgl": { display: "none" },
                ".tgl, .tgl:after, .tgl:before, .tgl *, .tgl *:after, .tgl *:before, .tgl+.tgl-slider":
                  { webkitBoxSizing: "border-box", boxSizing: "border-box" },
                ".tgl::-moz-selection, .tgl:after::-moz-selection, .tgl:before::-moz-selection, .tgl *::-moz-selection, .tgl *:after::-moz-selection, .tgl *:before::-moz-selection, .tgl+.tgl-slider::-moz-selection":
                  { background: "none" },
                ".tgl::selection, .tgl:after::selection, .tgl:before::selection, .tgl *::selection, .tgl *:after::selection, .tgl *:before::selection, .tgl+.tgl-slider::selection":
                  { background: "none" },
                ".tgl-slider": {},
                ".tgl+.tgl-slider": {
                  outline: "0",
                  display: "block",
                  width: "40px",
                  height: "18px",
                  position: "relative",
                  cursor: "pointer",
                  userSelect: "none",
                },
                ".tgl+.tgl-slider:after, .tgl+.tgl-slider:before": {
                  position: "relative",
                  display: "block",
                  content: '""',
                  width: "50%",
                  height: "100%",
                },
                ".tgl+.tgl-slider:after": { left: "0" },
                ".tgl+.tgl-slider:before": { display: "none" },
                ".tgl-flat+.tgl-slider": {
                  padding: "2px",
                  webkitTransition: "all .2s ease",
                  transition: "all .2s ease",
                  background: "var(--color6)",
                  border: "3px solid var(--color7)",
                  borderRadius: "2em",
                },
                ".tgl-flat+.tgl-slider:after": {
                  webkitTransition: "all .2s ease",
                  transition: "all .2s ease",
                  background: "var(--color7)",
                  content: '""',
                  borderRadius: "1em",
                },
                ".tgl-flat:checked+.tgl-slider": {
                  border: "3px solid var(--color3)",
                },
                ".tgl-flat:checked+.tgl-slider:after": {
                  left: "50%",
                  background: "var(--color3)",
                },
                ".btn-apply": {
                  display: "block !important",
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "40%",
                },
                ".form-control": {
                  backgroundColor: "var(--color7)",
                  border: "2px solid var(--color7)",
                  borderRadius: "4px",
                  color: "var(--color2)",
                  textAlign: "right",
                  fontFamily: "inherit",
                },
                ".form-control:hover": { borderColor: "var(--color7)" },
                ".form-group": {
                  paddingTop: "4px",
                  display: "grid",
                  gridTemplateColumns: "80% 20%",
                  rowGap: "4px",
                  paddingRight: "10px",
                  paddingLeft: "10px",
                },
                ".form-group label": {
                  verticalAlign: "middle",
                  fontWeight: "normal",
                },
                ".settingsContainer": {
                  display: "flex",
                  flexDirection: "column",
                  borderBottom: "1px solid var(--color7)",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                },
                ".settingsContainer> :first-child": {
                  marginTop: "4px",
                  marginBottom: "4px",
                  fontWeight: "bold",
                  justifyContent: "space-between",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "baseline",
                },
                ".collapse": { paddingLeft: "5%" },
                "#streamTools": {
                  borderBottomRightRadius: "5px",
                  borderBottomLeftRadius: "5px",
                  userSelect: "none",
                  position: "absolute",
                  top: "0",
                  right: "2%",
                  zIndex: "100",
                  border: "4px solid var(--colour8)",
                  borderTopWidth: "0px",
                },
                ".settingsHeader": { fontStyle: "italic" },
                "#streamToolsHeader": {
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--colour8)",
                  backgroundColor: "var(--color7)",
                },
                ".streamTools": {
                  backgroundColor: "var(--color2)",
                  fontFamily: "var(--buttonFont)",
                  fontWeight: "lighter",
                  color: "var(--color7)",
                },
                ".streamTools-shown>#streamToolsSettings, .streamTools-shown>#streamToolsStats":
                  { display: "block" },
                "#streamToolsToggle": { width: "100%" },
                "#qualityStatus": { fontSize: "37px", paddingRight: "4px" },
                ".svgIcon": { fill: "var(--color2)" },
              });
            const {
                customStyles: t,
                lightModePalette: n,
                darkModePalette: s,
              } = null != e ? e : {},
              i = { plugins: [(0, Ys.default)(), (0, $s.default)()] };
            Js.default.setup(i),
              (this.customStyles = t),
              (this.lightModePalette =
                null != n ? n : this.defaultLightModePalette),
              (this.darkModePalette =
                null != s ? s : this.defaultDarkModePalette);
          }
          applyStyleSheet() {
            Js.default
              .createStyleSheet({
                "@global": Object.assign(
                  Object.assign({}, this.defaultStyles),
                  this.customStyles
                ),
              })
              .attach();
          }
          applyPalette(e) {
            const t = document.querySelector(":root");
            t.style.setProperty("--color0", e["--color0"]),
              t.style.setProperty("--color1", e["--color1"]),
              t.style.setProperty("--color2", e["--color2"]),
              t.style.setProperty("--color3", e["--color3"]),
              t.style.setProperty("--color4", e["--color4"]),
              t.style.setProperty("--color5", e["--color5"]),
              t.style.setProperty("--color6", e["--color6"]),
              t.style.setProperty("--color7", e["--color7"]);
          }
          setColorMode(e) {
            e
              ? this.applyPalette(this.lightModePalette)
              : this.applyPalette(this.darkModePalette);
          }
        }
        var ei = us.Mx,
          ti = new (0, us.XY)();
        ti.applyStyleSheet(),
          (document.body.onload = function () {
            var e = new Tt({ useUrlParams: !0 }),
              t = new Rt(e),
              n = new ei({
                stream: t,
                onColorModeChanged: function (e) {
                  return ti.setColorMode(e);
                },
              });
            document
              .getElementById("playercontainer")
              .appendChild(n.rootElement);
            var s = new ni(t);
            document.getElementById("exampleSelect").onchange = function (e) {
              s.onExampleChanged(e);
            };
          });
        var ni = (function () {
          function e(e) {
            (this._pixelStreaming = e),
              (this._infoElem = document.getElementById("infoinstructions")),
              (this._exampleSettingsElem =
                document.getElementById("sidebarContent")),
              this._createGettingStartedExample();
          }
          return (
            (e.prototype.onExampleChanged = function (e) {
              if (e) {
                var t = e.target.value;
                this._createExample(t);
              }
            }),
            (e.prototype._createExample = function (e) {
              for (; this._exampleSettingsElem.lastElementChild; )
                this._exampleSettingsElem.removeChild(
                  this._exampleSettingsElem.lastElementChild
                );
              switch (e) {
                case "Send Data to UE":
                  this._createSendUEDataExample();
                  break;
                case "Getting Started":
                  this._createGettingStartedExample();
                  break;
                case "Send Commands to UE":
                  this._createUECommandExample();
              }
            }),
            (e.prototype._onCharacterClicked = function (e) {
              this._pixelStreaming.emitUIInteraction({ Character: e });
              console.log({character:e});
            }),
            (e.prototype._onSkinClicked = function (e) {
              this._pixelStreaming.emitUIInteraction({ Skin: e });
            }),
            (e.prototype._onResClicked = function (e, t) {
              this._pixelStreaming.emitCommand({
                Resolution: { Width: e, Height: t },
              });
            }),
            (e.prototype._createGettingStartedExample = function () {
              this._infoElem.innerHTML =
                '\n\t\t<p>Welcome to the Pixel Streaming demo showcase!</p>\n\t\t<p> <u>Getting Started</u> </p>\n\t\t<ol>\n\t\t\t<li>Run the Unreal Engine Pixel Streaming demo project with launch args for this server, example: -PixelStreamingUrl=ws://localhost:8888.</li>\n\t\t\t<li>Click the "click to start" text on this page to start streaming.</li>\n\t\t\t<li>Use the drop down to select an example.</li>\n\t\t\t<li>Use control panel on the left to interact with the example.</li>\n\t\t</ol>\n\t\t';
            }),
            (e.prototype._createSendUEDataExample = function () {
              var e = this;
              this._infoElem.innerHTML =
                "\n\t\t<p> <u>Example: Sending data to Unreal Engine</u> </p>\n\t\t<ol>\n\t\t\t<li>Click the character portraits to change character.</li>\n\t\t\t<li>Click the skins to change character skins.</li>\n\t\t</ol>\n\t\t<p>Under the hood these interactions use the WebRTC data channel to send a data payload that we interpret on the UE side and respond to appropriately.</p>\n\t\t<p>In particular the function called to send custom data to Unreal Engine from the frontend is:</p>\n\t\t<code>pixelstreaming.emitUIInteraction(data: object | string)</code>\n\t\t";
              var t = document.createElement("div");
              this._exampleSettingsElem.appendChild(t);
              var n = document.createElement("h2");
              (n.innerText = "Send data: "), t.appendChild(n);
              var s = document.createElement("p");
              (s.innerText = "Select a character: "), t.appendChild(s);
              var i = document.createElement("div");
              t.appendChild(i);
              var r = document.createElement("img");
              r.classList.add("characterBtn"),
                (r.src = "./images/Aurora.jpg"),
                (r.onclick = function () {
                  e._onCharacterClicked("Aurora");
                }),
                i.appendChild(r);
              var o = document.createElement("div");
              t.appendChild(o);
              var a = document.createElement("img");
              a.classList.add("characterBtn"),
                (a.src = "./images/Crunch.jpg"),
                (a.onclick = function () {
                  e._onCharacterClicked("Crunch");
                }),
                o.appendChild(a);
              var l = document.createElement("p");
              (l.innerText = "Select a skin: "),
                this._exampleSettingsElem.appendChild(l);
              var c = document.createElement("div");
              c.classList.add("spaced-row"),
                this._exampleSettingsElem.appendChild(c);
              var d = document.createElement("button");
              d.classList.add("btn-flat"),
                (d.onclick = function () {
                  e._onSkinClicked(0);
                }),
                (d.innerText = "Skin 1"),
                c.appendChild(d);
              var h = document.createElement("button");
              h.classList.add("btn-flat"),
                (h.onclick = function () {
                  e._onSkinClicked(1);
                }),
                (h.innerText = "Skin 2"),
                c.appendChild(h);
              var u = document.createElement("button");
              u.classList.add("btn-flat"),
                (u.onclick = function () {
                  e._onSkinClicked(2);
                }),
                (u.innerText = "Skin 3"),
                c.appendChild(u);
            }),
            (e.prototype._createUECommandExample = function () {
              var e = this;
              this._infoElem.innerHTML =
                '\n\t\t<p> <u>Example: Triggering Commands in Unreal Engine</u> </p>\n\t\t<ul>\n\t\t\t<li>Click on the resolution buttons to change your Unreal Engine application\'s resolution (requires a <code>-windowed</code> application).</li>\n\t\t</ul>\n\t\t<p>Under the hood these interactions use the WebRTC data channel to send command messages that we interpret on the UE side to call specific UE functions.</p>\n\t\t<p>There are a very select set of built-in commands such as <i>changing resolution</i> and <i>change encoder QP</i>, which can be triggered like so:</p>\n\t\t<code>pixelStreaming.emitCommand({"Encoder.MinQP": 51,})</code>\n\n\t\t<p>However, you can bind your own custom commands in C++ using:</p>\n\t\t<code>\n\t\t\t// C++ side \n\t\t\t</br>\n\t\t\tIPixelStreamingInputHandler::SetCommandHandler(const FString& CommandName, const TFunction<void(FString, FString)>& Handler)\n\t\t\t</br>\n\t\t\t// JS side\n\t\t\t</br>\n\t\t\tpixelstreaming.emitCommand({"MyCustomCommand": "MyCustomCommandParameter"});\n\t\t</code>\n\n\t\t<p>Additionally you can also trigger Unreal Engine console commands like <code>stat gpu</code> if you launch Pixel Streaming with <code>-AllowPixelStreamingCommands</code> then calling:</p>\n\t\t<code>pixelstreaming.emitConsoleCommand(command: string)</code>\n\t\t';
              var t = document.createElement("div");
              this._exampleSettingsElem.appendChild(t);
              var n = document.createElement("h2");
              (n.innerText = "Send a custom command: "), t.appendChild(n);
              var s = document.createElement("p");
              (s.innerHTML = "Change resolution"), t.appendChild(s);
              var i = document.createElement("div");
              i.classList.add("spaced-row"),
                this._exampleSettingsElem.appendChild(i);
              var r = document.createElement("button");
              r.classList.add("btn-flat"),
                (r.onclick = function () {
                  e._onResClicked(1280, 720);
                }),
                (r.innerText = "720p"),
                i.appendChild(r);
              var o = document.createElement("button");
              o.classList.add("btn-flat"),
                (o.onclick = function () {
                  e._onResClicked(1920, 1080);
                }),
                (o.innerText = "1080p"),
                i.appendChild(o);
              var a = document.createElement("button");
              a.classList.add("btn-flat"),
                (a.onclick = function () {
                  e._onResClicked(2560, 1440);
                }),
                (a.innerText = "1440p"),
                i.appendChild(a);
              var l = document.createElement("button");
              l.classList.add("btn-flat"),
                (l.onclick = function () {
                  e._onResClicked(3840, 2160);
                }),
                (l.innerText = "4k"),
                i.appendChild(l);
              var c = document.createElement("div");
              this._exampleSettingsElem.appendChild(c);
              var d = document.createElement("h2");
              (d.innerText = "Send a console command: "), c.appendChild(d);
              var h = document.createElement("p");
              (h.innerHTML =
                "(Requires UE side launched with <code>-AllowPixelStreamingCommands</code>)"),
                c.appendChild(h);
              var u = document.createElement("div");
              u.classList.add("spaced-row"),
                this._exampleSettingsElem.appendChild(u);
              var m = document.createElement("button");
              m.classList.add("btn-flat"),
                (m.onclick = function () {
                  e._pixelStreaming.emitConsoleCommand("stat fps");
                }),
                (m.innerText = "stat fps"),
                u.appendChild(m);
              var g = document.createElement("button");
              g.classList.add("btn-flat"),
                (g.onclick = function () {
                  e._pixelStreaming.emitConsoleCommand("stat pixelstreaming");
                }),
                (g.innerText = "stat pixelstreaming"),
                u.appendChild(g);
              var p = document.createElement("button");
              p.classList.add("btn-flat"),
                (p.onclick = function () {
                  e._pixelStreaming.emitConsoleCommand(
                    "stat pixelstreaminggraphs"
                  );
                }),
                (p.innerText = "stat pixelstreaminggraphs"),
                u.appendChild(p);
            }),
            e
          );
        })();
      })(),
      s
    );
  })()
);
