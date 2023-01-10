var canvas = document.getElementById("myCanvas");
canvas.style.position = "absolute";
canvas.style.zIndex = "9999";
const worker = new Worker("canvasHealthTestWorker.js");
const offscreen = document
    .querySelector("canvas")
    .transferControlToOffscreen();
worker.postMessage({ canvas: offscreen }, [offscreen]);
