import { f as formatAppLog, t as tn, a as time } from "../../time.js";
import { resolveComponent, openBlock, createElementBlock, createElementVNode, normalizeStyle, createVNode, withCtx, createTextVNode } from "vue";
import { _ as _export_sfc } from "../../plugin-vue_export-helper.js";
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
      uni.getSystemInfo({
        success: function(res) {
          that.deviceId = res.deviceId;
        },
        fail: function(err) {
          formatAppLog("log", "at pages/index/index.nvue:44", err);
        }
      });
      formatAppLog("log", "at pages/index/index.nvue:47", "\u672C\u673A\u8BBE\u5907ID\uFF1A" + this.deviceId);
      tn.callFunction({
        name: "readUserData",
        data: {
          deviceID: this.deviceId
        }
      }).then((res) => {
        var data = res.result.data;
        var readDeviceID = data[0].deviceID;
        formatAppLog("log", "at pages/index/index.nvue:57", "\u8BFB\u53D6\u8BBE\u5907ID\uFF1A" + readDeviceID);
        if (this.deviceId == readDeviceID) {
          uni.getLocation({
            type: "gcj02",
            isHighAccuracy: true,
            success: function(res2) {
              that.latitude = res2.latitude;
              that.longitude = res2.longitude;
              formatAppLog("log", "at pages/index/index.nvue:65", res2);
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
              formatAppLog("log", "at pages/index/index.nvue:82", err);
            }
          });
          formatAppLog("log", "at pages/index/index.nvue:85", "\u5F53\u524D\u7EAC\u5EA6\uFF1A" + this.latitude);
          formatAppLog("log", "at pages/index/index.nvue:86", "\u5F53\u524D\u7ECF\u5EA6\uFF1A" + this.longitude);
          tn.callFunction({
            name: "insertPositionData",
            data: {
              deviceID: this.deviceId,
              latitude: this.latitude,
              longitude: this.longitude,
              createTime: time.now()
            }
          }).then((res2) => {
            formatAppLog("log", "at pages/index/index.nvue:97", res2);
          }).catch((err) => {
            formatAppLog("log", "at pages/index/index.nvue:99", err);
          });
        }
      }).catch((err) => {
        uni.hideLoading();
        uni.showModal({
          content: "\u8BF7\u5148\u6CE8\u518C",
          showCancel: false
        });
        formatAppLog("log", "at pages/index/index.nvue:108", err);
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
