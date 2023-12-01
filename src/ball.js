"use strict";

import Sprite from "./sprite.js"

class Ball extends Sprite {
    constructor(radius, x, y, rot, texture) {
        super(radius, radius, x, y, rot, texture);
    }

    update(dt) {
        this.rot += 0.001 * dt;
    }
}

export default Ball;