import { GFXViewport } from "./GFXViewport";
import { GFXScene } from "./GFXScene";

export interface GFXBackend {
    viewport: GFXViewport;
    scene: GFXScene;
}