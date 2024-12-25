#version 300 es
precision highp float;

#define flipY(v2) vec2(v2.x, 1.0 - v2.y)  // Macro to flip texture coordinates vertically

// Time-based and resolution uniforms passed from JavaScript
uniform float iTime;          // Current time in seconds
uniform vec3 iResolution;     // Viewport resolution (width, height, pixel ratio)

uniform sampler2D iChannel1;  // Input texture

// User-controllable parameters
uniform bool uPixelated;       // Toggle for pixelation effect
uniform float uMix;            // Blend factor between normal and warped effect (0-1)
uniform float uSwirlAmount;    // Amount of swirling
uniform float uRotationSpeed;  // Speed of rotation

// Constants for effect parameters
#define PIXEL_SIZE_FAC 700.0  // Base size for pixelation
#define SPEED_OFFSET 302.2f   // Initial offset for the speed
#define SPIN_EASE 0.5         // Easing factor for rotation
#define contrast 1.5          // Contrast adjustment (unused in current code)

// Output colour
out vec4 outColour;

// Helper function to sample the input texture
vec4 sampleImage(vec2 uv) {
    vec2 shiftedUv = uv + 0.5f;  // Center the UV coordinates
    return texture(iChannel1, flipY(shiftedUv));  // Sample texture with vertical flip
}

/** 
 * Main warping function - creates a combination of swirl and paint-like effects.
 * 
 * Parts of this shader have been copied from https://www.playbalatro.com/
 *
 * @param areaResolution resolution of the area in pixels
 * @param areaXY current pixel position on the texture being warped
 */
vec2 ebbsWarp(vec2 areaResolution, vec2 areaXY) {
    // Calculate pixel size based on resolution and pixelation toggle
    float pixel_size = uPixelated ? length(areaResolution.xy) / PIXEL_SIZE_FAC : 1.0f;

    // Convert to normalized UV coordinates (-0.5 to 0.5 range)
    vec2 uv = (floor(areaXY.xy * (1.0f / pixel_size)) * pixel_size - 0.5f * areaResolution.xy) / length(areaResolution.xy) - vec2(0.0f, 0.0f);
    float uv_len = length(uv);  // Distance from center

    vec2 initialUv = vec2(uv);  // Store initial UVs for mixing later

    // Calculate rotation angle based on time and user parameters
    float speed = (iTime * SPIN_EASE * 0.1f * uRotationSpeed) + SPEED_OFFSET;
    float new_pixel_angle = (atan(uv.y, uv.x)) + speed -
        SPIN_EASE * 20.f * (1.0f * uSwirlAmount * uv_len + (1.f - 1.f * uSwirlAmount));

    // Calculate center point and apply swirl transformation
    vec2 mid = (areaResolution.xy / length(areaResolution.xy)) / 2.f;
    uv = (vec2((uv_len * cos(new_pixel_angle) + mid.x), (uv_len * sin(new_pixel_angle) + mid.y)) - mid);

    // Apply iterative paint-like warping effect
    uv *= 30.f;  // Scale up for more visible effect
    speed = iTime * (1.f);
    vec2 uv2 = vec2(uv.x + uv.y);

    // Iterative warping using trigonometric functions
    for(int i = 0; i < 5; i++) {
        uv2 += uv + cos(length(uv));
        uv += 0.5f * vec2(cos(5.1123314f + 0.353f * uv2.y + speed * 0.131121f), sin(uv2.x - 0.113f * speed));
        uv -= 1.0f * cos(uv.x + uv.y) - 1.0f * sin(uv.x * 0.711f - uv.y);
    }

    // Mix between original and warped coordinates based on user parameter
    return mix(initialUv, uv, uMix);
}

void main() {
    vec2 halfRes = iResolution.xy / 2.0f;  // Center of screen

    // Calculate texture scaling to maintain aspect ratio
    vec2 texSize = vec2(textureSize(iChannel1, 0));
    vec2 texSizeRatio = texSize / iResolution.xy;
    float minTexSizeRatio = min(texSizeRatio.x, texSizeRatio.y);

    // Scale pixel coordinates to match texture size while maintaining aspect ratio
    vec2 scaledPx = (((gl_FragCoord.xy - halfRes) * minTexSizeRatio) / texSizeRatio) + halfRes;

    // Apply warping effect and sample the texture
    vec2 warpedUv = ebbsWarp(texSize, scaledPx * texSizeRatio);
    outColour = sampleImage(warpedUv);
}
