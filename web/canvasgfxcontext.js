import { GFXContext } from "../engine/build/GFXBackend/GFXContext.js";
import { rgbToHex } from "../engine/build/Utils3D.js";

export class WebCanvasContext extends GFXContext {
    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.canvas_ctx = this.canvas.getContext("2d", { alpha: false });
    }

    getHeight() {
        return this.canvas.height;
    }
    getWidth() {
        return this.canvas.width;
    }

    drawTriangle(triangle) {
        return this.drawNGon(triangle.points, triangle.color);
    }

    drawNGon(points, color) {
        points = points.map(p => ({
            x: Math.floor(p.x),
            y: Math.floor(p.y),
        }));

        for (let p of points) {
            if(p.x > this.canvas.width + 10 || p.y > this.canvas.height + 10) {
                return this;
            }
        }

        this.canvas_ctx.fillStyle = rgbToHex(color) ?? "black";

        this.canvas_ctx.beginPath();
        this.canvas_ctx.moveTo(points[0].x, points[0].y);
        for(let i = 1; i < points.length; i++){
            this.canvas_ctx.lineTo(points[i].x, points[i].y);
        }
        this.canvas_ctx.fill();
        return this;
    }
    drawPath(points, thickness, color) {
        points = points.map(p => ({
            x: Math.floor(p.x),
            y: Math.floor(p.y),
        }));

        this.canvas_ctx.lineWidth = thickness;
        this.canvas_ctx.strokeStyle = rgbToHex(color) ?? "black";

        this.canvas_ctx.beginPath();
        this.canvas_ctx.moveTo(points[0].x, points[0].y);
        for(let i = 1; i < points.length; i++){
            this.canvas_ctx.lineTo(points[i].x, points[i].y);
        }
        this.canvas_ctx.stroke();
        this.canvas_ctx.closePath();
        return this;
    }
    drawText(text, pos, size, color) {
        pos = {
            x: Math.floor(pos.x),
            y: Math.floor(pos.y),
        };

        this.canvas_ctx.fillStyle = rgbToHex(color) ?? "black";
        this.canvas_ctx.textAlign = "center";
        this.canvas_ctx.font = `${size}px`;
        this.canvas_ctx.fillText(text, pos.x, pos.y);
        return this;
    }
    fillBackground(color) {
        this.canvas_ctx.fillStyle = rgbToHex(color);
        this.canvas_ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
        return this;
    }
}