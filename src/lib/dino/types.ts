import Game from "./game";

export type GameStatus = "title" | "running" | "paused" | "over";

export type TextureInfo = {
  path: string;
  color: string;
};

export type TexturesInfo = {
  dino: TextureInfo;
  cactus: TextureInfo;
  pterodactyl: TextureInfo;
  coin: TextureInfo;
};

export type GameTextures = {
  dino: OffscreenCanvas;
  cactus: OffscreenCanvas;
  pterodactyl: OffscreenCanvas;
  coin: OffscreenCanvas;
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

export type TerrainType = "classic" | "canyon";

export type TerrainEvent = {
  event: (game: Game) => void;
  weight: number;
};

export interface TerrainGenerator {
  /**
   * Generate the terrain for the game, such as obstacles, platforms, and coins, by appending them to the game's entity lists.
   * @param game The game instance.
   * @param dt The time delta.
   */
  generate(dt: number): void;
}
