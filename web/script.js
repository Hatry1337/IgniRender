import { Scene} from "../engine/build/Scene/Scene.js";
import {mat4Create, mat4Perspective, mat4Translate, v3distance, v3zero} from "../engine/build/Utils3D.js";
import AxesMarker from "../engine/build/Scene/AxesMarker.js";
import Camera from "../engine/build/Scene/Camera.js";
import IgniRender from "../engine/build/IgniRender.js";
import FloorGrid from "../engine/build/Scene/FloorGrid.js";
// import { WebCanvasContext } from "./canvasgfxcontext.js";
import { ViewportControls } from "./controls.js";
import {WebGLBackend} from "../engine/build/GFXBackend/impl/WebGLBackend.js";

let canvas = document.getElementById("viewport");
// let context = new WebCanvasContext(canvas);
let backend = new WebGLBackend(canvas.getContext("webgl2"));
backend.initShaders();

let scene = new Scene();

let axMarker = new AxesMarker("axmarker0", v3zero(), v3zero(), 10);
scene.addObject(axMarker);

let cam = new Camera("camera1", {
    x: 0,
    y: 0,
    z: 40
}, v3zero());
cam.renderStyle = "flat";
scene.addObject(cam);

new ViewportControls(canvas, cam).start();

let floor = new FloorGrid("floor1", v3zero(), { x: 1000, y: 1000 }, 1);
floor.trackCamera(cam);
scene.addObject(floor);

let frames = 0;
let fps = 0;
setInterval(() => {
    fps = frames;
    frames = 0;
    console.log(fps);
    console.log(`cam_pos: x=${cam.position.x} y=${cam.position.y} z=${cam.position.z}`);
    console.log(`cam_rot: x=${cam.rotation.x} y=${cam.rotation.y} z=${cam.rotation.z}`);
}, 1000);

(async () => {
    let obj = await fetch("/web/models/xyzcube.obj");
    let model = IgniRender.LoadOBJModel("cat", await obj.text());
    model.SetSize({ x: 1, y: 1, z: 1 });
    scene.addObject(model);

    document.getElementById("toggle_axes").addEventListener("change", (e) => {
        axMarker.visible = e.target.checked;
    });
    document.getElementById("toggle_model").addEventListener("change", (e) => {
        if(model) {
            model.visible = e.target.checked;
        }
    });
    document.getElementById("toggle_grid").addEventListener("change", (e) => {
        floor.visible = e.target.checked;
    });

    while (true) {
        cam.Render(backend);
        // backend.viewport.clear({ red: 1, green: 1, blue: 1, alpha: 1});
        // const positions = [
        //     // Front face
        //     -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
        //
        //     // Back face
        //     -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
        //
        //     // Top face
        //     -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
        //
        //     // Bottom face
        //     -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
        //
        //     // Right face
        //     1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
        //
        //     // Left face
        //     -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
        // ];
        // const faceColors = [
        //     [1.0, 1.0, 1.0, 1.0], // Front face: white
        //     [1.0, 0.0, 0.0, 1.0], // Back face: red
        //     [0.0, 1.0, 0.0, 1.0], // Top face: green
        //     [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
        //     [1.0, 1.0, 0.0, 1.0], // Right face: yellow
        //     [1.0, 0.0, 1.0, 1.0], // Left face: purple
        // ];
        // const indices = [
        //     0,
        //     1,
        //     2,
        //     0,
        //     2,
        //     3, // front
        //     4,
        //     5,
        //     6,
        //     4,
        //     6,
        //     7, // back
        //     8,
        //     9,
        //     10,
        //     8,
        //     10,
        //     11, // top
        //     12,
        //     13,
        //     14,
        //     12,
        //     14,
        //     15, // bottom
        //     16,
        //     17,
        //     18,
        //     16,
        //     18,
        //     19, // right
        //     20,
        //     21,
        //     22,
        //     20,
        //     22,
        //     23, // left
        // ];
        // var colors = [];
        //
        // for (var j = 0; j < faceColors.length; ++j) {
        //     const c = faceColors[j];
        //     // Repeat each color four times for the four vertices of the face
        //     colors = colors.concat(c, c, c, c);
        // }
        //
        // backend.scene.writePositions(new Float32Array(positions));
        // backend.scene.writeIndices(new Uint16Array(indices));
        // backend.scene.writeColors(new Float32Array(colors));
        //
        // const fieldOfView = (45 * Math.PI) / 180; // in radians
        // const aspect = canvas.clientWidth / canvas.clientHeight;
        // const zNear = 0.1;
        // const zFar = 100.0;
        // const projectionMatrix = mat4Create();
        //
        // // note: glmatrix.js always has the first argument
        // // as the destination to receive the result.
        // mat4Perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        //
        // const viewMatrix = mat4Create();
        // mat4Translate(
        //     viewMatrix, // destination matrix
        //     viewMatrix, // matrix to translate
        //     [-0.0, 0.0, -6.0]
        // ); // amount to translate
        //
        // backend.scene.render(viewMatrix, projectionMatrix);
        frames++;
        await new Promise(res => setTimeout(res, 1));
    }
})();
