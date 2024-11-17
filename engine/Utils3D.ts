import { Color } from "./GFXBackend/Structures";

export interface vec2{
    x: number;
    y: number;
}
export interface vec3 extends vec2{
    z: number;
}
export interface vec4 extends vec3{
    w: number;
}

export class Vertex implements vec3 {
    public normal?: vec3;
    constructor(public x: number, public y: number, public  z: number, public w?: number){

    }
}

export abstract class Primitive {
    public abstract readonly type: "face" | "path" | "text";
    public isFace(): this is Face {
        return this.type === "face";
    }
    public isPath(): this is Path {
        return this.type === "path";
    }
    public isText(): this is Text {
        return this.type === "text";
    }

    public abstract shortestDistance(pos: vec3): number;
}

export class Text extends Primitive {
    public readonly type = "text";
    constructor(public pos: vec3, public text: string, public size: number, public color?: Color) {
        super();
    }
    public shortestDistance(pos: vec3): number {
        return v3distance(pos, this.pos);
    }
}

export class Face extends Primitive {
    public readonly type = "face";
    constructor(public vertices: Vertex[] = [], public center?: vec3, public normal?:vec3, public bounds?: vec3, public color?: number){
        super();
    }

    public getCenter(force: boolean = false){
        if(!this.center || force){
            this.center = getFaceCenter(this);
        }
        return this.center;
    }

    public nearestVert(pos: vec3) {
        let dist = Infinity;
        let vert = this.vertices[0];
        for(let v of this.vertices) {
            let d = v3distance(v, pos);
            if (d < dist) {
                dist = d;
                vert = v;
            }
        }
        return vert;
    }

    public shortestDistance(pos: vec3) {
        let dist = Infinity;
        for(let v of this.vertices) {
            let d = v3distance(v, pos);
            if (d < dist) {
                dist = d;
            }
        }
        return dist;
    }
}

export class Path extends Primitive {
    public readonly type = "path";
    constructor(public points: vec3[], public thickness?: number, public color?: Color){
        super();
    }
    public shortestDistance(pos: vec3) {
        let dist = Infinity;
        for(let v of this.points) {
            let d = v3distance(v, pos);
            if (d < dist) {
                dist = d;
            }
        }
        return dist;
    }
}

export function v2fill(num: number): vec2 {
    return { x: num, y: num };
}

export function v3fill(num: number): vec3 {
    return { x: num, y: num, z: num };
}

export function v4fill(num: number): vec4 {
    return { x: num, y: num, z: num, w: num };
}

export function v2zero(): vec2 {
    return v2fill(0);
} 
export function v3zero(): vec3 {
    return v3fill(0);
}
export function v4zero(): vec4 {
    return v4fill(0);
}

export function v3copy(vec: vec3): vec3{
    return {
        x: vec.x,
        y: vec.y,
        z: vec.z
    }
}

//vec equals
export function v2equals(v1: vec2, v2: vec2): boolean{
    return  v1.x === v2.x && 
            v1.y === v2.y;
}

export function v3equals(v1: vec3, v2: vec3): boolean{
    return  v1.x === v2.x && 
            v1.y === v2.y &&
            v1.z === v2.z;
}

export function v4equals(v1: vec4, v2: vec4): boolean{
    return  v1.x === v2.x && 
            v1.y === v2.y &&
            v1.z === v2.z &&
            v1.w === v2.w;
}


//vec sums
export function v2sum(v1: vec2, v2: vec2): vec2{
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y,
    }
}

export function v3sum(v1: vec3, v2: vec3): vec3{
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y,
        z: v1.z + v2.z
    }
}

export function v4sum(v1: vec4, v2: vec4): vec4{
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y,
        z: v1.z + v2.z,
        w: v1.w + v2.w
    }
}


//vec subtracts
export function v2sub(v1: vec2, v2: vec2): vec2{
    return {
        x: v1.x - v2.x,
        y: v1.y - v2.y,
    }
}

