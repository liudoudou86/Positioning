import { resolveComponent, openBlock, createElementBlock, createElementVNode, createVNode, withCtx, createTextVNode } from "vue";
import { _ as _export_sfc } from "../../plugin-vue_export-helper.js";
var _style_0 = { "uni-btn-v": { "": { "marginTop": "50rpx", "marginBottom": "50rpx", "marginLeft": "50rpx", "marginRight": "50rpx" } }, "navigator-hover": { "": { "marginTop": "50rpx", "marginBottom": "50rpx" } } };
const _sfc_main = {
  data() {
    return {};
  },
  onLoad() {
  },
  methods: {}
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_button = resolveComponent("button");
  const _component_navigator = resolveComponent("navigator");
  return openBlock(), createElementBlock("scroll-view", {
    scrollY: true,
    showScrollbar: true,
    enableBackToTop: true,
    bubble: "true",
    style: { flexDirection: "column" }
  }, [
    createElementVNode("view", null, [
      createElementVNode("view", { class: "uni-padding-wrap uni-common-mt" }, [
        createElementVNode("view", { class: "uni-btn-v" }, [
          createVNode(_component_navigator, {
            url: "/pages/setting/register/register",
            "hover-class": "navigator-hover"
          }, {
            default: withCtx(() => [
              createVNode(_component_button, { type: "default" }, {
                default: withCtx(() => [
                  createTextVNode("\u6CE8\u518C\u7528\u6237")
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(_component_navigator, {
            url: "/pages/setting/confirm/confirm",
            "hover-class": "navigator-hover"
          }, {
            default: withCtx(() => [
              createVNode(_component_button, { type: "default" }, {
                default: withCtx(() => [
                  createTextVNode("\u67E5\u770B\u7528\u6237")
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ])
      ])
    ])
  ]);
}
var setting = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["styles", [_style_0]]]);
export { setting as default };
