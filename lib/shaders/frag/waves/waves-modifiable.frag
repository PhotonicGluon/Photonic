#version 300 es
precision highp float;

// UNIFORMS
// Time-based and resolution uniforms passed from JavaScript
uniform float iTime;          // Current time in seconds
uniform vec3 iResolution;     // Viewport resolution (width, height, pixel ratio)

// User-controllable parameters
uniform float uWaveFreq;    // Frequency of the wave
uniform float uWaveHeight;  // Height of the wave
uniform float uWaveBorder;  // Border width of the wave
uniform float uWaveSpeed;   // Speed of the wave effect

// CONSTANTS
#define TAU 6.283185307179586

// OUTPUT
out vec4 outColour;

float wave(float x) {
    return (sin(uWaveFreq * x) * uWaveHeight / 2.0f) + 0.5f;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;

    // Get the theta values
    vec2 theta = mod(uv * TAU, TAU);

    // Get the corresponding y value for the sine wave
    float time = iTime * uWaveSpeed;

    float sinY = wave(theta.x + time);
    float delta = abs(uv.y - sinY);

    // Get the appropriate colour based on distance to wave
    if(delta <= uWaveBorder) {
        float intensity = (uWaveBorder - delta) / uWaveBorder;
        outColour = vec4(intensity, intensity, intensity, 1);
    } else {
        outColour = vec4(0, 0, 0, 1);
    }

}
