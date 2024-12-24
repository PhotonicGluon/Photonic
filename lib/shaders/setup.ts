/**
 * Shader setup script.
 *
 * Adapted from
 *  https://github.com/s-thom/website-2023/blob/26d8a1a/src/components/site/ShaderBackdrop.astro
 */

import * as twgl from "twgl.js";

/**
 * Configuration interface for WebGL2 shader setup.
 * @interface Shader
 */
export interface Shader {
    /** Canvas element to render the shader on */
    canvas: HTMLCanvasElement;
    /** Shader source code for vertex and fragment shaders */
    sources: { vertex: string; fragment: string };
    /** Optional uniform values to pass to the shader */
    uniforms?: Record<string, any>;
    /** Optional callback executed each animation frame */
    onFrame?: (time: DOMHighResTimeStamp) => void;
    /** Optional texture configurations for shader inputs */
    textures?: twgl.TextureOptions[];
    /** Optional callback executed when all textures are loaded */
    onTexturesReady?: () => void;
}

/**
 * Interface for WebGL2 shaders.
 * @interface ShaderControl
 */
export interface ShaderControl {
    /** WebGL2 rendering context */
    gl: WebGL2RenderingContext;
    /** Method to start the shader */
    start: () => void;
    /** Method to stop the shader */
    stop: () => void;
}

/**
 * Sets up a WebGL2 shader with animation and texture support.
 * Handles canvas resizing, animation frame management, and shader uniforms.
 *
 * @param shader - Configuration object for the shader setup
 * @returns Shader control object
 * @throws Error if WebGL2 context creation fails or textures aren't loaded
 */
export function setupShader(shader: Shader): ShaderControl {
    const { canvas, sources } = shader;

    // Initialize WebGL2 context
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: false });
    if (!gl) {
        canvas.classList.add("fully-hidden");
        throw new Error("Unable to create WebGL2 context on canvas");
    }

    // Create shader program from source code
    const programInfo = twgl.createProgramInfo(gl, [
        sources.vertex,
        sources.fragment,
    ]);

    // Create a full-screen quad for rendering
    const arrays = {
        position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
    };
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

    // Animation frame management
    let lastTime: DOMHighResTimeStamp | undefined;
    let animFrameHandle: number;

    // Helper functions for animation frame control
    function queueFrame() {
        animFrameHandle = requestAnimationFrame(render);
    }

    function cancelFrame() {
        if (animFrameHandle) {
            lastTime = undefined;
            cancelAnimationFrame(animFrameHandle);
        }
    }

    // Set up intersection observer to pause rendering when off-screen
    let isIntersecting = false;
    let hasStarted = false;

    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.target === canvas) {
                    const prevIntersecting = isIntersecting;
                    isIntersecting = entry.intersectionRatio > 0;

                    if (hasStarted) {
                        if (isIntersecting && !prevIntersecting) {
                            queueFrame();
                        } else {
                            cancelFrame();
                        }
                    }
                }
            }
        },
        { threshold: [0] }, // Means check when it just disappears or just reappears on the screen
    );
    observer.observe(canvas);

    // Initialize shader textures if provided
    let textureUniforms = {};
    let texturesReady = true;
    if (shader.textures && shader.textures.length > 0) {
        texturesReady = false;
        textureUniforms = twgl.createTextures(
            gl,
            Object.fromEntries(
                shader.textures.map((init, i) => [`iChannel${i}`, init]),
            ),
            () => {
                texturesReady = true;
                shader.onTexturesReady?.();
            },
        );
    }

    // Main render function
    let frameCount = 0;
    function render(time: DOMHighResTimeStamp) {
        if (!gl) {
            console.error("No GL context in render loop, exiting loop");
            return;
        }

        if (!texturesReady) {
            throw new Error(
                "Shader has textures, but they have not been loaded yet.",
            );
        }

        // Resize canvas and viewport to match display size
        twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Execute frame callback if provided
        if (shader.onFrame) {
            shader.onFrame(time);
        }

        const lastFrameDelta = lastTime === undefined ? 0 : time - lastTime;

        // Set up uniforms
        const uniforms = {
            ...shader.uniforms,
            iResolution: [gl.canvas.width, gl.canvas.height, 1], // vec3(width, height, 1.0)
            iTime: time * 1e-3, // Current time in seconds
            iTimeDelta: lastFrameDelta, // Time since last frame
            iFrame: frameCount, // Current frame number
            ...textureUniforms, // Texture samplers
        };

        // Render the shader
        gl.useProgram(programInfo.program);
        twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
        twgl.setUniforms(programInfo, uniforms);
        twgl.drawBufferInfo(gl, bufferInfo);

        // Prepare for next frame
        frameCount++;
        lastTime = time;
        if (hasStarted) {
            animFrameHandle = requestAnimationFrame(render);
        }
    }

    // Start initial render
    requestAnimationFrame(render);

    // Return control interface
    return {
        gl: gl,
        start: () => {
            hasStarted = true;
            if (isIntersecting) {
                queueFrame();
            }
        },
        stop: () => {
            hasStarted = false;
            cancelFrame();
        },
    };
}
