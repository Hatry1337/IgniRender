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
    let obj = await fetch("/web/models/car_tri.obj");
    let model = IgniRender.LoadOBJModel("cat", await obj.text());
    model.SetSize({ x: 10, y: 10, z: 10 });
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
        frames++;
        await new Promise(res => setTimeout(res, 1));
    }
})();
