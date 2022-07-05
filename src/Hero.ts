import { AnimatedSprite, Texture } from 'pixi.js'

export class Hero extends AnimatedSprite {
frameLeft:Texture
frameRight:Texture

    constructor(texture: Texture[],frameRight:Texture, frameLeft:Texture) {
        super(texture)
        this.frameRight = frameRight
        this.frameLeft = frameLeft

        window.addEventListener("keydown", (e) => this.move(e))
    }

    move(e: KeyboardEvent) {
        if (e.key === "ArrowUp") {
            if (this.y > 20) {
                this.y -= 80;
            } else {
                this.y = this.y
            }
        } else if (e.key === "ArrowRight") {
            this.texture = this.frameRight;
            if (this.x < 700) {
                this.x += 15;
            } else {
                this.y = this.y
            }
        } else if (e.key === "ArrowLeft") {
            this.texture = this.frameLeft;
            if (this.x > -30) {
                this.x -= 15;
            }
        }
    }
}