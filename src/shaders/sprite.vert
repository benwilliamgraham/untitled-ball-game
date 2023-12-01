#version 300 es

uniform vec2 uResolution;
uniform vec2 uDimensions;
uniform vec2 uPosition;
uniform float uRotation;

in vec2 aPos;

out vec2 vTexCoord;

void main() {
    vec2 posPixels = (aPos * uDimensions) + uPosition;
    gl_Position = vec4(posPixels / uResolution * 2.0 - 1.0, 0.0, 1.0);
    vTexCoord = vec2(aPos.x, 1.0 - aPos.y);
}