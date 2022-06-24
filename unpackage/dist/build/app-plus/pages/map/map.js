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


(()=>{var h=Object.create;var u=Object.defineProperty;var y=Object.getOwnPropertyDescriptor;var b=Object.getOwnPropertyNames;var w=Object.getPrototypeOf,N=Object.prototype.hasOwnProperty;var S=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var k=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of b(t))!N.call(e,o)&&o!==r&&u(e,o,{get:()=>t[o],enumerable:!(n=y(t,o))||n.enumerable});return e};var E=(e,t,r)=>(r=e!=null?h(w(e)):{},k(t||!e||!e.__esModule?u(r,"default",{value:e,enumerable:!0}):r,e));var m=S((T,_)=>{_.exports=Vue});var j=Object.prototype.toString,p=e=>j.call(e),g=e=>p(e).slice(8,-1);function x(){return typeof __channelId__=="string"&&__channelId__}function B(e,t){switch(g(t)){case"Function":return"function() { [native code] }";default:return t}}function O(e,t,r){return x()?(r.push(t.replace("at ","uni-app:///")),console[e].apply(console,r)):r.map(function(o){let c=p(o).toLowerCase();if(["[object object]","[object array]","[object module]"].indexOf(c)!==-1)try{o="---BEGIN:JSON---"+JSON.stringify(o,B)+"---END:JSON---"}catch(s){o=c}else if(o===null)o="---NULL---";else if(o===void 0)o="---UNDEFINED---";else{let s=g(o).toUpperCase();s==="NUMBER"||s==="BOOLEAN"?o="---BEGIN:"+s+"---"+o+"---END:"+s+"---":o=String(o)}return o}).join("---COMMA---")+" "+t}function d(e,t,...r){let n=O(e,t,r);n&&console[e](n)}var f=(e,t)=>{let r=e.__vccOpts||e;for(let[n,o]of t)r[n]=o;return r};var i=E(m()),L={content:{"":{flex:1}},map:{"":{width:"750rpx",height:250,backgroundColor:"#f0f0f0"}}},A={data(){return{latitude:"",longitude:"",markers:[],circles:[]}},onLoad(){let e=this;uni.getSystemInfo({success:t=>{e.mapHeight=t.screenHeight-t.statusBarHeight,e.mapHeight=e.mapHeight}}),uni.getLocation({type:"gcj02",success:function(t){d("log","at pages/map/map.nvue:31",t),that.latitude=t.latitude,that.longitude=t.longitude;var r={width:30,height:30,latitude:that.latitude,longitude:that.longitude,iconPath:"/static/location.png"},n=[];n.push(r),that.markers=n,that.circles=[{latitude:t.latitude,longitude:t.longitude,fillColor:"#D9E6EF",color:"#A7B6CB",radius:50,strokeWidth:2}]}})},methods:{}};function C(e,t,r,n,o,c){return(0,i.openBlock)(),(0,i.createElementBlock)("scroll-view",{scrollY:!0,showScrollbar:!0,enableBackToTop:!0,bubble:"true",style:{flexDirection:"column"}},[(0,i.createElementVNode)("view",{class:"content"},[(0,i.createElementVNode)("map",{scale:18,style:(0,i.normalizeStyle)([{width:"100%"},{height:e.mapHeight+"px"}]),longitude:o.longitude,latitude:o.latitude,markers:o.markers,circles:o.circles},null,12,["longitude","latitude","markers","circles"])])])}var a=f(A,[["render",C],["styles",[L]]]);var l=plus.webview.currentWebview();if(l){let e=parseInt(l.id),t="pages/map/map",r={};try{r=JSON.parse(l.__query__)}catch(o){}a.mpType="page";let n=Vue.createPageApp(a,{$store:getApp({allowDefault:!0}).$store,__pageId:e,__pagePath:t,__pageQuery:r});n.provide("__globalStyles",Vue.useCssStyles([...__uniConfig.styles,...a.styles||[]])),n.mount("#root")}})();
