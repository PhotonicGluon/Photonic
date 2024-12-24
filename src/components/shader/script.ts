import $ from "jquery";
import { setupShader } from "../../../lib/shaders/setup";
import shaderVert from "../../../lib/shaders/2d.vert";
import shaderFrag from "../../../lib/shaders/balatro.frag";

const canvasElem = $("#shader-canvas");
canvasElem.width("100%");

const { start, stop } = setupShader({
    canvas: <HTMLCanvasElement>canvasElem.get(0),
    sources: { vertex: shaderVert, fragment: shaderFrag },
});
start();
