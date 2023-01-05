var globalCanvas = undefined;
self.onmessage = function (evt) {
    globalCanvas = evt.data.canvas;
    createTestableCanvasElement();
    // spin up periodical health test.
    setInterval(healthTest, 1000);
};
var PixelCompareResult;
(function (PixelCompareResult) {
    PixelCompareResult[PixelCompareResult["success"] = 0] = "success";
    PixelCompareResult[PixelCompareResult["failedWithBlackColor"] = 1] = "failedWithBlackColor";
    PixelCompareResult[PixelCompareResult["failed"] = 2] = "failed";
})(PixelCompareResult || (PixelCompareResult = {}));
var CanvasHealthCheckResult;
(function (CanvasHealthCheckResult) {
    CanvasHealthCheckResult[CanvasHealthCheckResult["healthy"] = 0] = "healthy";
    CanvasHealthCheckResult[CanvasHealthCheckResult["failedToRunCheck"] = 1] = "failedToRunCheck";
    CanvasHealthCheckResult[CanvasHealthCheckResult["notHealthyBuffersEmpty"] = 2] = "notHealthyBuffersEmpty";
    CanvasHealthCheckResult[CanvasHealthCheckResult["notHealthyRandomValues"] = 3] = "notHealthyRandomValues";
})(CanvasHealthCheckResult || (CanvasHealthCheckResult = {}));
function healthTest() {
    var imgData = globalCanvas.getContext("2d").getImageData(0, 0, 2, 2);
    createTestableCanvasElement();
    var result = validateCanvasPattern(imgData);
    switch (result) {
        case PixelCompareResult.success:
            console.log("health test succeed");
            return CanvasHealthCheckResult.healthy;
        case PixelCompareResult.failedWithBlackColor:
            console.log("health test failed With Black Color");
            return CanvasHealthCheckResult.notHealthyBuffersEmpty;
        default:
            console.log("health test not Healthy Random Values");
            return CanvasHealthCheckResult.notHealthyRandomValues;
    }
}
function createTestableCanvasElement() {
    try {
        globalCanvas.id = "myCanvas";
        // Set the canvas dimensions
        globalCanvas.width = "400";
        globalCanvas.height = "400";
        var ctx = globalCanvas.getContext("2d", { willReadFrequently: false });
        drawSamplePatternOnCanvas(ctx);
    }
    catch (exception) {
        return null;
    }
}
function validateCanvasPattern(imageData) {
    var redResult = validatePixel(imageData, { color: "red", x: 0, y: 0 });
    var greenResult = validatePixel(imageData, { color: "green", x: 1, y: 0 });
    var blueResult = validatePixel(imageData, { color: "blue", x: 0, y: 1 });
    var yellowResult = validatePixel(imageData, { color: "yellow", x: 1, y: 1 });
    if (redResult === PixelCompareResult.success &&
        greenResult === PixelCompareResult.success &&
        blueResult === PixelCompareResult.success &&
        yellowResult === PixelCompareResult.success) {
        return PixelCompareResult.success;
    }
    if (redResult === PixelCompareResult.failedWithBlackColor &&
        greenResult === PixelCompareResult.failedWithBlackColor &&
        blueResult === PixelCompareResult.failedWithBlackColor &&
        yellowResult === PixelCompareResult.failedWithBlackColor) {
        return PixelCompareResult.failedWithBlackColor;
    }
    return PixelCompareResult.failed;
}
function validatePixel(imageData, pixel) {
    // Retrieve the position of the pixel in the imageData array per imageData spec.
    // Each pixel is represented by 4 bytes ordered RGBA
    var offset = 4 * (imageData.width * pixel.y + pixel.x);
    var red = imageData.data[offset];
    var green = imageData.data[offset + 1];
    var blue = imageData.data[offset + 2];
    var alpha = imageData.data[offset + 3];
    if (!arePixelByteWithinErrorRange(red, 255) ||
        !arePixelByteWithinErrorRange(green, 0) ||
        !arePixelByteWithinErrorRange(blue, 0) ||
        !arePixelByteWithinErrorRange(alpha, 255)) {
        if (!red && !green && !blue && !alpha) {
            // pixel buffer is empty (black pixel = 0x000000)
            return PixelCompareResult.failedWithBlackColor;
        }
        return PixelCompareResult.failed;
    }
    return PixelCompareResult.success;
}
function arePixelByteWithinErrorRange(byte1, byte2) {
    var bottomRange = Math.max(0, byte1 - 2);
    var topRange = Math.min(255, byte1 + 2);
    // byte2 is within the valid error range in compare to byte1
    if (byte2 >= bottomRange && byte2 <= topRange) {
        return true;
    }
    return false;
}
/**
 * Draw Sample pattern on the canvas with 1px of each color:
 * |  Red   | Green  |
 * |--------|--------|
 * |  Blue  | Yellow |
 */
function drawSamplePatternOnCanvas(ctx) {
    drawPixel(ctx, { color: "red", x: 0, y: 0 });
    drawPixel(ctx, { color: "green", x: 100, y: 0 });
    drawPixel(ctx, { color: "blue", x: 0, y: 100 });
    drawPixel(ctx, { color: "yellow", x: 100, y: 100 });
}
function drawPixel(ctx, pixel) {
    ctx.fillStyle = pixel.color;
    ctx.fillRect(pixel.x, pixel.y, 100, 100);
}
