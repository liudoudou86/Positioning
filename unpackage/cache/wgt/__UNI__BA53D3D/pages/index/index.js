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


(()=>{var h=Object.create;var u=Object.defineProperty;var x=Object.getOwnPropertyDescriptor;var b=Object.getOwnPropertyNames;var w=Object.getPrototypeOf,N=Object.prototype.hasOwnProperty;var S=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var E=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of b(e))!N.call(t,o)&&o!==n&&u(t,o,{get:()=>e[o],enumerable:!(r=x(e,o))||r.enumerable});return t};var k=(t,e,n)=>(n=t!=null?h(w(t)):{},E(e||!t||!t.__esModule?u(n,"default",{value:t,enumerable:!0}):n,t));var g=S((A,p)=>{p.exports=Vue});var i=k(g());var d=(t,e)=>{let n=t.__vccOpts||t;for(let[r,o]of e)n[r]=o;return n};var B=Object.prototype.toString,m=t=>B.call(t),_=t=>m(t).slice(8,-1);function L(){return typeof __channelId__=="string"&&__channelId__}function I(t,e){switch(_(e)){case"Function":return"function() { [native code] }";default:return e}}function C(t,e,n){return L()?(n.push(e.replace("at ","uni-app:///")),console[t].apply(console,n)):n.map(function(o){let c=m(o).toLowerCase();if(["[object object]","[object array]","[object module]"].indexOf(c)!==-1)try{o="---BEGIN:JSON---"+JSON.stringify(o,I)+"---END:JSON---"}catch(s){o=c}else if(o===null)o="---NULL---";else if(o===void 0)o="---UNDEFINED---";else{let s=_(o).toUpperCase();s==="NUMBER"||s==="BOOLEAN"?o="---BEGIN:"+s+"---"+o+"---END:"+s+"---":o=String(o)}return o}).join("---COMMA---")+" "+e}function f(t,e,...n){let r=C(t,e,n);r&&console[t](r)}var O={content:{"":{flex:1}},"uni-padding-wrap":{"":{marginTop:"30rpx",marginBottom:"30rpx",marginLeft:"30rpx",marginRight:"30rpx"}}},j={data(){return{latitude:39.54,longitude:116.23,markers:[],circles:[]}},onLoad(){let t=this;uni.getSystemInfo({success:e=>{t.mapHeight=e.screenHeight-e.statusBarHeight-150,t.mapHeight=t.mapHeight}})},methods:{getLocationInfo(){let t=this;uni.getLocation({type:"gcj02",isHighAccuracy:!0,success:function(e){t.latitude=e.latitude,t.longitude=e.longitude,f("log","at pages/index/index.nvue:42",e),t.markers=[{id:0,latitude:e.latitude,longitude:e.longitude,iconPath:"/static/location.png"}],t.circles=[{latitude:e.latitude,longitude:e.longitude,fillColor:"#D9E6EF",color:"#A7B6CB",radius:30,strokeWidth:3}]},fail:function(e){f("log","at pages/index/index.nvue:60",e)}})}}};function D(t,e,n,r,o,c){let s=(0,i.resolveComponent)("button");return(0,i.openBlock)(),(0,i.createElementBlock)("scroll-view",{scrollY:!0,showScrollbar:!0,enableBackToTop:!0,bubble:"true",style:{flexDirection:"column"}},[(0,i.createElementVNode)("view",{class:"content"},[(0,i.createElementVNode)("map",{scale:18,onUpdated:e[0]||(e[0]=y=>c.getLocationInfo()),style:(0,i.normalizeStyle)([{width:"100%"},{height:t.mapHeight+"px"}]),longitude:o.longitude,latitude:o.latitude,markers:o.markers,circles:o.circles},null,44,["longitude","latitude","markers","circles"])]),(0,i.createElementVNode)("view",{class:"uni-padding-wrap uni-common-mt"},[(0,i.createVNode)(s,{type:"primary",onClick:e[1]||(e[1]=y=>c.getLocationInfo())},{default:(0,i.withCtx)(()=>[(0,i.createTextVNode)("\u5237\u65B0\u4F4D\u7F6E")]),_:1})])])}var a=d(j,[["render",D],["styles",[O]]]);var l=plus.webview.currentWebview();if(l){let t=parseInt(l.id),e="pages/index/index",n={};try{n=JSON.parse(l.__query__)}catch(o){}a.mpType="page";let r=Vue.createPageApp(a,{$store:getApp({allowDefault:!0}).$store,__pageId:t,__pagePath:e,__pageQuery:n});r.provide("__globalStyles",Vue.useCssStyles([...__uniConfig.styles,...a.styles||[]])),r.mount("#root")}})();
