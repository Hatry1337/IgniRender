import { Color } from "./Structures";

export interface GFXViewport {
    getWidth(): number;
    getHeight(): number;
    clear(color: Color): void;
}