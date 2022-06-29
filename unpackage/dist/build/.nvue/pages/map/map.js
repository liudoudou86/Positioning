import { openBlock, createElementBlock, createElementVNode, normalizeStyle } from "vue";
import { _ as _export_sfc } from "../../plugin-vue_export-helper.js";
var _style_0 = { "content": { "": { "flex": 1 } } };
const _sfc_main = {
  data() {
    return {
      latitude: 39.54,
      longitude: 116.23,
      markers: [{
        id: 0,
        latitude: 39.54,
        longitude: 116.23,
        iconPath: "/static/location.png"
      }]
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
        markers: $data.markers
      }, null, 12, ["longitude", "latitude", "markers"])
    ])
  ]);
}
var map = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["styles", [_style_0]]]);
export { map as default };
