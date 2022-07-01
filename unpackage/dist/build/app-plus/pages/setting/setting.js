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


(()=>{var m=Object.create;var c=Object.defineProperty;var v=Object.getOwnPropertyDescriptor;var d=Object.getOwnPropertyNames;var f=Object.getPrototypeOf,w=Object.prototype.hasOwnProperty;var b=(t,o)=>()=>(o||t((o={exports:{}}).exports,o),o.exports);var y=(t,o,r,a)=>{if(o&&typeof o=="object"||typeof o=="function")for(let s of d(o))!w.call(t,s)&&s!==r&&c(t,s,{get:()=>o[s],enumerable:!(a=v(o,s))||a.enumerable});return t};var x=(t,o,r)=>(r=t!=null?m(f(t)):{},y(o||!t||!t.__esModule?c(r,"default",{value:t,enumerable:!0}):r,t));var u=b((k,l)=>{l.exports=Vue});var e=x(u());var i=(t,o)=>{let r=t.__vccOpts||t;for(let[a,s]of o)r[a]=s;return r};var h={data(){return{}},onLoad(){},methods:{}};function C(t,o,r,a,s,V){let _=(0,e.resolveComponent)("button"),g=(0,e.resolveComponent)("navigator");return(0,e.openBlock)(),(0,e.createElementBlock)("scroll-view",{scrollY:!0,showScrollbar:!0,enableBackToTop:!0,bubble:"true",style:{flexDirection:"column"}},[(0,e.createElementVNode)("view",null,[(0,e.createElementVNode)("view",{class:"uni-padding-wrap uni-common-mt"},[(0,e.createElementVNode)("view",{class:"uni-btn-v"},[(0,e.createVNode)(g,{url:"/pages/setting/register/register","hover-class":"navigator-hover"},{default:(0,e.withCtx)(()=>[(0,e.createVNode)(_,{type:"default"},{default:(0,e.withCtx)(()=>[(0,e.createTextVNode)("\u6CE8\u518C\u7528\u6237")]),_:1})]),_:1})])])])])}var n=i(h,[["render",C]]);var p=plus.webview.currentWebview();if(p){let t=parseInt(p.id),o="pages/setting/setting",r={};try{r=JSON.parse(p.__query__)}catch(s){}n.mpType="page";let a=Vue.createPageApp(n,{$store:getApp({allowDefault:!0}).$store,__pageId:t,__pagePath:o,__pageQuery:r});a.provide("__globalStyles",Vue.useCssStyles([...__uniConfig.styles,...n.styles||[]])),a.mount("#root")}})();
