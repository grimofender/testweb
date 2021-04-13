export class Entity {
    Entity() {}

    process(delta, meta) {
        throw new Error("Method 'process(delta, meta)' must be implemented.");
    }
    draw(/** @type {CanvasRenderingContext2D}**/ ctx) {
        throw new Error("Method 'draw(ctx)' must be implemented.");
    }
    tick(meta) {
        throw new Error("Method 'tick(meta)' must be implemented.");
    }

    destroy(meta) {
        meta.entities.forEach((/** @type {Entity}**/ entity, index) => {
            if (entity === this) {
                meta.entities.splice(index,1);
                return false;
            }
        });
    }
}

