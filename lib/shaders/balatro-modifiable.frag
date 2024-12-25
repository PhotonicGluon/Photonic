#version 300 es
precision highp float;

uniform float iTime;
uniform vec3 iResolution;

uniform vec4 uColour1;
uniform vec4 uColour2;
uniform vec4 uColour3;

#define PIXEL_SIZE_FAC 700.0
#define SPIN_EASE 0.5
#define spin_amount 0.7
#define contrast 1.5

out vec4 outColour;

// Note: parts of this shader have been copied from https://www.playbalatro.com/

vec4 sampleColour(vec2 uv) {
    // Make the paint amount range from 0 - 2
    float contrast_mod = (0.25f * contrast + 0.5f * spin_amount + 1.2f);
    float paint_res = min(2.f, max(0.f, length(uv) * (0.035f) * contrast_mod));
    float c1p = max(0.f, 1.f - contrast_mod * abs(1.f - paint_res));
    float c2p = max(0.f, 1.f - contrast_mod * abs(paint_res));
    float c3p = 1.f - min(1.f, c1p + c2p);

    vec4 colour = (0.3f / contrast) * uColour1 + (1.f - 0.3f / contrast) * (uColour1 * c1p + uColour2 * c2p + vec4(c3p * uColour3.rgb, c3p * uColour1.a)) + 0.3f * max(c1p * 5.f - 4.f, 0.f) + 0.4f * max(c2p * 5.f - 4.f, 0.f);
    return colour;
}

void main() {
    // Convert to UV coords (0-1) and floor for pixel effect
    float pixel_size = length(iResolution.xy) / PIXEL_SIZE_FAC;
    vec2 uv = (floor(gl_FragCoord.xy * (1.0f / pixel_size)) * pixel_size - 0.5f * iResolution.xy) / length(iResolution.xy) - vec2(0.0f, 0.0f);
    float uv_len = length(uv);

    // Adding in a center swirl, changes with time. Only applies meaningfully if the 'spin amount' is a non-zero number
    float speed = (iTime * SPIN_EASE * 0.1f) + 302.2f;
    float new_pixel_angle = (atan(uv.y, uv.x)) + speed - SPIN_EASE * 20.f * (1.f * spin_amount * uv_len + (1.f - 1.f * spin_amount));
    vec2 mid = (iResolution.xy / length(iResolution.xy)) / 2.f;
    uv = (vec2((uv_len * cos(new_pixel_angle) + mid.x), (uv_len * sin(new_pixel_angle) + mid.y)) - mid);

	// Now add the paint effect to the swirled UV
    uv *= 30.f;
    speed = iTime * (1.f);
    vec2 uv2 = vec2(uv.x + uv.y);

    for(int i = 0; i < 5; i++) {
        uv2 += uv + cos(length(uv));
        uv += 0.5f * vec2(cos(5.1123314f + 0.353f * uv2.y + speed * 0.131121f), sin(uv2.x - 0.113f * speed));
        uv -= 1.0f * cos(uv.x + uv.y) - 1.0f * sin(uv.x * 0.711f - uv.y);
    }

    outColour = sampleColour(uv);
}
