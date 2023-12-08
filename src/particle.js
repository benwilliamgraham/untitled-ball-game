"use strict";

import Sprite from "./sprite.js"

class Particle extends Sprite {

    constructor(x, y, texture) {
        const radius = 10;
        super(radius * 2, radius * 2, x, y, 0, texture);

        this.radius = radius;
        this.velX = 0;
        this.velY = 0;
    }
}

export default Particle;