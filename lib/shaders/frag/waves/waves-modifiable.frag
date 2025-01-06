#version 300 es
precision highp float;

// UNIFORMS
// Time-based and resolution uniforms passed from JavaScript
uniform float iTime;          // Current time in seconds
uniform vec3 iResolution;     // Viewport resolution (width, height, pixel ratio)

// User-controllable parameters
uniform float uWavePeriod;
uniform float uWaveHeight;
uniform float uWaveBorder;

// CONSTANTS
#define PI 3.141592

// OUTPUT
out vec4 outColour;

float wave(float x) {
    return (sin(uWavePeriod * PI * x + iTime) * uWaveHeight / 2.0f) + 0.5f;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;

    // Get the corresponding y value for the sine wave
    float sinY = wave(uv.x);
    float delta = abs(uv.y - sinY);

    if(delta <= uWaveBorder) {
        float intensity = (uWaveBorder - delta) / uWaveBorder;
        outColour = vec4(intensity, intensity, intensity, 1);
    } else {
        outColour = vec4(0, 0, 0, 1);
    }

}
