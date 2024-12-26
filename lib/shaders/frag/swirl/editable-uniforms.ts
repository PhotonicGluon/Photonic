import type { SlidersOptionsMap } from "@lib/tweakpane/options";

export const editableUniforms: SlidersOptionsMap = {
    uPixelated: { type: "boolean", value: false },
    uAspectRatioFix: { type: "float", value: 1.0, min: 0.0, max: 1.0, step: 1e-3 },
    uOffset: { type: "vec2", value: [0.0, 0.0], min: -0.5, max: 0.5, step: 1e-3 },
    uScale: { type: "float", value: 1.0, min: 0.01, max: 2.0, step: 1e-2 },

    uApplySwirl: { type: "boolean", value: true },
    uSwirlAmount: { type: "float", value: 0.7, min: 0.0, max: 2.0, step: 1e-3 },
    uSwirlSpeed: { type: "float", value: 1.0, min: 0.0, max: 5.0, step: 1e-2 },

    uWarpIter: { type: "int", value: 5, min: 0, max: 10 },
    uWarpKeepImgScale: { type: "boolean", value: false },
    uWarpScale: { type: "float", value: 30.0, min: 0.1, max: 50.0, step: 1e-2 },
    uWarpAmount: { type: "float", value: 0.7, min: 0.0, max: 1.0, step: 1e-3 },
    uWarpSpeed: { type: "float", value: 0.5, min: 0.0, max: 2.0, step: 1e-3 },

    uMix: { type: "float", value: 0.1, min: 0.0, max: 1.0, step: 1e-3 },
};