export function v3sub(v1: vec3, v2: vec3): vec3{
    return {
        x: v1.x - v2.x,
        y: v1.y - v2.y,
        z: v1.z - v2.z
    }
}

export function v4sub(v1: vec4, v2: vec4): vec4{
    return {
        x: v1.x - v2.x,
        y: v1.y - v2.y,
        z: v1.z - v2.z,
        w: v1.w - v2.w
    }
}


//vec meltiplys
export function v2mul(v1: vec2, v2: vec2): vec2{
    return {
        x: v1.x * v2.x,
        y: v1.y * v2.y,
    }
}

export function v3mul(v1: vec3, v2: vec3): vec3{
    return {
        x: v1.x * v2.x,
        y: v1.y * v2.y,
        z: v1.z * v2.z
    }
}


//vec dividing
export function v2div(v1: vec2, v2: vec2): vec2{
    return {
        x: v1.x / v2.x,
        y: v1.y / v2.y,
    }
}

export function v3div(v1: vec3, v2: vec3): vec3{
    return {
        x: v1.x / v2.x,
        y: v1.y / v2.y,
        z: v1.z / v2.z
    }
}

export function v4div(v1: vec4, v2: vec4): vec4{
    return {
        x: v1.x / v2.x,
        y: v1.y / v2.y,
        z: v1.z / v2.z,
        w: v1.w / v2.w
    }
}

//vec abs
export function v2abs(v1: vec2): vec2{
    return {
        x: v1.x >= 0 ? v1.x : -v1.x,
        y: v1.y >= 0 ? v1.y : -v1.y,
    }
}

export function v3abs(v1: vec3): vec3{
    return {
        x: v1.x >= 0 ? v1.x : -v1.x,
        y: v1.y >= 0 ? v1.y : -v1.y,
        z: v1.z >= 0 ? v1.z : -v1.z,
    }
}

export function v4abs(v1: vec4): vec4{
    return {
        x: v1.x >= 0 ? v1.x : -v1.x,
        y: v1.y >= 0 ? v1.y : -v1.y,
        z: v1.z >= 0 ? v1.z : -v1.z,
        w: v1.w >= 0 ? v1.w : -v1.w,
    }
}

//vec dot products
export function v2dot(v1: vec2, v2: vec2){
    return (v1.x * v2.x) + (v1.y * v2.y);
}

export function v3dot(v1: vec3, v2: vec3){
    return (v1.x * v2.x) + (v1.y * v2.y) + (v1.z * v2.z);
}

export function v4dot(v1: vec4, v2: vec4){
    return (v1.x * v2.x) + (v1.y * v2.y) + (v1.z * v2.z) + (v1.w * v2.w);
}


//vec magnitude
export function v2mag(v1: vec2){
    return Math.sqrt((v1.x*v1.x) + (v1.y*v1.y));
}

export function v3mag(v1: vec3){
    return Math.sqrt((v1.x*v1.x) + (v1.y*v1.y) + (v1.z*v1.z));
}

export function v4mag(v1: vec4){
    return Math.sqrt((v1.x*v1.x) + (v1.y*v1.y) + (v1.z*v1.z) + (v1.w*v1.w));
}

//vec normalize
export function v2normalize(v: vec2): vec2{
    if(v.x === 0 && v.y === 0) return v2zero();

    let lg = v2mag(v);
    return {
        x: v.x / lg,
        y: v.y / lg,
    };
}

export function v3normalize(v: vec3): vec3{
    if(v.x === 0 && v.y === 0 && v.z === 0) return v3zero();

    let lg = v3mag(v);
    return {
        x: v.x / lg,
        y: v.y / lg,
        z: v.z / lg
    }
}

