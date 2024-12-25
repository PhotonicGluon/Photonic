// Note: parts of this shader have been copied from https://www.playbalatro.com/

#version 300 es
precision highp float;

#define flipY(v2) vec2(v2.x, 1.0 - v2.y)  // Flips the image along the y-axis

uniform float iTime;
uniform vec3 iResolution;
uniform sampler2D iChannel1;

uniform float uMix;

#define PIXEL_SIZE_FAC 700.0
#define SPIN_EASE 0.5
#define spin_amount 0.7
#define contrast 1.5

out vec4 outColour;

vec4 sampleImage(vec2 uv) {
    vec2 shiftedUv = uv + 0.5;
    return texture(iChannel1, flipY(shiftedUv));
}

void main() {
    // Convert to UV coords (0-1) and floor for pixel effect
    float pixel_size = length(iResolution.xy) / PIXEL_SIZE_FAC;
    vec2 uv = (floor(gl_FragCoord.xy * (1.0 / pixel_size)) * pixel_size - 0.5 * iResolution.xy) / length(iResolution.xy) - vec2(0.0, 0.0);
    float uv_len = length(uv);

    vec2 initialUv = vec2(uv);

    // Adding in a center swirl, changes with time. Only applies meaningfully if the 'spin amount' is a non-zero number
    float speed = (iTime * SPIN_EASE * 0.1) + 302.2;
    float new_pixel_angle = (atan(uv.y, uv.x)) + speed - SPIN_EASE * 20. * (1. * spin_amount * uv_len + (1. - 1. * spin_amount));
    vec2 mid = (iResolution.xy / length(iResolution.xy)) / 2.;
    uv = (vec2((uv_len * cos(new_pixel_angle) + mid.x), (uv_len * sin(new_pixel_angle) + mid.y)) - mid);

	// Now add the paint effect to the swirled UV
    uv *= 30.;
    speed = iTime * (1.);
    vec2 uv2 = vec2(uv.x + uv.y);

    for(int i = 0; i < 5; i++) {
        uv2 += uv + cos(length(uv));
        uv += 0.5 * vec2(cos(5.1123314 + 0.353 * uv2.y + speed * 0.131121), sin(uv2.x - 0.113 * speed));
        uv -= 1.0 * cos(uv.x + uv.y) - 1.0 * sin(uv.x * 0.711 - uv.y);
    }

    outColour = sampleImage(mix(initialUv, uv, uMix));
}
