#version 300 es
precision highp float;

// UNIFORMS
// Time-based and resolution uniforms passed from JavaScript
uniform float iTime;       // Current time in seconds
uniform vec3 iResolution;  // Viewport resolution (width, height, pixel ratio)

// Constant uniforms
uniform float cTimeOffset;  // Offset for starting time of the effect

// User-controllable parameters
#define SCALE 1.0                // Scaling factor
#define REPEAT_INTERVAL 7.0       // Tetra noise repeat interval

#define SPEED 0.0125                // Speed of the effect
#define COLOUR_BACKGROUND vec3(0.01, 0.03, 0.07)      // Background colour
#define COLOUR_LINES vec3(0.25, 0.25, 0.25)           // Lines' colour

#define NOISE_FACTOR 0.75          // 'Height' of the noise surface
#define NOISE_LINEAR_DIRECTION vec2(0.373, 0.267)  // Direction of the linear gradient 
#define NOISE_LINEAR_BLEND 0.5     // Blending factor of the noise with a linear gradient
#define NOISE_COEFF1 vec3(6.5, 1.5, 0.3)           // Coefficients for the first set of noise calculations
#define NOISE_COEFF2 vec3(1.0, 0.35, 1.75)           // Coefficients for the second set of noise calculations
#define NOISE_COEFF3 vec3(9.0, 0.25, 5.0)           // Coefficients for the third set of noise calculations

#define LINE_SPACING 0.08          // Spacing factor between lines
#define LINE_WEIGHT 0.65           // Weight of the lines
#define LINE_BASE_SIZE 3.5         // Base line size

// CONSTANTS
#define TAU 6.283185

#define REFERENCE_RESOLUTION 256.0  // Reference resolution to use when scaling line weight by resolution

// OUTPUT
out vec4 outColour;

// UV FUNCTIONS
/**
 * Gets the initial UV for further modification.
 *
 * @return initial UV as a 2D vector
 */
vec2 getInitialUV() {
    // Normalize UV to [-1, 1] for y axis and scaled according to aspect ratio for x axis
    vec2 uv = (-iResolution.xy + 2.0f * gl_FragCoord.xy) / iResolution.y;

    // Zoom in
    uv *= SCALE;

    return uv;
}

// SMOOTHING FUNCTIONS
/*
 * (These functions were adapted from https://www.shadertoy.com/view/Xt3yDS by tdhooper)
 * 
 * Imagine we have the following domain:
 *     0 1 2 3 4 5 6 7 8 9 ...
 * 
 * If you repeat with a size of 3, you get hard edges between 2 and 0:
 *     0 1 2 0 1 2 0 1 2 ...
 * 
 * You could flip each repetition, but you'd see a visible mirror effect:
 *     0 1 2 2 1 0 0 1 2 ...
 * 
 * So instead, take two samples out of phase:
 *     0 1 2 0 1 2 0 1 2 ...
 *     2 0 1 2 0 1 2 0 1 ...
 * 
 * And then blend the samples at these points in such a way that the visible joins of one sample are masked by the 
 * continuous part of the other sample.
 */

vec2 smoothRepeatStart(float x, float size) {
    return vec2(mod(x - size / 2.0f, size), mod(x, size));
}

float smoothRepeatEnd(float a, float b, float x, float size) {
    float mixFactor = smoothstep(0.0f, 1.0f, sin((x / size) * TAU - TAU * 0.25f) * 0.5f + 0.5f);
    return mix(a, b, mixFactor);
}

// NOISE FUNCTIONS
/**
 * Generates a vec3 hash of an input vec3.
 * 
 * @param p input vec3
 * @return a vec3 hash
 * @note this hash was taken from https://www.shadertoy.com/view/ldscWH by Shane
 */
vec3 hash33(vec3 p) {
    float n = sin(dot(p, vec3(7, 157, 113)));
    return fract(vec3(2097152, 262144, 32768) * n) * 2.0f - 1.0f;
}

/**
 * Simplex(ish) noise.
 * 
 * @param p input vec3
 * @return a simplex(ish) noise value
 * @note this noise code was taken from https://www.shadertoy.com/view/ldscWH by Shane
 */
float tetraNoise(vec3 p) {
    // Skewing the cubic grid, then determining the first vertex and fractional position.
    vec3 i = floor(p + dot(p, vec3(1.0f / 3.0f)));
    p -= i - dot(i, vec3(1.0f / 6.0f));

    // Breaking the skewed cube into tetrahedra with partitioning planes, then determining which side of the 
    // intersecting planes the skewed point is on. Ie: Determining which tetrahedron the point is in.
    vec3 i1 = step(p.yzx, p), i2 = max(i1, 1.0f - i1.zxy);
    i1 = min(i1, 1.0f - i1.zxy);    

    // Using the above to calculate the other three vertices -- Now we have all four tetrahedral vertices.
    // Technically, these are the vectors from "p" to the vertices, but you know what I mean. :)
    vec3 p1 = p - i1 + 1.0f / 6.0f, p2 = p - i2 + 1.0f / 3.0f, p3 = p - 0.5f;

    // 3D simplex falloff - based on the squared distance from the fractional position "p" within the 
    // tetrahedron to the four vertex points of the tetrahedron. 
    vec4 v = max(0.5f - vec4(dot(p, p), dot(p1, p1), dot(p2, p2), dot(p3, p3)), 0.0f);

    // Dotting the fractional position with a random vector, generated for each corner, in order to determine 
    // the weighted contribution distribution... Kind of. Just for the record, you can do a non-gradient, value 
    // version that works almost as well.
    vec4 d = vec4(dot(p, hash33(i)), dot(p1, hash33(i + i1)), dot(p2, hash33(i + i2)), dot(p3, hash33(i + 1.0f)));

    // Simplex noise... Not really, but close enough. :)
    return clamp(dot(d, v * v * v * 8.0f) * 1.732f + 0.5f, 0.0f, 1.0f); // Not sure if clamping is necessary. Might be overkill.
}

