import { hexToRGB, Path, v3distance, v3zero, vec2, vec3 } from "../Utils3D.js";
import SceneObject from "./SceneObject.js";
import Camera from "./Camera";

export default class FloorGrid extends SceneObject{
    private paths: Path[] = [];
    private camera?: Camera;
    private currentSize?: number;

    constructor(name: string, pos: vec3, size: vec2, step: number){
        super(name, pos, v3zero());
        this.resize(size, step);
    }

    public trackCamera(camera: Camera) {
        this.camera = camera;
    }

    public resize(size: vec2, step: number) {
        this.paths = [];
        let halfX = size.x  / 2;
        let halfY = size.y / 2;
        for(let x = -halfX; x <= halfX; x += step) {
            this.paths.push(new Path([
                {
                    x: this.position.x + x,
                    y: this.position.y,
                    z: this.position.z + halfY
                },
                {
                    x: this.position.x + x,
                    y: this.position.y,
                    z: this.position.z - halfY
                },
            ], 0.5, hexToRGB("#2c2c2c")));
        }
        for(let z = -halfY; z <= halfY; z += step) {
            this.paths.push(new Path([
                {
                    x: this.position.x + halfX,
                    y: this.position.y,
                    z: this.position.z + z
                },
                {
                    x: this.position.x - halfX,
                    y: this.position.y,
                    z: this.position.z + z
                },
            ], 0.5, hexToRGB("#2c2c2c")));
        }
    }

    public Draw(): Path[] {
        if (this.camera) {
            let fcDistance = v3distance(this.position, this.camera.position);
            let fscaleNew = Math.trunc(Math.log10(fcDistance));
            fscaleNew = fscaleNew < 0 || !isFinite(fscaleNew) ? 0 : fscaleNew;
            if (fscaleNew !== this.currentSize) {
                let sz = Math.pow(10, fscaleNew);
                this.resize({ x: sz, y: sz }, sz / 10);
                this.currentSize = fscaleNew;
            }
        }
        return this.paths;
    }
}