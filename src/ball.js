"use strict";

import Sprite from "./sprite.js"

class Ball extends Sprite {

    constructor(level, radius, x, y, texture) {
        super(radius * 2, radius * 2, x, y, 0, texture);
        this.radius = radius;
        this.mass = radius * radius;
        this.level = level;

        this.velX = 0;
        this.velY = 0;
    }
}

export default Ball;