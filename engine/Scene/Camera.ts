import { RenderProjection, RenderStyle } from "../IgniRender.js";
import {
    convertRangeVec2,
    getFaceCenter,
    getFaceNormal,
    getNormalColor, mat4Create, mat4Perspective, mat4Rotate, mat4Translate,
    matrix4MultPoint,
    Path, Primitive, v2fill, v2zero,
    v3copy,
    v3distance,
    v3dot, v3fill,
    v3mul,
    v3rotate,
    v3sub,
    v3sum,
    vec2,
    vec3
} from "../Utils3D.js";
import SceneObject from "./SceneObject.js";
import { GFXContext } from "../GFXBackend/GFXContext.js";
import { Color } from "../GFXBackend/Structures";
import { GFXScene } from "../GFXBackend/GFXScene";
import { GFXBackend } from "../GFXBackend/GFXBackend";

export default class Camera extends SceneObject{
    public renderStyle: RenderStyle = "flat";
    public projection: RenderProjection = "perspective";
    public FOV: number = 90;
    public nearClipPlane: number = 0.1;
    public farClipPlane: number = 100;

    constructor(name: string, pos: vec3, rot: vec3){
        super(name, pos, rot);
    }

    public Draw(): Path[] {
        /*
        let cam: PPath[] = [
            {
                type: "path",
                points: [
                    {
                        x: this.position.x - this.width / 2,
                        y: this.position.y + this.height / 2,
                        z: this.position.z
                    },
                    {
                        x: this.position.x + this.width / 2,
                        y: this.position.y + this.height / 2,
                        z: this.position.z
                    },
                    {
                        x: this.position.x + this.width / 2,
                        y: this.position.y - this.height / 2,
                        z: this.position.z
                    },
                    {
                        x: this.position.x - this.width / 2,
                        y: this.position.y - this.height / 2,
                        z: this.position.z
                    },
                    {
                        x: this.position.x - this.width / 2,
                        y: this.position.y + this.height / 2,
                        z: this.position.z
                    },
                ]
            },
            {
                type: "path",
                points: [
                    {
                        x: this.position.x - this.width / 2,
                        y: this.position.y - this.height / 2,
                        z: this.position.z
                    },
                    {
                        x: this.position.x,
                        y: this.position.y,
                        z: this.position.z
                    },
                    {
                        x: this.position.x - this.width / 2,
                        y: this.position.y + this.height / 2,
                        z: this.position.z
                    },
                ]
            },
            {
                type: "path",
                points: [
                    {
                        x: this.position.x + this.width / 2,
                        y: this.position.y + this.height / 2,
                        z: this.position.z
                    },
                    {
                        x: this.position.x,
                        y: this.position.y,
                        z: this.position.z
                    },
                    {
                        x: this.position.x + this.width / 2,
                        y: this.position.y - this.height / 2,
                        z: this.position.z
                    },
                ]
            }
        ];
        /*
        for(let p of cam){
            p.points = p.points.map(p => v3normalize(p));
        }
        */
        //return cam;
        return [];
    }

    public worldToCameraSpace(point: vec3) {
        let out = v3copy(point);
        out = v3rotate(out, this.rotation);
        out = v3sum(out, this.position);

        return out;
    }

    public projectionMatrix(width: number, height: number): Float32Array {
        let top, bottom, left, right;

        top = this.nearClipPlane * Math.tan((this.FOV * 0.0174533)/2);
        bottom = -top;
        right = top * width / height;
        left = -right;

        let mat = [
            2*this.nearClipPlane/(right-left), 0, 0, 0,
            0, 2*this.nearClipPlane/(top-bottom), 0, 0,
            0, 0, -(this.farClipPlane+this.nearClipPlane)/(this.farClipPlane-this.nearClipPlane), -1,
            -this.nearClipPlane*(right+left)/(right-left), -this.nearClipPlane*(top+bottom)/(top-bottom), 2*this.farClipPlane*this.nearClipPlane/(this.nearClipPlane-this.farClipPlane), 0
        ]

        return Float32Array.from(mat);
    }

