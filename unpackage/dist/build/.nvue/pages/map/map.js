import { _ as _export_sfc, f as formatAppLog } from "../../plugin-vue_export-helper.js";
import { openBlock, createElementBlock, createElementVNode, normalizeStyle } from "vue";
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
    uni.getLocation({
      type: "gcj02",
      success: function(res) {
        formatAppLog("log", "at pages/map/map.nvue:31", res);
        that.latitude = res.latitude;
        that.longitude = res.longitude;
        var obj = {
          width: 30,
          height: 30,
          latitude: that.latitude,
          longitude: that.longitude,
          iconPath: "/static/location.png"
        };
        var arr = [];
        arr.push(obj);
        that.markers = arr;
        that.circles = [{
          latitude: res.latitude,
          longitude: res.longitude,
          fillColor: "#D9E6EF",
          color: "#A7B6CB",
          radius: 50,
          strokeWidth: 2
        }];
      }
    });
  },
  methods: {}
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
        style: normalizeStyle([{ "width": "100%" }, { height: _ctx.mapHeight + "px" }]),
        longitude: $data.longitude,
        latitude: $data.latitude,
        markers: $data.markers,
        circles: $data.circles
      }, null, 12, ["longitude", "latitude", "markers", "circles"])
    ])
  ]);
}
var map = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["styles", [_style_0]]]);
export { map as default };
