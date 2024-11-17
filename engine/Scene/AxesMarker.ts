import { hexToRGB, Path, Primitive, Text, vec3 } from "../Utils3D.js";
import SceneObject from "./SceneObject.js";

export default class AxesMarker extends SceneObject{
    constructor(name: string, pos: vec3, rot: vec3, public size: number){
        super(name, pos, rot);
    }

    public Draw(): Primitive[] {
        return [
            new Path([
                {
                    x: this.position.x,
                    y: this.position.y,
                    z: this.position.z
                },
                {
                    x: this.position.x + this.size,
                    y: this.position.y,
                    z: this.position.z
                },
            ], 1, hexToRGB("#FF0000")),
            new Text(
                {
                    x: this.position.x + this.size + (this.size / 100),
                    y: this.position.y,
                    z: this.position.z
                },
                "x", 5, hexToRGB("#FF0000"),
            ),

            new Path([
                {
                    x: this.position.x,
                    y: this.position.y,
                    z: this.position.z
                },
                {
                    x: this.position.x,
                    y: this.position.y + this.size,
                    z: this.position.z
                },
            ], 1, hexToRGB("#00FF00")),
            new Text(
                {
                    x: this.position.x,
                    y: this.position.y + this.size + (this.size / 100),
                    z: this.position.z
                },
                "y", 5, hexToRGB("#00FF00"),
            ),
            
            new Path([
                {
                    x: this.position.x,
                    y: this.position.y,
                    z: this.position.z
                },
                {
                    x: this.position.x,
                    y: this.position.y,
                    z: this.position.z + this.size
                },
            ], 1, hexToRGB("#0000FF")),
            new Text(
                {
                    x: this.position.x,
                    y: this.position.y,
                    z: this.position.z + this.size + (this.size / 100)
                },
                "z", 5, hexToRGB("#0000FF"),
            ),
        ];
    }
}