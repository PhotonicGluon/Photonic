#version 300 es
precision highp float;

// MACROS
#define flipY(v2) vec2(v2.x, 1.0 - v2.y)  // Macro to flip texture coordinates vertically

// UNIFORMS
// Time-based and resolution uniforms passed from JavaScript
uniform float iTime;          // Current time in seconds
uniform vec3 iResolution;     // Viewport resolution (width, height, pixel ratio)

uniform sampler2D iChannel1;  // Input texture

// CONSTANTS
// User-controllable parameters
#define PIXELATED false          // Toggle for pixelation effect
#define PIXELATION_FACTOR 4.0  // Factor to use for the pixelation effect, larger means more pixelated

#define ASPECT_RATIO_FIX 1.0    // Aspect ratio fix factor
#define OFFSET vec2(0.0,0.0)             // Initial UV offset vector
#define SCALE 1.0             // UV scaling factor

#define APPLY_SWIRL true         // Whether to apply the rotation effect
#define SWIRL_AMOUNT 1.25       // Amount of swirling
#define SWIRL_SPEED 1.0        // Speed of rotation

#define WARP_ITER 5            // Number of iterations to apply the warping
#define WARP_KEEP_IMG_SCALE false   // Whether to maintain the image scaling when applying the warp
#define WARP_SCALE 30.0         // Warp UV scaling factor
#define WARP_AMOUNT 0.5        // Warping factor
#define WARP_SPEED 0.25         // Speed of the warp effect
#define WARP_UV2_COEFF vec4(0.5,0.65,0.9,0.275)       // Coefficients for the UV2 iteration in the warping loop
#define WARP_UV3_COEFF vec4(1.0,0.8,0.7,-0.5)       // Coefficients for the UV3 iteration in the warping loop

#define USE_COLOUR true          // Whether to use colour instead of an image
#define COLOUR_1 vec4(0.0,0.0,0.0,1.0)            // Primary, outer colour
#define COLOUR_2 vec4(0.0,0.0,0.0,1.0)            // Secondary, inner colour
#define COLOUR_3 vec4(0.0,0.0,0.0,1.0)            // Tertiary, highlights/shadows colour
#define COLOUR_CONTRAST 3.0    // Contrast adjustment for pure colours
#define COLOUR_SPREAD 0.9      // Factor adjusting the amount of space the inner colour takes
#define COLOUR_SHINE 5.0       // Shine factor, lower = more shine

#define MIX 0.1             // Blend factor between normal and warped effect (0-1)

#define IMAGE_SCALE 1.0
#define SPEED_OFFSET 300.0   // Initial offset for the speed
#define SPIN_EASE 0.5        // Easing factor for rotation

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
    vec2 mixedUV = mix(basicUV, uvScaled, ASPECT_RATIO_FIX) - OFFSET;

    // Apply pixelation
    if(PIXELATED) {
        float pixelSize = pow(1.5f, 20.0f - PIXELATION_FACTOR);
        mixedUV = floor((mixedUV * pixelSize)) / pixelSize;
    }

    // Shift UV to middle and scale
    float midpointOffset = 0.5f * ASPECT_RATIO_FIX;
    return (mixedUV - midpointOffset) * SCALE;
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
    float speed = (iTime * SPIN_EASE * 0.1f * SWIRL_SPEED) + SPEED_OFFSET;
    float new_pixel_angle = (atan(uv.y, uv.x)) + speed - SPIN_EASE * 20.0f * (SWIRL_AMOUNT * uv_len + (1.0f - SWIRL_AMOUNT));

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
    float speed = iTime * WARP_SPEED;

    // Define initial iteration values
    vec2 uv1 = vec2(uv.x + uv.y);
    vec2 uv2 = uv;
    vec2 uv3 = uv * WARP_SCALE;

    // Get uv2 and uv3 coefficients
    float uv2a = WARP_UV2_COEFF.x;
    float uv2b = WARP_UV2_COEFF.y;
    float uv2c = WARP_UV2_COEFF.z;
    float uv2d = WARP_UV2_COEFF.w;
    float uv3a = WARP_UV3_COEFF.x;
    float uv3b = WARP_UV3_COEFF.y;
    float uv3c = WARP_UV3_COEFF.z;
    float uv3d = WARP_UV3_COEFF.w;

    // Iterative warping using trigonometric functions
    for(int i = 0; i < WARP_ITER; i++) {
        uv1 += uv3 + cos(length(uv3));
        uv2 += vec2(cos(uv2a * uv1.y + uv2b * speed), sin(uv2c * uv1.x + uv2d * speed));
        uv3 -= cos(uv3a * uv3.x + uv3b * uv3.y) - sin(uv3c * uv3.x + uv3d * uv3.y);
    }

    // Adjust if image scale is to be preserved
    if(WARP_KEEP_IMG_SCALE) {
        uv3 /= WARP_SCALE;
        uv3 += OFFSET;
    }

    // Mix between original and warped coordinates based on user parameter
    return mix(uv2, uv3, WARP_AMOUNT);
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
    float contrastModifier = 0.25f * COLOUR_CONTRAST + 0.5f * SWIRL_AMOUNT + 1.0f;  // Base contrast modifier of 1

    // Compute a number that represents the chosen colour
    /*
     * The `paintVal` will be a number that is clipped from 0 to 2, where
     *   0 = Secondary colour
     *   2 = Primary colour
     */
    float paintVal = length(uv) * (1.0f - COLOUR_SPREAD) * contrastModifier;
    paintVal = min(2.0f, max(0.0f, paintVal));

    // Compute colour percentages
    float c1p = max(0.f, 1.f - contrastModifier * abs(1.f - paintVal));
    float c2p = max(0.f, 1.f - contrastModifier * paintVal);
    float c3p = 1.f - min(1.f, c1p + c2p);

    // Generate final colour
    float baseColourFactor = 0.3f / COLOUR_CONTRAST;  // Amount of primary colour to always be shown
    vec4 baseColour = baseColourFactor * COLOUR_1;
    vec4 accentColour = (1.f - baseColourFactor) * (COLOUR_1 * c1p + COLOUR_2 * c2p + COLOUR_3 * c3p);
    float shineAmount = max(0.0f, c1p * (COLOUR_SHINE + 1.0f) - COLOUR_SHINE) + max(0.0f, c2p * (COLOUR_SHINE + 1.0f) - COLOUR_SHINE);

    vec4 colour = baseColour + accentColour + shineAmount;
    return colour;
}

// MAIN
void main() {
    // Get the initial UV
    vec2 initialUV = getInitialUV();
    vec2 uv = vec2(initialUV);  // Copy of the initial UV for us to modify

    // Apply effects
    if(APPLY_SWIRL) {
        uv = applySwirl(uv);
    }
    if(WARP_ITER > 0) {
        uv = applyWarp(uv);
    }

    // Get the colour to return
    outColour = USE_COLOUR ? sampleColour(uv) : sampleImage(mix(initialUV, uv, MIX));
}
