import { openBlock, createElementBlock, createElementVNode, normalizeStyle } from "vue";
import { _ as _export_sfc } from "../../plugin-vue_export-helper.js";
var _style_0 = { "content": { "": { "flex": 1 } }, "map": { "": { "width": "750rpx", "height": 250, "backgroundColor": "#f0f0f0" } } };
const _sfc_main = {
  onLoad() {
    const _this = this;
    uni.getSystemInfo({
      success: (res) => {
        _this.mapHeight = res.screenHeight - res.statusBarHeight;
        _this.mapHeight = _this.mapHeight;
      }
    });
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
        id: "myMap",
        style: normalizeStyle([{ "width": "100%" }, { height: _ctx.mapHeight + "px" }]),
        markers: _ctx.markers,
        longitude: _ctx.longitude,
        latitude: _ctx.latitude,
        circles: _ctx.circles
      }, null, 12, ["markers", "longitude", "latitude", "circles"])
    ])
  ]);
}
var map = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["styles", [_style_0]], ["__file", "D:/Coding/Positioning/pages/map/map.nvue"]]);
export { map as default };
