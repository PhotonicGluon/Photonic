import type { SlidersOptionsMap } from "@lib/tweakpane/options";

export const editableUniforms: SlidersOptionsMap = {
    uPixelated: { type: "boolean", value: false },
    uPixelationFactor: { type: "float", value: 4.0, min: 1.0, max: 10.0, step: 1.0 },

    uAspectRatioFix: { type: "float", value: 1.0, min: 0.0, max: 1.0, step: 1e-3 },
    uOffset: { type: "vec2", value: [0.0, 0.0], min: -0.5, max: 0.5, step: 1e-3 },
    uScale: { type: "float", value: 1.0, min: 0.01, max: 2.0, step: 1e-2 },

    uApplySwirl: { type: "boolean", value: true },
    uSwirlAmount: { type: "float", value: 1.25, min: 0.0, max: 2.0, step: 1e-3 },
    uSwirlSpeed: { type: "float", value: 1.0, min: 0.0, max: 5.0, step: 1e-2 },

    uWarpIter: { type: "int", value: 5, min: 0, max: 10 },
    uWarpKeepImgScale: { type: "boolean", value: false },
    uWarpScale: { type: "float", value: 30.0, min: 0.1, max: 50.0, step: 1e-2 },
    uWarpAmount: { type: "float", value: 0.5, min: 0.0, max: 1.0, step: 1e-3 },
    uWarpSpeed: { type: "float", value: 0.25, min: 0.0, max: 2.0, step: 1e-3 },
    uWarpUV2Coeff: { type: "vec4", value: [0.5, 0.7, 0.9, 0.3], min: -2.0, max: 2.0, step: 1e-1 },
    uWarpUV3Coeff: { type: "vec4", value: [1, 0.8, 0.7, -0.5], min: -2.0, max: 2.0, step: 1e-1 },

    uUseColour: { type: "boolean", value: true },
    uColour1: { type: "rgba", value: [0.01, 0.03, 0.07, 1] },
    uColour2: { type: "rgba", value: [0.01, 0.03, 0.07, 1] },
    uColour3: { type: "rgba", value: [0.01, 0.03, 0.07, 1] },
    uColourContrast: { type: "float", value: 3.0, min: 0.0, max: 3.0, step: 1e-1 },
    uColourSpread: { type: "float", value: 0.9, min: 0.8, max: 1.0, step: 1e-3 },
    uColourShine: { type: "float", value: 5.0, min: 1, max: 10, step: 0.25 },

    uMix: { type: "float", value: 0.1, min: 0.0, max: 1.0, step: 1e-3 },
};
