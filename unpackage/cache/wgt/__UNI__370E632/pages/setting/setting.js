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


(()=>{var m=Object.create;var l=Object.defineProperty;var v=Object.getOwnPropertyDescriptor;var f=Object.getOwnPropertyNames;var d=Object.getPrototypeOf,x=Object.prototype.hasOwnProperty;var y=(t,r)=>()=>(r||t((r={exports:{}}).exports,r),r.exports);var b=(t,r,o,n)=>{if(r&&typeof r=="object"||typeof r=="function")for(let a of f(r))!x.call(t,a)&&a!==o&&l(t,a,{get:()=>r[a],enumerable:!(n=v(r,a))||n.enumerable});return t};var w=(t,r,o)=>(o=t!=null?m(d(t)):{},b(r||!t||!t.__esModule?l(o,"default",{value:t,enumerable:!0}):o,t));var _=y(($,c)=>{c.exports=Vue});var e=w(_());var g=(t,r)=>{let o=t.__vccOpts||t;for(let[n,a]of r)o[n]=a;return o};var h={"uni-btn-v":{"":{marginTop:"50rpx",marginBottom:"50rpx",marginLeft:"50rpx",marginRight:"50rpx"}},"navigator-hover":{"":{marginTop:"50rpx",marginBottom:"50rpx"}}},B={data(){return{}},onLoad(){},methods:{}};function C(t,r,o,n,a,T){let i=(0,e.resolveComponent)("button"),u=(0,e.resolveComponent)("navigator");return(0,e.openBlock)(),(0,e.createElementBlock)("scroll-view",{scrollY:!0,showScrollbar:!0,enableBackToTop:!0,bubble:"true",style:{flexDirection:"column"}},[(0,e.createElementVNode)("view",null,[(0,e.createElementVNode)("view",{class:"uni-padding-wrap uni-common-mt"},[(0,e.createElementVNode)("view",{class:"uni-btn-v"},[(0,e.createVNode)(u,{url:"/pages/setting/register/register","hover-class":"navigator-hover"},{default:(0,e.withCtx)(()=>[(0,e.createVNode)(i,{type:"default"},{default:(0,e.withCtx)(()=>[(0,e.createTextVNode)("\u6CE8\u518C\u7528\u6237")]),_:1})]),_:1}),(0,e.createVNode)(u,{url:"/pages/setting/confirm/confirm","hover-class":"navigator-hover"},{default:(0,e.withCtx)(()=>[(0,e.createVNode)(i,{type:"default"},{default:(0,e.withCtx)(()=>[(0,e.createTextVNode)("\u67E5\u770B\u7528\u6237")]),_:1})]),_:1})])])])])}var s=g(B,[["render",C],["styles",[h]]]);var p=plus.webview.currentWebview();if(p){let t=parseInt(p.id),r="pages/setting/setting",o={};try{o=JSON.parse(p.__query__)}catch(a){}s.mpType="page";let n=Vue.createPageApp(s,{$store:getApp({allowDefault:!0}).$store,__pageId:t,__pagePath:r,__pageQuery:o});n.provide("__globalStyles",Vue.useCssStyles([...__uniConfig.styles,...s.styles||[]])),n.mount("#root")}})();
