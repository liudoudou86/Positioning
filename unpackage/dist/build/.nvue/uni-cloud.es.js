var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a2, b2) => {
  for (var prop in b2 || (b2 = {}))
    if (__hasOwnProp.call(b2, prop))
      __defNormalProp(a2, prop, b2[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b2)) {
      if (__propIsEnum.call(b2, prop))
        __defNormalProp(a2, prop, b2[prop]);
    }
  return a2;
};
var __spreadProps = (a2, b2) => __defProps(a2, __getOwnPropDescs(b2));
const isString = (val) => typeof val === "string";
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
function isDebugMode() {
  return typeof __channelId__ === "string" && __channelId__;
}
function jsonStringifyReplacer(k2, p) {
  switch (toRawType(p)) {
    case "Function":
      return "function() { [native code] }";
    default:
      return p;
  }
}
function normalizeLog(type, filename, args) {
  if (isDebugMode()) {
    args.push(filename.replace("at ", "uni-app:///"));
    return console[type].apply(console, args);
  }
  const msgs = args.map(function(v2) {
    const type2 = toTypeString(v2).toLowerCase();
    if (["[object object]", "[object array]", "[object module]"].indexOf(type2) !== -1) {
      try {
        v2 = "---BEGIN:JSON---" + JSON.stringify(v2, jsonStringifyReplacer) + "---END:JSON---";
      } catch (e) {
        v2 = type2;
      }
    } else {
      if (v2 === null) {
        v2 = "---NULL---";
      } else if (v2 === void 0) {
        v2 = "---UNDEFINED---";
      } else {
        const vType = toRawType(v2).toUpperCase();
        if (vType === "NUMBER" || vType === "BOOLEAN") {
          v2 = "---BEGIN:" + vType + "---" + v2 + "---END:" + vType + "---";
        } else {
          v2 = String(v2);
        }
      }
    }
    return v2;
  });
  return msgs.join("---COMMA---") + " " + filename;
}
function formatAppLog(type, filename, ...args) {
  const res = normalizeLog(type, filename, args);
  res && console[type](res);
}
const isObject = (val) => val !== null && typeof val === "object";
const defaultDelimiters = ["{", "}"];
class BaseFormatter {
  constructor() {
    this._caches = /* @__PURE__ */ Object.create(null);
  }
  interpolate(message, values, delimiters = defaultDelimiters) {
    if (!values) {
      return [message];
    }
    let tokens = this._caches[message];
    if (!tokens) {
      tokens = parse(message, delimiters);
      this._caches[message] = tokens;
    }
    return compile(tokens, values);
  }
}
const RE_TOKEN_LIST_VALUE = /^(?:\d)+/;
const RE_TOKEN_NAMED_VALUE = /^(?:\w)+/;
function parse(format, [startDelimiter, endDelimiter]) {
  const tokens = [];
  let position = 0;
  let text = "";
  while (position < format.length) {
    let char = format[position++];
    if (char === startDelimiter) {
      if (text) {
        tokens.push({ type: "text", value: text });
      }
      text = "";
      let sub = "";
      char = format[position++];
      while (char !== void 0 && char !== endDelimiter) {
        sub += char;
        char = format[position++];
      }
      const isClosed = char === endDelimiter;
      const type = RE_TOKEN_LIST_VALUE.test(sub) ? "list" : isClosed && RE_TOKEN_NAMED_VALUE.test(sub) ? "named" : "unknown";
      tokens.push({ value: sub, type });
    } else {
      text += char;
    }
  }
  text && tokens.push({ type: "text", value: text });
  return tokens;
}
function compile(tokens, values) {
  const compiled = [];
  let index = 0;
  const mode = Array.isArray(values) ? "list" : isObject(values) ? "named" : "unknown";
  if (mode === "unknown") {
    return compiled;
  }
  while (index < tokens.length) {
    const token = tokens[index];
    switch (token.type) {
      case "text":
        compiled.push(token.value);
        break;
      case "list":
        compiled.push(values[parseInt(token.value, 10)]);
        break;
      case "named":
        if (mode === "named") {
          compiled.push(values[token.value]);
        }
        break;
    }
    index++;
  }
  return compiled;
}
const LOCALE_ZH_HANS = "zh-Hans";
const LOCALE_ZH_HANT = "zh-Hant";
const LOCALE_EN = "en";
const LOCALE_FR = "fr";
const LOCALE_ES = "es";
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const defaultFormatter = new BaseFormatter();
function include(str, parts) {
  return !!parts.find((part) => str.indexOf(part) !== -1);
}
function startsWith(str, parts) {
  return parts.find((part) => str.indexOf(part) === 0);
}
function normalizeLocale(locale, messages) {
  if (!locale) {
    return;
  }
  locale = locale.trim().replace(/_/g, "-");
  if (messages && messages[locale]) {
    return locale;
  }
  locale = locale.toLowerCase();
  if (locale === "chinese") {
    return LOCALE_ZH_HANS;
  }
  if (locale.indexOf("zh") === 0) {
    if (locale.indexOf("-hans") > -1) {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf("-hant") > -1) {
      return LOCALE_ZH_HANT;
    }
    if (include(locale, ["-tw", "-hk", "-mo", "-cht"])) {
      return LOCALE_ZH_HANT;
    }
    return LOCALE_ZH_HANS;
  }
  const lang = startsWith(locale, [LOCALE_EN, LOCALE_FR, LOCALE_ES]);
  if (lang) {
    return lang;
  }
}
class I18n {
  constructor({ locale, fallbackLocale, messages, watcher, formater }) {
    this.locale = LOCALE_EN;
    this.fallbackLocale = LOCALE_EN;
    this.message = {};
    this.messages = {};
    this.watchers = [];
    if (fallbackLocale) {
      this.fallbackLocale = fallbackLocale;
    }
    this.formater = formater || defaultFormatter;
    this.messages = messages || {};
    this.setLocale(locale || LOCALE_EN);
    if (watcher) {
      this.watchLocale(watcher);
    }
  }
  setLocale(locale) {
    const oldLocale = this.locale;
    this.locale = normalizeLocale(locale, this.messages) || this.fallbackLocale;
    if (!this.messages[this.locale]) {
      this.messages[this.locale] = {};
    }
    this.message = this.messages[this.locale];
    if (oldLocale !== this.locale) {
      this.watchers.forEach((watcher) => {
        watcher(this.locale, oldLocale);
      });
    }
  }
  getLocale() {
    return this.locale;
  }
  watchLocale(fn) {
    const index = this.watchers.push(fn) - 1;
    return () => {
      this.watchers.splice(index, 1);
    };
  }
  add(locale, message, override = true) {
    const curMessages = this.messages[locale];
    if (curMessages) {
      if (override) {
        Object.assign(curMessages, message);
      } else {
        Object.keys(message).forEach((key) => {
          if (!hasOwn(curMessages, key)) {
            curMessages[key] = message[key];
          }
        });
      }
    } else {
      this.messages[locale] = message;
    }
  }
  f(message, values, delimiters) {
    return this.formater.interpolate(message, values, delimiters).join("");
  }
  t(key, locale, values) {
    let message = this.message;
    if (typeof locale === "string") {
      locale = normalizeLocale(locale, this.messages);
      locale && (message = this.messages[locale]);
    } else {
      values = locale;
    }
    if (!hasOwn(message, key)) {
      console.warn(`Cannot translate the value of keypath ${key}. Use the value of keypath as default.`);
      return key;
    }
    return this.formater.interpolate(message[key], values).join("");
  }
}
function watchAppLocale(appVm, i18n) {
  if (appVm.$watchLocale) {
    appVm.$watchLocale((newLocale) => {
      i18n.setLocale(newLocale);
    });
  } else {
    appVm.$watch(() => appVm.$locale, (newLocale) => {
      i18n.setLocale(newLocale);
    });
  }
}
function getDefaultLocale() {
  if (typeof uni !== "undefined" && uni.getLocale) {
    return uni.getLocale();
  }
  if (typeof global !== "undefined" && global.getLocale) {
    return global.getLocale();
  }
  return LOCALE_EN;
}
function initVueI18n(locale, messages = {}, fallbackLocale, watcher) {
  if (typeof locale !== "string") {
    [locale, messages] = [
      messages,
      locale
    ];
  }
  if (typeof locale !== "string") {
    locale = getDefaultLocale();
  }
  if (typeof fallbackLocale !== "string") {
    fallbackLocale = typeof __uniConfig !== "undefined" && __uniConfig.fallbackLocale || LOCALE_EN;
  }
  const i18n = new I18n({
    locale,
    fallbackLocale,
    messages,
    watcher
  });
  let t2 = (key, values) => {
    if (typeof getApp !== "function") {
      t2 = function(key2, values2) {
        return i18n.t(key2, values2);
      };
    } else {
      let isWatchedAppLocale = false;
      t2 = function(key2, values2) {
        const appVm = getApp().$vm;
        if (appVm) {
          appVm.$locale;
          if (!isWatchedAppLocale) {
            isWatchedAppLocale = true;
            watchAppLocale(appVm, i18n);
          }
        }
        return i18n.t(key2, values2);
      };
    }
    return t2(key, values);
  };
  return {
    i18n,
    f(message, values, delimiters) {
      return i18n.f(message, values, delimiters);
    },
    t(key, values) {
      return t2(key, values);
    },
    add(locale2, message, override = true) {
      return i18n.add(locale2, message, override);
    },
    watch(fn) {
      return i18n.watchLocale(fn);
    },
    getLocale() {
      return i18n.getLocale();
    },
    setLocale(newLocale) {
      return i18n.setLocale(newLocale);
    }
  };
}
const pages = [
  {
    path: "pages/index/index",
    style: {
      navigationBarTitleText: "\u5B9E\u65F6\u5B9A\u4F4D"
    }
  },
  {
    path: "pages/map/map",
    style: {
      navigationBarTitleText: "\u5386\u53F2\u8DB3\u8FF9"
    }
  },
  {
    path: "pages/setting/setting",
    style: {
      navigationBarTitleText: "\u7528\u6237\u8BBE\u7F6E"
    }
  },
  {
    path: "pages/setting/confirm/confirm",
    style: {
      navigationBarTitleText: "\u67E5\u770B\u7528\u6237"
    }
  },
  {
    path: "pages/setting/register/register",
    style: {
      navigationBarTitleText: "\u6CE8\u518C\u7528\u6237"
    }
  }
];
const globalStyle = {
  navigationBarTextStyle: "black",
  navigationBarTitleText: "uni-app",
  navigationBarBackgroundColor: "#F8F8F8",
  backgroundColor: "#F8F8F8"
};
const tabBar = {
  color: "#7A7E83",
  selectedColor: "#007AFF",
  borderStyle: "black",
  backgroundColor: "#F8F8F8",
  list: [
    {
      pagePath: "pages/index/index",
      iconPath: "static/tabbar/component.png",
      selectedIconPath: "static/tabbar/componentHL.png",
      text: "\u5B9A\u4F4D"
    },
    {
      pagePath: "pages/map/map",
      iconPath: "static/tabbar/extui.png",
      selectedIconPath: "static/tabbar/extuiHL.png",
      text: "\u8DB3\u8FF9"
    },
    {
      pagePath: "pages/setting/setting",
      iconPath: "static/tabbar/template.png",
      selectedIconPath: "static/tabbar/templateHL.png",
      text: "\u8BBE\u7F6E"
    }
  ]
};
var t = {
  pages,
  globalStyle,
  tabBar
};
function n(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function s(e, t2, n2) {
  return e(n2 = { path: t2, exports: {}, require: function(e2, t3) {
    return function() {
      throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
    }(t3 == null && n2.path);
  } }, n2.exports), n2.exports;
}
var o = s(function(e, t2) {
  var n2;
  e.exports = (n2 = n2 || function(e2, t3) {
    var n3 = Object.create || function() {
      function e3() {
      }
      return function(t4) {
        var n4;
        return e3.prototype = t4, n4 = new e3(), e3.prototype = null, n4;
      };
    }(), s2 = {}, o2 = s2.lib = {}, r2 = o2.Base = { extend: function(e3) {
      var t4 = n3(this);
      return e3 && t4.mixIn(e3), t4.hasOwnProperty("init") && this.init !== t4.init || (t4.init = function() {
        t4.$super.init.apply(this, arguments);
      }), t4.init.prototype = t4, t4.$super = this, t4;
    }, create: function() {
      var e3 = this.extend();
      return e3.init.apply(e3, arguments), e3;
    }, init: function() {
    }, mixIn: function(e3) {
      for (var t4 in e3)
        e3.hasOwnProperty(t4) && (this[t4] = e3[t4]);
      e3.hasOwnProperty("toString") && (this.toString = e3.toString);
    }, clone: function() {
      return this.init.prototype.extend(this);
    } }, i2 = o2.WordArray = r2.extend({ init: function(e3, n4) {
      e3 = this.words = e3 || [], this.sigBytes = n4 != t3 ? n4 : 4 * e3.length;
    }, toString: function(e3) {
      return (e3 || c2).stringify(this);
    }, concat: function(e3) {
      var t4 = this.words, n4 = e3.words, s3 = this.sigBytes, o3 = e3.sigBytes;
      if (this.clamp(), s3 % 4)
        for (var r3 = 0; r3 < o3; r3++) {
          var i3 = n4[r3 >>> 2] >>> 24 - r3 % 4 * 8 & 255;
          t4[s3 + r3 >>> 2] |= i3 << 24 - (s3 + r3) % 4 * 8;
        }
      else
        for (r3 = 0; r3 < o3; r3 += 4)
          t4[s3 + r3 >>> 2] = n4[r3 >>> 2];
      return this.sigBytes += o3, this;
    }, clamp: function() {
      var t4 = this.words, n4 = this.sigBytes;
      t4[n4 >>> 2] &= 4294967295 << 32 - n4 % 4 * 8, t4.length = e2.ceil(n4 / 4);
    }, clone: function() {
      var e3 = r2.clone.call(this);
      return e3.words = this.words.slice(0), e3;
    }, random: function(t4) {
      for (var n4, s3 = [], o3 = function(t5) {
        t5 = t5;
        var n5 = 987654321, s4 = 4294967295;
        return function() {
          var o4 = ((n5 = 36969 * (65535 & n5) + (n5 >> 16) & s4) << 16) + (t5 = 18e3 * (65535 & t5) + (t5 >> 16) & s4) & s4;
          return o4 /= 4294967296, (o4 += 0.5) * (e2.random() > 0.5 ? 1 : -1);
        };
      }, r3 = 0; r3 < t4; r3 += 4) {
        var a3 = o3(4294967296 * (n4 || e2.random()));
        n4 = 987654071 * a3(), s3.push(4294967296 * a3() | 0);
      }
      return new i2.init(s3, t4);
    } }), a2 = s2.enc = {}, c2 = a2.Hex = { stringify: function(e3) {
      for (var t4 = e3.words, n4 = e3.sigBytes, s3 = [], o3 = 0; o3 < n4; o3++) {
        var r3 = t4[o3 >>> 2] >>> 24 - o3 % 4 * 8 & 255;
        s3.push((r3 >>> 4).toString(16)), s3.push((15 & r3).toString(16));
      }
      return s3.join("");
    }, parse: function(e3) {
      for (var t4 = e3.length, n4 = [], s3 = 0; s3 < t4; s3 += 2)
        n4[s3 >>> 3] |= parseInt(e3.substr(s3, 2), 16) << 24 - s3 % 8 * 4;
      return new i2.init(n4, t4 / 2);
    } }, u2 = a2.Latin1 = { stringify: function(e3) {
      for (var t4 = e3.words, n4 = e3.sigBytes, s3 = [], o3 = 0; o3 < n4; o3++) {
        var r3 = t4[o3 >>> 2] >>> 24 - o3 % 4 * 8 & 255;
        s3.push(String.fromCharCode(r3));
      }
      return s3.join("");
    }, parse: function(e3) {
      for (var t4 = e3.length, n4 = [], s3 = 0; s3 < t4; s3++)
        n4[s3 >>> 2] |= (255 & e3.charCodeAt(s3)) << 24 - s3 % 4 * 8;
      return new i2.init(n4, t4);
    } }, l2 = a2.Utf8 = { stringify: function(e3) {
      try {
        return decodeURIComponent(escape(u2.stringify(e3)));
      } catch (e4) {
        throw new Error("Malformed UTF-8 data");
      }
    }, parse: function(e3) {
      return u2.parse(unescape(encodeURIComponent(e3)));
    } }, h2 = o2.BufferedBlockAlgorithm = r2.extend({ reset: function() {
      this._data = new i2.init(), this._nDataBytes = 0;
    }, _append: function(e3) {
      typeof e3 == "string" && (e3 = l2.parse(e3)), this._data.concat(e3), this._nDataBytes += e3.sigBytes;
    }, _process: function(t4) {
      var n4 = this._data, s3 = n4.words, o3 = n4.sigBytes, r3 = this.blockSize, a3 = o3 / (4 * r3), c3 = (a3 = t4 ? e2.ceil(a3) : e2.max((0 | a3) - this._minBufferSize, 0)) * r3, u3 = e2.min(4 * c3, o3);
      if (c3) {
        for (var l3 = 0; l3 < c3; l3 += r3)
          this._doProcessBlock(s3, l3);
        var h3 = s3.splice(0, c3);
        n4.sigBytes -= u3;
      }
      return new i2.init(h3, u3);
    }, clone: function() {
      var e3 = r2.clone.call(this);
      return e3._data = this._data.clone(), e3;
    }, _minBufferSize: 0 });
    o2.Hasher = h2.extend({ cfg: r2.extend(), init: function(e3) {
      this.cfg = this.cfg.extend(e3), this.reset();
    }, reset: function() {
      h2.reset.call(this), this._doReset();
    }, update: function(e3) {
      return this._append(e3), this._process(), this;
    }, finalize: function(e3) {
      return e3 && this._append(e3), this._doFinalize();
    }, blockSize: 16, _createHelper: function(e3) {
      return function(t4, n4) {
        return new e3.init(n4).finalize(t4);
      };
    }, _createHmacHelper: function(e3) {
      return function(t4, n4) {
        return new d2.HMAC.init(e3, n4).finalize(t4);
      };
    } });
    var d2 = s2.algo = {};
    return s2;
  }(Math), n2);
}), r = (s(function(e, t2) {
  var n2;
  e.exports = (n2 = o, function(e2) {
    var t3 = n2, s2 = t3.lib, o2 = s2.WordArray, r2 = s2.Hasher, i2 = t3.algo, a2 = [];
    !function() {
      for (var t4 = 0; t4 < 64; t4++)
        a2[t4] = 4294967296 * e2.abs(e2.sin(t4 + 1)) | 0;
    }();
    var c2 = i2.MD5 = r2.extend({ _doReset: function() {
      this._hash = new o2.init([1732584193, 4023233417, 2562383102, 271733878]);
    }, _doProcessBlock: function(e3, t4) {
      for (var n3 = 0; n3 < 16; n3++) {
        var s3 = t4 + n3, o3 = e3[s3];
        e3[s3] = 16711935 & (o3 << 8 | o3 >>> 24) | 4278255360 & (o3 << 24 | o3 >>> 8);
      }
      var r3 = this._hash.words, i3 = e3[t4 + 0], c3 = e3[t4 + 1], f2 = e3[t4 + 2], g2 = e3[t4 + 3], p = e3[t4 + 4], m2 = e3[t4 + 5], y = e3[t4 + 6], _2 = e3[t4 + 7], w2 = e3[t4 + 8], k2 = e3[t4 + 9], T2 = e3[t4 + 10], S2 = e3[t4 + 11], v2 = e3[t4 + 12], A2 = e3[t4 + 13], P2 = e3[t4 + 14], I2 = e3[t4 + 15], b2 = r3[0], O2 = r3[1], C2 = r3[2], E2 = r3[3];
      b2 = u2(b2, O2, C2, E2, i3, 7, a2[0]), E2 = u2(E2, b2, O2, C2, c3, 12, a2[1]), C2 = u2(C2, E2, b2, O2, f2, 17, a2[2]), O2 = u2(O2, C2, E2, b2, g2, 22, a2[3]), b2 = u2(b2, O2, C2, E2, p, 7, a2[4]), E2 = u2(E2, b2, O2, C2, m2, 12, a2[5]), C2 = u2(C2, E2, b2, O2, y, 17, a2[6]), O2 = u2(O2, C2, E2, b2, _2, 22, a2[7]), b2 = u2(b2, O2, C2, E2, w2, 7, a2[8]), E2 = u2(E2, b2, O2, C2, k2, 12, a2[9]), C2 = u2(C2, E2, b2, O2, T2, 17, a2[10]), O2 = u2(O2, C2, E2, b2, S2, 22, a2[11]), b2 = u2(b2, O2, C2, E2, v2, 7, a2[12]), E2 = u2(E2, b2, O2, C2, A2, 12, a2[13]), C2 = u2(C2, E2, b2, O2, P2, 17, a2[14]), b2 = l2(b2, O2 = u2(O2, C2, E2, b2, I2, 22, a2[15]), C2, E2, c3, 5, a2[16]), E2 = l2(E2, b2, O2, C2, y, 9, a2[17]), C2 = l2(C2, E2, b2, O2, S2, 14, a2[18]), O2 = l2(O2, C2, E2, b2, i3, 20, a2[19]), b2 = l2(b2, O2, C2, E2, m2, 5, a2[20]), E2 = l2(E2, b2, O2, C2, T2, 9, a2[21]), C2 = l2(C2, E2, b2, O2, I2, 14, a2[22]), O2 = l2(O2, C2, E2, b2, p, 20, a2[23]), b2 = l2(b2, O2, C2, E2, k2, 5, a2[24]), E2 = l2(E2, b2, O2, C2, P2, 9, a2[25]), C2 = l2(C2, E2, b2, O2, g2, 14, a2[26]), O2 = l2(O2, C2, E2, b2, w2, 20, a2[27]), b2 = l2(b2, O2, C2, E2, A2, 5, a2[28]), E2 = l2(E2, b2, O2, C2, f2, 9, a2[29]), C2 = l2(C2, E2, b2, O2, _2, 14, a2[30]), b2 = h2(b2, O2 = l2(O2, C2, E2, b2, v2, 20, a2[31]), C2, E2, m2, 4, a2[32]), E2 = h2(E2, b2, O2, C2, w2, 11, a2[33]), C2 = h2(C2, E2, b2, O2, S2, 16, a2[34]), O2 = h2(O2, C2, E2, b2, P2, 23, a2[35]), b2 = h2(b2, O2, C2, E2, c3, 4, a2[36]), E2 = h2(E2, b2, O2, C2, p, 11, a2[37]), C2 = h2(C2, E2, b2, O2, _2, 16, a2[38]), O2 = h2(O2, C2, E2, b2, T2, 23, a2[39]), b2 = h2(b2, O2, C2, E2, A2, 4, a2[40]), E2 = h2(E2, b2, O2, C2, i3, 11, a2[41]), C2 = h2(C2, E2, b2, O2, g2, 16, a2[42]), O2 = h2(O2, C2, E2, b2, y, 23, a2[43]), b2 = h2(b2, O2, C2, E2, k2, 4, a2[44]), E2 = h2(E2, b2, O2, C2, v2, 11, a2[45]), C2 = h2(C2, E2, b2, O2, I2, 16, a2[46]), b2 = d2(b2, O2 = h2(O2, C2, E2, b2, f2, 23, a2[47]), C2, E2, i3, 6, a2[48]), E2 = d2(E2, b2, O2, C2, _2, 10, a2[49]), C2 = d2(C2, E2, b2, O2, P2, 15, a2[50]), O2 = d2(O2, C2, E2, b2, m2, 21, a2[51]), b2 = d2(b2, O2, C2, E2, v2, 6, a2[52]), E2 = d2(E2, b2, O2, C2, g2, 10, a2[53]), C2 = d2(C2, E2, b2, O2, T2, 15, a2[54]), O2 = d2(O2, C2, E2, b2, c3, 21, a2[55]), b2 = d2(b2, O2, C2, E2, w2, 6, a2[56]), E2 = d2(E2, b2, O2, C2, I2, 10, a2[57]), C2 = d2(C2, E2, b2, O2, y, 15, a2[58]), O2 = d2(O2, C2, E2, b2, A2, 21, a2[59]), b2 = d2(b2, O2, C2, E2, p, 6, a2[60]), E2 = d2(E2, b2, O2, C2, S2, 10, a2[61]), C2 = d2(C2, E2, b2, O2, f2, 15, a2[62]), O2 = d2(O2, C2, E2, b2, k2, 21, a2[63]), r3[0] = r3[0] + b2 | 0, r3[1] = r3[1] + O2 | 0, r3[2] = r3[2] + C2 | 0, r3[3] = r3[3] + E2 | 0;
    }, _doFinalize: function() {
      var t4 = this._data, n3 = t4.words, s3 = 8 * this._nDataBytes, o3 = 8 * t4.sigBytes;
      n3[o3 >>> 5] |= 128 << 24 - o3 % 32;
      var r3 = e2.floor(s3 / 4294967296), i3 = s3;
      n3[15 + (o3 + 64 >>> 9 << 4)] = 16711935 & (r3 << 8 | r3 >>> 24) | 4278255360 & (r3 << 24 | r3 >>> 8), n3[14 + (o3 + 64 >>> 9 << 4)] = 16711935 & (i3 << 8 | i3 >>> 24) | 4278255360 & (i3 << 24 | i3 >>> 8), t4.sigBytes = 4 * (n3.length + 1), this._process();
      for (var a3 = this._hash, c3 = a3.words, u3 = 0; u3 < 4; u3++) {
        var l3 = c3[u3];
        c3[u3] = 16711935 & (l3 << 8 | l3 >>> 24) | 4278255360 & (l3 << 24 | l3 >>> 8);
      }
      return a3;
    }, clone: function() {
      var e3 = r2.clone.call(this);
      return e3._hash = this._hash.clone(), e3;
    } });
    function u2(e3, t4, n3, s3, o3, r3, i3) {
      var a3 = e3 + (t4 & n3 | ~t4 & s3) + o3 + i3;
      return (a3 << r3 | a3 >>> 32 - r3) + t4;
    }
    function l2(e3, t4, n3, s3, o3, r3, i3) {
      var a3 = e3 + (t4 & s3 | n3 & ~s3) + o3 + i3;
      return (a3 << r3 | a3 >>> 32 - r3) + t4;
    }
    function h2(e3, t4, n3, s3, o3, r3, i3) {
      var a3 = e3 + (t4 ^ n3 ^ s3) + o3 + i3;
      return (a3 << r3 | a3 >>> 32 - r3) + t4;
    }
    function d2(e3, t4, n3, s3, o3, r3, i3) {
      var a3 = e3 + (n3 ^ (t4 | ~s3)) + o3 + i3;
      return (a3 << r3 | a3 >>> 32 - r3) + t4;
    }
    t3.MD5 = r2._createHelper(c2), t3.HmacMD5 = r2._createHmacHelper(c2);
  }(Math), n2.MD5);
}), s(function(e, t2) {
  var n2, s2, r2;
  e.exports = (s2 = (n2 = o).lib.Base, r2 = n2.enc.Utf8, void (n2.algo.HMAC = s2.extend({ init: function(e2, t3) {
    e2 = this._hasher = new e2.init(), typeof t3 == "string" && (t3 = r2.parse(t3));
    var n3 = e2.blockSize, s3 = 4 * n3;
    t3.sigBytes > s3 && (t3 = e2.finalize(t3)), t3.clamp();
    for (var o2 = this._oKey = t3.clone(), i2 = this._iKey = t3.clone(), a2 = o2.words, c2 = i2.words, u2 = 0; u2 < n3; u2++)
      a2[u2] ^= 1549556828, c2[u2] ^= 909522486;
    o2.sigBytes = i2.sigBytes = s3, this.reset();
  }, reset: function() {
    var e2 = this._hasher;
    e2.reset(), e2.update(this._iKey);
  }, update: function(e2) {
    return this._hasher.update(e2), this;
  }, finalize: function(e2) {
    var t3 = this._hasher, n3 = t3.finalize(e2);
    return t3.reset(), t3.finalize(this._oKey.clone().concat(n3));
  } })));
}), s(function(e, t2) {
  e.exports = o.HmacMD5;
}));
const i = "FUNCTION", a = "OBJECT", c = "CLIENT_DB";
function u(e) {
  return Object.prototype.toString.call(e).slice(8, -1).toLowerCase();
}
function l(e) {
  return u(e) === "object";
}
function h(e) {
  return e && typeof e == "string" ? JSON.parse(e) : e;
}
const d = false, f = "app";
let g;
switch (f) {
  case "h5":
    g = "web";
    break;
  case "app-plus":
    g = "app";
    break;
  default:
    g = f;
}
h({}.UNICLOUD_DEBUG);
const m = h('[{"provider":"aliyun","spaceName":"positioning","spaceId":"5260c85d-7565-4ff8-8922-3efa92885a84","clientSecret":"AguDoCV7fAJHQXo/k0FuWQ==","endpoint":"https://api.bspapp.com"}]');
let _ = "";
try {
  _ = "__UNI__370E632";
} catch (e) {
}
let w = {};
function k(e, t2 = {}) {
  var n2, s2;
  return n2 = w, s2 = e, Object.prototype.hasOwnProperty.call(n2, s2) || (w[e] = t2), w[e];
}
g === "app" && (w = uni._globalUniCloudObj ? uni._globalUniCloudObj : uni._globalUniCloudObj = {});
const T = ["invoke", "success", "fail", "complete"], S = k("_globalUniCloudInterceptor");
function v(e, t2) {
  S[e] || (S[e] = {}), l(t2) && Object.keys(t2).forEach((n2) => {
    T.indexOf(n2) > -1 && function(e2, t3, n3) {
      let s2 = S[e2][t3];
      s2 || (s2 = S[e2][t3] = []), s2.indexOf(n3) === -1 && typeof n3 == "function" && s2.push(n3);
    }(e, n2, t2[n2]);
  });
}
function A(e, t2) {
  S[e] || (S[e] = {}), l(t2) ? Object.keys(t2).forEach((n2) => {
    T.indexOf(n2) > -1 && function(e2, t3, n3) {
      const s2 = S[e2][t3];
      if (!s2)
        return;
      const o2 = s2.indexOf(n3);
      o2 > -1 && s2.splice(o2, 1);
    }(e, n2, t2[n2]);
  }) : delete S[e];
}
function P(e, t2) {
  return e && e.length !== 0 ? e.reduce((e2, n2) => e2.then(() => n2(t2)), Promise.resolve()) : Promise.resolve();
}
function I(e, t2) {
  return S[e] && S[e][t2] || [];
}
const b = k("_globalUniCloudListener"), O = "response", C = "needLogin", E = "refreshToken", R = "clientdb", U = "cloudfunction", x = "cloudobject";
function L(e) {
  return b[e] || (b[e] = []), b[e];
}
function D(e, t2) {
  const n2 = L(e);
  n2.includes(t2) || n2.push(t2);
}
function N(e, t2) {
  const n2 = L(e), s2 = n2.indexOf(t2);
  s2 !== -1 && n2.splice(s2, 1);
}
function q(e, t2) {
  const n2 = L(e);
  for (let e2 = 0; e2 < n2.length; e2++) {
    (0, n2[e2])(t2);
  }
}
function F(e, t2) {
  return t2 ? function(n2) {
    let s2 = false;
    if (t2 === "callFunction") {
      const e2 = n2 && n2.type || i;
      s2 = e2 !== i;
    }
    const o2 = t2 === "callFunction" && !s2;
    let r2;
    r2 = this.isReady ? Promise.resolve() : this.initUniCloud, n2 = n2 || {};
    const a2 = r2.then(() => s2 ? Promise.resolve() : P(I(t2, "invoke"), n2)).then(() => e.call(this, n2)).then((e2) => s2 ? Promise.resolve(e2) : P(I(t2, "success"), e2).then(() => P(I(t2, "complete"), e2)).then(() => (o2 && q(O, { type: U, content: e2 }), Promise.resolve(e2))), (e2) => s2 ? Promise.reject(e2) : P(I(t2, "fail"), e2).then(() => P(I(t2, "complete"), e2)).then(() => (q(O, { type: U, content: e2 }), Promise.reject(e2))));
    if (!(n2.success || n2.fail || n2.complete))
      return a2;
    a2.then((e2) => {
      n2.success && n2.success(e2), n2.complete && n2.complete(e2), o2 && q(O, { type: U, content: e2 });
    }, (e2) => {
      n2.fail && n2.fail(e2), n2.complete && n2.complete(e2), o2 && q(O, { type: U, content: e2 });
    });
  } : function(t3) {
    if (!((t3 = t3 || {}).success || t3.fail || t3.complete))
      return e.call(this, t3);
    e.call(this, t3).then((e2) => {
      t3.success && t3.success(e2), t3.complete && t3.complete(e2);
    }, (e2) => {
      t3.fail && t3.fail(e2), t3.complete && t3.complete(e2);
    });
  };
}
class M extends Error {
  constructor(e) {
    super(e.message), this.errMsg = e.message || "", this.errCode = this.code = e.code || "SYSTEM_ERROR", this.requestId = e.requestId;
  }
}
function $() {
  let e, t2;
  try {
    if (uni.getLaunchOptionsSync) {
      if (uni.getLaunchOptionsSync.toString().indexOf("not yet implemented") > -1)
        return;
      const { scene: n2, channel: s2 } = uni.getLaunchOptionsSync();
      e = s2, t2 = n2;
    }
  } catch (e2) {
  }
  return { channel: e, scene: t2 };
}
let j;
function K() {
  const e = uni.getLocale && uni.getLocale() || "en";
  if (j)
    return __spreadProps(__spreadValues({}, j), { locale: e, LOCALE: e });
  const t2 = uni.getSystemInfoSync(), { deviceId: n2, osName: s2, uniPlatform: o2, appId: r2 } = t2, i2 = ["pixelRatio", "brand", "model", "system", "language", "version", "platform", "host", "SDKVersion", "swanNativeVersion", "app", "AppPlatform", "fontSizeSetting"];
  for (let e2 = 0; e2 < i2.length; e2++) {
    delete t2[i2[e2]];
  }
  return j = __spreadValues(__spreadValues({ PLATFORM: o2, OS: s2, APPID: r2, DEVICEID: n2 }, $()), t2), __spreadProps(__spreadValues({}, j), { locale: e, LOCALE: e });
}
var B = { sign: function(e, t2) {
  let n2 = "";
  return Object.keys(e).sort().forEach(function(t3) {
    e[t3] && (n2 = n2 + "&" + t3 + "=" + e[t3]);
  }), n2 = n2.slice(1), r(n2, t2).toString();
}, wrappedRequest: function(e, t2) {
  return new Promise((n2, s2) => {
    t2(Object.assign(e, { complete(e2) {
      e2 || (e2 = {});
      const t3 = e2.data && e2.data.header && e2.data.header["x-serverless-request-id"] || e2.header && e2.header["request-id"];
      if (!e2.statusCode || e2.statusCode >= 400)
        return s2(new M({ code: "SYS_ERR", message: e2.errMsg || "request:fail", requestId: t3 }));
      const o2 = e2.data;
      if (o2.error)
        return s2(new M({ code: o2.error.code, message: o2.error.message, requestId: t3 }));
      o2.result = o2.data, o2.requestId = t3, delete o2.data, n2(o2);
    } }));
  });
} };
var H = { request: (e) => uni.request(e), uploadFile: (e) => uni.uploadFile(e), setStorageSync: (e, t2) => uni.setStorageSync(e, t2), getStorageSync: (e) => uni.getStorageSync(e), removeStorageSync: (e) => uni.removeStorageSync(e), clearStorageSync: () => uni.clearStorageSync() }, W = { "uniCloud.init.paramRequired": "{param} required", "uniCloud.uploadFile.fileError": "filePath should be instance of File" };
const { t: z } = initVueI18n({ "zh-Hans": { "uniCloud.init.paramRequired": "\u7F3A\u5C11\u53C2\u6570\uFF1A{param}", "uniCloud.uploadFile.fileError": "filePath\u5E94\u4E3AFile\u5BF9\u8C61" }, "zh-Hant": { "uniCloud.init.paramRequired": "\u7F3A\u5C11\u53C2\u6570\uFF1A{param}", "uniCloud.uploadFile.fileError": "filePath\u5E94\u4E3AFile\u5BF9\u8C61" }, en: W, fr: { "uniCloud.init.paramRequired": "{param} required", "uniCloud.uploadFile.fileError": "filePath should be instance of File" }, es: { "uniCloud.init.paramRequired": "{param} required", "uniCloud.uploadFile.fileError": "filePath should be instance of File" }, ja: W }, "zh-Hans");
var V = class {
  constructor(e) {
    ["spaceId", "clientSecret"].forEach((t2) => {
      if (!Object.prototype.hasOwnProperty.call(e, t2))
        throw new Error(z("uniCloud.init.paramRequired", { param: t2 }));
    }), this.config = Object.assign({}, { endpoint: "https://api.bspapp.com" }, e), this.config.provider = "aliyun", this.config.requestUrl = this.config.endpoint + "/client", this.config.envType = this.config.envType || "public", this.config.accessTokenKey = "access_token_" + this.config.spaceId, this.adapter = H, this._getAccessTokenPromise = null, this._getAccessTokenPromiseStatus = null;
  }
  get hasAccessToken() {
    return !!this.accessToken;
  }
  setAccessToken(e) {
    this.accessToken = e;
  }
  requestWrapped(e) {
    return B.wrappedRequest(e, this.adapter.request);
  }
  requestAuth(e) {
    return this.requestWrapped(e);
  }
  request(e, t2) {
    return Promise.resolve().then(() => this.hasAccessToken ? t2 ? this.requestWrapped(e) : this.requestWrapped(e).catch((t3) => new Promise((e2, n2) => {
      !t3 || t3.code !== "GATEWAY_INVALID_TOKEN" && t3.code !== "InvalidParameter.InvalidToken" ? n2(t3) : e2();
    }).then(() => this.getAccessToken()).then(() => {
      const t4 = this.rebuildRequest(e);
      return this.request(t4, true);
    })) : this.getAccessToken().then(() => {
      const t3 = this.rebuildRequest(e);
      return this.request(t3, true);
    }));
  }
  rebuildRequest(e) {
    const t2 = Object.assign({}, e);
    return t2.data.token = this.accessToken, t2.header["x-basement-token"] = this.accessToken, t2.header["x-serverless-sign"] = B.sign(t2.data, this.config.clientSecret), t2;
  }
  setupRequest(e, t2) {
    const n2 = Object.assign({}, e, { spaceId: this.config.spaceId, timestamp: Date.now() }), s2 = { "Content-Type": "application/json" };
    return t2 !== "auth" && (n2.token = this.accessToken, s2["x-basement-token"] = this.accessToken), s2["x-serverless-sign"] = B.sign(n2, this.config.clientSecret), { url: this.config.requestUrl, method: "POST", data: n2, dataType: "json", header: s2 };
  }
  getAccessToken() {
    if (this._getAccessTokenPromiseStatus === "pending")
      return this._getAccessTokenPromise;
    this._getAccessTokenPromiseStatus = "pending";
    return this._getAccessTokenPromise = this.requestAuth(this.setupRequest({ method: "serverless.auth.user.anonymousAuthorize", params: "{}" }, "auth")).then((e) => new Promise((t2, n2) => {
      e.result && e.result.accessToken ? (this.setAccessToken(e.result.accessToken), this._getAccessTokenPromiseStatus = "fulfilled", t2(this.accessToken)) : (this._getAccessTokenPromiseStatus = "rejected", n2(new M({ code: "AUTH_FAILED", message: "\u83B7\u53D6accessToken\u5931\u8D25" })));
    }), (e) => (this._getAccessTokenPromiseStatus = "rejected", Promise.reject(e))), this._getAccessTokenPromise;
  }
  authorize() {
    this.getAccessToken();
  }
  callFunction(e) {
    const t2 = { method: "serverless.function.runtime.invoke", params: JSON.stringify({ functionTarget: e.name, functionArgs: e.data || {} }) };
    return this.request(this.setupRequest(t2));
  }
  getOSSUploadOptionsFromPath(e) {
    const t2 = { method: "serverless.file.resource.generateProximalSign", params: JSON.stringify(e) };
    return this.request(this.setupRequest(t2));
  }
  uploadFileToOSS({ url: e, formData: t2, name: n2, filePath: s2, fileType: o2, onUploadProgress: r2 }) {
    return new Promise((i2, a2) => {
      const c2 = this.adapter.uploadFile({ url: e, formData: t2, name: n2, filePath: s2, fileType: o2, header: { "X-OSS-server-side-encrpytion": "AES256" }, success(e2) {
        e2 && e2.statusCode < 400 ? i2(e2) : a2(new M({ code: "UPLOAD_FAILED", message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
      }, fail(e2) {
        a2(new M({ code: e2.code || "UPLOAD_FAILED", message: e2.message || e2.errMsg || "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
      } });
      typeof r2 == "function" && c2 && typeof c2.onProgressUpdate == "function" && c2.onProgressUpdate((e2) => {
        r2({ loaded: e2.totalBytesSent, total: e2.totalBytesExpectedToSend });
      });
    });
  }
  reportOSSUpload(e) {
    const t2 = { method: "serverless.file.resource.report", params: JSON.stringify(e) };
    return this.request(this.setupRequest(t2));
  }
  uploadFile({ filePath: e, cloudPath: t2, fileType: n2 = "image", onUploadProgress: s2, config: o2 }) {
    if (u(t2) !== "string")
      throw new M({ code: "INVALID_PARAM", message: "cloudPath\u5FC5\u987B\u4E3A\u5B57\u7B26\u4E32\u7C7B\u578B" });
    if (!(t2 = t2.trim()))
      throw new M({ code: "CLOUDPATH_REQUIRED", message: "cloudPath\u4E0D\u53EF\u4E3A\u7A7A" });
    if (/:\/\//.test(t2))
      throw new M({ code: "INVALID_PARAM", message: "cloudPath\u4E0D\u5408\u6CD5" });
    const r2 = o2 && o2.envType || this.config.envType;
    let i2, a2;
    return this.getOSSUploadOptionsFromPath({ env: r2, filename: t2 }).then((t3) => {
      const o3 = t3.result;
      i2 = o3.id, a2 = "https://" + o3.cdnDomain + "/" + o3.ossPath;
      const r3 = { url: "https://" + o3.host, formData: { "Cache-Control": "max-age=2592000", "Content-Disposition": "attachment", OSSAccessKeyId: o3.accessKeyId, Signature: o3.signature, host: o3.host, id: i2, key: o3.ossPath, policy: o3.policy, success_action_status: 200 }, fileName: "file", name: "file", filePath: e, fileType: n2 };
      return this.uploadFileToOSS(Object.assign({}, r3, { onUploadProgress: s2 }));
    }).then(() => this.reportOSSUpload({ id: i2 })).then((t3) => new Promise((n3, s3) => {
      t3.success ? n3({ success: true, filePath: e, fileID: a2 }) : s3(new M({ code: "UPLOAD_FAILED", message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
    }));
  }
  deleteFile({ fileList: e }) {
    const t2 = { method: "serverless.file.resource.delete", params: JSON.stringify({ id: e[0] }) };
    return this.request(this.setupRequest(t2));
  }
  getTempFileURL({ fileList: e } = {}) {
    return new Promise((t2, n2) => {
      Array.isArray(e) && e.length !== 0 || n2(new M({ code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u5B57\u7B26\u4E32" })), t2({ fileList: e.map((e2) => ({ fileID: e2, tempFileURL: e2 })) });
    });
  }
};
var J = { init(e) {
  const t2 = new V(e), n2 = { signInAnonymously: function() {
    return t2.authorize();
  }, getLoginState: function() {
    return Promise.resolve(false);
  } };
  return t2.auth = function() {
    return n2;
  }, t2.customAuth = t2.auth, t2;
} };
const Y = typeof location != "undefined" && location.protocol === "http:" ? "http:" : "https:";
var X;
!function(e) {
  e.local = "local", e.none = "none", e.session = "session";
}(X || (X = {}));
var G = function() {
};
const Q = () => {
  let e;
  if (!Promise) {
    e = () => {
    }, e.promise = {};
    const t3 = () => {
      throw new M({ message: 'Your Node runtime does support ES6 Promises. Set "global.Promise" to your preferred implementation of promises.' });
    };
    return Object.defineProperty(e.promise, "then", { get: t3 }), Object.defineProperty(e.promise, "catch", { get: t3 }), e;
  }
  const t2 = new Promise((t3, n2) => {
    e = (e2, s2) => e2 ? n2(e2) : t3(s2);
  });
  return e.promise = t2, e;
};
function Z(e) {
  return e === void 0;
}
function ee(e) {
  return Object.prototype.toString.call(e) === "[object Null]";
}
var te;
function ne(e) {
  const t2 = (n2 = e, Object.prototype.toString.call(n2) === "[object Array]" ? e : [e]);
  var n2;
  for (const e2 of t2) {
    const { isMatch: t3, genAdapter: n3, runtime: s2 } = e2;
    if (t3())
      return { adapter: n3(), runtime: s2 };
  }
}
!function(e) {
  e.WEB = "web", e.WX_MP = "wx_mp";
}(te || (te = {}));
const se = { adapter: null, runtime: void 0 }, oe = ["anonymousUuidKey"];
class re extends G {
  constructor() {
    super(), se.adapter.root.tcbObject || (se.adapter.root.tcbObject = {});
  }
  setItem(e, t2) {
    se.adapter.root.tcbObject[e] = t2;
  }
  getItem(e) {
    return se.adapter.root.tcbObject[e];
  }
  removeItem(e) {
    delete se.adapter.root.tcbObject[e];
  }
  clear() {
    delete se.adapter.root.tcbObject;
  }
}
function ie(e, t2) {
  switch (e) {
    case "local":
      return t2.localStorage || new re();
    case "none":
      return new re();
    default:
      return t2.sessionStorage || new re();
  }
}
class ae {
  constructor(e) {
    if (!this._storage) {
      this._persistence = se.adapter.primaryStorage || e.persistence, this._storage = ie(this._persistence, se.adapter);
      const t2 = `access_token_${e.env}`, n2 = `access_token_expire_${e.env}`, s2 = `refresh_token_${e.env}`, o2 = `anonymous_uuid_${e.env}`, r2 = `login_type_${e.env}`, i2 = `user_info_${e.env}`;
      this.keys = { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2, anonymousUuidKey: o2, loginTypeKey: r2, userInfoKey: i2 };
    }
  }
  updatePersistence(e) {
    if (e === this._persistence)
      return;
    const t2 = this._persistence === "local";
    this._persistence = e;
    const n2 = ie(e, se.adapter);
    for (const e2 in this.keys) {
      const s2 = this.keys[e2];
      if (t2 && oe.includes(e2))
        continue;
      const o2 = this._storage.getItem(s2);
      Z(o2) || ee(o2) || (n2.setItem(s2, o2), this._storage.removeItem(s2));
    }
    this._storage = n2;
  }
  setStore(e, t2, n2) {
    if (!this._storage)
      return;
    const s2 = { version: n2 || "localCachev1", content: t2 }, o2 = JSON.stringify(s2);
    try {
      this._storage.setItem(e, o2);
    } catch (e2) {
      throw e2;
    }
  }
  getStore(e, t2) {
    try {
      if (!this._storage)
        return;
    } catch (e2) {
      return "";
    }
    t2 = t2 || "localCachev1";
    const n2 = this._storage.getItem(e);
    if (!n2)
      return "";
    if (n2.indexOf(t2) >= 0) {
      return JSON.parse(n2).content;
    }
    return "";
  }
  removeStore(e) {
    this._storage.removeItem(e);
  }
}
const ce = {}, ue = {};
function le(e) {
  return ce[e];
}
class he {
  constructor(e, t2) {
    this.data = t2 || null, this.name = e;
  }
}
class de extends he {
  constructor(e, t2) {
    super("error", { error: e, data: t2 }), this.error = e;
  }
}
const fe = new class {
  constructor() {
    this._listeners = {};
  }
  on(e, t2) {
    return function(e2, t3, n2) {
      n2[e2] = n2[e2] || [], n2[e2].push(t3);
    }(e, t2, this._listeners), this;
  }
  off(e, t2) {
    return function(e2, t3, n2) {
      if (n2 && n2[e2]) {
        const s2 = n2[e2].indexOf(t3);
        s2 !== -1 && n2[e2].splice(s2, 1);
      }
    }(e, t2, this._listeners), this;
  }
  fire(e, t2) {
    if (e instanceof de)
      return console.error(e.error), this;
    const n2 = typeof e == "string" ? new he(e, t2 || {}) : e;
    const s2 = n2.name;
    if (this._listens(s2)) {
      n2.target = this;
      const e2 = this._listeners[s2] ? [...this._listeners[s2]] : [];
      for (const t3 of e2)
        t3.call(this, n2);
    }
    return this;
  }
  _listens(e) {
    return this._listeners[e] && this._listeners[e].length > 0;
  }
}();
function ge(e, t2) {
  fe.on(e, t2);
}
function pe(e, t2 = {}) {
  fe.fire(e, t2);
}
function me(e, t2) {
  fe.off(e, t2);
}
const ye = "loginStateChanged", _e = "loginStateExpire", we = "loginTypeChanged", ke = "anonymousConverted", Te = "refreshAccessToken";
var Se;
!function(e) {
  e.ANONYMOUS = "ANONYMOUS", e.WECHAT = "WECHAT", e.WECHAT_PUBLIC = "WECHAT-PUBLIC", e.WECHAT_OPEN = "WECHAT-OPEN", e.CUSTOM = "CUSTOM", e.EMAIL = "EMAIL", e.USERNAME = "USERNAME", e.NULL = "NULL";
}(Se || (Se = {}));
const ve = ["auth.getJwt", "auth.logout", "auth.signInWithTicket", "auth.signInAnonymously", "auth.signIn", "auth.fetchAccessTokenWithRefreshToken", "auth.signUpWithEmailAndPassword", "auth.activateEndUserMail", "auth.sendPasswordResetEmail", "auth.resetPasswordWithToken", "auth.isUsernameRegistered"], Ae = { "X-SDK-Version": "1.3.5" };
function Pe(e, t2, n2) {
  const s2 = e[t2];
  e[t2] = function(t3) {
    const o2 = {}, r2 = {};
    n2.forEach((n3) => {
      const { data: s3, headers: i3 } = n3.call(e, t3);
      Object.assign(o2, s3), Object.assign(r2, i3);
    });
    const i2 = t3.data;
    return i2 && (() => {
      var e2;
      if (e2 = i2, Object.prototype.toString.call(e2) !== "[object FormData]")
        t3.data = __spreadValues(__spreadValues({}, i2), o2);
      else
        for (const e3 in o2)
          i2.append(e3, o2[e3]);
    })(), t3.headers = __spreadValues(__spreadValues({}, t3.headers || {}), r2), s2.call(e, t3);
  };
}
function Ie() {
  const e = Math.random().toString(16).slice(2);
  return { data: { seqId: e }, headers: __spreadProps(__spreadValues({}, Ae), { "x-seqid": e }) };
}
class be {
  constructor(e = {}) {
    var t2;
    this.config = e, this._reqClass = new se.adapter.reqClass({ timeout: this.config.timeout, timeoutMsg: `\u8BF7\u6C42\u5728${this.config.timeout / 1e3}s\u5185\u672A\u5B8C\u6210\uFF0C\u5DF2\u4E2D\u65AD`, restrictedMethods: ["post"] }), this._cache = le(this.config.env), this._localCache = (t2 = this.config.env, ue[t2]), Pe(this._reqClass, "post", [Ie]), Pe(this._reqClass, "upload", [Ie]), Pe(this._reqClass, "download", [Ie]);
  }
  async post(e) {
    return await this._reqClass.post(e);
  }
  async upload(e) {
    return await this._reqClass.upload(e);
  }
  async download(e) {
    return await this._reqClass.download(e);
  }
  async refreshAccessToken() {
    let e, t2;
    this._refreshAccessTokenPromise || (this._refreshAccessTokenPromise = this._refreshAccessToken());
    try {
      e = await this._refreshAccessTokenPromise;
    } catch (e2) {
      t2 = e2;
    }
    if (this._refreshAccessTokenPromise = null, this._shouldRefreshAccessTokenHook = null, t2)
      throw t2;
    return e;
  }
  async _refreshAccessToken() {
    const { accessTokenKey: e, accessTokenExpireKey: t2, refreshTokenKey: n2, loginTypeKey: s2, anonymousUuidKey: o2 } = this._cache.keys;
    this._cache.removeStore(e), this._cache.removeStore(t2);
    let r2 = this._cache.getStore(n2);
    if (!r2)
      throw new M({ message: "\u672A\u767B\u5F55CloudBase" });
    const i2 = { refresh_token: r2 }, a2 = await this.request("auth.fetchAccessTokenWithRefreshToken", i2);
    if (a2.data.code) {
      const { code: e2 } = a2.data;
      if (e2 === "SIGN_PARAM_INVALID" || e2 === "REFRESH_TOKEN_EXPIRED" || e2 === "INVALID_REFRESH_TOKEN") {
        if (this._cache.getStore(s2) === Se.ANONYMOUS && e2 === "INVALID_REFRESH_TOKEN") {
          const e3 = this._cache.getStore(o2), t3 = this._cache.getStore(n2), s3 = await this.send("auth.signInAnonymously", { anonymous_uuid: e3, refresh_token: t3 });
          return this.setRefreshToken(s3.refresh_token), this._refreshAccessToken();
        }
        pe(_e), this._cache.removeStore(n2);
      }
      throw new M({ code: a2.data.code, message: `\u5237\u65B0access token\u5931\u8D25\uFF1A${a2.data.code}` });
    }
    if (a2.data.access_token)
      return pe(Te), this._cache.setStore(e, a2.data.access_token), this._cache.setStore(t2, a2.data.access_token_expire + Date.now()), { accessToken: a2.data.access_token, accessTokenExpire: a2.data.access_token_expire };
    a2.data.refresh_token && (this._cache.removeStore(n2), this._cache.setStore(n2, a2.data.refresh_token), this._refreshAccessToken());
  }
  async getAccessToken() {
    const { accessTokenKey: e, accessTokenExpireKey: t2, refreshTokenKey: n2 } = this._cache.keys;
    if (!this._cache.getStore(n2))
      throw new M({ message: "refresh token\u4E0D\u5B58\u5728\uFF0C\u767B\u5F55\u72B6\u6001\u5F02\u5E38" });
    let s2 = this._cache.getStore(e), o2 = this._cache.getStore(t2), r2 = true;
    return this._shouldRefreshAccessTokenHook && !await this._shouldRefreshAccessTokenHook(s2, o2) && (r2 = false), (!s2 || !o2 || o2 < Date.now()) && r2 ? this.refreshAccessToken() : { accessToken: s2, accessTokenExpire: o2 };
  }
  async request(e, t2, n2) {
    const s2 = `x-tcb-trace_${this.config.env}`;
    let o2 = "application/x-www-form-urlencoded";
    const r2 = __spreadValues({ action: e, env: this.config.env, dataVersion: "2019-08-16" }, t2);
    if (ve.indexOf(e) === -1) {
      const { refreshTokenKey: e2 } = this._cache.keys;
      this._cache.getStore(e2) && (r2.access_token = (await this.getAccessToken()).accessToken);
    }
    let i2;
    if (e === "storage.uploadFile") {
      i2 = new FormData();
      for (let e2 in i2)
        i2.hasOwnProperty(e2) && i2[e2] !== void 0 && i2.append(e2, r2[e2]);
      o2 = "multipart/form-data";
    } else {
      o2 = "application/json", i2 = {};
      for (let e2 in r2)
        r2[e2] !== void 0 && (i2[e2] = r2[e2]);
    }
    let a2 = { headers: { "content-type": o2 } };
    n2 && n2.onUploadProgress && (a2.onUploadProgress = n2.onUploadProgress);
    const c2 = this._localCache.getStore(s2);
    c2 && (a2.headers["X-TCB-Trace"] = c2);
    const { parse: u2, inQuery: l2, search: h2 } = t2;
    let d2 = { env: this.config.env };
    u2 && (d2.parse = true), l2 && (d2 = __spreadValues(__spreadValues({}, l2), d2));
    let f2 = function(e2, t3, n3 = {}) {
      const s3 = /\?/.test(t3);
      let o3 = "";
      for (let e3 in n3)
        o3 === "" ? !s3 && (t3 += "?") : o3 += "&", o3 += `${e3}=${encodeURIComponent(n3[e3])}`;
      return /^http(s)?\:\/\//.test(t3 += o3) ? t3 : `${e2}${t3}`;
    }(Y, "//tcb-api.tencentcloudapi.com/web", d2);
    h2 && (f2 += h2);
    const g2 = await this.post(__spreadValues({ url: f2, data: i2 }, a2)), p = g2.header && g2.header["x-tcb-trace"];
    if (p && this._localCache.setStore(s2, p), Number(g2.status) !== 200 && Number(g2.statusCode) !== 200 || !g2.data)
      throw new M({ code: "NETWORK_ERROR", message: "network request error" });
    return g2;
  }
  async send(e, t2 = {}) {
    const n2 = await this.request(e, t2, { onUploadProgress: t2.onUploadProgress });
    if (n2.data.code === "ACCESS_TOKEN_EXPIRED" && ve.indexOf(e) === -1) {
      await this.refreshAccessToken();
      const n3 = await this.request(e, t2, { onUploadProgress: t2.onUploadProgress });
      if (n3.data.code)
        throw new M({ code: n3.data.code, message: n3.data.message });
      return n3.data;
    }
    if (n2.data.code)
      throw new M({ code: n2.data.code, message: n2.data.message });
    return n2.data;
  }
  setRefreshToken(e) {
    const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
    this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e);
  }
}
const Oe = {};
function Ce(e) {
  return Oe[e];
}
class Ee {
  constructor(e) {
    this.config = e, this._cache = le(e.env), this._request = Ce(e.env);
  }
  setRefreshToken(e) {
    const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
    this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e);
  }
  setAccessToken(e, t2) {
    const { accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys;
    this._cache.setStore(n2, e), this._cache.setStore(s2, t2);
  }
  async refreshUserInfo() {
    const { data: e } = await this._request.send("auth.getUserInfo", {});
    return this.setLocalUserInfo(e), e;
  }
  setLocalUserInfo(e) {
    const { userInfoKey: t2 } = this._cache.keys;
    this._cache.setStore(t2, e);
  }
}
class Re {
  constructor(e) {
    if (!e)
      throw new M({ code: "PARAM_ERROR", message: "envId is not defined" });
    this._envId = e, this._cache = le(this._envId), this._request = Ce(this._envId), this.setUserInfo();
  }
  linkWithTicket(e) {
    if (typeof e != "string")
      throw new M({ code: "PARAM_ERROR", message: "ticket must be string" });
    return this._request.send("auth.linkWithTicket", { ticket: e });
  }
  linkWithRedirect(e) {
    e.signInWithRedirect();
  }
  updatePassword(e, t2) {
    return this._request.send("auth.updatePassword", { oldPassword: t2, newPassword: e });
  }
  updateEmail(e) {
    return this._request.send("auth.updateEmail", { newEmail: e });
  }
  updateUsername(e) {
    if (typeof e != "string")
      throw new M({ code: "PARAM_ERROR", message: "username must be a string" });
    return this._request.send("auth.updateUsername", { username: e });
  }
  async getLinkedUidList() {
    const { data: e } = await this._request.send("auth.getLinkedUidList", {});
    let t2 = false;
    const { users: n2 } = e;
    return n2.forEach((e2) => {
      e2.wxOpenId && e2.wxPublicId && (t2 = true);
    }), { users: n2, hasPrimaryUid: t2 };
  }
  setPrimaryUid(e) {
    return this._request.send("auth.setPrimaryUid", { uid: e });
  }
  unlink(e) {
    return this._request.send("auth.unlink", { platform: e });
  }
  async update(e) {
    const { nickName: t2, gender: n2, avatarUrl: s2, province: o2, country: r2, city: i2 } = e, { data: a2 } = await this._request.send("auth.updateUserInfo", { nickName: t2, gender: n2, avatarUrl: s2, province: o2, country: r2, city: i2 });
    this.setLocalUserInfo(a2);
  }
  async refresh() {
    const { data: e } = await this._request.send("auth.getUserInfo", {});
    return this.setLocalUserInfo(e), e;
  }
  setUserInfo() {
    const { userInfoKey: e } = this._cache.keys, t2 = this._cache.getStore(e);
    ["uid", "loginType", "openid", "wxOpenId", "wxPublicId", "unionId", "qqMiniOpenId", "email", "hasPassword", "customUserId", "nickName", "gender", "avatarUrl"].forEach((e2) => {
      this[e2] = t2[e2];
    }), this.location = { country: t2.country, province: t2.province, city: t2.city };
  }
  setLocalUserInfo(e) {
    const { userInfoKey: t2 } = this._cache.keys;
    this._cache.setStore(t2, e), this.setUserInfo();
  }
}
class Ue {
  constructor(e) {
    if (!e)
      throw new M({ code: "PARAM_ERROR", message: "envId is not defined" });
    this._cache = le(e);
    const { refreshTokenKey: t2, accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys, o2 = this._cache.getStore(t2), r2 = this._cache.getStore(n2), i2 = this._cache.getStore(s2);
    this.credential = { refreshToken: o2, accessToken: r2, accessTokenExpire: i2 }, this.user = new Re(e);
  }
  get isAnonymousAuth() {
    return this.loginType === Se.ANONYMOUS;
  }
  get isCustomAuth() {
    return this.loginType === Se.CUSTOM;
  }
  get isWeixinAuth() {
    return this.loginType === Se.WECHAT || this.loginType === Se.WECHAT_OPEN || this.loginType === Se.WECHAT_PUBLIC;
  }
  get loginType() {
    return this._cache.getStore(this._cache.keys.loginTypeKey);
  }
}
class xe extends Ee {
  async signIn() {
    this._cache.updatePersistence("local");
    const { anonymousUuidKey: e, refreshTokenKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e) || void 0, s2 = this._cache.getStore(t2) || void 0, o2 = await this._request.send("auth.signInAnonymously", { anonymous_uuid: n2, refresh_token: s2 });
    if (o2.uuid && o2.refresh_token) {
      this._setAnonymousUUID(o2.uuid), this.setRefreshToken(o2.refresh_token), await this._request.refreshAccessToken(), pe(ye), pe(we, { env: this.config.env, loginType: Se.ANONYMOUS, persistence: "local" });
      const e2 = new Ue(this.config.env);
      return await e2.user.refresh(), e2;
    }
    throw new M({ message: "\u533F\u540D\u767B\u5F55\u5931\u8D25" });
  }
  async linkAndRetrieveDataWithTicket(e) {
    const { anonymousUuidKey: t2, refreshTokenKey: n2 } = this._cache.keys, s2 = this._cache.getStore(t2), o2 = this._cache.getStore(n2), r2 = await this._request.send("auth.linkAndRetrieveDataWithTicket", { anonymous_uuid: s2, refresh_token: o2, ticket: e });
    if (r2.refresh_token)
      return this._clearAnonymousUUID(), this.setRefreshToken(r2.refresh_token), await this._request.refreshAccessToken(), pe(ke, { env: this.config.env }), pe(we, { loginType: Se.CUSTOM, persistence: "local" }), { credential: { refreshToken: r2.refresh_token } };
    throw new M({ message: "\u533F\u540D\u8F6C\u5316\u5931\u8D25" });
  }
  _setAnonymousUUID(e) {
    const { anonymousUuidKey: t2, loginTypeKey: n2 } = this._cache.keys;
    this._cache.removeStore(t2), this._cache.setStore(t2, e), this._cache.setStore(n2, Se.ANONYMOUS);
  }
  _clearAnonymousUUID() {
    this._cache.removeStore(this._cache.keys.anonymousUuidKey);
  }
}
class Le extends Ee {
  async signIn(e) {
    if (typeof e != "string")
      throw new M({ param: "PARAM_ERROR", message: "ticket must be a string" });
    const { refreshTokenKey: t2 } = this._cache.keys, n2 = await this._request.send("auth.signInWithTicket", { ticket: e, refresh_token: this._cache.getStore(t2) || "" });
    if (n2.refresh_token)
      return this.setRefreshToken(n2.refresh_token), await this._request.refreshAccessToken(), pe(ye), pe(we, { env: this.config.env, loginType: Se.CUSTOM, persistence: this.config.persistence }), await this.refreshUserInfo(), new Ue(this.config.env);
    throw new M({ message: "\u81EA\u5B9A\u4E49\u767B\u5F55\u5931\u8D25" });
  }
}
class De extends Ee {
  async signIn(e, t2) {
    if (typeof e != "string")
      throw new M({ code: "PARAM_ERROR", message: "email must be a string" });
    const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: "EMAIL", email: e, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: o2, access_token: r2, access_token_expire: i2 } = s2;
    if (o2)
      return this.setRefreshToken(o2), r2 && i2 ? this.setAccessToken(r2, i2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), pe(ye), pe(we, { env: this.config.env, loginType: Se.EMAIL, persistence: this.config.persistence }), new Ue(this.config.env);
    throw s2.code ? new M({ code: s2.code, message: `\u90AE\u7BB1\u767B\u5F55\u5931\u8D25: ${s2.message}` }) : new M({ message: "\u90AE\u7BB1\u767B\u5F55\u5931\u8D25" });
  }
  async activate(e) {
    return this._request.send("auth.activateEndUserMail", { token: e });
  }
  async resetPasswordWithToken(e, t2) {
    return this._request.send("auth.resetPasswordWithToken", { token: e, newPassword: t2 });
  }
}
class Ne extends Ee {
  async signIn(e, t2) {
    if (typeof e != "string")
      throw new M({ code: "PARAM_ERROR", message: "username must be a string" });
    typeof t2 != "string" && (t2 = "", console.warn("password is empty"));
    const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: Se.USERNAME, username: e, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: o2, access_token_expire: r2, access_token: i2 } = s2;
    if (o2)
      return this.setRefreshToken(o2), i2 && r2 ? this.setAccessToken(i2, r2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), pe(ye), pe(we, { env: this.config.env, loginType: Se.USERNAME, persistence: this.config.persistence }), new Ue(this.config.env);
    throw s2.code ? new M({ code: s2.code, message: `\u7528\u6237\u540D\u5BC6\u7801\u767B\u5F55\u5931\u8D25: ${s2.message}` }) : new M({ message: "\u7528\u6237\u540D\u5BC6\u7801\u767B\u5F55\u5931\u8D25" });
  }
}
class qe {
  constructor(e) {
    this.config = e, this._cache = le(e.env), this._request = Ce(e.env), this._onAnonymousConverted = this._onAnonymousConverted.bind(this), this._onLoginTypeChanged = this._onLoginTypeChanged.bind(this), ge(we, this._onLoginTypeChanged);
  }
  get currentUser() {
    const e = this.hasLoginState();
    return e && e.user || null;
  }
  get loginType() {
    return this._cache.getStore(this._cache.keys.loginTypeKey);
  }
  anonymousAuthProvider() {
    return new xe(this.config);
  }
  customAuthProvider() {
    return new Le(this.config);
  }
  emailAuthProvider() {
    return new De(this.config);
  }
  usernameAuthProvider() {
    return new Ne(this.config);
  }
  async signInAnonymously() {
    return new xe(this.config).signIn();
  }
  async signInWithEmailAndPassword(e, t2) {
    return new De(this.config).signIn(e, t2);
  }
  signInWithUsernameAndPassword(e, t2) {
    return new Ne(this.config).signIn(e, t2);
  }
  async linkAndRetrieveDataWithTicket(e) {
    this._anonymousAuthProvider || (this._anonymousAuthProvider = new xe(this.config)), ge(ke, this._onAnonymousConverted);
    return await this._anonymousAuthProvider.linkAndRetrieveDataWithTicket(e);
  }
  async signOut() {
    if (this.loginType === Se.ANONYMOUS)
      throw new M({ message: "\u533F\u540D\u7528\u6237\u4E0D\u652F\u6301\u767B\u51FA\u64CD\u4F5C" });
    const { refreshTokenKey: e, accessTokenKey: t2, accessTokenExpireKey: n2 } = this._cache.keys, s2 = this._cache.getStore(e);
    if (!s2)
      return;
    const o2 = await this._request.send("auth.logout", { refresh_token: s2 });
    return this._cache.removeStore(e), this._cache.removeStore(t2), this._cache.removeStore(n2), pe(ye), pe(we, { env: this.config.env, loginType: Se.NULL, persistence: this.config.persistence }), o2;
  }
  async signUpWithEmailAndPassword(e, t2) {
    return this._request.send("auth.signUpWithEmailAndPassword", { email: e, password: t2 });
  }
  async sendPasswordResetEmail(e) {
    return this._request.send("auth.sendPasswordResetEmail", { email: e });
  }
  onLoginStateChanged(e) {
    ge(ye, () => {
      const t3 = this.hasLoginState();
      e.call(this, t3);
    });
    const t2 = this.hasLoginState();
    e.call(this, t2);
  }
  onLoginStateExpired(e) {
    ge(_e, e.bind(this));
  }
  onAccessTokenRefreshed(e) {
    ge(Te, e.bind(this));
  }
  onAnonymousConverted(e) {
    ge(ke, e.bind(this));
  }
  onLoginTypeChanged(e) {
    ge(we, () => {
      const t2 = this.hasLoginState();
      e.call(this, t2);
    });
  }
  async getAccessToken() {
    return { accessToken: (await this._request.getAccessToken()).accessToken, env: this.config.env };
  }
  hasLoginState() {
    const { refreshTokenKey: e } = this._cache.keys;
    return this._cache.getStore(e) ? new Ue(this.config.env) : null;
  }
  async isUsernameRegistered(e) {
    if (typeof e != "string")
      throw new M({ code: "PARAM_ERROR", message: "username must be a string" });
    const { data: t2 } = await this._request.send("auth.isUsernameRegistered", { username: e });
    return t2 && t2.isRegistered;
  }
  getLoginState() {
    return Promise.resolve(this.hasLoginState());
  }
  async signInWithTicket(e) {
    return new Le(this.config).signIn(e);
  }
  shouldRefreshAccessToken(e) {
    this._request._shouldRefreshAccessTokenHook = e.bind(this);
  }
  getUserInfo() {
    return this._request.send("auth.getUserInfo", {}).then((e) => e.code ? e : __spreadProps(__spreadValues({}, e.data), { requestId: e.seqId }));
  }
  getAuthHeader() {
    const { refreshTokenKey: e, accessTokenKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e);
    return { "x-cloudbase-credentials": this._cache.getStore(t2) + "/@@/" + n2 };
  }
  _onAnonymousConverted(e) {
    const { env: t2 } = e.data;
    t2 === this.config.env && this._cache.updatePersistence(this.config.persistence);
  }
  _onLoginTypeChanged(e) {
    const { loginType: t2, persistence: n2, env: s2 } = e.data;
    s2 === this.config.env && (this._cache.updatePersistence(n2), this._cache.setStore(this._cache.keys.loginTypeKey, t2));
  }
}
const Fe = function(e, t2) {
  t2 = t2 || Q();
  const n2 = Ce(this.config.env), { cloudPath: s2, filePath: o2, onUploadProgress: r2, fileType: i2 = "image" } = e;
  return n2.send("storage.getUploadMetadata", { path: s2 }).then((e2) => {
    const { data: { url: a2, authorization: c2, token: u2, fileId: l2, cosFileId: h2 }, requestId: d2 } = e2, f2 = { key: s2, signature: c2, "x-cos-meta-fileid": h2, success_action_status: "201", "x-cos-security-token": u2 };
    n2.upload({ url: a2, data: f2, file: o2, name: s2, fileType: i2, onUploadProgress: r2 }).then((e3) => {
      e3.statusCode === 201 ? t2(null, { fileID: l2, requestId: d2 }) : t2(new M({ code: "STORAGE_REQUEST_FAIL", message: `STORAGE_REQUEST_FAIL: ${e3.data}` }));
    }).catch((e3) => {
      t2(e3);
    });
  }).catch((e2) => {
    t2(e2);
  }), t2.promise;
}, Me = function(e, t2) {
  t2 = t2 || Q();
  const n2 = Ce(this.config.env), { cloudPath: s2 } = e;
  return n2.send("storage.getUploadMetadata", { path: s2 }).then((e2) => {
    t2(null, e2);
  }).catch((e2) => {
    t2(e2);
  }), t2.promise;
}, $e = function({ fileList: e }, t2) {
  if (t2 = t2 || Q(), !e || !Array.isArray(e))
    return { code: "INVALID_PARAM", message: "fileList\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u6570\u7EC4" };
  for (let t3 of e)
    if (!t3 || typeof t3 != "string")
      return { code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u5B57\u7B26\u4E32" };
  const n2 = { fileid_list: e };
  return Ce(this.config.env).send("storage.batchDeleteFile", n2).then((e2) => {
    e2.code ? t2(null, e2) : t2(null, { fileList: e2.data.delete_list, requestId: e2.requestId });
  }).catch((e2) => {
    t2(e2);
  }), t2.promise;
}, je = function({ fileList: e }, t2) {
  t2 = t2 || Q(), e && Array.isArray(e) || t2(null, { code: "INVALID_PARAM", message: "fileList\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u6570\u7EC4" });
  let n2 = [];
  for (let s3 of e)
    typeof s3 == "object" ? (s3.hasOwnProperty("fileID") && s3.hasOwnProperty("maxAge") || t2(null, { code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u5305\u542BfileID\u548CmaxAge\u7684\u5BF9\u8C61" }), n2.push({ fileid: s3.fileID, max_age: s3.maxAge })) : typeof s3 == "string" ? n2.push({ fileid: s3 }) : t2(null, { code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u5B57\u7B26\u4E32" });
  const s2 = { file_list: n2 };
  return Ce(this.config.env).send("storage.batchGetDownloadUrl", s2).then((e2) => {
    e2.code ? t2(null, e2) : t2(null, { fileList: e2.data.download_list, requestId: e2.requestId });
  }).catch((e2) => {
    t2(e2);
  }), t2.promise;
}, Ke = async function({ fileID: e }, t2) {
  const n2 = (await je.call(this, { fileList: [{ fileID: e, maxAge: 600 }] })).fileList[0];
  if (n2.code !== "SUCCESS")
    return t2 ? t2(n2) : new Promise((e2) => {
      e2(n2);
    });
  const s2 = Ce(this.config.env);
  let o2 = n2.download_url;
  if (o2 = encodeURI(o2), !t2)
    return s2.download({ url: o2 });
  t2(await s2.download({ url: o2 }));
}, Be = function({ name: e, data: t2, query: n2, parse: s2, search: o2 }, r2) {
  const i2 = r2 || Q();
  let a2;
  try {
    a2 = t2 ? JSON.stringify(t2) : "";
  } catch (e2) {
    return Promise.reject(e2);
  }
  if (!e)
    return Promise.reject(new M({ code: "PARAM_ERROR", message: "\u51FD\u6570\u540D\u4E0D\u80FD\u4E3A\u7A7A" }));
  const c2 = { inQuery: n2, parse: s2, search: o2, function_name: e, request_data: a2 };
  return Ce(this.config.env).send("functions.invokeFunction", c2).then((e2) => {
    if (e2.code)
      i2(null, e2);
    else {
      let t3 = e2.data.response_data;
      if (s2)
        i2(null, { result: t3, requestId: e2.requestId });
      else
        try {
          t3 = JSON.parse(e2.data.response_data), i2(null, { result: t3, requestId: e2.requestId });
        } catch (e3) {
          i2(new M({ message: "response data must be json" }));
        }
    }
    return i2.promise;
  }).catch((e2) => {
    i2(e2);
  }), i2.promise;
}, He = { timeout: 15e3, persistence: "session" }, We = {};
class ze {
  constructor(e) {
    this.config = e || this.config, this.authObj = void 0;
  }
  init(e) {
    switch (se.adapter || (this.requestClient = new se.adapter.reqClass({ timeout: e.timeout || 5e3, timeoutMsg: `\u8BF7\u6C42\u5728${(e.timeout || 5e3) / 1e3}s\u5185\u672A\u5B8C\u6210\uFF0C\u5DF2\u4E2D\u65AD` })), this.config = __spreadValues(__spreadValues({}, He), e), true) {
      case this.config.timeout > 6e5:
        console.warn("timeout\u5927\u4E8E\u53EF\u914D\u7F6E\u4E0A\u9650[10\u5206\u949F]\uFF0C\u5DF2\u91CD\u7F6E\u4E3A\u4E0A\u9650\u6570\u503C"), this.config.timeout = 6e5;
        break;
      case this.config.timeout < 100:
        console.warn("timeout\u5C0F\u4E8E\u53EF\u914D\u7F6E\u4E0B\u9650[100ms]\uFF0C\u5DF2\u91CD\u7F6E\u4E3A\u4E0B\u9650\u6570\u503C"), this.config.timeout = 100;
    }
    return new ze(this.config);
  }
  auth({ persistence: e } = {}) {
    if (this.authObj)
      return this.authObj;
    const t2 = e || se.adapter.primaryStorage || He.persistence;
    var n2;
    return t2 !== this.config.persistence && (this.config.persistence = t2), function(e2) {
      const { env: t3 } = e2;
      ce[t3] = new ae(e2), ue[t3] = new ae(__spreadProps(__spreadValues({}, e2), { persistence: "local" }));
    }(this.config), n2 = this.config, Oe[n2.env] = new be(n2), this.authObj = new qe(this.config), this.authObj;
  }
  on(e, t2) {
    return ge.apply(this, [e, t2]);
  }
  off(e, t2) {
    return me.apply(this, [e, t2]);
  }
  callFunction(e, t2) {
    return Be.apply(this, [e, t2]);
  }
  deleteFile(e, t2) {
    return $e.apply(this, [e, t2]);
  }
  getTempFileURL(e, t2) {
    return je.apply(this, [e, t2]);
  }
  downloadFile(e, t2) {
    return Ke.apply(this, [e, t2]);
  }
  uploadFile(e, t2) {
    return Fe.apply(this, [e, t2]);
  }
  getUploadMetadata(e, t2) {
    return Me.apply(this, [e, t2]);
  }
  registerExtension(e) {
    We[e.name] = e;
  }
  async invokeExtension(e, t2) {
    const n2 = We[e];
    if (!n2)
      throw new M({ message: `\u6269\u5C55${e} \u5FC5\u987B\u5148\u6CE8\u518C` });
    return await n2.invoke(t2, this);
  }
  useAdapters(e) {
    const { adapter: t2, runtime: n2 } = ne(e) || {};
    t2 && (se.adapter = t2), n2 && (se.runtime = n2);
  }
}
var Ve = new ze();
function Je(e, t2, n2) {
  n2 === void 0 && (n2 = {});
  var s2 = /\?/.test(t2), o2 = "";
  for (var r2 in n2)
    o2 === "" ? !s2 && (t2 += "?") : o2 += "&", o2 += r2 + "=" + encodeURIComponent(n2[r2]);
  return /^http(s)?:\/\//.test(t2 += o2) ? t2 : "" + e + t2;
}
class Ye {
  post(e) {
    const { url: t2, data: n2, headers: s2 } = e;
    return new Promise((e2, o2) => {
      H.request({ url: Je("https:", t2), data: n2, method: "POST", header: s2, success(t3) {
        e2(t3);
      }, fail(e3) {
        o2(e3);
      } });
    });
  }
  upload(e) {
    return new Promise((t2, n2) => {
      const { url: s2, file: o2, data: r2, headers: i2, fileType: a2 } = e, c2 = H.uploadFile({ url: Je("https:", s2), name: "file", formData: Object.assign({}, r2), filePath: o2, fileType: a2, header: i2, success(e2) {
        const n3 = { statusCode: e2.statusCode, data: e2.data || {} };
        e2.statusCode === 200 && r2.success_action_status && (n3.statusCode = parseInt(r2.success_action_status, 10)), t2(n3);
      }, fail(e2) {
        n2(new Error(e2.errMsg || "uploadFile:fail"));
      } });
      typeof e.onUploadProgress == "function" && c2 && typeof c2.onProgressUpdate == "function" && c2.onProgressUpdate((t3) => {
        e.onUploadProgress({ loaded: t3.totalBytesSent, total: t3.totalBytesExpectedToSend });
      });
    });
  }
}
const Xe = { setItem(e, t2) {
  H.setStorageSync(e, t2);
}, getItem: (e) => H.getStorageSync(e), removeItem(e) {
  H.removeStorageSync(e);
}, clear() {
  H.clearStorageSync();
} };
var Ge = { genAdapter: function() {
  return { root: {}, reqClass: Ye, localStorage: Xe, primaryStorage: "local" };
}, isMatch: function() {
  return true;
}, runtime: "uni_app" };
Ve.useAdapters(Ge);
const Qe = Ve, Ze = Qe.init;
Qe.init = function(e) {
  e.env = e.spaceId;
  const t2 = Ze.call(this, e);
  t2.config.provider = "tencent", t2.config.spaceId = e.spaceId;
  const n2 = t2.auth;
  return t2.auth = function(e2) {
    const t3 = n2.call(this, e2);
    return ["linkAndRetrieveDataWithTicket", "signInAnonymously", "signOut", "getAccessToken", "getLoginState", "signInWithTicket", "getUserInfo"].forEach((e3) => {
      t3[e3] = F(t3[e3]).bind(t3);
    }), t3;
  }, t2.customAuth = t2.auth, t2;
};
var et = Qe;
function tt(e) {
  return e && tt(e.__v_raw) || e;
}
function nt() {
  return { token: H.getStorageSync("uni_id_token") || H.getStorageSync("uniIdToken"), tokenExpired: H.getStorageSync("uni_id_token_expired") };
}
function st({ token: e, tokenExpired: t2 } = {}) {
  e && H.setStorageSync("uni_id_token", e), t2 && H.setStorageSync("uni_id_token_expired", t2);
}
var rt = class extends V {
  getAccessToken() {
    return new Promise((e, t2) => {
      const n2 = "Anonymous_Access_token";
      this.setAccessToken(n2), e(n2);
    });
  }
  setupRequest(e, t2) {
    const n2 = Object.assign({}, e, { spaceId: this.config.spaceId, timestamp: Date.now() }), s2 = { "Content-Type": "application/json" };
    t2 !== "auth" && (n2.token = this.accessToken, s2["x-basement-token"] = this.accessToken), s2["x-serverless-sign"] = B.sign(n2, this.config.clientSecret);
    const o2 = K();
    s2["x-client-info"] = encodeURIComponent(JSON.stringify(o2));
    const { token: r2 } = nt();
    return s2["x-client-token"] = r2, { url: this.config.requestUrl, method: "POST", data: n2, dataType: "json", header: JSON.parse(JSON.stringify(s2)) };
  }
  uploadFileToOSS({ url: e, formData: t2, name: n2, filePath: s2, fileType: o2, onUploadProgress: r2 }) {
    return new Promise((i2, a2) => {
      const c2 = this.adapter.uploadFile({ url: e, formData: t2, name: n2, filePath: s2, fileType: o2, success(e2) {
        e2 && e2.statusCode < 400 ? i2(e2) : a2(new M({ code: "UPLOAD_FAILED", message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
      }, fail(e2) {
        a2(new M({ code: e2.code || "UPLOAD_FAILED", message: e2.message || e2.errMsg || "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
      } });
      typeof r2 == "function" && c2 && typeof c2.onProgressUpdate == "function" && c2.onProgressUpdate((e2) => {
        r2({ loaded: e2.totalBytesSent, total: e2.totalBytesExpectedToSend });
      });
    });
  }
  uploadFile({ filePath: e, cloudPath: t2, fileType: n2 = "image", onUploadProgress: s2 }) {
    if (!t2)
      throw new M({ code: "CLOUDPATH_REQUIRED", message: "cloudPath\u4E0D\u53EF\u4E3A\u7A7A" });
    let o2;
    return this.getOSSUploadOptionsFromPath({ cloudPath: t2 }).then((t3) => {
      const { url: r2, formData: i2, name: a2 } = t3.result;
      o2 = t3.result.fileUrl;
      const c2 = { url: r2, formData: i2, name: a2, filePath: e, fileType: n2 };
      return this.uploadFileToOSS(Object.assign({}, c2, { onUploadProgress: s2 }));
    }).then(() => this.reportOSSUpload({ cloudPath: t2 })).then((t3) => new Promise((n3, s3) => {
      t3.success ? n3({ success: true, filePath: e, fileID: o2 }) : s3(new M({ code: "UPLOAD_FAILED", message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
    }));
  }
  deleteFile({ fileList: e }) {
    const t2 = { method: "serverless.file.resource.delete", params: JSON.stringify({ fileList: e }) };
    return this.request(this.setupRequest(t2));
  }
  getTempFileURL({ fileList: e } = {}) {
    const t2 = { method: "serverless.file.resource.getTempFileURL", params: JSON.stringify({ fileList: e }) };
    return this.request(this.setupRequest(t2));
  }
};
var it = { init(e) {
  const t2 = new rt(e), n2 = { signInAnonymously: function() {
    return t2.authorize();
  }, getLoginState: function() {
    return Promise.resolve(false);
  } };
  return t2.auth = function() {
    return n2;
  }, t2.customAuth = t2.auth, t2;
} };
function at({ data: e }) {
  let t2;
  t2 = K();
  const n2 = JSON.parse(JSON.stringify(e || {}));
  if (Object.assign(n2, { clientInfo: t2 }), !n2.uniIdToken) {
    const { token: e2 } = nt();
    e2 && (n2.uniIdToken = e2);
  }
  return n2;
}
const ut = [{ rule: /fc_function_not_found|FUNCTION_NOT_FOUND/, content: "\uFF0C\u4E91\u51FD\u6570[{functionName}]\u5728\u4E91\u7AEF\u4E0D\u5B58\u5728\uFF0C\u8BF7\u68C0\u67E5\u6B64\u4E91\u51FD\u6570\u540D\u79F0\u662F\u5426\u6B63\u786E\u4EE5\u53CA\u8BE5\u4E91\u51FD\u6570\u662F\u5426\u5DF2\u4E0A\u4F20\u5230\u670D\u52A1\u7A7A\u95F4", mode: "append" }];
var lt = /[\\^$.*+?()[\]{}|]/g, ht = RegExp(lt.source);
function dt(e, t2, n2) {
  return e.replace(new RegExp((s2 = t2) && ht.test(s2) ? s2.replace(lt, "\\$&") : s2, "g"), n2);
  var s2;
}
function ft({ functionName: e, result: t2, logPvd: n2 }) {
  if (this.config.debugLog && t2 && t2.requestId) {
    const s2 = JSON.stringify({ spaceId: this.config.spaceId, functionName: e, requestId: t2.requestId });
    console.log(`[${n2}-request]${s2}[/${n2}-request]`);
  }
}
function gt(e) {
  const t2 = e.callFunction, n2 = function(n3) {
    const s2 = n3.name;
    n3.data = at.call(e, { data: n3.data });
    const o2 = { aliyun: "aliyun", tencent: "tcb", tcb: "tcb" }[this.config.provider];
    return t2.call(this, n3).then((e2) => (e2.errCode = 0, ft.call(this, { functionName: s2, result: e2, logPvd: o2 }), Promise.resolve(e2)), (e2) => (ft.call(this, { functionName: s2, result: e2, logPvd: o2 }), e2 && e2.message && (e2.message = function({ message: e3 = "", extraInfo: t3 = {}, formatter: n4 = [] } = {}) {
      for (let s3 = 0; s3 < n4.length; s3++) {
        const { rule: o3, content: r2, mode: i2 } = n4[s3], a2 = e3.match(o3);
        if (!a2)
          continue;
        let c2 = r2;
        for (let e4 = 1; e4 < a2.length; e4++)
          c2 = dt(c2, `{$${e4}}`, a2[e4]);
        for (const e4 in t3)
          c2 = dt(c2, `{${e4}}`, t3[e4]);
        return i2 === "replace" ? c2 : e3 + c2;
      }
      return e3;
    }({ message: `[${n3.name}]: ${e2.message}`, formatter: ut, extraInfo: { functionName: s2 } })), Promise.reject(e2)));
  };
  e.callFunction = function(t3) {
    let s2;
    return s2 = n2.call(this, t3), Object.defineProperty(s2, "result", { get: () => (console.warn("\u5F53\u524D\u8FD4\u56DE\u7ED3\u679C\u4E3APromise\u7C7B\u578B\uFF0C\u4E0D\u53EF\u76F4\u63A5\u8BBF\u95EE\u5176result\u5C5E\u6027\uFF0C\u8BE6\u60C5\u8BF7\u53C2\u8003\uFF1Ahttps://uniapp.dcloud.net.cn/uniCloud/faq?id=promise"), {}) }), s2;
  };
}
const pt = Symbol("CLIENT_DB_INTERNAL");
function mt(e, t2) {
  return e.then = "DoNotReturnProxyWithAFunctionNamedThen", e._internalType = pt, e.__v_raw = void 0, new Proxy(e, { get(e2, n2, s2) {
    if (n2 === "_uniClient")
      return null;
    if (n2 in e2 || typeof n2 != "string") {
      const t3 = e2[n2];
      return typeof t3 == "function" ? t3.bind(e2) : t3;
    }
    return t2.get(e2, n2, s2);
  } });
}
function yt(e) {
  return { on: (t2, n2) => {
    e[t2] = e[t2] || [], e[t2].indexOf(n2) > -1 || e[t2].push(n2);
  }, off: (t2, n2) => {
    e[t2] = e[t2] || [];
    const s2 = e[t2].indexOf(n2);
    s2 !== -1 && e[t2].splice(s2, 1);
  } };
}
const _t = ["db.Geo", "db.command", "command.aggregate"];
function wt(e, t2) {
  return _t.indexOf(`${e}.${t2}`) > -1;
}
function kt(e) {
  switch (u(e = tt(e))) {
    case "array":
      return e.map((e2) => kt(e2));
    case "object":
      return e._internalType === pt || Object.keys(e).forEach((t2) => {
        e[t2] = kt(e[t2]);
      }), e;
    case "regexp":
      return { $regexp: { source: e.source, flags: e.flags } };
    case "date":
      return { $date: e.toISOString() };
    default:
      return e;
  }
}
function Tt(e) {
  return e && e.content && e.content.$method;
}
class St {
  constructor(e, t2, n2) {
    this.content = e, this.prevStage = t2 || null, this.udb = null, this._database = n2;
  }
  toJSON() {
    let e = this;
    const t2 = [e.content];
    for (; e.prevStage; )
      e = e.prevStage, t2.push(e.content);
    return { $db: t2.reverse().map((e2) => ({ $method: e2.$method, $param: kt(e2.$param) })) };
  }
  getAction() {
    const e = this.toJSON().$db.find((e2) => e2.$method === "action");
    return e && e.$param && e.$param[0];
  }
  getCommand() {
    return { $db: this.toJSON().$db.filter((e) => e.$method !== "action") };
  }
  get isAggregate() {
    let e = this;
    for (; e; ) {
      const t2 = Tt(e), n2 = Tt(e.prevStage);
      if (t2 === "aggregate" && n2 === "collection" || t2 === "pipeline")
        return true;
      e = e.prevStage;
    }
    return false;
  }
  get isCommand() {
    let e = this;
    for (; e; ) {
      if (Tt(e) === "command")
        return true;
      e = e.prevStage;
    }
    return false;
  }
  get isAggregateCommand() {
    let e = this;
    for (; e; ) {
      const t2 = Tt(e), n2 = Tt(e.prevStage);
      if (t2 === "aggregate" && n2 === "command")
        return true;
      e = e.prevStage;
    }
    return false;
  }
  get count() {
    if (!this.isAggregate)
      return function() {
        return this._send("count", Array.from(arguments));
      };
    const e = this;
    return function() {
      return vt({ $method: "count", $param: kt(Array.from(arguments)) }, e, this._database);
    };
  }
  get remove() {
    if (!this.isCommand)
      return function() {
        return this._send("remove", Array.from(arguments));
      };
    const e = this;
    return function() {
      return vt({ $method: "remove", $param: kt(Array.from(arguments)) }, e, this._database);
    };
  }
  get() {
    return this._send("get", Array.from(arguments));
  }
  add() {
    return this._send("add", Array.from(arguments));
  }
  update() {
    return this._send("update", Array.from(arguments));
  }
  end() {
    return this._send("end", Array.from(arguments));
  }
  get set() {
    if (!this.isCommand)
      return function() {
        throw new Error("JQL\u7981\u6B62\u4F7F\u7528set\u65B9\u6CD5");
      };
    const e = this;
    return function() {
      return vt({ $method: "set", $param: kt(Array.from(arguments)) }, e, this._database);
    };
  }
  _send(e, t2) {
    const n2 = this.getAction(), s2 = this.getCommand();
    if (s2.$db.push({ $method: e, $param: kt(t2) }), d)
      ;
    return this._database._callCloudFunction({ action: n2, command: s2 });
  }
}
function vt(e, t2, n2) {
  return mt(new St(e, t2, n2), { get(e2, t3) {
    let s2 = "db";
    return e2 && e2.content && (s2 = e2.content.$method), wt(s2, t3) ? vt({ $method: t3 }, e2, n2) : function() {
      return vt({ $method: t3, $param: kt(Array.from(arguments)) }, e2, n2);
    };
  } });
}
function At({ path: e, method: t2 }) {
  return class {
    constructor() {
      this.param = Array.from(arguments);
    }
    toJSON() {
      return { $newDb: [...e.map((e2) => ({ $method: e2 })), { $method: t2, $param: this.param }] };
    }
  };
}
class Pt extends class {
  constructor({ uniClient: e = {} } = {}) {
    this._uniClient = e, this._authCallBacks = {}, this._dbCallBacks = {}, e.isDefault && (this._dbCallBacks = k("_globalUniCloudDatabaseCallback")), this.auth = yt(this._authCallBacks), Object.assign(this, yt(this._dbCallBacks)), this.env = mt({}, { get: (e2, t2) => ({ $env: t2 }) }), this.Geo = mt({}, { get: (e2, t2) => At({ path: ["Geo"], method: t2 }) }), this.serverDate = At({ path: [], method: "serverDate" }), this.RegExp = At({ path: [], method: "RegExp" });
  }
  getCloudEnv(e) {
    if (typeof e != "string" || !e.trim())
      throw new Error("getCloudEnv\u53C2\u6570\u9519\u8BEF");
    return { $env: e.replace("$cloudEnv_", "") };
  }
  _callback(e, t2) {
    const n2 = this._dbCallBacks;
    n2[e] && n2[e].forEach((e2) => {
      e2(...t2);
    });
  }
  _callbackAuth(e, t2) {
    const n2 = this._authCallBacks;
    n2[e] && n2[e].forEach((e2) => {
      e2(...t2);
    });
  }
  multiSend() {
    const e = Array.from(arguments), t2 = e.map((e2) => {
      const t3 = e2.getAction(), n2 = e2.getCommand();
      if (n2.$db[n2.$db.length - 1].$method !== "getTemp")
        throw new Error("multiSend\u53EA\u652F\u6301\u5B50\u547D\u4EE4\u5185\u4F7F\u7528getTemp");
      return { action: t3, command: n2 };
    });
    return this._callCloudFunction({ multiCommand: t2, queryList: e });
  }
} {
  _callCloudFunction({ action: e, command: t2, multiCommand: n2, queryList: s2 }) {
    function o2(e2, t3) {
      if (n2 && s2)
        for (let n3 = 0; n3 < s2.length; n3++) {
          const o3 = s2[n3];
          o3.udb && typeof o3.udb.setResult == "function" && (t3 ? o3.udb.setResult(t3) : o3.udb.setResult(e2.result.dataList[n3]));
        }
    }
    const r2 = this;
    function i2(e2) {
      return r2._callback("error", [e2]), P(I("database", "fail"), e2).then(() => P(I("database", "complete"), e2)).then(() => (o2(null, e2), q(O, { type: R, content: e2 }), Promise.reject(e2)));
    }
    const a2 = P(I("database", "invoke")), u2 = this._uniClient;
    return a2.then(() => u2.callFunction({ name: "DCloud-clientDB", type: c, data: { action: e, command: t2, multiCommand: n2 } })).then((e2) => {
      const { code: t3, message: n3, token: s3, tokenExpired: r3, systemInfo: a3 = [] } = e2.result;
      if (a3)
        for (let e3 = 0; e3 < a3.length; e3++) {
          const { level: t4, message: n4, detail: s4 } = a3[e3], o3 = console[g === "app" && t4 === "warn" ? "error" : t4] || console.log;
          let r4 = "[System Info]" + n4;
          s4 && (r4 = `${r4}
\u8BE6\u7EC6\u4FE1\u606F\uFF1A${s4}`), o3(r4);
        }
      if (t3) {
        return i2(new M({ code: t3, message: n3, requestId: e2.requestId }));
      }
      e2.result.errCode = e2.result.code, e2.result.errMsg = e2.result.message, s3 && r3 && (st({ token: s3, tokenExpired: r3 }), this._callbackAuth("refreshToken", [{ token: s3, tokenExpired: r3 }]), this._callback("refreshToken", [{ token: s3, tokenExpired: r3 }]), q(E, { token: s3, tokenExpired: r3 }));
      const c2 = [{ prop: "affectedDocs", tips: "affectedDocs\u4E0D\u518D\u63A8\u8350\u4F7F\u7528\uFF0C\u8BF7\u4F7F\u7528inserted/deleted/updated/data.length\u66FF\u4EE3" }, { prop: "code", tips: "code\u4E0D\u518D\u63A8\u8350\u4F7F\u7528\uFF0C\u8BF7\u4F7F\u7528errCode\u66FF\u4EE3" }, { prop: "message", tips: "message\u4E0D\u518D\u63A8\u8350\u4F7F\u7528\uFF0C\u8BF7\u4F7F\u7528errMsg\u66FF\u4EE3" }];
      for (let t4 = 0; t4 < c2.length; t4++) {
        const { prop: n4, tips: s4 } = c2[t4];
        if (n4 in e2.result) {
          const t5 = e2.result[n4];
          Object.defineProperty(e2.result, n4, { get: () => (console.warn(s4), t5) });
        }
      }
      return function(e3) {
        return P(I("database", "success"), e3).then(() => P(I("database", "complete"), e3)).then(() => (o2(e3, null), q(O, { type: R, content: e3 }), Promise.resolve(e3)));
      }(e2);
    }, (e2) => {
      /fc_function_not_found|FUNCTION_NOT_FOUND/g.test(e2.message) && console.warn("clientDB\u672A\u521D\u59CB\u5316\uFF0C\u8BF7\u5728web\u63A7\u5236\u53F0\u4FDD\u5B58\u4E00\u6B21schema\u4EE5\u5F00\u542FclientDB");
      return i2(new M({ code: e2.code || "SYSTEM_ERROR", message: e2.message, requestId: e2.requestId }));
    });
  }
}
function It(e) {
  e.database = function(t2) {
    if (t2 && Object.keys(t2).length > 0)
      return e.init(t2).database();
    if (this._database)
      return this._database;
    const n2 = function(e2, t3 = {}) {
      return mt(new e2(t3), { get: (e3, t4) => wt("db", t4) ? vt({ $method: t4 }, null, e3) : function() {
        return vt({ $method: t4, $param: kt(Array.from(arguments)) }, null, e3);
      } });
    }(Pt, { uniClient: e });
    return this._database = n2, n2;
  };
}
const bt = "token\u65E0\u6548\uFF0C\u8DF3\u8F6C\u767B\u5F55\u9875\u9762", Ot = "token\u8FC7\u671F\uFF0C\u8DF3\u8F6C\u767B\u5F55\u9875\u9762", Ct = { TOKEN_INVALID_TOKEN_EXPIRED: Ot, TOKEN_INVALID_INVALID_CLIENTID: bt, TOKEN_INVALID: bt, TOKEN_INVALID_WRONG_TOKEN: bt, TOKEN_INVALID_ANONYMOUS_USER: bt }, Et = { "uni-id-token-expired": Ot, "uni-id-check-token-failed": bt, "uni-id-token-not-exist": bt, "uni-id-check-device-feature-failed": bt };
function Rt(e, t2) {
  let n2 = "";
  return n2 = e ? `${e}/${t2}` : t2, n2.replace(/^\//, "");
}
function Ut(e = [], t2 = "") {
  const n2 = [], s2 = [];
  return e.forEach((e2) => {
    e2.needLogin === true ? n2.push(Rt(t2, e2.path)) : e2.needLogin === false && s2.push(Rt(t2, e2.path));
  }), { needLoginPage: n2, notNeedLoginPage: s2 };
}
function xt(e = "", t2 = {}) {
  if (!e)
    return false;
  if (!(t2 && t2.list && t2.list.length))
    return false;
  const n2 = t2.list, s2 = e.split("?")[0].replace(/^\//, "");
  return n2.some((e2) => e2.pagePath === s2);
}
const Lt = !!t.uniIdRouter;
const { loginPage: Dt, routerNeedLogin: Nt, resToLogin: qt, needLoginPage: Ft, notNeedLoginPage: Mt, loginPageInTabBar: $t } = function({ pages: e = [], subPackages: n2 = [], uniIdRouter: s2 = {}, tabBar: o2 = {} } = t) {
  const { loginPage: r2, needLogin: i2 = [], resToLogin: a2 = true } = s2, { needLoginPage: c2, notNeedLoginPage: u2 } = Ut(e), { needLoginPage: l2, notNeedLoginPage: h2 } = function(e2 = []) {
    const t2 = [], n3 = [];
    return e2.forEach((e3) => {
      const { root: s3, pages: o3 = [] } = e3, { needLoginPage: r3, notNeedLoginPage: i3 } = Ut(o3, s3);
      t2.push(...r3), n3.push(...i3);
    }), { needLoginPage: t2, notNeedLoginPage: n3 };
  }(n2);
  return { loginPage: r2, routerNeedLogin: i2, resToLogin: a2, needLoginPage: [...c2, ...l2], notNeedLoginPage: [...u2, ...h2], loginPageInTabBar: xt(r2, o2) };
}();
function jt(e) {
  const t2 = function(e2) {
    const t3 = getCurrentPages(), n2 = t3[t3.length - 1].route, s2 = e2.charAt(0), o2 = e2.split("?")[0];
    if (s2 === "/")
      return o2;
    const r2 = o2.replace(/^\//, "").split("/"), i2 = n2.split("/");
    i2.pop();
    for (let e3 = 0; e3 < r2.length; e3++) {
      const t4 = r2[e3];
      t4 === ".." ? i2.pop() : t4 !== "." && i2.push(t4);
    }
    return i2[0] === "" && i2.shift(), i2.join("/");
  }(e).replace(/^\//, "");
  return !(Mt.indexOf(t2) > -1) && (Ft.indexOf(t2) > -1 || Nt.some((t3) => function(e2, t4) {
    return new RegExp(t4).test(e2);
  }(e, t3)));
}
function Kt(e, t2) {
  return e.charAt(0) !== "/" && (e = "/" + e), t2 ? e.indexOf("?") > -1 ? e + `&uniIdRedirectUrl=${encodeURIComponent(t2)}` : e + `?uniIdRedirectUrl=${encodeURIComponent(t2)}` : e;
}
function Bt() {
  const e = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
  for (let t2 = 0; t2 < e.length; t2++) {
    const n2 = e[t2];
    uni.addInterceptor(n2, { invoke(e2) {
      const { token: t3, tokenExpired: s2 } = nt();
      let o2;
      if (t3) {
        if (s2 < Date.now()) {
          const e3 = "uni-id-token-expired";
          o2 = { errCode: e3, errMsg: Et[e3] };
        }
      } else {
        const e3 = "uni-id-check-token-failed";
        o2 = { errCode: e3, errMsg: Et[e3] };
      }
      if (jt(e2.url) && o2) {
        o2.uniIdRedirectUrl = e2.url;
        if (L(C).length > 0)
          return setTimeout(() => {
            q(C, o2);
          }, 0), e2.url = "", false;
        if (!Dt)
          return e2;
        const t4 = Kt(Dt, o2.uniIdRedirectUrl);
        if ($t) {
          if (n2 === "navigateTo" || n2 === "redirectTo")
            return setTimeout(() => {
              uni.switchTab({ url: t4 });
            }), false;
        } else if (n2 === "switchTab")
          return setTimeout(() => {
            uni.navigateTo({ url: t4 });
          }), false;
        e2.url = t4;
      }
      return e2;
    } });
  }
}
function Ht() {
  this.onResponse((e) => {
    const { type: t2, content: n2 } = e;
    let s2 = false;
    switch (t2) {
      case "cloudobject":
        s2 = function(e2) {
          const { errCode: t3 } = e2;
          return t3 in Et;
        }(n2);
        break;
      case "clientdb":
        s2 = function(e2) {
          const { errCode: t3 } = e2;
          return t3 in Ct;
        }(n2);
    }
    s2 && function(e2 = {}) {
      const t3 = L(C), n3 = getCurrentPages(), s3 = n3[n3.length - 1], o2 = s3 && s3.$page && s3.$page.fullPath;
      if (t3.length > 0)
        return q(C, Object.assign({ uniIdRedirectUrl: o2 }, e2));
      Dt && uni.navigateTo({ url: Kt(Dt, o2) });
    }(n2);
  });
}
function Wt(e) {
  e.onNeedLogin = function(e2) {
    D(C, e2);
  }, e.offNeedLogin = function(e2) {
    N(C, e2);
  }, Lt && (k("uni-cloud-status").needLoginInit || (k("uni-cloud-status").needLoginInit = true, function t2() {
    const n2 = getCurrentPages();
    n2 && n2[0] ? Bt.call(e) : setTimeout(() => {
      t2();
    }, 30);
  }(), qt && Ht.call(e)));
}
function zt(e) {
  !function(e2) {
    e2.onResponse = function(e3) {
      D(O, e3);
    }, e2.offResponse = function(e3) {
      N(O, e3);
    };
  }(e), Wt(e), function(e2) {
    e2.onRefreshToken = function(e3) {
      D(E, e3);
    }, e2.offRefreshToken = function(e3) {
      N(E, e3);
    };
  }(e);
}
let Vt;
const Jt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", Yt = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
function Xt() {
  const e = nt().token || "", t2 = e.split(".");
  if (!e || t2.length !== 3)
    return { uid: null, role: [], permission: [], tokenExpired: 0 };
  let n2;
  try {
    n2 = JSON.parse((s2 = t2[1], decodeURIComponent(Vt(s2).split("").map(function(e2) {
      return "%" + ("00" + e2.charCodeAt(0).toString(16)).slice(-2);
    }).join(""))));
  } catch (e2) {
    throw new Error("\u83B7\u53D6\u5F53\u524D\u7528\u6237\u4FE1\u606F\u51FA\u9519\uFF0C\u8BE6\u7EC6\u9519\u8BEF\u4FE1\u606F\u4E3A\uFF1A" + e2.message);
  }
  var s2;
  return n2.tokenExpired = 1e3 * n2.exp, delete n2.exp, delete n2.iat, n2;
}
Vt = typeof atob != "function" ? function(e) {
  if (e = String(e).replace(/[\t\n\f\r ]+/g, ""), !Yt.test(e))
    throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
  var t2;
  e += "==".slice(2 - (3 & e.length));
  for (var n2, s2, o2 = "", r2 = 0; r2 < e.length; )
    t2 = Jt.indexOf(e.charAt(r2++)) << 18 | Jt.indexOf(e.charAt(r2++)) << 12 | (n2 = Jt.indexOf(e.charAt(r2++))) << 6 | (s2 = Jt.indexOf(e.charAt(r2++))), o2 += n2 === 64 ? String.fromCharCode(t2 >> 16 & 255) : s2 === 64 ? String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255) : String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255, 255 & t2);
  return o2;
} : atob;
var Gt = s(function(e, t2) {
  Object.defineProperty(t2, "__esModule", { value: true });
  const n2 = "chooseAndUploadFile:ok", s2 = "chooseAndUploadFile:fail";
  function o2(e2, t3) {
    return e2.tempFiles.forEach((e3, n3) => {
      e3.name || (e3.name = e3.path.substring(e3.path.lastIndexOf("/") + 1)), t3 && (e3.fileType = t3), e3.cloudPath = Date.now() + "_" + n3 + e3.name.substring(e3.name.lastIndexOf("."));
    }), e2.tempFilePaths || (e2.tempFilePaths = e2.tempFiles.map((e3) => e3.path)), e2;
  }
  function r2(e2, t3, { onChooseFile: s3, onUploadProgress: o3 }) {
    return t3.then((e3) => {
      if (s3) {
        const t4 = s3(e3);
        if (t4 !== void 0)
          return Promise.resolve(t4).then((t5) => t5 === void 0 ? e3 : t5);
      }
      return e3;
    }).then((t4) => t4 === false ? { errMsg: n2, tempFilePaths: [], tempFiles: [] } : function(e3, t5, s4 = 5, o4) {
      (t5 = Object.assign({}, t5)).errMsg = n2;
      const r3 = t5.tempFiles, i2 = r3.length;
      let a2 = 0;
      return new Promise((n3) => {
        for (; a2 < s4; )
          c2();
        function c2() {
          const s5 = a2++;
          if (s5 >= i2)
            return void (!r3.find((e4) => !e4.url && !e4.errMsg) && n3(t5));
          const u2 = r3[s5];
          e3.uploadFile({ filePath: u2.path, cloudPath: u2.cloudPath, fileType: u2.fileType, onUploadProgress(e4) {
            e4.index = s5, e4.tempFile = u2, e4.tempFilePath = u2.path, o4 && o4(e4);
          } }).then((e4) => {
            u2.url = e4.fileID, s5 < i2 && c2();
          }).catch((e4) => {
            u2.errMsg = e4.errMsg || e4.message, s5 < i2 && c2();
          });
        }
      });
    }(e2, t4, 5, o3));
  }
  t2.initChooseAndUploadFile = function(e2) {
    return function(t3 = { type: "all" }) {
      return t3.type === "image" ? r2(e2, function(e3) {
        const { count: t4, sizeType: n3, sourceType: r3 = ["album", "camera"], extension: i2 } = e3;
        return new Promise((e4, a2) => {
          uni.chooseImage({ count: t4, sizeType: n3, sourceType: r3, extension: i2, success(t5) {
            e4(o2(t5, "image"));
          }, fail(e5) {
            a2({ errMsg: e5.errMsg.replace("chooseImage:fail", s2) });
          } });
        });
      }(t3), t3) : t3.type === "video" ? r2(e2, function(e3) {
        const { camera: t4, compressed: n3, maxDuration: r3, sourceType: i2 = ["album", "camera"], extension: a2 } = e3;
        return new Promise((e4, c2) => {
          uni.chooseVideo({ camera: t4, compressed: n3, maxDuration: r3, sourceType: i2, extension: a2, success(t5) {
            const { tempFilePath: n4, duration: s3, size: r4, height: i3, width: a3 } = t5;
            e4(o2({ errMsg: "chooseVideo:ok", tempFilePaths: [n4], tempFiles: [{ name: t5.tempFile && t5.tempFile.name || "", path: n4, size: r4, type: t5.tempFile && t5.tempFile.type || "", width: a3, height: i3, duration: s3, fileType: "video", cloudPath: "" }] }, "video"));
          }, fail(e5) {
            c2({ errMsg: e5.errMsg.replace("chooseVideo:fail", s2) });
          } });
        });
      }(t3), t3) : r2(e2, function(e3) {
        const { count: t4, extension: n3 } = e3;
        return new Promise((e4, r3) => {
          let i2 = uni.chooseFile;
          if (typeof wx != "undefined" && typeof wx.chooseMessageFile == "function" && (i2 = wx.chooseMessageFile), typeof i2 != "function")
            return r3({ errMsg: s2 + " \u8BF7\u6307\u5B9A type \u7C7B\u578B\uFF0C\u8BE5\u5E73\u53F0\u4EC5\u652F\u6301\u9009\u62E9 image \u6216 video\u3002" });
          i2({ type: "all", count: t4, extension: n3, success(t5) {
            e4(o2(t5));
          }, fail(e5) {
            r3({ errMsg: e5.errMsg.replace("chooseFile:fail", s2) });
          } });
        });
      }(t3), t3);
    };
  };
}), Qt = n(Gt);
const Zt = "manual";
function en(e) {
  return { props: { localdata: { type: Array, default: () => [] }, options: { type: [Object, Array], default: () => ({}) }, spaceInfo: { type: Object, default: () => ({}) }, collection: { type: [String, Array], default: "" }, action: { type: String, default: "" }, field: { type: String, default: "" }, orderby: { type: String, default: "" }, where: { type: [String, Object], default: "" }, pageData: { type: String, default: "add" }, pageCurrent: { type: Number, default: 1 }, pageSize: { type: Number, default: 20 }, getcount: { type: [Boolean, String], default: false }, gettree: { type: [Boolean, String], default: false }, gettreepath: { type: [Boolean, String], default: false }, startwith: { type: String, default: "" }, limitlevel: { type: Number, default: 10 }, groupby: { type: String, default: "" }, groupField: { type: String, default: "" }, distinct: { type: [Boolean, String], default: false }, foreignKey: { type: String, default: "" }, loadtime: { type: String, default: "auto" }, manual: { type: Boolean, default: false } }, data: () => ({ mixinDatacomLoading: false, mixinDatacomHasMore: false, mixinDatacomResData: [], mixinDatacomErrorMessage: "", mixinDatacomPage: {} }), created() {
    this.mixinDatacomPage = { current: this.pageCurrent, size: this.pageSize, count: 0 }, this.$watch(() => {
      var e2 = [];
      return ["pageCurrent", "pageSize", "localdata", "collection", "action", "field", "orderby", "where", "getont", "getcount", "gettree", "groupby", "groupField", "distinct"].forEach((t2) => {
        e2.push(this[t2]);
      }), e2;
    }, (e2, t2) => {
      if (this.loadtime === Zt)
        return;
      let n2 = false;
      const s2 = [];
      for (let o2 = 2; o2 < e2.length; o2++)
        e2[o2] !== t2[o2] && (s2.push(e2[o2]), n2 = true);
      e2[0] !== t2[0] && (this.mixinDatacomPage.current = this.pageCurrent), this.mixinDatacomPage.size = this.pageSize, this.onMixinDatacomPropsChange(n2, s2);
    });
  }, methods: { onMixinDatacomPropsChange(e2, t2) {
  }, mixinDatacomEasyGet({ getone: e2 = false, success: t2, fail: n2 } = {}) {
    this.mixinDatacomLoading || (this.mixinDatacomLoading = true, this.mixinDatacomErrorMessage = "", this.mixinDatacomGet().then((n3) => {
      this.mixinDatacomLoading = false;
      const { data: s2, count: o2 } = n3.result;
      this.getcount && (this.mixinDatacomPage.count = o2), this.mixinDatacomHasMore = s2.length < this.pageSize;
      const r2 = e2 ? s2.length ? s2[0] : void 0 : s2;
      this.mixinDatacomResData = r2, t2 && t2(r2);
    }).catch((e3) => {
      this.mixinDatacomLoading = false, this.mixinDatacomErrorMessage = e3, n2 && n2(e3);
    }));
  }, mixinDatacomGet(t2 = {}) {
    let n2 = e.database(this.spaceInfo);
    const s2 = t2.action || this.action;
    s2 && (n2 = n2.action(s2));
    const o2 = t2.collection || this.collection;
    n2 = Array.isArray(o2) ? n2.collection(...o2) : n2.collection(o2);
    const r2 = t2.where || this.where;
    r2 && Object.keys(r2).length && (n2 = n2.where(r2));
    const i2 = t2.field || this.field;
    i2 && (n2 = n2.field(i2));
    const a2 = t2.foreignKey || this.foreignKey;
    a2 && (n2 = n2.foreignKey(a2));
    const c2 = t2.groupby || this.groupby;
    c2 && (n2 = n2.groupBy(c2));
    const u2 = t2.groupField || this.groupField;
    u2 && (n2 = n2.groupField(u2));
    (t2.distinct !== void 0 ? t2.distinct : this.distinct) === true && (n2 = n2.distinct());
    const l2 = t2.orderby || this.orderby;
    l2 && (n2 = n2.orderBy(l2));
    const h2 = t2.pageCurrent !== void 0 ? t2.pageCurrent : this.mixinDatacomPage.current, d2 = t2.pageSize !== void 0 ? t2.pageSize : this.mixinDatacomPage.size, f2 = t2.getcount !== void 0 ? t2.getcount : this.getcount, g2 = t2.gettree !== void 0 ? t2.gettree : this.gettree, p = t2.gettreepath !== void 0 ? t2.gettreepath : this.gettreepath, m2 = { getCount: f2 }, y = { limitLevel: t2.limitlevel !== void 0 ? t2.limitlevel : this.limitlevel, startWith: t2.startwith !== void 0 ? t2.startwith : this.startwith };
    return g2 && (m2.getTree = y), p && (m2.getTreePath = y), n2 = n2.skip(d2 * (h2 - 1)).limit(d2).get(m2), n2;
  } } };
}
function tn(e) {
  return function(t2, n2 = {}) {
    n2 = function(e2, t3 = {}) {
      return e2.customUI = t3.customUI || e2.customUI, Object.assign(e2.loadingOptions, t3.loadingOptions), Object.assign(e2.errorOptions, t3.errorOptions), e2;
    }({ customUI: false, loadingOptions: { title: "\u52A0\u8F7D\u4E2D...", mask: true }, errorOptions: { type: "modal", retry: false } }, n2);
    const { customUI: s2, loadingOptions: o2, errorOptions: r2 } = n2, i2 = !s2;
    return new Proxy({}, { get: (n3, s3) => async function n4(...c2) {
      let u2;
      i2 && uni.showLoading({ title: o2.title, mask: o2.mask });
      try {
        u2 = await e.callFunction({ name: t2, type: a, data: { method: s3, params: c2 } });
      } catch (e2) {
        u2 = { result: e2 };
      }
      const { errCode: l2, errMsg: h2, newToken: d2 } = u2.result || {};
      if (i2 && uni.hideLoading(), d2 && d2.token && d2.tokenExpired && (st(d2), q(E, __spreadValues({}, d2))), l2) {
        if (i2)
          if (r2.type === "toast")
            uni.showToast({ title: h2, icon: "none" });
          else {
            if (r2.type !== "modal")
              throw new Error(`Invalid errorOptions.type: ${r2.type}`);
            {
              const { confirm: e3 } = await async function({ title: e4, content: t3, showCancel: n5, cancelText: s4, confirmText: o3 } = {}) {
                return new Promise((r3, i3) => {
                  uni.showModal({ title: e4, content: t3, showCancel: n5, cancelText: s4, confirmText: o3, success(e5) {
                    r3(e5);
                  }, fail() {
                    r3({ confirm: false, cancel: true });
                  } });
                });
              }({ title: "\u63D0\u793A", content: h2, showCancel: r2.retry, cancelText: "\u53D6\u6D88", confirmText: r2.retry ? "\u91CD\u8BD5" : "\u786E\u5B9A" });
              if (r2.retry && e3)
                return n4(...c2);
            }
          }
        const e2 = new M({ code: l2, message: h2, requestId: u2.requestId });
        throw e2.detail = u2.result, q(O, { type: x, content: e2 }), e2;
      }
      return q(O, { type: x, content: u2.result }), u2.result;
    } });
  };
}
function sn(e) {
  if (e.initUniCloudStatus && e.initUniCloudStatus !== "rejected")
    return;
  let t2 = Promise.resolve();
  var n2;
  n2 = 1, t2 = new Promise((e2, t3) => {
    setTimeout(() => {
      e2();
    }, n2);
  }), e.isReady = false, e.isDefault = false;
  const s2 = e.auth();
  e.initUniCloudStatus = "pending", e.initUniCloud = t2.then(() => s2.getLoginState()).then((e2) => e2 ? Promise.resolve() : s2.signInAnonymously()).then(() => {
    return Promise.resolve();
  }).then(({ address: t3, port: n3 } = {}) => {
    return Promise.resolve();
  }).then(() => {
    e.isReady = true, e.initUniCloudStatus = "fulfilled";
  }).catch((t3) => {
    console.error(t3), e.initUniCloudStatus = "rejected";
  });
}
let on = new class {
  init(e) {
    let t2 = {};
    const n2 = d;
    switch (e.provider) {
      case "tcb":
      case "tencent":
        t2 = et.init(Object.assign(e, { debugLog: n2 }));
        break;
      case "aliyun":
        t2 = J.init(Object.assign(e, { debugLog: n2 }));
        break;
      case "private":
        t2 = it.init(Object.assign(e, { debugLog: n2 }));
        break;
      default:
        throw new Error("\u672A\u63D0\u4F9B\u6B63\u786E\u7684provider\u53C2\u6570");
    }
    sn(t2), t2.reInit = function() {
      sn(this);
    }, gt(t2), function(e2) {
      const t3 = e2.uploadFile;
      e2.uploadFile = function(e3) {
        return t3.call(this, e3);
      };
    }(t2), It(t2), function(e2) {
      e2.getCurrentUserInfo = Xt, e2.chooseAndUploadFile = Qt.initChooseAndUploadFile(e2), Object.assign(e2, { get mixinDatacom() {
        return en(e2);
      } }), e2.importObject = tn(e2);
    }(t2);
    return ["callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile", "chooseAndUploadFile"].forEach((e2) => {
      if (!t2[e2])
        return;
      const n3 = t2[e2];
      t2[e2] = function() {
        return t2.reInit(), n3.apply(t2, Array.from(arguments));
      }, t2[e2] = F(t2[e2], e2).bind(t2);
    }), t2.init = this.init, t2;
  }
}();
(() => {
  {
    const e = m;
    let t2 = {};
    if (e.length === 1)
      t2 = e[0], on = on.init(t2), on.isDefault = true;
    else {
      const t3 = ["auth", "callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile", "database", "getCurrentUSerInfo", "importObject"];
      let n2;
      n2 = e && e.length > 0 ? "\u5E94\u7528\u6709\u591A\u4E2A\u670D\u52A1\u7A7A\u95F4\uFF0C\u8BF7\u901A\u8FC7uniCloud.init\u65B9\u6CD5\u6307\u5B9A\u8981\u4F7F\u7528\u7684\u670D\u52A1\u7A7A\u95F4" : "\u5E94\u7528\u672A\u5173\u8054\u670D\u52A1\u7A7A\u95F4\uFF0C\u8BF7\u5728uniCloud\u76EE\u5F55\u53F3\u952E\u5173\u8054\u670D\u52A1\u7A7A\u95F4", t3.forEach((e2) => {
        on[e2] = function() {
          return console.error(n2), Promise.reject(new M({ code: "SYS_ERR", message: n2 }));
        };
      });
    }
    Object.assign(on, { get mixinDatacom() {
      return en(on);
    } }), zt(on), on.addInterceptor = v, on.removeInterceptor = A;
  }
})();
var rn = on;
export { formatAppLog as f, isString as i, rn as r };
