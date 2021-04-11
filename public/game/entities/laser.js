import { globalToCanvas } from "../math.js";
import { Entity } from "./entities.js"
export class Laser extends Entity {
    constructor(x, y, direction) {
        super();
        this.position = [x, y];
        this.direction = direction;
        this.timeout = 5;
        this.fadetime = 1;
    }

    process(delta, meta) {
        this.position[0] += Math.cos(this.direction)*delta*400*(document.getElementById("bullet_speed").value/100);
        this.position[1] += Math.sin(this.direction)*delta*400*(document.getElementById("bullet_speed").value/100);
        if (Math.abs(this.position[0]) > (meta.ctx.canvas.width/2)) {
            this.direction = Math.atan2(Math.sin(this.direction), -Math.cos(this.direction));
        } if (Math.abs(this.position[1]) > (meta.ctx.canvas.height/2)) {
            this.direction = Math.atan2(-Math.sin(this.direction), Math.cos(this.direction));
        }

        this.timeout -= delta;
        if (this.timeout <= 0) {
            this.fadetime -= delta;
            if (this.fadetime <= 0) {
                meta.entities.forEach((/** @type {Entity}**/ entity, index) => {
                    if (entity === this) {
                        meta.entities.splice(index,1);
                        return false;
                    }
                });
            }
        }


    }

    draw(/** @type {CanvasRenderingContext2D}**/ ctx) {
        ctx.fillStyle = `hsla(${(performance.now()/4)%360}, 100%, 50%, ${this.fadetime*100}%)`;
        let screenpos = globalToCanvas(this.position, ctx);
        ctx.fillRect(screenpos[0], screenpos[1], 20*(document.getElementById("bullet_size").value/100), 10*(document.getElementById("bullet_size").value/100));
    }

    tick(meta) {}
}