    public viewMatrix(): Float32Array {
        let mat = mat4Create();
        mat4Translate(mat, mat, [this.position.x, this.position.y, -this.position.z]);
        mat4Rotate(mat, mat, this.rotation.x, [1, 0, 0]);
        mat4Rotate(mat, mat, this.rotation.y, [0, 1, 0]);
        mat4Rotate(mat, mat, this.rotation.z, [0, 0, 1]);

        return mat;
    }

    public Project(width: number, height: number, point: vec3, cords_min?: vec2, cords_max?: vec2): vec2 {
        if(this.projection === "perspective"){
            //point = v3normalize(point);
            //
            // let s = 1 / Math.tan(this.FOV / 2 * Math.PI / 180);
            // let d = this.farClipPlane - this.nearClipPlane;
            // let fn1 = this.farClipPlane / d;
            // let fn2 = this.farClipPlane * this.nearClipPlane / d;
            //
            //
            // let mat = [
            //     [s, 0, 0,     0],
            //     [0, s, 0,     0],
            //     [0, 0, -fn1, -1],
            //     [0, 0, -fn2,  0]
            // ];


            let top, bottom, left, right;

            top = this.nearClipPlane * Math.tan((this.FOV * 0.0174533)/2);
            bottom = -top;
            right = top * width / height;
            left = -right;

            let mat = [
                [2*this.nearClipPlane/(right-left), 0, 0, -this.nearClipPlane*(right+left)/(right-left)],
                [0, 2*this.nearClipPlane/(top-bottom), 0, -this.nearClipPlane*(top+bottom)/(top-bottom)],
                [0, 0, -(this.farClipPlane+this.nearClipPlane)/(this.farClipPlane-this.nearClipPlane), 2*this.farClipPlane*this.nearClipPlane/(this.nearClipPlane-this.farClipPlane)],
                [0, 0, -1, 0]
            ]

            // let mat = [
            //     [2*this.nearClipPlane/(right-left), 0, (right+left)/(right-left), 0],
            //     [0, 2*this.nearClipPlane/(top-bottom), (top+bottom)/(top-bottom), 0],
            //     [0, 0, -(this.farClipPlane+this.nearClipPlane)/(this.farClipPlane-this.nearClipPlane), -2*this.farClipPlane*this.nearClipPlane/(this.farClipPlane-this.nearClipPlane)],
            //     [0, 0, -1, 0]
            // ]

            let res: vec2 = matrix4MultPoint(mat, point);

            if(cords_max && cords_min) {
                res = convertRangeVec2(res, cords_max, cords_min, v2fill(1), v2fill(-1));
            }

            return res;

        //}else if(this.projection === "orthogonal"){

        }else{
            return {
                x: point.x,
                y: point.y
            }
        }
    }

