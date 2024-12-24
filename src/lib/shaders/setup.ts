import * as twgl from "twgl.js";

/**
 * Shader object.
 */
export interface Shader {
    canvas: HTMLCanvasElement;
    sources: { vertex: string; fragment: string };
    uniforms?: Record<string, any>;
    onFrame?: (time: DOMHighResTimeStamp) => void;
    textures?: twgl.TextureOptions[];
    onTexturesReady?: () => void;
}

/**
 * Sets up a shader.
 *
 * Taken and adapted from
 *   https://github.com/s-thom/website-2023/blob/26d8a1abb60db1878840579c35bc2b462b9d124a/src/lib/shaders/setup.ts
 *
 * @param shader Shader object to set up.
 */
export function setupShader(shader: Shader) {
    const { canvas, sources } = shader;
    // Create WebGL2 context
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: false });
    if (!gl) {
        canvas.classList.add("fully-hidden");
        throw new Error("Unable to create WebGL2 context on canvas");
    }

    // Get infos
    const programInfo = twgl.createProgramInfo(gl, [
        sources.vertex,
        sources.fragment,
    ]);

    const arrays = {
        // Cover the entire canvas with a single quad
        position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
    };
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

    // Create helper function to queue and cancel frames
    let lastTime: DOMHighResTimeStamp | undefined;
    let animFrameHandle: number;
    let hasBeenStarted = false;
    let isIntersecting = false;

    function queueFrame() {
        animFrameHandle = requestAnimationFrame(render);
    }

    function cancelFrame() {
        if (animFrameHandle) {
            lastTime = undefined;
            cancelAnimationFrame(animFrameHandle);
        }
    }

    // Intersection observer to stop the shader if it goes off-screen
    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.target === canvas) {
                    const prevIntersecting = isIntersecting;
                    isIntersecting = entry.intersectionRatio > 0;

                    if (hasBeenStarted) {
                        if (isIntersecting && !prevIntersecting) {
                            queueFrame();
                        } else {
                            cancelFrame();
                        }
                    }
                }
            }
        },
        { threshold: [0] },
    );
    observer.observe(canvas);

    // Create textures
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

    // Set up renderer
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

        twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        if (shader.onFrame) {
            shader.onFrame(time);
        }

        const lastFrameDelta = lastTime === undefined ? 0 : time - lastTime;

        const uniforms = {
            ...shader.uniforms,
            // Shadertoy's built-in uniforms
            // https://www.shadertoy.com/howto
            // uniform vec3 iResolution;
            // uniform float iTime;
            // uniform float iTimeDelta;
            // uniform float iFrame;
            // uniform float iChannelTime[4];
            // uniform vec4 iMouse;
            // uniform vec4 iDate;
            // uniform float iSampleRate;
            // uniform vec3 iChannelResolution[4];
            // uniform samplerXX iChanneli;
            iResolution: [gl.canvas.width, gl.canvas.height, 1],
            iTime: time * 0.001,
            iTimeDelta: lastFrameDelta,
            iFrame: frameCount,
            ...textureUniforms,
        };

        gl.useProgram(programInfo.program);
        twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
        twgl.setUniforms(programInfo, uniforms);
        twgl.drawBufferInfo(gl, bufferInfo);

        frameCount++;
        lastTime = time;
        if (hasBeenStarted) {
            animFrameHandle = requestAnimationFrame(render);
        }
    }

    requestAnimationFrame(render);

    return {
        gl,
        start: () => {
            hasBeenStarted = true;
            if (isIntersecting) {
                queueFrame();
            }
        },
        stop: () => {
            hasBeenStarted = false;
            cancelFrame();
        },
        destroy: () => {
            observer.disconnect();
        },
    };
}
