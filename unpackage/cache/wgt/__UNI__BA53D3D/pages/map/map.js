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


(()=>{var m=Object.create;var i=Object.defineProperty;var _=Object.getOwnPropertyDescriptor;var g=Object.getOwnPropertyNames;var d=Object.getPrototypeOf,f=Object.prototype.hasOwnProperty;var h=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var y=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of g(t))!f.call(e,s)&&s!==r&&i(e,s,{get:()=>t[s],enumerable:!(a=_(t,s))||a.enumerable});return e};var v=(e,t,r)=>(r=e!=null?m(d(e)):{},y(t||!e||!e.__esModule?i(r,"default",{value:e,enumerable:!0}):r,e));var c=h(($,n)=>{n.exports=Vue});var o=v(c());var u=(e,t)=>{let r=e.__vccOpts||e;for(let[a,s]of t)r[a]=s;return r};var w={content:{"":{flex:1}},map:{"":{width:"750rpx",height:250,backgroundColor:"#f0f0f0"}}},b={onLoad(){let e=this;uni.getSystemInfo({success:t=>{e.mapHeight=t.screenHeight-t.statusBarHeight,e.mapHeight=e.mapHeight}})}};function k(e,t,r,a,s,H){return(0,o.openBlock)(),(0,o.createElementBlock)("scroll-view",{scrollY:!0,showScrollbar:!0,enableBackToTop:!0,bubble:"true",style:{flexDirection:"column"}},[(0,o.createElementVNode)("view",{class:"content"},[(0,o.createElementVNode)("map",{scale:18,id:"myMap",style:(0,o.normalizeStyle)([{width:"100%"},{height:e.mapHeight+"px"}]),markers:e.markers,longitude:e.longitude,latitude:e.latitude,circles:e.circles},null,12,["markers","longitude","latitude","circles"])])])}var l=u(b,[["render",k],["styles",[w]]]);var p=plus.webview.currentWebview();if(p){let e=parseInt(p.id),t="pages/map/map",r={};try{r=JSON.parse(p.__query__)}catch(s){}l.mpType="page";let a=Vue.createPageApp(l,{$store:getApp({allowDefault:!0}).$store,__pageId:e,__pagePath:t,__pageQuery:r});a.provide("__globalStyles",Vue.useCssStyles([...__uniConfig.styles,...l.styles||[]])),a.mount("#root")}})();