export function v4normalize(v: vec4): vec4{
    if(v.x === 0 && v.y === 0 && v.z === 0 && v.w === 0) return v4zero();

    let lg = v4mag(v);
    return {
        x: v.x / lg,
        y: v.y / lg,
        z: v.z / lg,
        w: v.w / lg
    }
}

//vec angles
export function v2angle(v1: vec2, v2: vec2){
    let angle = Math.acos(v2dot(v1, v2) / v2mag(v1) / v2mag(v2));
    return angle;
}

export function v3angle(v1: vec3, v2: vec3){
    let angle = Math.acos(v3dot(v1, v2) / v3mag(v1) / v3mag(v2));
    return angle;
}

export function v4angle(v1: vec4, v2: vec4){
    let angle = Math.acos(v4dot(v1, v2) / v4mag(v1) / v4mag(v2));
    return angle;
}


//vec distance
export function v3distance(v1: vec3, v2: vec3){
    let distance = Math.sqrt(Math.pow((v2.x - v1.x), 2) + Math.pow((v2.y - v1.y), 2) + Math.pow((v2.z - v1.z), 2));
    return distance;
}

export function v3rotateX(vec: vec3, angle: number){
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);

    let rot_mat = [
        [1,    0,   0,    0],
        [0,    cos, -sin, 0],
        [0,    sin, cos,  0],
        [0,    0,   0,    1]
    ]

    return matrix4MultPoint(rot_mat, vec);
}

export function v3rotateY(vec: vec3, angle: number){
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);

    let rot_mat = [
        [cos,  0, sin, 0],
        [0,    1, 0,   0],
        [-sin, 0, cos, 0],
        [0,    0, 0,   1]
    ]

    return matrix4MultPoint(rot_mat, vec);
}

export function v3rotateZ(vec: vec3, angle: number){
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);

    let rot_mat = [
        [cos,  -sin, 0, 0],
        [sin,  cos,  0, 0],
        [0,    0,    1, 0],
        [0,    0,    0, 1]
    ]

    return matrix4MultPoint(rot_mat, vec);
}

export function v3rotate(vec: vec3, rot: vec3){
    let out = v3copy(vec);
    if(rot.x !== 0){
        out = v3rotateX(out, rot.x);
    }
    if(rot.y !== 0){
        out = v3rotateY(out, rot.y);
    }
    if(rot.z !== 0){
        out = v3rotateZ(out, rot.z);
    }
    return out;
}
//vec3 rotate
/*
export function v3rotate(vec: vec3, rot: vec3){
    let vin: vec3 = {
        x: vec.x,
        y: vec.y,
        z: vec.z
    }
    let vout: vec3 = {
        x: vec.x,
        y: vec.y,
        z: vec.z
    }

    //X rotation
    if(rot.x !== 0){
        vout.y =  vin.y * Math.cos(rot.x) + vin.z * Math.sin(rot.x);
        vout.z = -vin.y * Math.sin(rot.x) + vin.z * Math.cos(rot.x);
    }
    
    vin.y = vout.y;
    vin.z = vout.z;

    //Y rotation
    if(rot.y !== 0){
        vout.x =  vin.x * Math.cos(rot.y) + vin.z * Math.sin(rot.y);
        vout.z = -vin.x * Math.sin(rot.y) + vin.z * Math.cos(rot.y);
    }

    vin.x = vout.x;
    vin.z = vout.z;

    //Z rotation
    if(rot.z !== 0){
        vout.x =  vin.x * Math.cos(rot.z) - vin.y * Math.sin(rot.z);
        vout.y = -vin.x * Math.sin(rot.z) + vin.y * Math.cos(rot.z);
    }

    vin.x = vout.x;
    vin.y = vout.y;

    return vout;
}
*/

export function getFaceCenter(face: Face){
    let cnt: vec3 = {
        x: 0,
        y: 0,
        z: 0
    }
    for(let v of face.vertices){
        cnt.x += v.x;
        cnt.y += v.y;
        cnt.z += v.z;
    }
    cnt.x /= face.vertices.length;
    cnt.y /= face.vertices.length;
    cnt.z /= face.vertices.length;
    return cnt;
}

