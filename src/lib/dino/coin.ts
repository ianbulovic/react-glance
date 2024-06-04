import Sprite from "./sprite";

class Coin extends Sprite {
  constructor(texture: OffscreenCanvas, x: number, y: number) {
    super(texture);
    this.position.x = x;
    this.position.y = y;
    this.scale = 1;
  }

  update(dt: number, elapsedTime: number) {
    this.position.x -= 15 * dt * (1 + elapsedTime / 60);
  }

  isOut() {
    return this.position.x < -this.texture.width * this.scale;
  }
}

export default Coin;
