import type { SlidersOptionsMap } from "@lib/tweakpane/options";

export const editableUniforms: SlidersOptionsMap = {
    uScale: { type: "float", value: 1.0, min: 0.01, max: 2.0, step: 1e-2 },
    uRepeatInterval: { type: "float", value: 4.0, min: 0.0, max: 10.0, step: 5e-2 },

    uSpeed: { type: "float", value: 0.025, min: 0.0, max: 0.1, step: 1e-4 },
    uColourBackground: { type: "rgb", value: [0, 0, 0] },
    uColourLines: { type: "rgb", value: [0.25, 0.25, 0.25] },

    uNoiseFactor: { type: "float", value: 0.75, min: 0.0, max: 2.0, step: 1e-3 },
    uNoiseLinearDirection: { type: "vec2", value: [0.4, 0.264], min: -1.0, max: 1.0, step: 1e-3 },
    uNoiseLinearBlend: { type: "float", value: 0.6, min: 0.0, max: 1.0, step: 1e-3 },
    uNoiseCoeff1: { type: "vec3", value: [8.0, 1.2, 0.5], min: -10.0, max: 10.0, step: 2.5e-2 },
    uNoiseCoeff2: { type: "vec3", value: [0.0, 0.5, 2.0], min: -10.0, max: 10.0, step: 2.5e-2 },
    uNoiseCoeff3: { type: "vec3", value: [9.0, 0.05, 5.0], min: -10.0, max: 10.0, step: 2.5e-2 },

    uLineSpacing: { type: "float", value: 0.02, min: 0.0, max: 0.05, step: 1e-4 },
    uLineWeight: { type: "float", value: 0.25, min: 0.0, max: 1.0, step: 1e-3 },
    uLineBaseSize: { type: "float", value: 3.0, min: 1.0, max: 5.0, step: 2.5e-1 },
};
