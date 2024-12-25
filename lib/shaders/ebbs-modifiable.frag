#version 300 es
precision highp float;

// MACROS
#define flipY(v2) vec2(v2.x, 1.0 - v2.y)  // Macro to flip texture coordinates vertically

// CONSTANTS
#define IMAGE_SCALE 1.0
#define PIXEL_SIZE_FAC 700.0  // Base size for pixelation
#define SPEED_OFFSET 302.2f   // Initial offset for the speed
#define SPIN_EASE 0.5         // Easing factor for rotation
#define contrast 1.5          // Contrast adjustment (unused in current code)

// UNIFORMS
// Time-based and resolution uniforms passed from JavaScript
uniform float iTime;          // Current time in seconds
uniform vec3 iResolution;     // Viewport resolution (width, height, pixel ratio)

uniform sampler2D iChannel1;  // Input texture

// User-controllable parameters
uniform bool uPixelated;        // Toggle for pixelation effect
uniform float uAspectRatioFix;  // Aspect ratio fix factor

uniform bool uApplyRotation;    // Whether to apply the rotation effect
uniform float uSwirlAmount;     // Amount of swirling
uniform float uRotationSpeed;   // Speed of rotation

uniform int uWarpIter;          // Number of iterations to apply the warping

uniform float uMix;             // Blend factor between normal and warped effect (0-1)

// Output colour
out vec4 outColour;

// UV FUNCTIONS
vec2 getInitialUV() {
    vec2 center = iResolution.xy / 2.0f;

    // Calculate texture scaling to maintain aspect ratio
    vec2 texSize = vec2(textureSize(iChannel1, 0));
    vec2 texSizeRatio = texSize / iResolution.xy;
    float minTexSizeRatio = min(texSizeRatio.x, texSizeRatio.y);

    // Scale pixel coordinates to match texture size while maintaining aspect ratio
    vec2 scaledPx = (((gl_FragCoord.xy - center) * minTexSizeRatio) / (texSizeRatio * IMAGE_SCALE)) + center;
    vec2 uv = scaledPx * texSizeRatio;
    vec2 uvScaled = uv / texSize;

    // Mix with aspect ratio UV
    vec2 basicUV = (gl_FragCoord.xy - center) / length(iResolution.xy);
    vec2 mixedUV = mix(basicUV, uvScaled, uAspectRatioFix) + vec2(0.0f, 0.0f);  // TODO: Make this `uOffset`

    // Apply pixelation
    if(uPixelated) {
        mixedUV = floor((mixedUV * PIXEL_SIZE_FAC)) / PIXEL_SIZE_FAC;
    }

    // Shift UV to middle and scale
    float midpointOffset = 0.5f * uAspectRatioFix;
    return (mixedUV - midpointOffset) * 1.0f;  // TODO: make this `uScale`
}

vec2 applySwirl(vec2 uv) {
    float uv_len = length(uv);  // Length of UV

    // Calculate rotation angle based on time and user parameters
    float speed = (iTime * SPIN_EASE * 0.1f * uRotationSpeed) + SPEED_OFFSET;
    float new_pixel_angle = (atan(uv.y, uv.x)) + speed -
        SPIN_EASE * 20.f * (1.0f * uSwirlAmount * uv_len + (1.f - 1.f * uSwirlAmount));

    // Calculate center point and apply swirl transformation
    vec2 mid = (iResolution.xy / length(iResolution.xy)) / 2.f;
    vec2 newUV = (vec2((uv_len * cos(new_pixel_angle) + mid.x), (uv_len * sin(new_pixel_angle) + mid.y)) - mid);
    return newUV;
}

vec2 applyWarp(vec2 uv) {
    vec2 uvSummed = vec2(uv.x + uv.y);  // TODO: What is this?
    vec2 uvScaled = uv * 30.0f;  // TODO: make this `uWarpScale`
    float speed = iTime * 1.0f;  // TODO: make this `uSpeed`

    // Iterative warping using trigonometric functions
    // TODO: Remove magic constants
    for(int i = 0; i < uWarpIter; i++) {
        uvSummed += uvScaled + cos(length(uvScaled));
        uv += 0.5f * vec2(cos(5.1123314f + 0.353f * uvSummed.y + speed * 0.131121f), sin(uvSummed.x - 0.113f * speed));
        uvScaled -= 1.0f * cos(uvScaled.x + uvScaled.y) - 1.0f * sin(uvScaled.x * 0.711f - uvScaled.y);
    }

    // if(uKeepImageScale) {
    //     uvScaled /= uWarpScale;
    //     uvScaled -= uOffset;
    // }

    // Mix between original and warped coordinates based on user parameter
    return mix(uv, uvScaled, uMix);  // TODO: make this `uWarpAmount`
}

// MISC FUNCTIONS
/**
 * Apply the given UV to the image.
 * 
 * @param uv UV to apply to the image
 */
vec4 sampleImage(vec2 uv) {
    vec2 shiftedUv = uv + 0.5f;  // Center the UV coordinates
    return texture(iChannel1, flipY(shiftedUv));  // Sample texture with vertical flip
}

// MAIN
void main() {
    // Get the initial UV
    vec2 initialUV = getInitialUV();
    vec2 uv = vec2(initialUV);  // Copy of the initial UV for us to modify

    // Apply effects
    if(uApplyRotation) {
        uv = applySwirl(uv);
    }
    if(uWarpIter > 0) {
        uv = applyWarp(uv);
    }

    vec2 finalUV = mix(initialUV, uv, uMix);

    // Get the colour to return
    outColour = sampleImage(finalUV);  // TODO: Allow the use of just colours
}
