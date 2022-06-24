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


(()=>{var h=Object.create;var p=Object.defineProperty;var y=Object.getOwnPropertyDescriptor;var x=Object.getOwnPropertyNames;var b=Object.getPrototypeOf,w=Object.prototype.hasOwnProperty;var N=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var S=(t,e,n,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of x(e))!w.call(t,o)&&o!==n&&p(t,o,{get:()=>e[o],enumerable:!(i=y(e,o))||i.enumerable});return t};var k=(t,e,n)=>(n=t!=null?h(b(t)):{},S(e||!t||!t.__esModule?p(n,"default",{value:t,enumerable:!0}):n,t));var m=N((T,_)=>{_.exports=Vue});var E=Object.prototype.toString,d=t=>E.call(t),g=t=>d(t).slice(8,-1);function L(){return typeof __channelId__=="string"&&__channelId__}function B(t,e){switch(g(e)){case"Function":return"function() { [native code] }";default:return e}}function I(t,e,n){return L()?(n.push(e.replace("at ","uni-app:///")),console[t].apply(console,n)):n.map(function(o){let l=d(o).toLowerCase();if(["[object object]","[object array]","[object module]"].indexOf(l)!==-1)try{o="---BEGIN:JSON---"+JSON.stringify(o,B)+"---END:JSON---"}catch(s){o=l}else if(o===null)o="---NULL---";else if(o===void 0)o="---UNDEFINED---";else{let s=g(o).toUpperCase();s==="NUMBER"||s==="BOOLEAN"?o="---BEGIN:"+s+"---"+o+"---END:"+s+"---":o=String(o)}return o}).join("---COMMA---")+" "+e}function c(t,e,...n){let i=I(t,e,n);i&&console[t](i)}var f=(t,e)=>{let n=t.__vccOpts||t;for(let[i,o]of e)n[i]=o;return n};var r=k(m()),O={content:{"":{flex:1}},map:{"":{width:"750rpx",height:250,backgroundColor:"#f0f0f0"}}},j={data(){return{latitude:"",longitude:"",markers:[],circles:[]}},onLoad(){let t=this;uni.getSystemInfo({success:e=>{t.mapHeight=e.screenHeight-e.statusBarHeight,t.mapHeight=t.mapHeight}})},methods:{getLocationInfo(){let t=this;uni.getLocation({type:"wgs84",geocode:!0,success:function(e){t.latitude=e.latitude,t.longitude=e.longitude,c("log","at pages/index/index.nvue:39",e.latitude),c("log","at pages/index/index.nvue:40",e.longitude),t.markers=[{id:1,latitude:e.latitude,longitude:e.longitude,iconPath:"../../../static/img/pos.png"}],t.circles=[{latitude:e.latitude,longitude:e.longitude,fillColor:"#D9E6EF",color:"#A7B6CB",radius:50,strokeWidth:2}]},fail:function(e){c("log","at pages/index/index.nvue:58",e)}})}}};function A(t,e,n,i,o,l){return(0,r.openBlock)(),(0,r.createElementBlock)("scroll-view",{scrollY:!0,showScrollbar:!0,enableBackToTop:!0,bubble:"true",style:{flexDirection:"column"}},[(0,r.createElementVNode)("view",{class:"content"},[(0,r.createElementVNode)("map",{scale:18,onUpdated:e[0]||(e[0]=s=>l.getLocationInfo()),style:(0,r.normalizeStyle)([{width:"100%"},{height:t.mapHeight+"px"}]),longitude:o.longitude,latitude:o.latitude,markers:o.markers,circles:o.circles},null,44,["longitude","latitude","markers","circles"])])])}var a=f(j,[["render",A],["styles",[O]]]);var u=plus.webview.currentWebview();if(u){let t=parseInt(u.id),e="pages/index/index",n={};try{n=JSON.parse(u.__query__)}catch(o){}a.mpType="page";let i=Vue.createPageApp(a,{$store:getApp({allowDefault:!0}).$store,__pageId:t,__pagePath:e,__pageQuery:n});i.provide("__globalStyles",Vue.useCssStyles([...__uniConfig.styles,...a.styles||[]])),i.mount("#root")}})();
