import { f as formatAppLog, t as tn } from "../../uni-cloud.es.js";
import { resolveComponent, openBlock, createElementBlock, createElementVNode, createVNode, withCtx, createTextVNode } from "vue";
import { _ as _export_sfc } from "../../plugin-vue_export-helper.js";
const position = function() {
  const that = this;
  uni.getSystemInfo({
    success: function(res) {
      that.deviceId = res.deviceId;
    },
    fail: function(err) {
      formatAppLog("log", "at common/getPosition.js:22", err);
    }
  });
  formatAppLog("log", "at common/getPosition.js:25", "\u672C\u673A\u8BBE\u5907ID\uFF1A" + this.deviceId);
  tn.callFunction({
    name: "readUserData",
    data: {
      deviceID: this.deviceId
    }
  }).then((res) => {
    var data = res.result.data;
    var readDeviceID = data[0].deviceID;
    formatAppLog("log", "at common/getPosition.js:35", "\u8BFB\u53D6\u8BBE\u5907ID\uFF1A" + readDeviceID);
    if (this.deviceId == readDeviceID) {
      const that2 = this;
      uni.getLocation({
        type: "gcj02",
        isHighAccuracy: true,
        success: function(res2) {
          that2.latitude = res2.latitude;
          that2.longitude = res2.longitude;
          formatAppLog("log", "at common/getPosition.js:44", res2);
          that2.markers = [{
            id: 0,
            latitude: res2.latitude,
            longitude: res2.longitude,
            iconPath: "/static/location.png"
          }], that2.circles = [{
            latitude: res2.latitude,
            longitude: res2.longitude,
            color: "#C0C0C0",
            radius: 30,
            strokeWidth: 5
          }];
        },
        fail: function(err) {
          formatAppLog("log", "at common/getPosition.js:61", err);
        }
      });
      formatAppLog("log", "at common/getPosition.js:64", "\u5F53\u524D\u7EAC\u5EA6\uFF1A" + this.latitude);
      formatAppLog("log", "at common/getPosition.js:65", "\u5F53\u524D\u7ECF\u5EA6\uFF1A" + this.longitude);
      tn.callFunction({
        name: "insertPositionData",
        data: {
          deviceID: this.deviceId,
          latitude: this.latitude,
          longitude: this.longitude,
          createTime: time.now()
        }
      }).then((res2) => {
        formatAppLog("log", "at common/getPosition.js:76", res2);
      }).catch((err) => {
        formatAppLog("log", "at common/getPosition.js:78", err);
      });
    }
  }).catch((err) => {
    uni.hideLoading();
    uni.showModal({
      content: "\u8BF7\u5148\u6CE8\u518C",
      showCancel: false
    });
    formatAppLog("log", "at common/getPosition.js:87", err);
  });
};
var get = {
  position
};
var _style_0 = { "form": { "": { "paddingTop": 0, "paddingRight": "100rpx", "paddingBottom": 0, "paddingLeft": "100rpx", "marginTop": 80 } }, "uni-list-cell-db": { "": { "marginTop": 10, "marginLeft": 15 } }, "uni-padding-wrap": { "": { "marginTop": "30rpx", "marginBottom": "30rpx", "marginLeft": "30rpx", "marginRight": "30rpx" } }, "inputWrapper": { "": { "width": 230, "height": 50, "backgroundColor": "#C0C0C0", "borderRadius": 20, "paddingTop": 0, "paddingRight": 20, "paddingBottom": 0, "paddingLeft": 20, "marginTop": "30rpx", "marginBottom": "10rpx", "marginLeft": "30rpx", "marginRight": "50rpx" } }, "input": { ".inputWrapper ": { "width": 200, "height": 50, "textAlign": "center", "fontSize": 15 } } };
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
        timer = setInterval(get.getPosition, 5e4);
        formatAppLog("log", "at pages/map/map.nvue:32", "\u542F\u52A8\u5FAA\u73AF,\u5FAA\u73AFID: " + timer);
        return timer;
      } else {
        formatAppLog("log", "at pages/map/map.nvue:35", "\u7ED3\u675F\u5FAA\u73AF,\u5FAA\u73AFID: " + timer);
        clearInterval(timer);
      }
    },
    inputmobile: function(e) {
      this.mobile = e.detail.value;
    },
    getRemoteInfo() {
      if (this.mobile == null || this.mobile == "") {
        uni.hideLoading();
        uni.showModal({
          content: "\u4E0D\u80FD\u4E3A\u7A7A",
          showCancel: false
        });
      } else {
        tn.callFunction({
          name: "readUserData",
          data: {
            mobile: this.mobile
          }
        }).then((res) => {
          var data = res.result.data;
          this.deviceID = data[0].deviceID;
          tn.callFunction({
            name: "readPositionData",
            data: {
              deviceID: this.deviceID
            }
          }).then((res2) => {
            var data2 = res2.result.data;
            formatAppLog("log", "at pages/map/map.nvue:69", res2);
            const latitude = data2[0].latitude;
            const longitude = data2[0].longitude;
            formatAppLog("log", "at pages/map/map.nvue:72", "\u5F53\u524D\u7EAC\u5EA6\uFF1A" + latitude);
            formatAppLog("log", "at pages/map/map.nvue:73", "\u5F53\u524D\u7ECF\u5EA6\uFF1A" + longitude);
            uni.openLocation({
              latitude,
              longitude,
              success: function(res3) {
                formatAppLog("log", "at pages/map/map.nvue:78", res3);
              },
              fail: function(err) {
                formatAppLog("log", "at pages/map/map.nvue:81", err);
              }
            });
          }).catch((err) => {
            formatAppLog("log", "at pages/map/map.nvue:85", err);
          });
        }).catch((err) => {
          uni.hideLoading();
          uni.showModal({
            content: "\u65E0\u6B64\u624B\u673A\u53F7",
            showCancel: false
          });
          formatAppLog("log", "at pages/map/map.nvue:93", err);
        });
      }
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
            createElementVNode("u-text", null, "\u540E\u53F0\u5B9A\u4F4D "),
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
    ])
  ]);
}
var map = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["styles", [_style_0]], ["__file", "D:/Coding/Positioning/pages/map/map.nvue"]]);
export { map as default };
