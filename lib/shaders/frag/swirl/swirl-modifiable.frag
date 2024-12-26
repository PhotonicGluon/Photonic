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
uniform vec2 uOffset;           // Initial UV offset vector
uniform float uScale;           // UV scaling factor

uniform bool uApplySwirl;       // Whether to apply the rotation effect
uniform float uSwirlAmount;     // Amount of swirling
uniform float uSwirlSpeed;      // Speed of rotation

uniform int uWarpIter;          // Number of iterations to apply the warping
uniform bool uWarpKeepImgScale; // Whether to maintain the image scaling when applying the warp
uniform float uWarpScale;       // Warp UV scaling factor
uniform float uWarpAmount;      // Warping factor
uniform float uWarpSpeed;       // Speed of the warp effect

uniform float uMix;             // Blend factor between normal and warped effect (0-1)

// Output colour
out vec4 outColour;

// UV FUNCTIONS
/**
 * Gets the initial UV for further modification.
 *
 * @return initial UV as a 2D vector
 */
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
    vec2 mixedUV = mix(basicUV, uvScaled, uAspectRatioFix) + uOffset;

    // Apply pixelation
    if(uPixelated) {
        mixedUV = floor((mixedUV * PIXEL_SIZE_FAC)) / PIXEL_SIZE_FAC;
    }

    // Shift UV to middle and scale
    float midpointOffset = 0.5f * uAspectRatioFix;
    return (mixedUV - midpointOffset) * uScale;
}

/**
 * Applies a swirl effect to the UV coordinate.
 *
 * @param uv UV coordinate to apply the swirl effect to
 * @return modified UV coordinate
 */
vec2 applySwirl(vec2 uv) {
    float uv_len = length(uv);  // Length of UV

    // Calculate rotation angle based on time and user parameters
    float speed = (iTime * SPIN_EASE * 0.1f * uSwirlSpeed) + SPEED_OFFSET;
    float new_pixel_angle = (atan(uv.y, uv.x)) + speed -
        SPIN_EASE * 20.0f * (1.0f * uSwirlAmount * uv_len + (1.0f - 1.0f * uSwirlAmount));

    // Calculate center point and apply swirl transformation
    vec2 mid = (iResolution.xy / length(iResolution.xy)) / 2.0f;
    vec2 newUV = vec2((uv_len * cos(new_pixel_angle) + mid.x), (uv_len * sin(new_pixel_angle) + mid.y)) - mid;
    return newUV;
}

/*
 * Applies a warping effect to the given UV coordinate.
 *
 * @param uv UV coordinate to apply the warping effect to
 * @return modified UV coordinate
 * @note this warp effect was partially taken from https://www.playbalatro.com/
 */
vec2 applyWarp(vec2 uv) {
    float speed = iTime * uWarpSpeed;

    // Define initial iteration values
    vec2 uv1 = vec2(uv.x + uv.y);
    vec2 uv2 = uv;
    vec2 uv3 = uv * uWarpScale;

    // Iterative warping using trigonometric functions
    for(int i = 0; i < uWarpIter; i++) {
        uv1 += uv3 + cos(length(uv3));
        uv2 += vec2(cos(uv1.y + speed), sin(uv1.x - speed));
        uv3 -= cos(uv3.x + uv3.y) - sin(uv3.x - uv3.y);
    }

    // Adjust if image scale is to be preserved
    if(uWarpKeepImgScale) {
        uv3 /= uWarpScale;
        uv3 -= uOffset;
    }

    // Mix between original and warped coordinates based on user parameter
    return mix(uv2, uv3, uWarpAmount);
}

// MISC FUNCTIONS
/**
 * Samples the image at the specified UV coordinate.
 * 
 * @param uv UV coordinate to sample
 * @return RGBA value of the UV coordinate, based on the image provided. RGBA values are in the
 *     interval [0, 1].
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
    if(uApplySwirl) {
        uv = applySwirl(uv);
    }
    if(uWarpIter > 0) {
        uv = applyWarp(uv);
    }

    vec2 finalUV = mix(initialUV, uv, uMix);

    // Get the colour to return
    outColour = sampleImage(finalUV);  // TODO: Allow the use of just colours
}
