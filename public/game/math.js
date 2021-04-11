

export function globalToCanvas(position, /** @type {CanvasRenderingContext2D}**/ ctx) {
    return [position[0] + (ctx.canvas.width / 2), position[1] + (ctx.canvas.height / 2)]
}

export function canvasToGlobal(position, /** @type {CanvasRenderingContext2D}**/ ctx) {
    return [position[0] - (ctx.canvas.width / 2), position[1] - (ctx.canvas.height / 2)]
}

export function screenToCanvas(position, /** @type {CanvasRenderingContext2D}**/ ctx) {
    var rect = ctx.canvas.getBoundingClientRect();
    return [
        (position[0] - rect.left) / (rect.right - rect.left) * canvas.width,
        (position[1] - rect.top) / (rect.bottom - rect.top) * canvas.height
    ]
}

export function lerp(a, b, t) {
    return a*(1-t)+b*t
}

export function wrap(number, low, high ) {
    var range = high - low;
    return (range == 0)? low : number-(range*Math.floor((number - low)/range));
}