/*! For license information please see main.js.LICENSE.txt */
(()=>{var e={127:(e,t,n)=>{"use strict";n.d(t,{Z:()=>u});var r=n(645),i=n.n(r),o=n(667),a=n.n(o),s=new URL(n(433),n.b),l=i()((function(e){return e[1]})),c=a()(s);l.push([e.id,"*{\n    padding: 0;\n    margin: 0;\n    box-sizing:border-box;\n}\n\n#appCont{\n    \n    position:fixed;\n    display: flex;\n    flex-direction: row;\n    width: 100%;\n    height: 100%;\n    background:rgba(255,255,255,0.1);\n}\n\n#spann{\n    color:red;\n}\n#canvas-cont{\n    width: 100%;\n    height: calc(100% - 36px); /*because of tabs height*/\n    overflow: auto;\n    background-color: rgb(75, 75, 75);\n}\n#canvas{\n    overflow-x: auto;\n    display: block;\n    /* background-color: rgb(212, 90, 90); */\n\n}\n\n\n#cli-cont{\n    width: 100%;\n    height: 100%;   \n}\n\n\n#cli-textarea:focus{\n    outline: none;\n}\n#cli-textarea{\n    white-space: pre;\n    font-size: 14px;\n    line-height: em;\n    font-size: 1em;\n    white-space: nowrap;\n    overflow-x: auto;\n    resize: none;\n    width: 100%;\n    height: 100%; \n    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */\n    -moz-box-sizing: border-box;    /* Firefox, other Gecko */\n    box-sizing: border-box;         /* Opera/IE 8+ */\n    padding: 5px;\n}\n\n#error{\n    width: 100%;\n}\n\n.highLite,.highLite_err{\n    width: 100%;\n    height: 100%;\n    position: relative;\n    white-space: nowrap;\n    overflow-x: auto;\n    overflow-y: auto;\n  }\n  \n\n.highLite_colors,\n.highLite_editable,\n.highLite_colors_err {\n    width: 100%;\n    height: 100%;\n    outline: none;\n    padding: 10px;\n  }\n  \n  /* THE UNDERLAYING ONE WITH COLORS */\n.highLite_colors,.highLite_colors_err {\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0; \n    user-select: none;\n  }\n\n  .highLite_colors_err{\n      padding-top: 20px;\n  }\n  \n  /* THE OVERLAYING CONTENTEDITABLE WITH TRANSPARENT TEXT */\n.highLite > div:nth-child(2) {\n    position: relative;\n    -webkit-text-fill-color: transparent; /* Chrome: make text transparent */\n    /* text-fill-color: transparent;         One day, hopefully? */\n    color: black;                         /* But keep caret black */\n  }\n\n.hl_angled{ color: turquoise; }\n.hl_curly{ color: fuchsia; }\n\n\n\n.highlight {\n    background-color: yellow;\n  }\n\n.gutter {\n    background-repeat: no-repeat;\n    background-position: 50%;\n    background-color: rgb(128, 128, 128);\n}\n\n.gutter.gutter-horizontal {\n    background-image: url("+c+");\n    cursor: col-resize;\n}\n\n.gutter.gutter-vertical {\n    background-image: url("+c+");\n    cursor:row-resize;\n}\n\n.error_tab_tag,.cli_tab_tag{\n    color: white;\n    font-size: 0.9rem;\n    font-family:Arial, Helvetica, sans-serif;\n    font-weight: 100;\n    background-color: rgb(128, 128, 128);\n    padding-bottom: 5px;\n    text-align: center;\n}\n.cli_tab_tag{\n    padding-top: 5px;\n\n}",""]);const u=l},701:(e,t,n)=>{"use strict";n.d(t,{Z:()=>o});var r=n(645),i=n.n(r)()((function(e){return e[1]}));i.push([e.id,'/*!\n * tabbyjs v12.0.3\n * Lightweight, accessible vanilla JS toggle tabs.\n * (c) 2019 Chris Ferdinandi\n * MIT License\n * http://github.com/cferdinandi/tabby\n */\n\n/**\n * The tablist\n */\n[role="tablist"] {\n  border-bottom: 1px solid lightgray;\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n[role="tablist"] * {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n\n/**\n * The tablist item\n */\n@media (min-width: 30em) {\n  [role="tablist"] li {\n    display: inline-block;\n  }\n}\n\n/**\n * The tabs\n */\n[role="tab"] {\n  border: 1px solid transparent;\n  border-top-color: lightgray;\n  display: block;\n  padding: 0.4em 1em;\n  text-decoration: none;\n  font-size: 1em;\n  color: black;\n  /**\n\t * Active tab styling\n\t */\n  /**\n\t * Tabs on hover\n\t */\n}\n\n@media (min-width: 30em) {\n  [role="tab"] {\n    border-top-color: transparent;\n    border-top-left-radius: 0.5em;\n    border-top-right-radius: 0.5em;\n    display: inline-block;\n    margin-bottom: -1px;\n  }\n}\n\n[role="tab"][aria-selected="true"] {\n  background-color: lightgray;\n}\n\n@media (min-width: 30em) {\n  [role="tab"][aria-selected="true"] {\n    background-color: transparent;\n    border: 1px solid lightgray;\n    border-bottom-color: #ffffff;\n  }\n}\n\n[role="tab"]:hover:not([aria-selected="true"]) {\n  background-color: #f7f7f7;\n}\n\n@media (min-width: 30em) {\n  [role="tab"]:hover:not([aria-selected="true"]) {\n    border: 1px solid lightgray;\n  }\n}\n\n/**\n * [hidden] fallback for IE10 and lower\n */\n[hidden] {\n  display: none;\n}',""]);const o=i},645:e=>{"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=e(t);return t[2]?"@media ".concat(t[2]," {").concat(n,"}"):n})).join("")},t.i=function(e,n,r){"string"==typeof e&&(e=[[null,e,""]]);var i={};if(r)for(var o=0;o<this.length;o++){var a=this[o][0];null!=a&&(i[a]=!0)}for(var s=0;s<e.length;s++){var l=[].concat(e[s]);r&&i[l[0]]||(n&&(l[2]?l[2]="".concat(n," and ").concat(l[2]):l[2]=n),t.push(l))}},t}},667:e=>{"use strict";e.exports=function(e,t){return t||(t={}),e?(e=String(e.__esModule?e.default:e),/^['"].*['"]$/.test(e)&&(e=e.slice(1,-1)),t.hash&&(e+=t.hash),/["'() \t\n]|(%20)/.test(e)||t.needQuotes?'"'.concat(e.replace(/"/g,'\\"').replace(/\n/g,"\\n"),'"'):e):e}},379:e=>{"use strict";var t=[];function n(e){for(var n=-1,r=0;r<t.length;r++)if(t[r].identifier===e){n=r;break}return n}function r(e,r){for(var o={},a=[],s=0;s<e.length;s++){var l=e[s],c=r.base?l[0]+r.base:l[0],u=o[c]||0,d="".concat(c," ").concat(u);o[c]=u+1;var f=n(d),h={css:l[1],media:l[2],sourceMap:l[3]};-1!==f?(t[f].references++,t[f].updater(h)):t.push({identifier:d,updater:i(h,r),references:1}),a.push(d)}return a}function i(e,t){var n=t.domAPI(t);return n.update(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;n.update(e=t)}else n.remove()}}e.exports=function(e,i){var o=r(e=e||[],i=i||{});return function(e){e=e||[];for(var a=0;a<o.length;a++){var s=n(o[a]);t[s].references--}for(var l=r(e,i),c=0;c<o.length;c++){var u=n(o[c]);0===t[u].references&&(t[u].updater(),t.splice(u,1))}o=l}}},569:e=>{"use strict";var t={};e.exports=function(e,n){var r=function(e){if(void 0===t[e]){var n=document.querySelector(e);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}t[e]=n}return t[e]}(e);if(!r)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");r.appendChild(n)}},216:e=>{"use strict";e.exports=function(e){var t=document.createElement("style");return e.setAttributes(t,e.attributes),e.insert(t),t}},565:(e,t,n)=>{"use strict";e.exports=function(e){var t=n.nc;t&&e.setAttribute("nonce",t)}},795:e=>{"use strict";e.exports=function(e){var t=e.insertStyleElement(e);return{update:function(n){!function(e,t,n){var r=n.css,i=n.media,o=n.sourceMap;i?e.setAttribute("media",i):e.removeAttribute("media"),o&&"undefined"!=typeof btoa&&(r+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(o))))," */")),t.styleTagTransform(r,e)}(t,e,n)},remove:function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)}}}},589:e=>{"use strict";e.exports=function(e,t){if(t.styleSheet)t.styleSheet.cssText=e;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(e))}}},394:function(e,t,n){var r,i;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),i=void 0!==n.g?n.g:"undefined"!=typeof window?window:this,void 0===(r=function(){return function(e){"use strict";var t={idPrefix:"tabby-toggle_",default:"[data-tabby-default]"},n=function(t){if(t&&"true"!=t.getAttribute("aria-selected")){var n=document.querySelector(t.hash);if(n){var r=function(e){var t=e.closest('[role="tablist"]');if(!t)return{};var n=t.querySelector('[role="tab"][aria-selected="true"]');if(!n)return{};var r=document.querySelector(n.hash);return n.setAttribute("aria-selected","false"),n.setAttribute("tabindex","-1"),r?(r.setAttribute("hidden","hidden"),{previousTab:n,previousContent:r}):{previousTab:n}}(t);!function(e,t){e.setAttribute("aria-selected","true"),e.setAttribute("tabindex","0"),t.removeAttribute("hidden"),e.focus()}(t,n),r.tab=t,r.content=n,function(t,n){var r;"function"==typeof e.CustomEvent?r=new CustomEvent("tabby",{bubbles:!0,cancelable:!0,detail:n}):(r=document.createEvent("CustomEvent")).initCustomEvent("tabby",!0,!0,n),t.dispatchEvent(r)}(t,r)}}};return function(r,i){var o,a,s={destroy:function(){var e=a.querySelectorAll("a");Array.prototype.forEach.call(e,(function(e){var t=document.querySelector(e.hash);t&&function(e,t,n){e.id.slice(0,n.idPrefix.length)===n.idPrefix&&(e.id=""),e.removeAttribute("role"),e.removeAttribute("aria-controls"),e.removeAttribute("aria-selected"),e.removeAttribute("tabindex"),e.closest("li").removeAttribute("role"),t.removeAttribute("role"),t.removeAttribute("aria-labelledby"),t.removeAttribute("hidden")}(e,t,o)})),a.removeAttribute("role"),document.documentElement.removeEventListener("click",l,!0),a.removeEventListener("keydown",c,!0),o=null,a=null},setup:function(){if(a=document.querySelector(r)){var e=a.querySelectorAll("a");a.setAttribute("role","tablist"),Array.prototype.forEach.call(e,(function(e){var t=document.querySelector(e.hash);t&&function(e,t,n){e.id||(e.id=n.idPrefix+t.id),e.setAttribute("role","tab"),e.setAttribute("aria-controls",t.id),e.closest("li").setAttribute("role","presentation"),t.setAttribute("role","tabpanel"),t.setAttribute("aria-labelledby",e.id),e.matches(n.default)?e.setAttribute("aria-selected","true"):(e.setAttribute("aria-selected","false"),e.setAttribute("tabindex","-1"),t.setAttribute("hidden","hidden"))}(e,t,o)}))}},toggle:function(e){var t=e;"string"==typeof e&&(t=document.querySelector(r+' [role="tab"][href*="'+e+'"]')),n(t)}},l=function(e){var t=e.target.closest(r+' [role="tab"]');t&&(e.preventDefault(),n(t))},c=function(e){var t=document.activeElement;t.matches(r+' [role="tab"]')&&(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Up","Down","Left","Right","Home","End"].indexOf(e.key)<0||function(e,t){var r=function(e){var t=e.closest('[role="tablist"]'),n=t?t.querySelectorAll('[role="tab"]'):null;if(n)return{tabs:n,index:Array.prototype.indexOf.call(n,e)}}(e);if(r){var i,o=r.tabs.length-1;["ArrowUp","ArrowLeft","Up","Left"].indexOf(t)>-1?i=r.index<1?o:r.index-1:["ArrowDown","ArrowRight","Down","Right"].indexOf(t)>-1?i=r.index===o?0:r.index+1:"Home"===t?i=0:"End"===t&&(i=o),n(r.tabs[i])}}(t,e.key))};return o=function(){var e={};return Array.prototype.forEach.call(arguments,(function(t){for(var n in t){if(!t.hasOwnProperty(n))return;e[n]=t[n]}})),e}(t,i||{}),s.setup(),function(t){if(!(e.location.hash.length<1)){var r=document.querySelector(t+' [role="tab"][href*="'+e.location.hash+'"]');n(r)}}(r),document.documentElement.addEventListener("click",l,!0),a.addEventListener("keydown",c,!0),s}}(i)}.apply(t,[]))||(e.exports=r)},433:e=>{"use strict";e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg=="}},t={};function n(r){var i=t[r];if(void 0!==i)return i.exports;var o=t[r]={id:r,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.exports}n.m=e,n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.b=document.baseURI||self.location.href,(()=>{"use strict";var e="undefined"!=typeof window?window:null,t=null===e,r=t?void 0:e.document,i="horizontal",o=function(){return!1},a=t?"calc":["","-webkit-","-moz-","-o-"].filter((function(e){var t=r.createElement("div");return t.style.cssText="width:"+e+"calc(9px)",!!t.style.length})).shift()+"calc",s=function(e){return"string"==typeof e||e instanceof String},l=function(e){if(s(e)){var t=r.querySelector(e);if(!t)throw new Error("Selector "+e+" did not match a DOM element");return t}return e},c=function(e,t,n){var r=e[t];return void 0!==r?r:n},u=function(e,t,n,r){if(t){if("end"===r)return 0;if("center"===r)return e/2}else if(n){if("start"===r)return 0;if("center"===r)return e/2}return e},d=function(e,t){var n=r.createElement("div");return n.className="gutter gutter-"+t,n},f=function(e,t,n){var r={};return s(t)?r[e]=t:r[e]=a+"("+t+"% - "+n+"px)",r},h=function(e,t){var n;return(n={})[e]=t+"px",n};var b=n(379),p=n.n(b),g=n(795),m=n.n(g),v=n(569),y=n.n(v),w=n(565),x=n.n(w),A=n(216),E=n.n(A),S=n(589),z=n.n(S),L=n(127),k={};k.styleTagTransform=z(),k.setAttributes=x(),k.insert=y().bind(null,"head"),k.domAPI=m(),k.insertStyleElement=E(),p()(L.Z,k),L.Z&&L.Z.locals&&L.Z.locals;var _=n(701),T={};T.styleTagTransform=z(),T.setAttributes=x(),T.insert=y().bind(null,"head"),T.domAPI=m(),T.insertStyleElement=E(),p()(_.Z,T),_.Z&&_.Z.locals&&_.Z.locals;var C=n(394),M=n.n(C);document.getElementById("cli-textarea"),new class{constructor(e){this.rawText=e}}("ce"),function(n,a){if(void 0===a&&(a={}),t)return{};var s,b,p,g,m,v,y=n;Array.from&&(y=Array.from(y));var w=l(y[0]).parentNode,x=getComputedStyle?getComputedStyle(w):null,A=x?x.flexDirection:null,E=c(a,"sizes")||y.map((function(){return 100/y.length})),S=c(a,"minSize",100),z=Array.isArray(S)?S:y.map((function(){return S})),L=c(a,"maxSize",1/0),k=Array.isArray(L)?L:y.map((function(){return L})),_=c(a,"expandToMin",!1),T=c(a,"gutterSize",10),C=c(a,"gutterAlign","center"),M=c(a,"snapOffset",30),O=c(a,"dragInterval",1),R=c(a,"direction",i),U=c(a,"cursor",R===i?"col-resize":"row-resize"),I=c(a,"gutter",d),N=c(a,"elementStyle",f),D=c(a,"gutterStyle",h);function q(e,t,n,r){var i=N(s,t,n,r);Object.keys(i).forEach((function(t){e.style[t]=i[t]}))}function B(){return v.map((function(e){return e.size}))}function H(e){return"touches"in e?e.touches[0][b]:e[b]}function j(e){var t=v[this.a],n=v[this.b],r=t.size+n.size;t.size=e/this.size*r,n.size=r-e/this.size*r,q(t.element,t.size,this._b,t.i),q(n.element,n.size,this._c,n.i)}function F(e){var t,n=v[this.a],r=v[this.b];this.dragging&&(t=H(e)-this.start+(this._b-this.dragOffset),O>1&&(t=Math.round(t/O)*O),t<=n.minSize+M+this._b?t=n.minSize+this._b:t>=this.size-(r.minSize+M+this._c)&&(t=this.size-(r.minSize+this._c)),t>=n.maxSize-M+this._b?t=n.maxSize+this._b:t<=this.size-(r.maxSize-M+this._c)&&(t=this.size-(r.maxSize+this._c)),j.call(this,t),c(a,"onDrag",o)(B()))}function P(){var e=v[this.a].element,t=v[this.b].element,n=e.getBoundingClientRect(),r=t.getBoundingClientRect();this.size=n[s]+r[s]+this._b+this._c,this.start=n[p],this.end=n[g]}function Z(e){var t=function(e){if(!getComputedStyle)return null;var t=getComputedStyle(e);if(!t)return null;var n=e[m];return 0===n?null:n-=R===i?parseFloat(t.paddingLeft)+parseFloat(t.paddingRight):parseFloat(t.paddingTop)+parseFloat(t.paddingBottom)}(w);if(null===t)return e;if(z.reduce((function(e,t){return e+t}),0)>t)return e;var n=0,r=[],o=e.map((function(i,o){var a=t*i/100,s=u(T,0===o,o===e.length-1,C),l=z[o]+s;return a<l?(n+=l-a,r.push(0),l):(r.push(a-l),a)}));return 0===n?e:o.map((function(e,i){var o=e;if(n>0&&r[i]-n>0){var a=Math.min(n,r[i]-n);n-=a,o=e-a}return o/t*100}))}function Y(){var t=this,n=v[t.a].element,i=v[t.b].element;t.dragging&&c(a,"onDragEnd",o)(B()),t.dragging=!1,e.removeEventListener("mouseup",t.stop),e.removeEventListener("touchend",t.stop),e.removeEventListener("touchcancel",t.stop),e.removeEventListener("mousemove",t.move),e.removeEventListener("touchmove",t.move),t.stop=null,t.move=null,n.removeEventListener("selectstart",o),n.removeEventListener("dragstart",o),i.removeEventListener("selectstart",o),i.removeEventListener("dragstart",o),n.style.userSelect="",n.style.webkitUserSelect="",n.style.MozUserSelect="",n.style.pointerEvents="",i.style.userSelect="",i.style.webkitUserSelect="",i.style.MozUserSelect="",i.style.pointerEvents="",t.gutter.style.cursor="",t.parent.style.cursor="",r.body.style.cursor=""}function G(t){if(!("button"in t)||0===t.button){var n=this,i=v[n.a].element,s=v[n.b].element;n.dragging||c(a,"onDragStart",o)(B()),t.preventDefault(),n.dragging=!0,n.move=F.bind(n),n.stop=Y.bind(n),e.addEventListener("mouseup",n.stop),e.addEventListener("touchend",n.stop),e.addEventListener("touchcancel",n.stop),e.addEventListener("mousemove",n.move),e.addEventListener("touchmove",n.move),i.addEventListener("selectstart",o),i.addEventListener("dragstart",o),s.addEventListener("selectstart",o),s.addEventListener("dragstart",o),i.style.userSelect="none",i.style.webkitUserSelect="none",i.style.MozUserSelect="none",i.style.pointerEvents="none",s.style.userSelect="none",s.style.webkitUserSelect="none",s.style.MozUserSelect="none",s.style.pointerEvents="none",n.gutter.style.cursor=U,n.parent.style.cursor=U,r.body.style.cursor=U,P.call(n),n.dragOffset=H(t)-n.end}}R===i?(s="width",b="clientX",p="left",g="right",m="clientWidth"):"vertical"===R&&(s="height",b="clientY",p="top",g="bottom",m="clientHeight"),E=Z(E);var J=[];function W(e){var t=e.i===J.length,n=t?J[e.i-1]:J[e.i];P.call(n);var r=t?n.size-e.minSize-n._c:e.minSize+n._b;j.call(n,r)}(v=y.map((function(e,t){var n,r={element:l(e),size:E[t],minSize:z[t],maxSize:k[t],i:t};if(t>0&&((n={a:t-1,b:t,dragging:!1,direction:R,parent:w})._b=u(T,t-1==0,!1,C),n._c=u(T,!1,t===y.length-1,C),"row-reverse"===A||"column-reverse"===A)){var i=n.a;n.a=n.b,n.b=i}if(t>0){var o=I(t,R,r.element);!function(e,t,n){var r=D(s,t,n);Object.keys(r).forEach((function(t){e.style[t]=r[t]}))}(o,T,t),n._a=G.bind(n),o.addEventListener("mousedown",n._a),o.addEventListener("touchstart",n._a),w.insertBefore(o,r.element),n.gutter=o}return q(r.element,r.size,u(T,0===t,t===y.length-1,C),t),t>0&&J.push(n),r}))).forEach((function(e){var t=e.element.getBoundingClientRect()[s];t<e.minSize&&(_?W(e):e.minSize=t)}))}(["#left-side","#right-side"],{sizes:[75,25]}),new(M())("[data-tabs-left]"),new(M())("[data-tabs-right]");const O=1500,R=1500,U=document.getElementsByClassName("highLite_editable")[0];U.addEventListener("input",(e=>function(e){let t=e.innerHTML;for(let e of N){const n=new RegExp(`${e}`,"g");t=t.replace(n,`<span class='hl_curly'>${e}</span>`)}e.previousElementSibling.innerHTML=t}(U)));let I=document.getElementById("canvas");const N=["add","put","cmd1","dev"];I.width=O,I.height=R;let D=I.getContext("2d"),q=0,B=0;function H(e,t,n,r){D.fillRect(e,t,n,r)}let j=[],F=!1,P=null,Z=null;I.addEventListener("mousedown",(e=>{!function(e,t){let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;console.log("Coordinate x: "+r,"Coordinate y: "+i),F||j.push({x:r,y:i})}(I,e)})),I.addEventListener("mouseup",(function(e){F=!1,P=null,Z=1})),function e(){I.width=O,I.height=R,D.translate(750,750),D.scale(1,1),D.translate(-750+q,-750+B),D.fillStyle="#555",D.fillRect(0,0,O,R),D.fillStyle="#991111",H(-50,-50,100,100),D.fillStyle="#eecc77";for(let e of j)H(e.x,e.y,30,30);requestAnimationFrame(e)}()})()})();