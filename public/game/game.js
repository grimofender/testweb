import { Player } from "./entities/player.js"
import Color from "../libraries/color.js";
import { Enemy } from "./entities/enemy.js";
import { canvasToGlobal } from "./math.js";
var tickerstarted = false;
var entities = Array(0);
var running = false;
var zen = false;

var pressedKeys = {};
window.addEventListener("keyup", e => { pressedKeys[e.keyCode] = false; })
window.addEventListener("keydown", e => { pressedKeys[e.keyCode] = true; });

export function start(/** @type {CanvasRenderingContext2D}**/ ctx, onstop, should_zen) {
    running = true;
    zen = should_zen
    

    entities.splice(0, entities.length);
    entities.push(new Player(0, 0));

    let lasttime = performance.now();
    async function update() {
        let delta = performance.now() - lasttime;
        lasttime = performance.now();
        entities.forEach((/** @type {Entity}**/ entity, index) => {
            entity?.process(delta/1000, {
                entities:entities,
                ctx:ctx,
                stopgame:()=>{
                    if (!zen) running = false;      
                }
            });
        });

        if (running) running = !pressedKeys[84];
        if (running) setTimeout(update, 0);
        else {
            onstop();
        }
    }
    function draw(time) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        entities.forEach((/** @type {Entity}**/ entity, index) => {
            entity?.draw(ctx);
        }); 
        window.requestAnimationFrame(draw);
    }
    window.requestAnimationFrame(draw);

    function tick() {
        console.log("tick");


        let color = new Color(document.body.style.backgroundColor);
        color.hue += 90;
        document.body.style.backgroundColor = color.toString();
        if (!running) return;

        entities?.forEach((/** @type {Entity}**/ entity, index) => {
            entity?.tick({
                entities:entities,
                ctx:ctx
            });
        });
        
        if (!zen) {
            let spawnpos = [];
            let rand = Math.floor(Math.random()*4);
            switch (rand) {
                case 0:
                    spawnpos = [((Math.random()*2)-1)*(ctx.canvas.width/2), ctx.canvas.height/2]
                    break;
                case 1:
                    spawnpos = [((Math.random()*2)-1)*(ctx.canvas.width/2), -ctx.canvas.height/2]
                    break;
                case 2:
                    spawnpos = [ctx.canvas.width/2, ((Math.random()*2)-1)*(ctx.canvas.height/2)]
                    break;
                case 3:
                    spawnpos = [-ctx.canvas.width/2, ((Math.random()*2)-1)*(ctx.canvas.height/2)]
                    break;
            }
            entities.push(new Enemy(spawnpos[0], spawnpos[1]));
        }
    };

    


    let sound = document.createElement("audio");
    sound.src = "public/game/audio/mack-the-knife.mp3"
    sound.loop = true;
    document.body.appendChild(sound);
    async function ticker(time) {
        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        async function repeat(func, times) {
            await func();
            times && --times && await repeat(func, times);
        }
        await sleep(2000);
        await repeat(async()=>{
            tick();
            await sleep(2000)
        }, 11);
        await repeat(async()=>{
            tick();
            await sleep(1000)
        }, 15);
        setTimeout(ticker, sound.duration-sound.currentTime);
    }
    if (!tickerstarted)  {
        tickerstarted = true;
        sound.play();
        ticker();
    }

    update();
}

