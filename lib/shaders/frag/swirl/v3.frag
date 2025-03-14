#version 300 es
precision highp float;

// UNIFORMS
// Time-based and resolution uniforms passed from JavaScript
uniform float iTime;          // Current time in seconds
uniform vec3 iResolution;     // Viewport resolution (width, height, pixel ratio)

uniform sampler2D iChannel1;  // Input texture

// User-controllable parameters
#define PIXELATED false            // Toggle for pixelation effect
#define PIXELATION_FACTOR 4.0    // Factor to use for the pixelation effect, larger means more pixelated

#define ASPECT_RATIO_FIX 1.0      // Aspect ratio fix factor
#define OFFSET vec2(0.0, 0.0)               // Initial UV offset vector
#define SCALE 1.0               // UV scaling factor

#define TIME_OFFSET 75.0         // Initial offset for the time

#define APPLY_SWIRL true           // Whether to apply the rotation effect
#define SWIRL_AMOUNT 1.25         // Amount of swirling
#define SWIRL_SPEED 1.0          // Speed of rotation

#define WARP_ITER 5              // Number of iterations to apply the warping
#define WARP_KEEP_IMG_SCALE false     // Whether to maintain the image scaling when applying the warp
#define WARP_SCALE 30.0           // Warp UV scaling factor
#define WARP_AMOUNT 0.5          // Warping factor
#define WARP_SPEED 0.25           // Speed of the warp effect
#define WARP_UV2COEFF vec4(0.5, 0.7, 0.9, 0.3)         // Coefficients for the UV2 iteration in the warping loop
#define WARP_UV3COEFF vec4(1, 0.8, 0.7, -0.5)         // Coefficients for the UV3 iteration in the warping loop

#define COLOUR1 vec4(0.01, 0.03, 0.07, 1)              // Primary, outer colour
#define COLOUR2 vec4(0.01, 0.03, 0.07, 1)              // Secondary, inner colour
#define COLOUR3 vec4(0.01, 0.03, 0.07, 1)              // Tertiary, highlights/shadows colour
#define COLOUR_CONTRAST 3.0      // Contrast adjustment for pure colours
#define COLOUR_SPREAD 0.9        // Factor adjusting the amount of space the inner colour takes
#define COLOUR_SHINE 5.0         // Shine factor, lower = more shine

#define ANTIALIASING true         // Toggle for antialiasing
#define ANTIALIASING_LEVEL 2.0   // Level of antialiasing to apply
#define ANTIALIASING_RADIUS 0.75  // Radius to sample points for antialiasing

// CONSTANTS
#define IMAGE_SCALE 1.0
#define SPIN_EASE 0.5     // Easing factor for rotation

// OUTPUT
out vec4 outColour;

// UV FUNCTIONS
/**
 * Gets the initial UV for further modification.
 *
 * @param fragCoord Fragment coordinates
 * @return initial UV as a 2D vector
 */
vec2 getInitialUV(vec2 fragCoord) {
    vec2 center = iResolution.xy / 2.0f;

    // Calculate texture scaling to maintain aspect ratio
    vec2 texSize = vec2(textureSize(iChannel1, 0));
    vec2 texSizeRatio = texSize / iResolution.xy;
    float minTexSizeRatio = min(texSizeRatio.x, texSizeRatio.y);

    // Scale pixel coordinates to match texture size while maintaining aspect ratio
    vec2 scaledPx = (((fragCoord - center) * minTexSizeRatio) / (texSizeRatio * IMAGE_SCALE)) + center;
    vec2 uv = scaledPx * texSizeRatio;
    vec2 uvScaled = uv / texSize;

    // Mix with aspect ratio UV
    vec2 basicUV = (fragCoord - center) / length(iResolution.xy);
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
    float uvLen = length(uv);  // Length of UV

    // Calculate rotation angle based on time and user parameters
    float time = (iTime * SPIN_EASE * -0.1f * SWIRL_SPEED) + TIME_OFFSET;  // Make swirl anticlockwise
    float newPixelAngle = (atan(uv.y, uv.x)) + time - SPIN_EASE * 20.0f * (SWIRL_AMOUNT * uvLen + (1.0f - SWIRL_AMOUNT));

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
    float time = -iTime * WARP_SPEED;  // Warp goes anticlockwise

    // Define initial iteration values
    vec2 uv1 = vec2(uv.x + uv.y);
    vec2 uv2 = uv;
    vec2 uv3 = uv * WARP_SCALE;

    // Get uv2 and uv3 coefficients
    float uv2a = WARP_UV2COEFF.x;
    float uv2b = WARP_UV2COEFF.y;
    float uv2c = WARP_UV2COEFF.z;
    float uv2d = WARP_UV2COEFF.w;
    float uv3a = WARP_UV3COEFF.x;
    float uv3b = WARP_UV3COEFF.y;
    float uv3c = WARP_UV3COEFF.z;
    float uv3d = WARP_UV3COEFF.w;

    // Iterative warping using trigonometric functions
    for(int i = 0; i < WARP_ITER; i++) {
        uv1 += uv3 + cos(length(uv3));
        uv2 += vec2(cos(uv2a * uv1.y + uv2b * time), sin(uv2c * uv1.x + uv2d * time));
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
    vec4 baseColour = baseColourFactor * COLOUR1;
    vec4 accentColour = (1.f - baseColourFactor) * (COLOUR1 * c1p + COLOUR2 * c2p + COLOUR3 * c3p);
    float shineAmount = max(0.0f, c1p * (COLOUR_SHINE + 1.0f) - COLOUR_SHINE) + max(0.0f, c2p * (COLOUR_SHINE + 1.0f) - COLOUR_SHINE);

    vec4 colour = baseColour + accentColour + shineAmount;
    return colour;
}

// MAIN
vec4 getFinalColour(vec2 fragCoord) {
    // Get the initial UV
    vec2 initialUV = getInitialUV(fragCoord);
    vec2 uv = vec2(initialUV);  // Copy of the initial UV for us to modify

    // Apply effects
    if(APPLY_SWIRL) {
        uv = applySwirl(uv);
    }
    if(WARP_ITER > 0) {
        uv = applyWarp(uv);
    }

    // Sample colour and return
    return sampleColour(uv);
}

void main() {
    if(!ANTIALIASING) {
        outColour = getFinalColour(gl_FragCoord.xy);
        return;
    }

    // Apply antialiasing
    // (Adapted from https://www.shadertoy.com/view/wtjfRV by Greg Rostami)
    float step = 1.0f / ANTIALIASING_LEVEL;

    vec4 finalColour = vec4(0);
    for(float x = -ANTIALIASING_RADIUS; x < ANTIALIASING_RADIUS; x += step) {
        for(float y = -ANTIALIASING_RADIUS; y < ANTIALIASING_RADIUS; y += step) {
            finalColour += min(getFinalColour(gl_FragCoord.xy + vec2(x, y)), 1.0f);
        }
    }
    finalColour /= (4.0f * ANTIALIASING_RADIUS * ANTIALIASING_RADIUS) * (ANTIALIASING_LEVEL * ANTIALIASING_LEVEL);
    outColour = finalColour;
}
