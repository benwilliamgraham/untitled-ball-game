"use strict";

class Scene {
  constructor() {
    // Sprites that obstruct the player's view
    this.sprites = new Set();
  }

  update(dt) {
    for (const sprite of this.sprites) {
      sprite.update(dt);
    }
  }
}

export default Scene;
