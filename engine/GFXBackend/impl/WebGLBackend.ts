import { Color } from "../Structures";
import { GFXViewport } from "../GFXViewport";
import { GFXScene } from "../GFXScene";
import { GFXBackend } from "../GFXBackend";

class WebGLViewport implements GFXViewport{
    constructor(private backend: WebGLBackend) {
    }

    public getWidth(): number {
        return this.backend.gl.canvas.width;
    }

    public getHeight(): number {
        return this.backend.gl.canvas.height;
    }

    public clear(color: Color) {
        this.backend.gl.clearColor(color.red, color.green, color.blue, color.alpha);
        this.backend.gl.clear(this.backend.gl.COLOR_BUFFER_BIT);
    }
}

class WebGLScene implements GFXScene {
    public positionBuffer: WebGLBuffer;
    public indexBuffer: WebGLBuffer;
    public colorBuffer: WebGLBuffer;

    constructor(private backend: WebGLBackend) {
        this.positionBuffer = this.backend.gl.createBuffer()!;
        this.indexBuffer = this.backend.gl.createBuffer()!;
        this.colorBuffer = this.backend.gl.createBuffer()!;
    }

    public writePositions(data: Float32Array) {
        this.backend.gl.bindBuffer(this.backend.gl.ARRAY_BUFFER, this.positionBuffer);
        this.backend.gl.bufferData(this.backend.gl.ARRAY_BUFFER, data, this.backend.gl.STATIC_DRAW);
    }

    public writeIndices(data: Uint16Array) {
        this.backend.gl.bindBuffer(this.backend.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.backend.gl.bufferData(this.backend.gl.ELEMENT_ARRAY_BUFFER, data, this.backend.gl.STATIC_DRAW);
    }

    public writeColors(data: Float32Array) {
        this.backend.gl.bindBuffer(this.backend.gl.ARRAY_BUFFER, this.colorBuffer);
        this.backend.gl.bufferData(this.backend.gl.ARRAY_BUFFER, data, this.backend.gl.STATIC_DRAW);
    }

    public render(modelViewMatrix: Float32Array, projectionMatrix: Float32Array) {
        if(!this.backend.shader) {
            throw new Error("Shaders are not initialized in backend.");
        }

        this.backend.gl.enable(this.backend.gl.DEPTH_TEST); // Enable depth testing
        this.backend.gl.depthFunc(this.backend.gl.LEQUAL); // Near things obscure far things
        this.backend.gl.clear(this.backend.gl.DEPTH_BUFFER_BIT);

        this.backend.gl.bindBuffer(this.backend.gl.ARRAY_BUFFER, this.positionBuffer);
        this.backend.gl.vertexAttribPointer(
            this.backend.shader.attribLocations.vertexPosition,
            3,
            this.backend.gl.FLOAT,
            false,
            0,
            0
        );
        this.backend.gl.enableVertexAttribArray(this.backend.shader.attribLocations.vertexPosition);

        this.backend.gl.bindBuffer(this.backend.gl.ARRAY_BUFFER, this.colorBuffer);
        this.backend.gl.vertexAttribPointer(
            this.backend.shader.attribLocations.vertexColor,
            4,
            this.backend.gl.FLOAT,
            false,
            0,
            0
        );
        this.backend.gl.enableVertexAttribArray(this.backend.shader.attribLocations.vertexColor);

        // Tell WebGL which indices to use to index the vertices
        this.backend.gl.bindBuffer(this.backend.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.backend.gl.useProgram(this.backend.shader.program);

        this.backend.gl.uniformMatrix4fv(
            this.backend.shader.uniformLocations.projectionMatrix,
            false,
            projectionMatrix
        );
        this.backend.gl.uniformMatrix4fv(
            this.backend.shader.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix
        );

        this.backend.gl.bindBuffer(this.backend.gl.ARRAY_BUFFER, this.positionBuffer);
        let pointer: GLint = this.backend.gl.getBufferParameter(this.backend.gl.ARRAY_BUFFER, this.backend.gl.BUFFER_SIZE);

        const vertexCount = pointer.valueOf() / 4 / 3;
        this.backend.gl.drawElements(
        this.backend.gl.TRIANGLES, vertexCount, this.backend.gl.UNSIGNED_SHORT, 0);
    }
}

interface ShaderProgram {
    program: WebGLProgram;
    attribLocations: {
        vertexPosition: GLint,
        vertexColor: GLint,
    },
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation,
        modelViewMatrix: WebGLUniformLocation,
    },
}

export class WebGLBackend implements GFXBackend {
    public gl: WebGLRenderingContext;
    public viewport: WebGLViewport;
    public scene: WebGLScene;
    public shader?: ShaderProgram;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
        this.viewport = new WebGLViewport(this);
        this.scene = new WebGLScene(this);
    }

    private loadShader(type: number, source: string): WebGLShader {
        const shader = this.gl.createShader(type)!;
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            let compileErr = this.gl.getShaderInfoLog(shader);
            this.gl.deleteShader(shader);
            throw new Error(`Failed to compile shader type=${type}: ` + compileErr);
        }
        return shader;
    }

    public initShaders() {
        const vsSource = `#version 300 es
            in vec4 aVertexPosition;
            in vec4 aVertexColor;
        
            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;
        
            out lowp vec4 vColor;
        
            void main(void) {
              gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
              vColor = aVertexColor;
            }
        `;

        const fsSource = `#version 300 es
            precision highp float;
            in vec4 vColor;
            out vec4 fragment_color;
            
            void main(void) {
              fragment_color = vColor;
            }
        `;

        const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fsSource);

        const shaderProgram = this.gl.createProgram()!;
        this.gl.attachShader(shaderProgram, vertexShader);
        this.gl.attachShader(shaderProgram, fragmentShader);
        this.gl.linkProgram(shaderProgram);

        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
            throw new Error(`Failed to link shader program: ${this.gl.getProgramInfoLog(shaderProgram)}`);
        }

        this.shader = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(shaderProgram, "aVertexPosition"),
                vertexColor: this.gl.getAttribLocation(shaderProgram, "aVertexColor"),
            },
            uniformLocations: {
                projectionMatrix: this.gl.getUniformLocation(
                    shaderProgram,
                    "uProjectionMatrix"
                )!,
                modelViewMatrix: this.gl.getUniformLocation(shaderProgram, "uModelViewMatrix")!,
            },
        }
    }
}