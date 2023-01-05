var worker = new Worker("canvasHealthTestWorker.js");
var offscreen = document
    .querySelector("canvas")
    .transferControlToOffscreen();
worker.postMessage({ canvas: offscreen }, [offscreen]);
