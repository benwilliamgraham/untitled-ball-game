"use strict";

class Camera {
  constructor(x, y, rotation, width, height) {
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.width = width;
    this.height = height;

    this.viewMat = mat3.create();
    this.updateMatrix();
  }

  updateMatrix() {
    const { x, y, rotation, width, height, viewMat } = this;

    mat3.identity(viewMat);
    mat3.translate(viewMat, viewMat, [-x, -y]);
    mat3.rotate(viewMat, viewMat, -rotation);
    mat3.scale(viewMat, viewMat, [2 / width, 2 / height]);
  }
}

export default Camera;
