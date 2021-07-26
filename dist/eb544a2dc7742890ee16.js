import Split from"split.js";import"./index.css";import"./tabby.css";import{TextParser}from"./TextParser";import Tabby from"tabbyjs";const ta=document.getElementById("cli-textarea"),x=new TextParser("ce");Split(["#left-side","#right-side"],{sizes:[75,25]});var tab1=new Tabby("[data-tabs-left]");const canvasW=1500,canvasH=1500,keywords=["add","put","cmd1","dev"];function highLite(t){let e=t.innerHTML;for(let t of keywords){const a=new RegExp(`${t}`,"g");e=e.replace(a,`<span class='hl_curly'>${t}</span>`)}t.previousElementSibling.innerHTML=e}let canvas=document.getElementById("canvas");canvas.width=1500,canvas.height=1500;let ctx=canvas.getContext("2d"),cameraOffset={x:0,y:0},cameraZoom=1,MAX_ZOOM=5,MIN_ZOOM=.1,SCROLL_SENSITIVITY=5e-4;function drawRect(t,e,a,o){ctx.fillRect(t,e,a,o)}let eses=[];function draw(){canvas.width=1500,canvas.height=1500,ctx.translate(750,750),ctx.scale(cameraZoom,cameraZoom),ctx.translate(-750+cameraOffset.x,-750+cameraOffset.y),ctx.fillStyle="#000",ctx.fillRect(0,0,1500,1500),ctx.fillStyle="#991111",drawRect(-50,-50,100,100),ctx.fillStyle="#eecc77";for(let t of eses)drawRect(t.x,t.y,30,30);requestAnimationFrame(draw)}function getEventLocation(t){if(t.clientX&&t.clientY)return{x:t.clientX,y:t.clientY}}let isDragging=!1,dragStart={x:0,y:0};function onPointerDown(t){isDragging||eses.push({x:getEventLocation(t).x,y:getEventLocation(t).y}),isDragging=!0,dragStart.x=getEventLocation(t).x/cameraZoom-cameraOffset.x,dragStart.y=getEventLocation(t).y/cameraZoom-cameraOffset.y,console.log(getEventLocation(t).x,getEventLocation(t).y)}function onPointerUp(t){isDragging=!1,initialPinchDistance=null,lastZoom=cameraZoom}function onPointerMove(t){isDragging&&(cameraOffset.x=getEventLocation(t).x/cameraZoom-dragStart.x,cameraOffset.y=getEventLocation(t).y/cameraZoom-dragStart.y)}let initialPinchDistance=null,lastZoom=cameraZoom;function adjustZoom(t,e){isDragging||(t?cameraZoom+=t:e&&(console.log(e),cameraZoom=e*lastZoom),cameraZoom=Math.min(cameraZoom,MAX_ZOOM),cameraZoom=Math.max(cameraZoom,MIN_ZOOM),console.log(t))}canvas.addEventListener("mousedown",onPointerDown),canvas.addEventListener("mouseup",onPointerUp),draw();