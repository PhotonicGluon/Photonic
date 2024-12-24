import $ from "jquery";
import { setupShader } from "../../lib/shaders/setup";
import shaderVert from "../../lib/shaders/2d.vert";
import shaderFrag from "../../lib/shaders/demo.frag";

const canvas = <HTMLCanvasElement>$("#shader-canvas").get(0);

setupShader({
    canvas: canvas,
    sources: { vertex: shaderVert, fragment: shaderFrag },
});
