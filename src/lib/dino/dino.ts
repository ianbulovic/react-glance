import Sprite from "./sprite";

class Dino extends Sprite {
  groundY: number;
  vy: number;
  constructor(texture: OffscreenCanvas, groundY: number) {
    super(texture);
    this.groundY = groundY;
    this.position.x = 1;
    this.position.y = groundY;
    this.vy = 0;
    this.scale = 2;
  }

  update(dt: number, jumpKey: boolean) {
    if (jumpKey && this.position.y === this.groundY) {
      this.vy = 40;
    }
    if (jumpKey) {
      this.vy -= 150 * dt;
    } else {
      this.vy -= 200 * dt;
    }
    this.position.y += this.vy * dt;
    if (this.position.y < this.groundY) {
      this.position.y = this.groundY;
      this.vy = 0;
    }
  }
}

export default Dino;
