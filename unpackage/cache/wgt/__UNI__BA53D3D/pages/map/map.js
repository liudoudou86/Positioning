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


(()=>{var _=Object.create;var p=Object.defineProperty;var m=Object.getOwnPropertyDescriptor;var g=Object.getOwnPropertyNames;var f=Object.getPrototypeOf,h=Object.prototype.hasOwnProperty;var d=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var y=(e,t,s,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of g(t))!h.call(e,r)&&r!==s&&p(e,r,{get:()=>t[r],enumerable:!(a=m(t,r))||a.enumerable});return e};var v=(e,t,s)=>(s=e!=null?_(f(e)):{},y(t||!e||!e.__esModule?p(s,"default",{value:e,enumerable:!0}):s,e));var n=d((S,i)=>{i.exports=Vue});var o=v(n());var u=(e,t)=>{let s=e.__vccOpts||e;for(let[a,r]of t)s[a]=r;return s};var w={content:{"":{flex:1}},map:{"":{width:"750rpx",height:250,backgroundColor:"#f0f0f0"}}},b={data(){return{latitude:39.9,longitude:116.4,markers:[],circles:[]}},onLoad(){let e=this;uni.getSystemInfo({success:t=>{e.mapHeight=t.screenHeight-t.statusBarHeight,e.mapHeight=e.mapHeight}})},methods:{}};function k(e,t,s,a,r,x){return(0,o.openBlock)(),(0,o.createElementBlock)("scroll-view",{scrollY:!0,showScrollbar:!0,enableBackToTop:!0,bubble:"true",style:{flexDirection:"column"}},[(0,o.createElementVNode)("view",{class:"content"},[(0,o.createElementVNode)("map",{scale:18,style:(0,o.normalizeStyle)([{width:"100%"},{height:e.mapHeight+"px"}]),longitude:r.longitude,latitude:r.latitude,markers:r.markers,circles:r.circles},null,12,["longitude","latitude","markers","circles"])])])}var l=u(b,[["render",k],["styles",[w]]]);var c=plus.webview.currentWebview();if(c){let e=parseInt(c.id),t="pages/map/map",s={};try{s=JSON.parse(c.__query__)}catch(r){}l.mpType="page";let a=Vue.createPageApp(l,{$store:getApp({allowDefault:!0}).$store,__pageId:e,__pagePath:t,__pageQuery:s});a.provide("__globalStyles",Vue.useCssStyles([...__uniConfig.styles,...l.styles||[]])),a.mount("#root")}})();
