"use strict";

import Game from "./game.js";

// Setup document
document.body.style.backgroundColor = "rgb(219, 189, 145)";

// Setup canvas
const canvas = document.createElement("canvas");
canvas.style.position = "absolute";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.borderRadius = "10px";
canvas.width = 600;
canvas.height = 800;
document.body.appendChild(canvas);

// Setup canvas text div
const canvasText = document.createElement("div");
canvasText.style.position = "absolute";
canvasText.style.top = "0";
canvasText.style.left = "0";
canvasText.style.width = canvas.width + "px";
canvasText.style.color = "white";
canvasText.style.fontFamily = "monospace";
canvasText.style.fontSize = "24px";
canvasText.style.userSelect = "none";
document.body.appendChild(canvasText);

// Setup score div
const scoreboard = document.createElement("div");
scoreboard.style.position = "absolute";
scoreboard.style.top = "0";
scoreboard.style.left = "0";
scoreboard.style.padding = "12px";
scoreboard.innerText = "Score: 0";
canvasText.appendChild(scoreboard);

// Setup next ball div
const nextBall = document.createElement("div");
nextBall.style.position = "absolute";
nextBall.style.top = "0";
nextBall.style.right = "0";
nextBall.style.padding = "2.5px";
nextBall.innerText = "Next ball:";
canvasText.appendChild(nextBall);

const nextBallImg = document.createElement("img");
nextBallImg.style.width = "50px";
nextBallImg.style.height = "50px";
nextBallImg.style.verticalAlign = "middle";
nextBall.appendChild(nextBallImg);

// Create info div
const info = document.createElement("div");
info.style.position = "absolute";
info.style.top = "0";
info.style.left = canvas.width + "px";
info.style.color = "white";
info.style.fontFamily = "monospace";
info.style.fontSize = "24px";
info.style.padding = "10px";

const header = document.createElement("h2");
header.innerText = "Rankings:";
info.appendChild(header);

const rankings = document.createElement("ul");
info.appendChild(rankings);

for (let i = 0; i <= 10; i++) {
  const item = document.createElement("li");
  const image = document.createElement("img");
  image.src = "src/textures/" + i + ".png";
  image.style.width = "50px";
  image.style.height = "50px";
  image.style.verticalAlign = "middle";
  item.appendChild(image);

  const text = document.createElement("span");
  text.innerText = " = " + (3 * (i + 1)) + " points";
  item.appendChild(text);

  rankings.appendChild(item);
}

document.body.appendChild(info);

// Main function
async function main() {
  const game = await Game.init(canvas, scoreboard, nextBallImg);
  game.play();
}

main();
