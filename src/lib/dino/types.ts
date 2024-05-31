export type GameStatus = "title" | "running" | "paused" | "over";

export type TextureInfo = {
  path: string;
  color: string;
};

export type TexturesInfo = {
  dino: TextureInfo;
  cactus: TextureInfo;
  pterodactyl: TextureInfo;
};

export type GameTextures = {
  dino: OffscreenCanvas;
  cactus: OffscreenCanvas;
  pterodactyl: OffscreenCanvas;
};

export class GamePosition {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toCanvasPosition(canvas: HTMLCanvasElement) {
    return {
      cx: this.x * 16,
      cy: canvas.height - this.y * 16,
    };
  }
}
