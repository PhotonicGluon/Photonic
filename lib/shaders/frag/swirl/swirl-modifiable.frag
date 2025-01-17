#version 300 es
precision highp float;

// MACROS
#define flipY(v2) vec2(v2.x, 1.0 - v2.y)  // Macro to flip texture coordinates vertically

// UNIFORMS
// Time-based and resolution uniforms passed from JavaScript
uniform float iTime;          // Current time in seconds
uniform vec3 iResolution;     // Viewport resolution (width, height, pixel ratio)

uniform sampler2D iChannel1;  // Input texture

// User-controllable parameters
uniform bool uPixelated;          // Toggle for pixelation effect
uniform float uPixelationFactor;  // Factor to use for the pixelation effect, larger means more pixelated

uniform float uAspectRatioFix;    // Aspect ratio fix factor
uniform vec2 uOffset;             // Initial UV offset vector
uniform float uScale;             // UV scaling factor

uniform bool uApplySwirl;         // Whether to apply the rotation effect
uniform float uSwirlAmount;       // Amount of swirling
uniform float uSwirlSpeed;        // Speed of rotation

uniform int uWarpIter;            // Number of iterations to apply the warping
uniform bool uWarpKeepImgScale;   // Whether to maintain the image scaling when applying the warp
uniform float uWarpScale;         // Warp UV scaling factor
uniform float uWarpAmount;        // Warping factor
uniform float uWarpSpeed;         // Speed of the warp effect
uniform vec4 uWarpUV2Coeff;       // Coefficients for the UV2 iteration in the warping loop
uniform vec4 uWarpUV3Coeff;       // Coefficients for the UV3 iteration in the warping loop

uniform bool uUseColour;          // Whether to use colour instead of an image
uniform vec4 uColour1;            // Primary, outer colour
uniform vec4 uColour2;            // Secondary, inner colour
uniform vec4 uColour3;            // Tertiary, highlights/shadows colour
uniform float uColourContrast;    // Contrast adjustment for pure colours
uniform float uColourSpread;      // Factor adjusting the amount of space the inner colour takes
uniform float uColourShine;       // Shine factor, lower = more shine

uniform float uMix;               // Blend factor between normal and warped effect (0-1)

// CONSTANTS
#define IMAGE_SCALE 1.0
#define TIME_OFFSET 64.0  // Initial offset for the time
#define SPIN_EASE 0.5     // Easing factor for rotation

// OUTPUT
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
    vec2 mixedUV = mix(basicUV, uvScaled, uAspectRatioFix) - uOffset;

    // Apply pixelation
    if(uPixelated) {
        float pixelSize = pow(1.5f, 20.0f - uPixelationFactor);
        mixedUV = floor((mixedUV * pixelSize)) / pixelSize;
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
    float uvLen = length(uv);  // Length of UV

    // Calculate rotation angle based on time and user parameters
    float time = (iTime * SPIN_EASE * -0.1f * uSwirlSpeed) + TIME_OFFSET;  // Make swirl anticlockwise
    float newPixelAngle = (atan(uv.y, uv.x)) + time - SPIN_EASE * 20.0f * (uSwirlAmount * uvLen + (1.0f - uSwirlAmount));

    // Calculate center point and apply swirl transformation
    vec2 mid = (iResolution.xy / length(iResolution.xy)) / 2.0f;
    vec2 newUV = vec2((uvLen * cos(newPixelAngle) + mid.x), (uvLen * sin(newPixelAngle) + mid.y)) - mid;
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
    float time = -iTime * uWarpSpeed;  // Warp goes anticlockwise

    // Define initial iteration values
    vec2 uv1 = vec2(uv.x + uv.y);
    vec2 uv2 = uv;
    vec2 uv3 = uv * uWarpScale;

    // Get uv2 and uv3 coefficients
    float uv2a = uWarpUV2Coeff.x;
    float uv2b = uWarpUV2Coeff.y;
    float uv2c = uWarpUV2Coeff.z;
    float uv2d = uWarpUV2Coeff.w;
    float uv3a = uWarpUV3Coeff.x;
    float uv3b = uWarpUV3Coeff.y;
    float uv3c = uWarpUV3Coeff.z;
    float uv3d = uWarpUV3Coeff.w;

    // Iterative warping using trigonometric functions
    for(int i = 0; i < uWarpIter; i++) {
        uv1 += uv3 + cos(length(uv3));
        uv2 += vec2(cos(uv2a * uv1.y + uv2b * time), sin(uv2c * uv1.x + uv2d * time));
        uv3 -= cos(uv3a * uv3.x + uv3b * uv3.y) - sin(uv3c * uv3.x + uv3d * uv3.y);
    }

    // Adjust if image scale is to be preserved
    if(uWarpKeepImgScale) {
        uv3 /= uWarpScale;
        uv3 += uOffset;
    }

    // Mix between original and warped coordinates based on user parameter
    return mix(uv2, uv3, uWarpAmount);
}

// SAMPLING FUNCTIONS
/**
 * Samples the image at the specified UV coordinate.
 * 
 * @param uv UV coordinate to sample
 * @return RGBA value of the UV coordinate, based on the image provided. RGBA values are in the
 *     interval [0, 1]
 */
vec4 sampleImage(vec2 uv) {
    vec2 shiftedUV = uv + 0.5f;  // Center the UV coordinates
    return texture(iChannel1, flipY(shiftedUV));  // Sample texture with vertical flip
}

/**
 * Samples a colour at the specified UV coordinate.
 * 
 * @param uv UV coordinate to sample
 * @return RGBA value of the UV coordinate. RGBA values are in the interval [0, 1]
 * @note this colour sampler was partially taken from https://www.playbalatro.com/
 */
vec4 sampleColour(vec2 uv) {
    // Calculate paint contrast factor
    float contrastModifier = 0.25f * uColourContrast + 0.5f * uSwirlAmount + 1.0f;  // Base contrast modifier of 1

    // Compute a number that represents the chosen colour
    /*
     * The `paintVal` will be a number that is clipped from 0 to 2, where
     *   0 = Secondary colour
     *   2 = Primary colour
     */
    float paintVal = length(uv) * (1.0f - uColourSpread) * contrastModifier;
    paintVal = min(2.0f, max(0.0f, paintVal));

    // Compute colour percentages
    float c1p = max(0.f, 1.f - contrastModifier * abs(1.f - paintVal));
    float c2p = max(0.f, 1.f - contrastModifier * paintVal);
    float c3p = 1.f - min(1.f, c1p + c2p);

    // Generate final colour
    float baseColourFactor = 0.3f / uColourContrast;  // Amount of primary colour to always be shown
    vec4 baseColour = baseColourFactor * uColour1;
    vec4 accentColour = (1.f - baseColourFactor) * (uColour1 * c1p + uColour2 * c2p + uColour3 * c3p);
    float shineAmount = max(0.0f, c1p * (uColourShine + 1.0f) - uColourShine) + max(0.0f, c2p * (uColourShine + 1.0f) - uColourShine);

    vec4 colour = baseColour + accentColour + shineAmount;
    return colour;
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

    // Get the colour to return
    outColour = uUseColour ? sampleColour(uv) : sampleImage(mix(initialUV, uv, uMix));
}
