import { Color, Point2D, Triangle2D } from "./Structures.js";

export abstract class GFXContext {
    public abstract getHeight(): number;
    public abstract getWidth(): number;

    public abstract drawTriangle(triangle: Triangle2D): GFXContext;
    public abstract drawNGon(points: Point2D[], color?: Color): GFXContext;
    public abstract drawPath(points: Point2D[], thickness: number, color?: Color): GFXContext;
    public abstract drawText(text: string, pos: Point2D, size: number, color?: Color): GFXContext;
    public abstract fillBackground(color: Color): GFXContext;
}