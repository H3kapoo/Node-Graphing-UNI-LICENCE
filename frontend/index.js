import "./Styles/index.css";
import "./Styles/tabby.css";

import Tabby from 'tabbyjs'
import Split from 'split.js'
import { CLITabManager } from './Tabs/CLITabManager';
import { CanvasManager } from './Canvas/CanvasManager';
import { GraphManager } from './Graph/GraphManager';

const cliTabManager_ = new CLITabManager('cli-textarea')
const canvasManager_ = new CanvasManager('canvas')
const graphManager_ = new GraphManager(canvasManager_, cliTabManager_)
graphManager_.start()

//split into 2 parts
Split(['#left-side', '#right-side'], { sizes: [65, 35] })

//create tabs area
new Tabby('[data-tabs-left]');
new Tabby('[data-tabs-right]');

//JUNK DOWN BELLOW THAT MIGHT BE USEFUL LATER
//DONT DELETE

// const eled = document.getElementsByClassName('highLite_editable')[0]

// // eled.addEventListener('input', e => highLite(eled))

// let canvas = document.getElementById("canvas")

// // const keywords = ['add', 'put', 'cmd1', 'dev']

// // function highLite(el) {
// //     let text = el.innerHTML
// //     for (let keyword of keywords) {
// //         const regex = new RegExp(`${keyword}`, 'g');

// //         text = text.replace(regex, `<span class='hl_curly'>${keyword}</span>`)

// //     }
// //     el.previousElementSibling.innerHTML = text
// // }

// canvas.width = canvasW
// canvas.height = canvasH
// let ctx = canvas.getContext('2d')
// // let cameraOffset = { x: canvasW / 2, y: canvasH / 2 }
// let cameraOffset = { x: 0, y: 0 }

// let cameraZoom = 1
// let MAX_ZOOM = 5
// let MIN_ZOOM = 0.1
// let SCROLL_SENSITIVITY = 0.0005

// function drawRect(x, y, width, height) {
//     ctx.fillRect(x, y, width, height)
// }

// let eses = []

// function draw() {
//     canvas.width = canvasW
//     canvas.height = canvasH

//     // Translate to the canvas centre before zooming - so you'll always zoom on what you're looking directly at
//     ctx.translate(canvasW / 2, canvasH / 2)
//     ctx.scale(cameraZoom, cameraZoom)
//     ctx.translate(-canvasW / 2 + cameraOffset.x, -canvasH / 2 + cameraOffset.y)
//     ctx.fillStyle = '#555'
//     ctx.fillRect(0, 0, canvasW, canvasH);
//     ctx.fillStyle = "#991111"
//     drawRect(-50, -50, 100, 100)

//     ctx.fillStyle = "#eecc77"

//     for (let obj of eses)
//         drawRect(obj.x, obj.y, 30, 30)

//     requestAnimationFrame(draw)
// }

// // Gets the relevant location from a mouse or single touch event
// function getEventLocation(e) {
//     if (e.clientX && e.clientY) {
//         return { x: e.clientX, y: e.clientY }
//     }
// }

// let isDragging = false
// let dragStart = { x: 0, y: 0 }

// function getMousePosition(canvas, event) {
//     let rect = canvas.getBoundingClientRect();
//     let x = event.clientX - rect.left;
//     let y = event.clientY - rect.top;
//     console.log("Coordinate x: " + x,
//         "Coordinate y: " + y);

//     if (!isDragging)
//         eses.push({
//             x,
//             y
//         })
// }

// // function onPointerDown(e) {

// //     if (!isDragging)
// //         eses.push({
// //             x: getEventLocation(e).x,
// //             y: getEventLocation(e).y
// //         })

// //     isDragging = true
// //     dragStart.x = getEventLocation(e).x / cameraZoom - cameraOffset.x
// //     dragStart.y = getEventLocation(e).y / cameraZoom - cameraOffset.y

// //     console.log(getEventLocation(e).x, getEventLocation(e).y)

// // }

// function onPointerUp(e) {
//     isDragging = false
//     initialPinchDistance = null
//     lastZoom = cameraZoom
// }

// function onPointerMove(e) {
//     if (isDragging) {
//         cameraOffset.x = getEventLocation(e).x / cameraZoom - dragStart.x
//         cameraOffset.y = getEventLocation(e).y / cameraZoom - dragStart.y
//     }
// }

// let initialPinchDistance = null
// let lastZoom = cameraZoom


// function adjustZoom(zoomAmount, zoomFactor) {
//     if (!isDragging) {
//         if (zoomAmount) {
//             cameraZoom += zoomAmount
//         }
//         else if (zoomFactor) {
//             console.log(zoomFactor)
//             cameraZoom = zoomFactor * lastZoom
//         }

//         cameraZoom = Math.min(cameraZoom, MAX_ZOOM)
//         cameraZoom = Math.max(cameraZoom, MIN_ZOOM)

//         console.log(zoomAmount)
//     }
// }

// // canvas.addEventListener('mousedown', onPointerDown)
// canvas.addEventListener("mousedown", e => {
//     getMousePosition(canvas, e);
// });
// canvas.addEventListener('mouseup', onPointerUp)
// // canvas.addEventListener('mousemove', onPointerMove)
// // canvas.addEventListener('wheel', (e) => adjustZoom(e.deltaY * -SCROLL_SENSITIVITY))

// // Ready, set, go
// draw()
