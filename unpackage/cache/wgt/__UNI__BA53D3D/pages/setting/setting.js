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


(()=>{var f=Object.create;var p=Object.defineProperty;var v=Object.getOwnPropertyDescriptor;var d=Object.getOwnPropertyNames;var m=Object.getPrototypeOf,w=Object.prototype.hasOwnProperty;var b=(t,o)=>()=>(o||t((o={exports:{}}).exports,o),o.exports);var y=(t,o,r,s)=>{if(o&&typeof o=="object"||typeof o=="function")for(let a of d(o))!w.call(t,a)&&a!==r&&p(t,a,{get:()=>o[a],enumerable:!(s=v(o,a))||s.enumerable});return t};var h=(t,o,r)=>(r=t!=null?f(m(t)):{},y(o||!t||!t.__esModule?p(r,"default",{value:t,enumerable:!0}):r,t));var _=b((k,i)=>{i.exports=Vue});var e=h(_());var g=(t,o)=>{let r=t.__vccOpts||t;for(let[s,a]of o)r[s]=a;return r};var x={data(){return{}},onLoad(){},methods:{}};function C(t,o,r,s,a,V){let c=(0,e.resolveComponent)("button"),l=(0,e.resolveComponent)("navigator");return(0,e.openBlock)(),(0,e.createElementBlock)("scroll-view",{scrollY:!0,showScrollbar:!0,enableBackToTop:!0,bubble:"true",style:{flexDirection:"column"}},[(0,e.createElementVNode)("view",null,[(0,e.createElementVNode)("view",{class:"uni-padding-wrap uni-common-mt"},[(0,e.createElementVNode)("view",{class:"uni-btn-v"},[(0,e.createVNode)(l,{url:"/pages/setting/register/register","hover-class":"navigator-hover"},{default:(0,e.withCtx)(()=>[(0,e.createVNode)(c,{type:"default"},{default:(0,e.withCtx)(()=>[(0,e.createTextVNode)("\u6CE8\u518C\u7528\u6237")]),_:1})]),_:1}),(0,e.createVNode)(l,{url:"/pages/setting/confirm/confirm","hover-class":"navigator-hover"},{default:(0,e.withCtx)(()=>[(0,e.createVNode)(c,{type:"default"},{default:(0,e.withCtx)(()=>[(0,e.createTextVNode)("\u67E5\u770B\u7528\u6237")]),_:1})]),_:1})])])])])}var n=g(x,[["render",C]]);var u=plus.webview.currentWebview();if(u){let t=parseInt(u.id),o="pages/setting/setting",r={};try{r=JSON.parse(u.__query__)}catch(a){}n.mpType="page";let s=Vue.createPageApp(n,{$store:getApp({allowDefault:!0}).$store,__pageId:t,__pagePath:o,__pageQuery:r});s.provide("__globalStyles",Vue.useCssStyles([...__uniConfig.styles,...n.styles||[]])),s.mount("#root")}})();
