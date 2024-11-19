export class ViewportControls {
    constructor(canvas, viewportCamera) {
        this.canvas = canvas;
        this.camera = viewportCamera;
    }

    start() {
        this.canvas.addEventListener("click", async ev => {
            await this.canvas.requestPointerLock();
        });

        document.addEventListener("mousemove", async (event) => {
            if(event.buttons === 4) {
                this.camera.Move({
                    x: event.movementX / 10,
                    y: -event.movementY / 10,
                    z: 0
                });
            } else if (event.buttons === 0) {
                if (document.pointerLockElement === this.canvas) {
                    this.camera.Rotate({
                        x: event.movementY / 100,
                        y: event.movementX / 100,
                        z: 0
                    });
                }
            } else if(event.buttons === 2 && document.pointerLockElement === this.canvas) {
                document.exitPointerLock();
            }
        });

        document.addEventListener("wheel", (event) => {
            this.camera.Move({
                x: 0,
                y: 0,
                z: event.deltaY / 10
            })
        });

        document.addEventListener('keydown', (event) => {
            console.log(event.key);
            switch(event.key){
                case "w": {
                    this.camera.position.z += 0.1;
                    break;
                }
                case "s": {
                    this.camera.position.z -= 0.1;
                    break;
                }
                case "a": {
                    this.camera.position.x -= 0.1;
                    break;
                }
                case "d": {
                    this.camera.position.x += 0.1;
                    break;
                }

                case "W": {
                    this.camera.position.z += 1;
                    break;
                }
                case "S": {
                    this.camera.position.z -= 1;
                    break;
                }
                case "A": {
                    this.camera.position.x -= 1;
                    break;
                }
                case "D": {
                    this.camera.position.x += 1;
                    break;
                }

                case "ArrowDown": {
                    this.camera.position.y -= 0.1;
                    break;
                }
                case "ArrowUp": {
                    this.camera.position.y += 0.1;
                    break;
                }

                case "ArrowLeft": {
                    this.camera.rotation.y -= 0.0174533;
                    break;
                }
                case "ArrowRight": {
                    this.camera.rotation.y += 0.0174533;
                    break;
                }

                // case "+": {
                //         model2.SetSize({
                //             x: model2.size.x + 0.01,
                //             y: model2.size.y + 0.01,
                //             z: model2.size.z + 0.01,
                //         });
                //
                //         break;
                //     }
                // case "-": {
                //         model2.SetSize({
                //             x: model2.size.x - 0.01,
                //             y: model2.size.y - 0.01,
                //             z: model2.size.z - 0.01,
                //         });
                //         break;
                //     }
                //
                // case "O": {
                //         IgniRender.ExportOBJ(model2);
                //         break;
                //     }
                //
                // case "o": {
                //         IgniRender.ExportOBJ(model2, false);
                //         break;
                //     }
            }
        }, false);
    }
}
//
// function download_file(file, name) {
//     let blob = new Blob([file], {type: 'text/plain'});
//     let url = URL.createObjectURL(blob);
//
//     let hiddenElement = document.createElement('a');
//
//     hiddenElement.href = url;
//     hiddenElement.target = '_blank';
//     hiddenElement.download = name;
//     hiddenElement.click();
// }