    public Render(backend: GFXBackend) {
        backend.viewport.clear({ red: 1.0, green: 1.0, blue: 1.0, alpha: 1.0 });

        let rend_obj = this.scene.objects.filter(o => o.visible && o.id !== this.id);

        let drawnObjects: Primitive[][] = [];
        let facesCount = 0;
        for(let obj of rend_obj) {
            let prims = obj.Draw();
            drawnObjects.push(prims);
            facesCount += prims.filter(p => p.isFace()).length;
        }

        // 3 vertices per face, 3 coords per vertex
        let vertexBuffer = new Float32Array(facesCount * 3 * 3);
        // 3 vertices per face
        let indicesBuffer = new Uint16Array(facesCount * 3);
        // 3 vertices per face, 4 color values per vertex
        let colorsBuffer = new Float32Array(facesCount * 3 * 4);

        let vertexI = 0;
        let indicesI = 0;
        let colorI = 0;

        for(let i in drawnObjects) {

            // for(let p of prims){
            //     if(p.isFace()){
            //         p.vertices.sort((a, b) => v3distance(a, this.position) - v3distance(b, this.position));
            //     }else if(p.isPath()){
            //         p.points.sort((a, b) => v3distance(a, this.position) - v3distance(b, this.position));
            //     }
            // }

            // #HEAVY CODE
            //let camera_pos = v3rotate(this.position, v3mul(this.rotation, v3fill(-1)));

            // prims.sort((a, b) => {
            //     return a.shortestDistance(camera_pos) - b.shortestDistance(camera_pos);
            // });

            for(let p of drawnObjects[i]){
                if(p.isPath()){
                    continue;
                    // //let points = p.points.map(p => this.Project(v3sum(v3rotate(p, this.rotation), this.position)));
                    // let points = p.points
                    //     .map(p => this.Project(this.worldToCameraSpace(p), v2zero(), {
                    //         x: backend.viewport.getWidth(),
                    //         y: backend.viewport.getHeight()
                    //     }));
                    //
                    // ctx.drawPath(points, p.thickness ?? 1, p.color);
                }else if(p.isFace()) {
                    p.center = p.center ?? getFaceCenter(p);
                    p.normal = p.normal ?? getFaceNormal(p);

                    let draw_flag = true;
                    // let draw_flag = false;
                    //
                    // if(this.renderStyle === "wireframe"){
                    //     draw_flag = true;
                    // }else if(v3dot(v3sub(p.vertices[0], camera_pos), p.normal) >= 0){
                    //     draw_flag = true;
                    // }

                    if(draw_flag){
                       // let verts_prj = p.vertices.map(p => this.Project(v3sum(v3rotate(p, this.rotation), this.position)));
                       //  let verts_prj = p.vertices.map(p => this.Project(this.worldToCameraSpace(p), v2zero(), {
                       //      x: backend.viewport.getWidth(),
                       //      y: backend.viewport.getHeight()
                       //  }));

                        let color: Color | undefined;
                        if(this.renderStyle === "flat"){
                            let brightness = getNormalColor(p.normal, {
                                x: -0.5,
                                y: 0.75,
                                z: -1
                            });
                            color = { red: brightness, green: brightness, blue: brightness, alpha: 1 };
                        }


                        if(p.vertices.length === 3) {
                            for(let v of p.vertices) {
                                vertexBuffer[vertexI] = v.x;
                                vertexBuffer[vertexI+1] = v.y;
                                vertexBuffer[vertexI+2] = v.z;
                                vertexI += 3;

                                if(color) {
                                    colorsBuffer[colorI] = color.red;
                                    colorsBuffer[colorI+1] = color.green;
                                    colorsBuffer[colorI+2] = color.blue;
                                    colorsBuffer[colorI+3] = color.alpha;
                                } else {
                                    colorsBuffer[colorI] = 0;
                                    colorsBuffer[colorI+1] = 0;
                                    colorsBuffer[colorI+2] = 0;
                                    colorsBuffer[colorI+3] = 0;
                                }
                                colorI += 4;
                            }

                            indicesBuffer[indicesI] = indicesI;
                            indicesBuffer[indicesI+1] = indicesI+1;
                            indicesBuffer[indicesI+2] = indicesI+2;
                            indicesI += 3;

                            // ctx.drawTriangle({
                            //     points: verts_prj as [vec2, vec2, vec2],
                            //     color
                            // });
                        } else {
                            console.log(`N-GON detected. we're currently not supporting that.`)
                            //ctx.drawNGon(verts_prj, color);
                        }
                    }
                } else if (p.isText()) {
                    // let pos = this.Project(this.worldToCameraSpace(p.pos), v2zero(), {
                    //     x: ctx.getWidth(),
                    //     y: ctx.getHeight()
                    // });
                    // ctx.drawText(p.text, pos, p.size, p.color);
                }
            }
        }
        backend.scene.writePositions(vertexBuffer);
        backend.scene.writeIndices(indicesBuffer);
        backend.scene.writeColors(colorsBuffer);
        backend.scene.render(
            this.viewMatrix(),
            this.projectionMatrix(backend.viewport.getWidth(), backend.viewport.getHeight())
        );
    }
}