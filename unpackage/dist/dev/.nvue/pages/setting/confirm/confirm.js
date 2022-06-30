import { openBlock, createElementBlock, createElementVNode } from "vue";
import { _ as _export_sfc } from "../../../plugin-vue_export-helper.js";
const _sfc_main = {};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("scroll-view", {
    scrollY: true,
    showScrollbar: true,
    enableBackToTop: true,
    bubble: "true",
    style: { flexDirection: "column" }
  }, [
    createElementVNode("div")
  ]);
}
var confirm = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Coding/Positioning/pages/setting/confirm/confirm.nvue"]]);
export { confirm as default };
