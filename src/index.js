"use strict";

import Game from "./game.js";

// Setup  canvas
const canvas = document.createElement("canvas");
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

// Main function
async function main() {
  const game = await Game.init(canvas);
  game.play();
}

main();
