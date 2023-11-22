#version 300 es

precision mediump float;

uniform sampler2D uTexture;

in vec2 vTexCoord;

out vec4 fFragColor;

void main() {
    fFragColor = texture(uTexture, vTexCoord);
}