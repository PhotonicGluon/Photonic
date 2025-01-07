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

uniform int uLineNum;

// CONSTANTS
#define INF 1e10
#define TAU 6.283185307179586

// OUTPUT
out vec4 outColour;

float wave(float x) {
    return (sin(uWaveFreq * x) * uWaveHeight / 2.0f) + 0.5f;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float time = iTime * uWaveSpeed;

    // Draw if it is close to a line
    float minDelta = INF;
    for(int i = 0; i < 2 * uLineNum + 1; i++) {  // *2 cos' we need hidden off-screen lines
        float lineX = float(i - uLineNum) / float(uLineNum) + mod(time, 1.0f);
        float delta = abs(uv.x - lineX);
        minDelta = min(delta, minDelta);
    }

    if(minDelta <= uWaveBorder) {
        float intensity = (uWaveBorder - minDelta) / uWaveBorder;
        outColour = vec4(intensity, intensity, intensity, 1);
    } else {
        outColour = vec4(0, 0, 0, 1);
    } 

    // // Get the theta values
    // vec2 theta = mod(uv * TAU, TAU);

    // // Get the corresponding y value for the sine wave
    // float sinY = wave(theta.x + time);
    // float delta = abs(uv.y - sinY);

    // // Get the appropriate colour based on distance to wave
    // if(delta <= uWaveBorder) {
    //     float intensity = (uWaveBorder - delta) / uWaveBorder;
    //     outColour = vec4(intensity, intensity, intensity, 1);
    // } else {
    //     outColour = vec4(0, 0, 0, 1);
    // }

}
