export interface GFXScene {
    writePositions(data: Float32Array): void;
    writeIndices(data: Uint16Array): void;
    writeColors(data: Float32Array): void;
    render(modelViewMatrix: Float32Array, projectionMatrix: Float32Array): void;
}