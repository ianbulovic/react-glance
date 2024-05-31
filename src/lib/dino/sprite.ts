import { GamePosition } from "./types";

class Sprite {
  position: GamePosition;
  hitbox: GamePosition;
  texture: OffscreenCanvas;
  scale: number;

  constructor(texture: OffscreenCanvas) {
    this.position = new GamePosition(0, 0);
    this.texture = texture;
    this.scale = 1;
    // calculate hitbox
    const { width, height } = texture;
    this.hitbox = new GamePosition(
      (width * this.scale) / 16,
      (height * this.scale) / 16
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { cx, cy } = this.position.toCanvasPosition(ctx.canvas);
    const w = this.texture.width * this.scale;
    const h = this.texture.height * this.scale;
    ctx.drawImage(this.texture, cx, cy - h, w, h);
  }

  collidesWith(other: Sprite) {
    const { x: x1, y: y1 } = this.position;
    const { x: x2, y: y2 } = other.position;
    const { x: w1, y: h1 } = this.hitbox;
    const { x: w2, y: h2 } = other.hitbox;
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
  }
}

export default Sprite;
