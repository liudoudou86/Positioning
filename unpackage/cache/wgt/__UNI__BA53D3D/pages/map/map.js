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


(()=>{var _=Object.create;var i=Object.defineProperty;var m=Object.getOwnPropertyDescriptor;var g=Object.getOwnPropertyNames;var d=Object.getPrototypeOf,h=Object.prototype.hasOwnProperty;var f=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var y=(e,t,o,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of g(t))!h.call(e,r)&&r!==o&&i(e,r,{get:()=>t[r],enumerable:!(a=m(t,r))||a.enumerable});return e};var v=(e,t,o)=>(o=e!=null?_(d(e)):{},y(t||!e||!e.__esModule?i(o,"default",{value:e,enumerable:!0}):o,e));var c=f((S,p)=>{p.exports=Vue});var s=v(c());var u=(e,t)=>{let o=e.__vccOpts||e;for(let[a,r]of t)o[a]=r;return o};var w={content:{"":{flex:1}}},b={data(){return{latitude:39.54,longitude:116.23,markers:[{id:0,latitude:39.54,longitude:116.23,iconPath:"/static/location.png"}]}},onLoad(){let e=this;uni.getSystemInfo({success:t=>{e.mapHeight=t.screenHeight-t.statusBarHeight,e.mapHeight=e.mapHeight}})},methods:{}};function k(e,t,o,a,r,x){return(0,s.openBlock)(),(0,s.createElementBlock)("scroll-view",{scrollY:!0,showScrollbar:!0,enableBackToTop:!0,bubble:"true",style:{flexDirection:"column"}},[(0,s.createElementVNode)("view",{class:"content"},[(0,s.createElementVNode)("map",{scale:18,style:(0,s.normalizeStyle)([{width:"100%"},{height:e.mapHeight+"px"}]),longitude:r.longitude,latitude:r.latitude,markers:r.markers},null,12,["longitude","latitude","markers"])])])}var l=u(b,[["render",k],["styles",[w]]]);var n=plus.webview.currentWebview();if(n){let e=parseInt(n.id),t="pages/map/map",o={};try{o=JSON.parse(n.__query__)}catch(r){}l.mpType="page";let a=Vue.createPageApp(l,{$store:getApp({allowDefault:!0}).$store,__pageId:e,__pagePath:t,__pageQuery:o});a.provide("__globalStyles",Vue.useCssStyles([...__uniConfig.styles,...l.styles||[]])),a.mount("#root")}})();
