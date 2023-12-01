"use strict";

import Sprite from "./sprite.js"

class Ball extends Sprite {
    constructor(radius, x, y, rot, texture) {
        super(radius, radius, x, y, rot, texture);

        this.velX = 0;
        this.velY = 0;
    }
}

export default Ball;