import type { SlidersOptionsMap } from "@lib/tweakpane/options";

export const editableUniforms: SlidersOptionsMap = {
    uScale: { type: "float", value: 1.0, min: 0.01, max: 2.0, step: 1e-2 },
    uRepeatInterval: { type: "float", value: 7.0, min: 0.0, max: 10.0, step: 5e-2 },

    uSpeed: { type: "float", value: 0.0125, min: 0.0, max: 0.1, step: 1e-4 },
    uColourBackground: { type: "rgb", value: [0.01, 0.03, 0.07] },
    uColourLines: { type: "rgb", value: [0.25, 0.25, 0.25] },

    uNoiseFactor: { type: "float", value: 0.75, min: 0.0, max: 2.0, step: 1e-3 },
    uNoiseLinearDirection: { type: "vec2", value: [0.373, 0.267], min: -1.0, max: 1.0, step: 1e-3 },
    uNoiseLinearBlend: { type: "float", value: 0.5, min: 0.0, max: 1.0, step: 1e-3 },
    uNoiseCoeff1: { type: "vec3", value: [6.5, 1.5, 0.3], min: -10.0, max: 10.0, step: 2.5e-2 },
    uNoiseCoeff2: { type: "vec3", value: [1.0, 0.35, 1.75], min: -10.0, max: 10.0, step: 2.5e-2 },
    uNoiseCoeff3: { type: "vec3", value: [9.0, 0.25, 5.0], min: -10.0, max: 10.0, step: 2.5e-2 },

    uLineSpacing: { type: "float", value: 0.08, min: 0.0, max: 0.1, step: 1e-4 },
    uLineWeight: { type: "float", value: 0.65, min: 0.0, max: 1.0, step: 1e-3 },
    uLineBaseSize: { type: "float", value: 3.5, min: 1.0, max: 5.0, step: 2.5e-1 },
};
