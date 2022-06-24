import { openBlock, createElementBlock, createElementVNode, normalizeStyle } from "vue";
import { _ as _export_sfc } from "../../plugin-vue_export-helper.js";
Object.freeze({});
Object.freeze([]);
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
function isDebugMode() {
  return typeof __channelId__ === "string" && __channelId__;
}
function jsonStringifyReplacer(k, p) {
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
  const msgs = args.map(function(v) {
    const type2 = toTypeString(v).toLowerCase();
    if (["[object object]", "[object array]", "[object module]"].indexOf(type2) !== -1) {
      try {
        v = "---BEGIN:JSON---" + JSON.stringify(v, jsonStringifyReplacer) + "---END:JSON---";
      } catch (e) {
        v = type2;
      }
    } else {
      if (v === null) {
        v = "---NULL---";
      } else if (v === void 0) {
        v = "---UNDEFINED---";
      } else {
        const vType = toRawType(v).toUpperCase();
        if (vType === "NUMBER" || vType === "BOOLEAN") {
          v = "---BEGIN:" + vType + "---" + v + "---END:" + vType + "---";
        } else {
          v = String(v);
        }
      }
    }
    return v;
  });
  return msgs.join("---COMMA---") + " " + filename;
}
function formatAppLog(type, filename, ...args) {
  const res = normalizeLog(type, filename, args);
  res && console[type](res);
}
var _style_0 = { "content": { "": { "flex": 1 } }, "map": { "": { "width": "750rpx", "height": 250, "backgroundColor": "#f0f0f0" } } };
const _sfc_main = {
  data() {
    return {
      latitude: "",
      longitude: "",
      markers: [],
      circles: []
    };
  },
  onLoad() {
    const _this = this;
    uni.getSystemInfo({
      success: (res) => {
        _this.mapHeight = res.screenHeight - res.statusBarHeight;
        _this.mapHeight = _this.mapHeight;
      }
    });
  },
  methods: {
    getLocationInfo() {
      const that = this;
      uni.getLocation({
        type: "wgs84",
        geocode: true,
        success: function(res) {
          that.latitude = res.latitude;
          that.longitude = res.longitude;
          formatAppLog("log", "at pages/index/index.nvue:39", res.latitude);
          formatAppLog("log", "at pages/index/index.nvue:40", res.longitude);
          that.markers = [{
            id: 1,
            latitude: res.latitude,
            longitude: res.longitude,
            iconPath: "../../../static/img/pos.png"
          }];
          that.circles = [{
            latitude: res.latitude,
            longitude: res.longitude,
            fillColor: "#D9E6EF",
            color: "#A7B6CB",
            radius: 50,
            strokeWidth: 2
          }];
        },
        fail: function(err) {
          formatAppLog("log", "at pages/index/index.nvue:58", err);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("scroll-view", {
    scrollY: true,
    showScrollbar: true,
    enableBackToTop: true,
    bubble: "true",
    style: { flexDirection: "column" }
  }, [
    createElementVNode("view", { class: "content" }, [
      createElementVNode("map", {
        scale: 18,
        onUpdated: _cache[0] || (_cache[0] = ($event) => $options.getLocationInfo()),
        style: normalizeStyle([{ "width": "100%" }, { height: _ctx.mapHeight + "px" }]),
        longitude: $data.longitude,
        latitude: $data.latitude,
        markers: $data.markers,
        circles: $data.circles
      }, null, 44, ["longitude", "latitude", "markers", "circles"])
    ])
  ]);
}
var index = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["styles", [_style_0]], ["__file", "D:/Coding/Positioning/pages/index/index.nvue"]]);
export { index as default };