export function getFaceNormal(face: Face){
    let normal: vec3 = {
        x: 0,
        y: 0,
        z: 0
    }
    for(let i = 0; i < face.vertices.length; i++){
        let cur_v = face.vertices[i];
        let nxt_v = face.vertices[(i+1) % face.vertices.length];

        normal.x += (cur_v.y - nxt_v.y) * (cur_v.z + nxt_v.z);
        normal.y += (cur_v.z - nxt_v.z) * (cur_v.x + nxt_v.x);
        normal.z += (cur_v.x - nxt_v.x) * (cur_v.y + nxt_v.y);
    }
    return v3normalize(normal);
}

/**
 * 
 * @param num Value to convert
 * @param n_max New value range max
 * @param n_min New value range min
 * @param o_max Old value range max
 * @param o_min Old value range min
 * @returns 
 */
export function convertRange(num: number, n_max: number, n_min: number, o_max: number, o_min: number){
    let n_rng = n_max - n_min;
    let o_rng = o_max - o_min;
    return (((num - o_min) * n_rng) / o_rng) + n_min;
}

export function convertRangeVec2(vec: vec2, n_max: vec2, n_min: vec2, o_max: vec2, o_min: vec2): vec2 {
    return {
        x: convertRange(vec.x, n_max.x, n_min.x, o_max.x, o_min.x),
        y: convertRange(vec.y, n_max.y, n_min.y, o_max.y, o_min.y),
    }
}

export function convertRangeVec3(vec: vec3, n_max: vec3, n_min: vec3, o_max: vec3, o_min: vec3): vec3 {
    return {
        x: convertRange(vec.x, n_max.x, n_min.x, o_max.x, o_min.x),
        y: convertRange(vec.y, n_max.y, n_min.y, o_max.y, o_min.y),
        z: convertRange(vec.z, n_max.z, n_min.z, o_max.z, o_min.z),
    }
}


export function hexToRGB(hex: string): Color {
    let bigint = parseInt(hex.replace("#", ""), 16);
    let red = ((bigint >> 16) & 255) / 255;
    let green = ((bigint >> 8) & 255) / 255;
    let blue = (bigint & 255) / 255;

    return { red, green, blue, alpha: 1.0 };
}

export function rgbToHex(color: Color) {
    return "#" + (1 << 24 | Math.floor(color.red * 255) << 16 | Math.floor(color.green * 255) << 8 | Math.floor(color.blue * 255)).toString(16).slice(1);
}

export function getNormalColor(normal: vec3, fakeLight: vec3){
    let cf = v3dot(fakeLight, v3normalize(normal));
    return (cf+3)/6;
}

export function matrixDot (A: number[][], B: number[][]) {
    let result = new Array(A.length).fill(0).map(row => new Array(B[0].length).fill(0));

    return result.map((row, i) => {
        return row.map((val, j) => {
            return A[i].reduce((sum, elm, k) => sum + (elm*B[k][j]) ,0)
        })
    })
}

export function matrix4MultPoint(matrix: number[][], point: vec3) {
    let out: vec3 = v3zero();
    out.x   = point.x * matrix[0][0] + point.y * matrix[1][0] + point.z * matrix[2][0] + matrix[3][0]; 
    out.y   = point.x * matrix[0][1] + point.y * matrix[1][1] + point.z * matrix[2][1] + matrix[3][1]; 
    out.z   = point.x * matrix[0][2] + point.y * matrix[1][2] + point.z * matrix[2][2] + matrix[3][2]; 
    let w   = point.x * matrix[0][3] + point.y * matrix[1][3] + point.z * matrix[2][3] + matrix[3][3]; 
 
    if (w !== 1) { 
        out.x /= w; 
        out.y /= w; 
        out.z /= w; 
    } 
    return out;
}