import type { SlidersOptionsMap } from "@lib/tweakpane/options";

export const editableUniforms: SlidersOptionsMap = {
    uWavePeriod: { type: "float", value: 4.0, min: 1.0, max: 10.0, step: 2.5e-2 },
    uWaveHeight: { type: "float", value: 0.25, min: 0.0, max: 1.0, step: 1e-3 },
    uWaveBorder: { type: "float", value: 0.25, min: 0.0, max: 1.0, step: 1e-3 },
};
