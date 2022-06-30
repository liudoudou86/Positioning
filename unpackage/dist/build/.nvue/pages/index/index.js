import { _ as _export_sfc, f as formatAppLog } from "../../plugin-vue_export-helper.js";
import { resolveComponent, openBlock, createElementBlock, createElementVNode, normalizeStyle, createVNode, withCtx, createTextVNode } from "vue";
var _style_0 = { "content": { "": { "flex": 1 } }, "uni-padding-wrap": { "": { "marginTop": "30rpx", "marginBottom": "30rpx", "marginLeft": "30rpx", "marginRight": "30rpx" } } };
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
        _this.mapHeight = res.screenHeight - res.statusBarHeight - 150;
        _this.mapHeight = _this.mapHeight;
      }
    });
  },
  methods: {
    getLocationInfo() {
      const that = this;
      uni.getLocation({
        type: "gcj02",
        isHighAccuracy: true,
        success: function(res) {
          that.latitude = res.latitude;
          that.longitude = res.longitude;
          formatAppLog("log", "at pages/index/index.nvue:42", res);
          that.markers = [{
            id: 0,
            latitude: res.latitude,
            longitude: res.longitude,
            iconPath: "/static/location.png"
          }], that.circles = [{
            latitude: res.latitude,
            longitude: res.longitude,
            color: "#A7B6CB",
            radius: 30,
            strokeWidth: 5
          }];
        },
        fail: function(err) {
          formatAppLog("log", "at pages/index/index.nvue:59", err);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_button = resolveComponent("button");
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
    ]),
    createElementVNode("view", { class: "uni-padding-wrap uni-common-mt" }, [
      createVNode(_component_button, {
        type: "primary",
        onClick: _cache[1] || (_cache[1] = ($event) => $options.getLocationInfo())
      }, {
        default: withCtx(() => [
          createTextVNode("\u5237\u65B0\u4F4D\u7F6E")
        ]),
        _: 1
      })
    ])
  ]);
}
var index = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["styles", [_style_0]]]);
export { index as default };
