"use strict";

import Sprite from "./sprite.js"

class Ball extends Sprite {
    constructor(width, height, x, y, rot, texture) {
        super(width, height, x, y, rot, texture);
    }

    update(dt) {
        this.x += 0.1 * dt;
        this.y += 0.1 * dt;
    }
}

export default Ball;