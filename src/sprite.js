"use strict";

class Sprite {
    constructor(width, height, x, y, rot, texture) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.rot = rot;
        this.texture = texture;
    }

    update(dt) {
        // Sprite subclass should implement this
    }
};

export default Sprite;