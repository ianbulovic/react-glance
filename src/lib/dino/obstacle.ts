import Sprite from "./sprite";

type ObstacleBehavior = "static" | "wiggle";

class Obstacle extends Sprite {
  behavior: ObstacleBehavior;

  constructor(
    texture: OffscreenCanvas,
    x: number,
    y: number,
    scale: number,
    behavior: ObstacleBehavior = "static",
  ) {
    super(texture);
    this.position.x = x;
    this.position.y = y;
    this.scale = scale;
    this.behavior = behavior;
  }

  update(dt: number, elapsedTime: number) {
    this.position.x -= 15 * dt * (1 + elapsedTime / 60);
    if (this.behavior === "wiggle") {
      this.position.y += Math.sin(this.position.x * 0.3 + 3) * 0.05;
    }
  }

  isOut() {
    return this.position.x < -this.texture.width * this.scale;
  }
}

export default Obstacle;
