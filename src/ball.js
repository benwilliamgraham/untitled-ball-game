"use strict";

import Sprite from "./sprite.js"

const levelHeirarchy = [
    {radius: 10, texture: "src/textures/0.png"},
    {radius: 20, texture: "src/textures/1.png"},
    {radius: 30, texture: "src/textures/2.png"},
    {radius: 40, texture: "src/textures/3.png"},
    {radius: 50, texture: "src/textures/4.png"},
    {radius: 60, texture: "src/textures/5.png"},
    {radius: 70, texture: "src/textures/6.png"},
    {radius: 80, texture: "src/textures/7.png"},
    {radius: 90, texture: "src/textures/8.png"},
    {radius: 100, texture: "src/textures/9.png"},
    {radius: 110, texture: "src/textures/10.png"},
];

class Ball extends Sprite {
    levelHeirarchy = levelHeirarchy;

    constructor(level, x, y, renderer) {
        const {radius, texture} = levelHeirarchy[level];
        console.log(levelHeirarchy[level]);
        super(radius * 2, radius * 2, x, y, 0, renderer.getTexture(texture));
        this.radius = radius;
        this.mass = radius * radius;
        this.level = level;

        this.velX = 0;
        this.velY = 0;
    }
}

export default Ball;