/**
 * Generates a simplex(ish) noise value for a given UV value.
 * 
 * @param uv UV coordinate
 * @return a simplex(ish) noise value
 * @note code of this function was adapted from https://www.shadertoy.com/view/Xt3yDS by tdhooper
 */
float generateNoise(vec2 uv) {
    // Get actual x and y coordinates based on time
    float time = iTime * SPEED + cTimeOffset;

    float x = uv.x - mod(time, REPEAT_INTERVAL);  // Makes noise go 'rightward'
    float y = uv.y;

    // Blend noise at different frequencies, moving in different directions
    vec2 ab; // Two sample points on one axis

    float noise;
    float noiseA, noiseB;

    ab = smoothRepeatStart(x, REPEAT_INTERVAL);
    noiseA = tetraNoise(NOISE_COEFF1.x + vec3(vec2(ab.x, uv.y) * NOISE_COEFF1.y, 0)) * NOISE_COEFF1.z;
    noiseB = tetraNoise(NOISE_COEFF1.x + vec3(vec2(ab.y, uv.y) * NOISE_COEFF1.y, 0)) * NOISE_COEFF1.z;
    noise = smoothRepeatEnd(noiseA, noiseB, x, REPEAT_INTERVAL);

    ab = smoothRepeatStart(y, REPEAT_INTERVAL / 2.0f);
    noiseA = tetraNoise(NOISE_COEFF2.x + vec3(vec2(uv.x, ab.x) * NOISE_COEFF2.y, 0)) * NOISE_COEFF2.z;
    noiseB = tetraNoise(NOISE_COEFF2.x + vec3(vec2(uv.x, ab.y) * NOISE_COEFF2.y, 0)) * NOISE_COEFF2.z;
    noise *= smoothRepeatEnd(noiseA, noiseB, y, REPEAT_INTERVAL / 2.0f);

    ab = smoothRepeatStart(x, REPEAT_INTERVAL);
    noiseA = tetraNoise(NOISE_COEFF3.x + vec3(vec2(ab.x, uv.y) * NOISE_COEFF3.y, 0)) * NOISE_COEFF3.z;
    noiseB = tetraNoise(NOISE_COEFF3.x + vec3(vec2(ab.y, uv.y) * NOISE_COEFF3.y, 0)) * NOISE_COEFF3.z;
    noise *= smoothRepeatEnd(noiseA, noiseB, x, REPEAT_INTERVAL);

    noise *= NOISE_FACTOR;

    // Blend with a linear gradient to give lines common direction
    vec2 directionNormalVector = vec2(NOISE_LINEAR_DIRECTION.y, -NOISE_LINEAR_DIRECTION.x);
    noise = mix(noise, dot(uv, directionNormalVector), NOISE_LINEAR_BLEND);

    return noise;
}

/**
 * Converts a simplex(ish) noise value into a contour intensity value.
 * 
 * @param a noise value
 * @return a contour intensity value
 * @note code of this function was adapted from https://www.shadertoy.com/view/Xt3yDS by tdhooper
 */
float noiseAsContour(float noise) {
    // Get the base intensity that the noise should have
    float intensity = mod(noise, LINE_SPACING) / LINE_SPACING;

    // Convert jagged steps into bumps (i.e., sawtooth waves into triangle waves)
    intensity = min(intensity * 2.0f, 1.0f) - max(intensity * 2.0f - 1.0f, 0.0f);

    // Adjust the intensity based on the sum of gradients of the noise at that point
    /*
     * Specifically `fwidth()` estimates how much the value changes across adjacent pixels.
     * 
     * So dividing by this gradient makes lines appear sharper where the noise changes slowly (e.g., at the 'crests' of
     * the noise) and softer where it changes quickly, making the emphasis stronger on the 'crests'.
     */
    intensity /= fwidth(noise / LINE_SPACING);

    // Adjust to the base line size
    intensity /= LINE_BASE_SIZE;  // Divide to make more pixels fall within line boundary

    // Offset by the line weight
    intensity -= LINE_WEIGHT;
    intensity += 1.0f;  // +1 to shift valid values to [0, 1]

    // Subtract intensity from 1 to actually emphasise the lines
    intensity = 1.0f - intensity;

    // Clamp intensity to be in the interval [0, 1]
    intensity = max(0.0f, min(1.0f, intensity));

    return intensity;
}

// MAIN
void main() {
    // Generate contour
    vec2 uv = getInitialUV();
    float noise = generateNoise(uv);
    float intensity = noiseAsContour(noise);

    // Generate final colour
    outColour = vec4(COLOUR_BACKGROUND + intensity * (COLOUR_LINES - COLOUR_BACKGROUND), 1);
}
