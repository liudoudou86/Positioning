import { f as formatAppLog, t as tn, a as time } from "../../time.js";
import { resolveComponent, openBlock, createElementBlock, createElementVNode, createVNode, withCtx, createTextVNode } from "vue";
import { _ as _export_sfc } from "../../plugin-vue_export-helper.js";
var _style_0 = { "form": { "": { "paddingTop": 0, "paddingRight": "100rpx", "paddingBottom": 0, "paddingLeft": "100rpx", "marginTop": 80 } }, "inputWrapper": { "": { "width": 200, "height": 50, "backgroundColor": "#FFFFFF", "borderRadius": 20, "paddingTop": 0, "paddingRight": 20, "paddingBottom": 0, "paddingLeft": 20, "marginTop": 10 } }, "input": { ".inputWrapper ": { "width": 150, "height": 50, "textAlign": "center", "fontSize": 15 } }, "uni-list-cell": { "": { "paddingTop": 0, "paddingRight": "30rpx", "paddingBottom": 0, "paddingLeft": "30rpx" } }, "uni-padding-wrap": { "": { "marginTop": "30rpx", "marginBottom": "30rpx", "marginLeft": "30rpx", "marginRight": "30rpx" } } };
const _sfc_main = {
  data() {
    return {};
  },
  onLoad() {
  },
  methods: {
    switchChange: function(e) {
      var switchcontrol = e.detail.value;
      if (switchcontrol == true) {
        const that = this;
        uni.getSystemInfo({
          success: function(res) {
            that.deviceId = res.deviceId;
          },
          fail: function(err) {
            formatAppLog("log", "at pages/map/map.nvue:37", err);
          }
        });
        formatAppLog("log", "at pages/map/map.nvue:40", "\u672C\u673A\u8BBE\u5907ID\uFF1A" + this.deviceId);
        tn.callFunction({
          name: "readUserData",
          data: {
            deviceID: this.deviceId
          }
        }).then((res) => {
          var data = res.result.data;
          var readDeviceID = data[0].deviceID;
          formatAppLog("log", "at pages/map/map.nvue:50", "\u8BFB\u53D6\u8BBE\u5907ID\uFF1A" + readDeviceID);
          if (this.deviceId == readDeviceID) {
            uni.getLocation({
              type: "gcj02",
              isHighAccuracy: true,
              success: function(res2) {
                that.latitude = res2.latitude;
                that.longitude = res2.longitude;
                formatAppLog("log", "at pages/map/map.nvue:58", res2);
                that.markers = [{
                  id: 0,
                  latitude: res2.latitude,
                  longitude: res2.longitude,
                  iconPath: "/static/location.png"
                }], that.circles = [{
                  latitude: res2.latitude,
                  longitude: res2.longitude,
                  color: "#A7B6CB",
                  radius: 30,
                  strokeWidth: 5
                }];
              },
              fail: function(err) {
                formatAppLog("log", "at pages/map/map.nvue:75", err);
              }
            });
            formatAppLog("log", "at pages/map/map.nvue:78", "\u5F53\u524D\u7EAC\u5EA6\uFF1A" + this.latitude);
            formatAppLog("log", "at pages/map/map.nvue:79", "\u5F53\u524D\u7ECF\u5EA6\uFF1A" + this.longitude);
            tn.callFunction({
              name: "insertPositionData",
              data: {
                deviceID: this.deviceId,
                latitude: this.latitude,
                longitude: this.longitude,
                createTime: time.now()
              }
            }).then((res2) => {
              formatAppLog("log", "at pages/map/map.nvue:90", res2);
            }).catch((err) => {
              formatAppLog("log", "at pages/map/map.nvue:92", err);
            });
          }
        }).catch((err) => {
          uni.hideLoading();
          uni.showModal({
            content: "\u8BF7\u5148\u6CE8\u518C",
            showCancel: false
          });
          formatAppLog("log", "at pages/map/map.nvue:101", err);
        });
      }
    },
    inputmobile: function(e) {
      this.mobile = e.detail.value;
    },
    getRemoteInfo() {
      tn.callFunction({
        name: "readUserData",
        data: {
          mobile: this.mobile
        }
      }).then((res) => {
        var data = res.result.data;
        this.deviceID = data[0].deviceID;
        formatAppLog("log", "at pages/map/map.nvue:120", "\u8BFB\u53D6\u8BBE\u5907ID\uFF1A" + this.deviceID);
        tn.callFunction({
          name: "readPositionData",
          data: {
            deviceID: this.deviceID
          }
        }).then((res2) => {
          var data2 = res2.result.data;
          formatAppLog("log", "at pages/map/map.nvue:129", res2);
          const latitude = data2[0].latitude;
          const longitude = data2[0].longitude;
          formatAppLog("log", "at pages/map/map.nvue:132", "\u5F53\u524D\u7EAC\u5EA6\uFF1A" + latitude);
          formatAppLog("log", "at pages/map/map.nvue:133", "\u5F53\u524D\u7ECF\u5EA6\uFF1A" + longitude);
          uni.openLocation({
            latitude,
            longitude,
            success: function(res3) {
              formatAppLog("log", "at pages/map/map.nvue:138", res3);
            },
            fail: function(err) {
              formatAppLog("log", "at pages/map/map.nvue:141", err);
            }
          });
        }).catch((err) => {
          formatAppLog("log", "at pages/map/map.nvue:145", err);
        });
      }).catch((err) => {
        uni.hideLoading();
        uni.showModal({
          content: "\u65E0\u6B64\u624B\u673A\u53F7",
          showCancel: false
        });
        formatAppLog("log", "at pages/map/map.nvue:153", err);
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_switch = resolveComponent("switch");
  const _component_button = resolveComponent("button");
  return openBlock(), createElementBlock("scroll-view", {
    scrollY: true,
    showScrollbar: true,
    enableBackToTop: true,
    bubble: "true",
    style: { flexDirection: "column" }
  }, [
    createElementVNode("view", { class: "form" }, [
      createElementVNode("view", { class: "uni-list" }, [
        createElementVNode("view", { class: "uni-list-cell" }, [
          createElementVNode("view", { class: "uni-list-cell-db" }, [
            createElementVNode("u-text", null, "\u540E\u53F0\u5B9A\u4F4D")
          ]),
          createVNode(_component_switch, {
            type: "switch",
            onChange: $options.switchChange
          }, null, 8, ["onChange"])
        ]),
        createElementVNode("view", { class: "inputWrapper" }, [
          createElementVNode("u-input", {
            class: "input",
            type: "number",
            onInput: _cache[0] || (_cache[0] = (...args) => $options.inputmobile && $options.inputmobile(...args)),
            maxlength: "11",
            value: "",
            placeholder: "\u8BF7\u8F93\u5165\u624B\u673A\u53F7"
          }, null, 32)
        ]),
        createElementVNode("view", { class: "uni-padding-wrap uni-common-mt" }, [
          createVNode(_component_button, {
            type: "primary",
            onClick: _cache[1] || (_cache[1] = ($event) => $options.getRemoteInfo())
          }, {
            default: withCtx(() => [
              createTextVNode("\u67E5\u770B\u4F4D\u7F6E")
            ]),
            _: 1
          })
        ])
      ])
    ])
  ]);
}
var map = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["styles", [_style_0]], ["__file", "D:/Coding/Positioning/pages/map/map.nvue"]]);
export { map as default };
