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


(()=>{var m=Object.create;var u=Object.defineProperty;var h=Object.getOwnPropertyDescriptor;var y=Object.getOwnPropertyNames;var b=Object.getPrototypeOf,w=Object.prototype.hasOwnProperty;var x=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var N=(e,t,n,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of y(t))!w.call(e,o)&&o!==n&&u(e,o,{get:()=>t[o],enumerable:!(i=h(t,o))||i.enumerable});return e};var S=(e,t,n)=>(n=e!=null?m(b(e)):{},N(t||!e||!e.__esModule?u(n,"default",{value:e,enumerable:!0}):n,e));var d=x((C,p)=>{p.exports=Vue});var r=S(d());var g=(e,t)=>{let n=e.__vccOpts||e;for(let[i,o]of t)n[i]=o;return n};var E=Object.prototype.toString,f=e=>E.call(e),_=e=>f(e).slice(8,-1);function k(){return typeof __channelId__=="string"&&__channelId__}function B(e,t){switch(_(t)){case"Function":return"function() { [native code] }";default:return t}}function D(e,t,n){return k()?(n.push(t.replace("at ","uni-app:///")),console[e].apply(console,n)):n.map(function(o){let l=f(o).toLowerCase();if(["[object object]","[object array]","[object module]"].indexOf(l)!==-1)try{o="---BEGIN:JSON---"+JSON.stringify(o,B)+"---END:JSON---"}catch(s){o=l}else if(o===null)o="---NULL---";else if(o===void 0)o="---UNDEFINED---";else{let s=_(o).toUpperCase();s==="NUMBER"||s==="BOOLEAN"?o="---BEGIN:"+s+"---"+o+"---END:"+s+"---":o=String(o)}return o}).join("---COMMA---")+" "+t}function O(e,t,...n){let i=D(e,t,n);i&&console[e](i)}var I={content:{"":{flex:1}},map:{"":{width:"750rpx",height:250,backgroundColor:"#f0f0f0"}}},L={data(){return{latitude:39.9,longitude:116.4,circles:[],markers:[]}},onLoad(){let e=this;uni.getSystemInfo({success:t=>{e.mapHeight=t.screenHeight-t.statusBarHeight,e.mapHeight=e.mapHeight}})},methods:{getLocationInfo(){let e=this;uni.getLocation({type:"wgs84",success:function(t){O("log","at pages/index/index.nvue:37","\u5F53\u524D\u4F4D\u7F6E\uFF1A"+t),e.latitude=t.latitude,e.longitude=t.longitude,e.markers=[{id:1,latitude:t.latitude,longitude:t.longitude,iconPath:"/static/location.png"}],e.circles=[{latitude:t.latitude,longitude:t.longitude,fillColor:"#D9E6EF",color:"#A7B6CB",radius:50,strokeWidth:2}]}})}}};function j(e,t,n,i,o,l){return(0,r.openBlock)(),(0,r.createElementBlock)("scroll-view",{scrollY:!0,showScrollbar:!0,enableBackToTop:!0,bubble:"true",style:{flexDirection:"column"}},[(0,r.createElementVNode)("view",{class:"content"},[(0,r.createElementVNode)("map",{scale:18,id:"myMap",style:(0,r.normalizeStyle)([{width:"100%"},{height:e.mapHeight+"px"}]),markers:o.markers,longitude:o.longitude,latitude:o.latitude,circles:o.circles},null,12,["markers","longitude","latitude","circles"])])])}var c=g(L,[["render",j],["styles",[I]]]);var a=plus.webview.currentWebview();if(a){let e=parseInt(a.id),t="pages/index/index",n={};try{n=JSON.parse(a.__query__)}catch(o){}c.mpType="page";let i=Vue.createPageApp(c,{$store:getApp({allowDefault:!0}).$store,__pageId:e,__pagePath:t,__pageQuery:n});i.provide("__globalStyles",Vue.useCssStyles([...__uniConfig.styles,...c.styles||[]])),i.mount("#root")}})();
