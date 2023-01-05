const worker = new Worker("canvasHealthTestWorker.js");
const offscreen = document
.querySelector("canvas")
.transferControlToOffscreen();

worker.postMessage({ canvas: offscreen }, [offscreen]);
