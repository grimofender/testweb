import { Player } from "./player.js";
import { Entity } from "./entities.js";
import { Laser } from "./laser.js";
import { globalToCanvas, lerp } from "../math.js";

export class Enemy extends Entity {
    
    constructor(x, y) {
        super();
        this.position = [x, y];
        this.scale = [50, 50];
        this.rotation = 0;
        this.velocity = [0, 0]
        this.friction = 7;
        this.speed = 325;
    }

    process(delta, meta) { }
    physics(delta, meta) {
        this.position[0] += this.velocity[0]*delta;
        this.position[1] += this.velocity[1]*delta;

        meta.entities.forEach((/** @type {Entity}**/ entity, index) => {
            if (entity instanceof Player) {
                var dir = Math.atan2(entity.position[1]-this.position[1], entity.position[0]-this.position[0]);

                this.velocity[0] = lerp(this.velocity[0], Math.cos(dir)*this.speed, delta*this.friction);
                this.velocity[1] = lerp(this.velocity[1], Math.sin(dir)*this.speed, delta*this.friction);
                let pt = [entity.position[0] + 10, entity.position[1] + 5];
                let distance = Math.sqrt(Math.pow(pt[0]-this.position[0], 2)+Math.pow(pt[1]-this.position[1], 2));
                if (distance < 30) {
                    meta.entities.forEach((/** @type {Entity}**/ entity, index) => {
                      meta.stopgame();
                    });
                }
            }
        });
    }
    tick(meta) {
    }

    draw(/** @type {CanvasRenderingContext2D}**/ ctx) {
        let screenpos = globalToCanvas(this.position, ctx);
        ctx.fillStyle = "#800080"
        ctx.beginPath();
        ctx.ellipse(screenpos[0], screenpos[1], this.scale[0], this.scale[1], this.rotation, 0, 2 * Math.PI);
        ctx.fill();
    }
}