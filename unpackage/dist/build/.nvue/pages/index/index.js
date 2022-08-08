import { f as formatAppLog, r as rn } from "../../uni-cloud.es.js";
import { resolveComponent, openBlock, createElementBlock, createElementVNode, normalizeStyle, createVNode, withCtx, createTextVNode } from "vue";
import { _ as _export_sfc } from "../../plugin-vue_export-helper.js";
const now = function() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var timer = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  return timer;
};
var time = {
  now
};
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
          formatAppLog("log", "at pages/index/index.nvue:45", err);
        }
      });
      formatAppLog("log", "at pages/index/index.nvue:48", "\u672C\u673A\u8BBE\u5907ID\uFF1A" + this.deviceId);
      rn.callFunction({
        name: "readUserData",
        data: {
          deviceID: this.deviceId
        }
      }).then((res) => {
        var thisdeviceID = this.deviceId;
        var data = res.result.data;
        var readDeviceID = data[0].deviceID;
        formatAppLog("log", "at pages/index/index.nvue:59", "\u8BFB\u53D6\u8BBE\u5907ID\uFF1A" + readDeviceID);
        if (thisdeviceID === readDeviceID) {
          uni.getLocation({
            type: "gcj02",
            isHighAccuracy: true,
            success: function(res2) {
              that.latitude = res2.latitude;
              that.longitude = res2.longitude;
              formatAppLog("log", "at pages/index/index.nvue:67", "\u5F53\u524D\u7EAC\u5EA6\uFF1A" + that.latitude);
              formatAppLog("log", "at pages/index/index.nvue:68", "\u5F53\u524D\u7ECF\u5EA6\uFF1A" + that.longitude);
              if (that.latitude != null && that.longitude != null) {
                rn.callFunction({
                  name: "insertPositionData",
                  data: {
                    deviceID: thisdeviceID,
                    latitude: that.latitude,
                    longitude: that.longitude,
                    createTime: time.now()
                  }
                }).then((res3) => {
                }).catch((err) => {
                  formatAppLog("log", "at pages/index/index.nvue:82", err);
                });
                that.markers = [{
                  id: 0,
                  latitude: res2.latitude,
                  longitude: res2.longitude,
                  iconPath: "/static/location.png"
                }], that.circles = [{
                  latitude: res2.latitude,
                  longitude: res2.longitude,
                  color: "#C0C0C0",
                  radius: 30,
                  strokeWidth: 5
                }];
              }
            },
            fail: function(err) {
              formatAppLog("log", "at pages/index/index.nvue:101", err);
            }
          });
        }
      }).catch((err) => {
        uni.hideLoading();
        uni.showModal({
          content: "\u8BF7\u5148\u6CE8\u518C",
          showCancel: false
        });
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
