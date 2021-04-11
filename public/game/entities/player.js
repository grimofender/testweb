
import Color from "../../libraries/color.js";
import { canvasToGlobal, globalToCanvas, screenToCanvas, lerp, wrap } from "../math.js";
import { Entity } from "./entities.js"
import { Laser } from "./laser.js";


var pressedKeys = {};
window.onkeyup = function(e) { pressedKeys[e.keyCode] = false; }
window.onkeydown = function(e) { pressedKeys[e.keyCode] = true; }
let mousepos = [0, 0];
window.addEventListener("mousemove", (e)=>{
   mousepos[0] = e.pageX;
   mousepos[1] = e.pageY;
});

let mousedown = false;
window.addEventListener("mousedown", (e)=>{
    mousedown = true;
})
window.addEventListener("mouseup", (e)=>{
    mousedown = false;
})






export class Player extends Entity {
    constructor(x, y) {
        super();
        this.position = [x, y];
        this.scale = [25, 25];
        this.rotation = 0;
        this.velocity = [0, 0]
        this.friction = 7;
        this.speed = 300;
    }

    process(delta, meta) {
        var input = [
            Number((pressedKeys[38]||pressedKeys[87]) == true), 
            Number((pressedKeys[40]||pressedKeys[83]) == true), 
            Number((pressedKeys[37]||pressedKeys[65]) == true),
            Number((pressedKeys[39]||pressedKeys[68]) == true)]
        console.log(input);
        if ((input[0] || input[1] || input[2] || input[3]) && !(input[0] && input[1] && input[2] && input[3])) {
            
            let direction = Math.atan2(input[1]-input[0],input[3]-input[2]);
            this.velocity[0] = lerp(this.velocity[0], Math.cos(direction)*this.speed, delta*this.friction);
            this.velocity[1] = lerp(this.velocity[1], Math.sin(direction)*this.speed, delta*this.friction);
        } else {
            this.velocity[0] = lerp(this.velocity[0], 0, delta*this.friction);
            this.velocity[1] = lerp(this.velocity[1], 0, delta*this.friction);
        }

        if (mousedown) {
            var localmousepos = canvasToGlobal(screenToCanvas(mousepos, meta.ctx), meta.ctx);
            var dir = Math.atan2(localmousepos[1]-this.position[1], localmousepos[0]-this.position[0]);
            meta.entities.push(new Laser(this.position[0] + Math.cos(dir)*40, this.position[1] + Math.sin(dir)*40, dir))
        }
        this.position[0] += this.velocity[0]*delta;
        this.position[1] += this.velocity[1]*delta;

        this.position[0] = wrap(this.position[0], -(meta.ctx.canvas.width/2)-this.scale[0], (meta.ctx.canvas.width/2)+this.scale[0]);
        this.position[1] = wrap(this.position[1], -(meta.ctx.canvas.height/2)-this.scale[1], (meta.ctx.canvas.height/2)+this.scale[1]);

        meta.entities.forEach((/** @type {Entity}**/ entity, index) => {
            if (!(entity instanceof Laser)) return;
            if (entity.timeout <= 0) return;
            let pt = [entity.position[0] + 10, entity.position[1] + 5];
            let distance = Math.sqrt(Math.pow(pt[0]-this.position[0], 2)+Math.pow(pt[1]-this.position[1], 2));

            if (distance < 20) {
                meta.stopgame();
            }
        });
        
    }
    
    tick(meta) {
    }

    draw(/** @type {CanvasRenderingContext2D}**/ ctx) {
        let screenpos = globalToCanvas(this.position, ctx);
        ctx.fillStyle = "#ff0000"
        ctx.beginPath();
        ctx.ellipse(screenpos[0], screenpos[1], this.scale[0], this.scale[1], this.rotation, 0, 2 * Math.PI);
        ctx.fill();
    }
}