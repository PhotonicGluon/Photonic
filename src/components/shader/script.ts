/**
 * Partially adapted from https://github.com/s-thom/website-2023/blob/26d8a1a/src/components/site/ShaderBackdrop.astro.
 */

import $ from "jquery";
import { setupShader } from "@lib/shaders/setup";
import { Interpolate, easeInOutCubic } from "@lib/shaders/interpolate";
import shaderVert from "@lib/shaders/2d.vert";
import type { SlidersInitialisedEvent } from "@lib/tweakpane/panel";
import type { SlidersOptionsMap } from "@lib/tweakpane/options";

// Process each canvas
$(".shader-backdrop").each((_index, backdropArea) => {
    // Get the canvas associated with the backdrop
    const canvas = backdropArea.querySelector<HTMLCanvasElement>("canvas.shader-backdrop-canvas");
    if (!canvas) {
        return;
    }

    // Get fragment shader
    const shaderFrag = backdropArea.dataset.shaderFrag;
    if (!shaderFrag) {
        throw Error("No fragment shader given");
    }
    delete backdropArea.dataset.shaderFrag; // No need to keep it now that we have it

    // Get background
    const backgroundURL = backdropArea.dataset.imageUrl;
    const hasBackground = backgroundURL !== undefined;

    // Define editable uniforms
    let editableUniforms: SlidersOptionsMap;
    if (backdropArea.dataset.editableUniforms) {
        editableUniforms = JSON.parse(backdropArea.dataset.editableUniforms);
    } else {
        editableUniforms = {};
    }
    delete backdropArea.dataset.editableUniforms;

    window.addEventListener("sliders-initialised", ((event: InstanceType<typeof SlidersInitialisedEvent>) => {
        event.detail.registerSliders(backdropArea.id, editableUniforms);
    }) as (e: Event) => void);

    // Define uniforms
    const uniforms: Record<string, any> = {};

    uniforms.uUseColours = !hasBackground;

    uniforms.uWarpIter = hasBackground ? 4 : 9;
    uniforms.uOffset = backdropArea.dataset.offset ? JSON.parse(backdropArea.dataset.offset) : [0, 0];
    uniforms.uWarpScale = backdropArea.dataset.warpScale ? JSON.parse(backdropArea.dataset.warpScale) : 1;

    // Define interpolator
    const interpolator = new Interpolate(easeInOutCubic, hasBackground ? 0 : 1);

    // // Intersection observer for changing multiplier during scroll
    // let canvasIntersectionRatio = 1;
    // const observer = new IntersectionObserver(
    //     (entries) => {
    //         for (const entry of entries) {
    //             if (entry.target === canvas) {
    //                 canvasIntersectionRatio = entry.intersectionRatio;
    //             }
    //         }
    //     },
    //     {
    //         // Fire callback on many changes. 100 should be smooth enough.
    //         threshold: range(101).map((n) => n / 100),
    //     },
    // );
    // observer.observe(canvas);

    const { start, stop } = setupShader({
        canvas,
        sources: { vertex: shaderVert, fragment: shaderFrag },
        uniforms,
        onFrame: (time) => {
            // uniforms.uWarpAmount =
            //     ((1 - canvasIntersectionRatio) *
            //         (MAX_PAINT_FACTOR - MIN_PAINT_FACTOR) +
            //         MIN_PAINT_FACTOR) *
            //     interpolator.getValue();

            // Update pixel density
            uniforms.uPixelDensity = window.devicePixelRatio;

            // Update any editable uniforms
            for (const [key, value] of Object.entries(editableUniforms)) {
                uniforms[key] = value.value;
            }
        },
        textures: hasBackground ? [{ src: backgroundURL }] : undefined,
        onTexturesReady: () => {
            // interpolator.setTarget(prefersReducedMotion ? 0 : 1, 10_000);
            start();
        },
    });

    interpolator.on("start", ({ current }) => {
        if (current === 0) {
            start();
        }
    });
    interpolator.on("end", ({ current }) => {
        if (current === 0) {
            stop();
        }
    });

    if (!hasBackground) {
        start();
    }
});
