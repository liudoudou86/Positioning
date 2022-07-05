"use weex:vue";

if (typeof Promise !== 'undefined' && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor
    return this.then(
      value => promise.resolve(callback()).then(() => value),
      reason => promise.resolve(callback()).then(() => {
        throw reason
      })
    )
  }
};

if (typeof uni !== 'undefined' && uni && uni.requireGlobal) {
  const global = uni.requireGlobal()
  ArrayBuffer = global.ArrayBuffer
  Int8Array = global.Int8Array
  Uint8Array = global.Uint8Array
  Uint8ClampedArray = global.Uint8ClampedArray
  Int16Array = global.Int16Array
  Uint16Array = global.Uint16Array
  Int32Array = global.Int32Array
  Uint32Array = global.Uint32Array
  Float32Array = global.Float32Array
  Float64Array = global.Float64Array
  BigInt64Array = global.BigInt64Array
  BigUint64Array = global.BigUint64Array
};


(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

  // vue-ns:vue
  var require_vue = __commonJS({
    "vue-ns:vue"(exports, module) {
      module.exports = Vue;
    }
  });

  // ../../../Positioning/unpackage/dist/dev/.nvue/pages/setting/setting.js
  var import_vue = __toESM(require_vue());

  // ../../../Positioning/unpackage/dist/dev/.nvue/plugin-vue_export-helper.js
  var _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };

  // ../../../Positioning/unpackage/dist/dev/.nvue/pages/setting/setting.js
  var _sfc_main = {
    data() {
      return {};
    },
    onLoad() {
    },
    methods: {}
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_button = (0, import_vue.resolveComponent)("button");
    const _component_navigator = (0, import_vue.resolveComponent)("navigator");
    return (0, import_vue.openBlock)(), (0, import_vue.createElementBlock)("scroll-view", {
      scrollY: true,
      showScrollbar: true,
      enableBackToTop: true,
      bubble: "true",
      style: { flexDirection: "column" }
    }, [
      (0, import_vue.createElementVNode)("view", null, [
        (0, import_vue.createElementVNode)("view", { class: "uni-padding-wrap uni-common-mt" }, [
          (0, import_vue.createElementVNode)("view", { class: "uni-btn-v" }, [
            (0, import_vue.createVNode)(_component_navigator, {
              url: "/pages/setting/register/register",
              "hover-class": "navigator-hover"
            }, {
              default: (0, import_vue.withCtx)(() => [
                (0, import_vue.createVNode)(_component_button, { type: "default" }, {
                  default: (0, import_vue.withCtx)(() => [
                    (0, import_vue.createTextVNode)("\u6CE8\u518C\u7528\u6237")
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            (0, import_vue.createVNode)(_component_navigator, {
              url: "/pages/setting/comfirm/comfirm",
              "hover-class": "navigator-hover"
            }, {
              default: (0, import_vue.withCtx)(() => [
                (0, import_vue.createVNode)(_component_button, { type: "default" }, {
                  default: (0, import_vue.withCtx)(() => [
                    (0, import_vue.createTextVNode)("\u67E5\u770B\u7528\u6237")
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
  var setting = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Coding/Positioning/pages/setting/setting.nvue"]]);

  // <stdin>
  var webview = plus.webview.currentWebview();
  if (webview) {
    const __pageId = parseInt(webview.id);
    const __pagePath = "pages/setting/setting";
    let __pageQuery = {};
    try {
      __pageQuery = JSON.parse(webview.__query__);
    } catch (e) {
    }
    setting.mpType = "page";
    const app = Vue.createPageApp(setting, { $store: getApp({ allowDefault: true }).$store, __pageId, __pagePath, __pageQuery });
    app.provide("__globalStyles", Vue.useCssStyles([...__uniConfig.styles, ...setting.styles || []]));
    app.mount("#root");
  }
})();
