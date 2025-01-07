import type { SlidersOptionsMap } from "@lib/tweakpane/options";

export const editableUniforms: SlidersOptionsMap = {
    uWaveCount: { type: "float", value: 1.0, min: 0.0, max: 3.0, step: 0.5 },
    uWaveFreq: { type: "float", value: 2.0, min: 1.0, max: 10.0, step: 2.5e-2 },
    uWaveHeight: { type: "float", value: 0.25, min: 0.0, max: 1.0, step: 1e-3 },
    uWaveBorder: { type: "float", value: 0.05, min: 0.0, max: 1.0, step: 1e-3 },
    uWaveSpeed: { type: "float", value: 0.25, min: 0.0, max: 2.0, step: 1e-3 },

    uLineNum: { type: "int", value: 1, min: 0, max: 5 },
};
