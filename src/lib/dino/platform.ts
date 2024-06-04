import { GamePosition } from "./types";
import Dino from "./dino";

class Platform {
  position: GamePosition;
  width: number;
  color: string;
  frozen: boolean = false;

  constructor(x: number, y: number, width: number, color: string) {
    this.position = new GamePosition(x, y);
    this.width = width;
    this.color = color;
  }

  isOut() {
    return this.position.x + this.width < 0;
  }

  freeze() {
    this.frozen = true;
  }

  unfreeze() {
    this.frozen = false;
  }

  update(dt: number, elapsedTime: number) {
    if (this.frozen) return;
    this.position.x -= 15 * dt * (1 + elapsedTime / 60);
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { cx, cy } = this.position.toCanvasPosition(ctx.canvas);
    ctx.fillStyle = this.color;
    ctx.fillRect(cx, cy, this.width * 16, 5);
  }

  isCollidable(dino: Dino) {
    return (
      this.position.x < dino.position.x + dino.hitbox.x &&
      this.position.x + this.width > dino.position.x
    );
  }
}

export default Platform;
