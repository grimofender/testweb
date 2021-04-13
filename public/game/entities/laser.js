import { globalToCanvas } from "../math.js";
import { Enemy } from "./enemy.js";
import { Entity } from "./entities.js"
import { Player } from "./player.js";




export class Laser extends Entity {
    constructor(x, y, direction) {
        super();
        this.position = [x, y];
        this.direction = direction;
        this.timeout = 5*document.getElementById("bullet_lifetime").value;
        this.hostile = false;
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

        let collided = false;
        meta.entities.forEach((/** @type {Entity}**/ entity, index) => {
            if (!(entity instanceof Player) && !(entity instanceof Enemy)) return;
            if (this.timeout <= 0) return;
            let pt = [entity.position[0] + 10, entity.position[1] + 5];
            let distance = Math.sqrt(Math.pow(pt[0]-this.position[0], 2)+Math.pow(pt[1]-this.position[1], 2));

            if (distance < 20/(document.getElementById("bullet_size").value/100)) {
                collided = true;
                if (this.hostile && entity instanceof Player) meta.stopgame();
                else if (entity instanceof Enemy) entity.destroy(meta);
            }
        });
        if (!collided) this.hostile = true;
        


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
        let width = 20*(document.getElementById("bullet_size").value/100);
        let height = 10*(document.getElementById("bullet_size").value/100);
        ctx.save();
            ctx.translate(screenpos[0], screenpos[1])
            ctx.rotate(this.direction);
            ctx.fillRect(-width/2, -height/2, width, height);
        ctx.restore();
    }

    tick(meta) {}
}