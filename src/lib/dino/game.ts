import {
  GameStatus,
  GameTextures,
  TexturesInfo,
  TerrainType,
  TerrainGenerator,
} from "./types";

import Dino from "./dino";
import Obstacle from "./obstacle";
import loadTextures from "./load-textures";
import Platform from "./platform";
import Coin from "./coin";
import ClassicTerrainGenerator from "./terrain/classic-terrain-generator";
import CanyonTerrainGenerator from "./terrain/canyon-terrain-generator";

class Game {
  status: GameStatus = "title";

  elapsedTime: number = 0;
  collectedCoins: number = 0;
  score: number = 0;

  terrainTimer: number = 0;
  terrainType: TerrainType = "classic";
  terrainGenerator: TerrainGenerator | null = null;

  canvasWidth: number = 0;
  groundY: number = 1;

  textures: GameTextures;
  colors: {
    ground: string;
    platform: string;
  };

  dino: Dino;
  obstacles: Obstacle[] = [];
  platforms: Platform[] = [];
  coins: Coin[] = [];

  constructor(
    textures: GameTextures,
    colors: { ground: string; platform: string },
  ) {
    this.textures = textures;
    this.dino = new Dino(this.textures.dino, this.groundY);
    this.colors = colors;
  }

  reset() {
    this.terrainTimer = 0;
    this.dino.position.y = 0;
    this.dino.vy = 0;
    this.obstacles = [];
    this.platforms = [];
    this.coins = [];
    this.elapsedTime = 0;
    this.collectedCoins = 0;
    this.score = 0;
    this.terrainGenerator = null;
  }

  start() {
    if (this.status === "title" || this.status === "over") {
      this.status = "running";
    } else {
      throw new Error("Game already running");
    }
  }

  pause() {
    if (this.status === "running") {
      this.status = "paused";
    } else {
      throw new Error("Game not running");
    }
  }

  resume() {
    if (this.status === "paused") {
      this.status = "running";
    } else {
      throw new Error("Game not paused");
    }
  }

  stop() {
    if (this.status === "running") {
      this.status = "over";
    } else {
      throw new Error("Game not running");
    }
  }

  restart() {
    if (this.status === "over") {
      this.reset();
      this.start();
    } else {
      throw new Error("Game not over");
    }
  }

  spawnCactus(xOffset: number = 0, yOffset: number = 0, scale: number = 2) {
    this.obstacles.push(
      new Obstacle(
        this.textures.cactus,
        this.canvasWidth / 16 + xOffset,
        this.groundY + yOffset,
        scale,
      ),
    );
  }

  spawnPterodactyl(
    xOffset: number = 0,
    yOffset: number = 0,
    scale: number = 2,
  ) {
    this.obstacles.push(
      new Obstacle(
        this.textures.pterodactyl,
        this.canvasWidth / 16 + xOffset,
        this.groundY + yOffset,
        scale,
        "wiggle",
      ),
    );
  }

  spawnPlatform(width: number, xOffset: number = 0, yOffset: number = 0) {
    this.platforms.push(
      new Platform(
        this.canvasWidth / 16 + xOffset,
        this.groundY + yOffset,
        width,
        this.colors.platform,
      ),
    );
  }

  spawnCoin(xOffset: number = 0, yOffset: number = 0) {
    this.coins.push(
      new Coin(
        this.textures.coin,
        this.canvasWidth / 16 + xOffset,
        this.groundY + yOffset,
      ),
    );
  }

  update(dt: number, jumpKey: boolean, canvas: HTMLCanvasElement) {
    if (this.status === "running") {
      this.elapsedTime += dt;
      this.terrainTimer -= dt;
      this.score = Math.floor(this.elapsedTime * 10) + this.collectedCoins * 50;
      this.canvasWidth = canvas.width;

      if (this.terrainGenerator === null || this.terrainTimer <= 0) {
        this.terrainTimer = 10 + Math.random() * 20;
        this.platforms.forEach((platform) => {
          platform.unfreeze();
          if (platform.width < this.canvasWidth / 16) return;
          platform.width = this.canvasWidth / 16 - platform.position.x;
        });
        if (this.terrainGenerator === null || this.terrainType === "canyon") {
          this.terrainType = "classic";
          this.terrainGenerator = new ClassicTerrainGenerator(this);
        } else {
          this.terrainType = "canyon";
          this.terrainGenerator = new CanyonTerrainGenerator(this);
        }
      }

      // generate terrain
      this.terrainGenerator.generate(dt);

      // update and filter out-of-bounds obstacles
      this.obstacles.forEach((obstacle) => {
        obstacle.update(dt, this.elapsedTime);
      });
      this.obstacles = this.obstacles.filter((obstacle) => !obstacle.isOut());

      // update and filter out-of-bounds platforms
      this.platforms.forEach((platform) => {
        platform.update(dt, this.elapsedTime);
      });
      this.platforms = this.platforms.filter((platform) => !platform.isOut());

      // update and filter out-of-bounds coins
      this.coins.forEach((coin) => {
        coin.update(dt, this.elapsedTime);
      });
      this.coins = this.coins.filter((coin) => !coin.isOut());

      // update dino
      const collidablePlatform = this.platforms[0]?.isCollidable(this.dino)
        ? this.platforms[0]
        : null;
      this.dino.update(dt, jumpKey, collidablePlatform?.position.y || null);

      // check for collision with obstacles
      this.obstacles.forEach((obstacle) => {
        if (this.dino.collidesWith(obstacle)) {
          this.stop();
        }
      });

      // check for collision with coins
      this.coins = this.coins.filter((coin) => {
        if (this.dino.collidesWith(coin)) {
          this.collectedCoins++;
          return false;
        }
        return true;
      });
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // draw ground
    ctx.fillStyle = this.colors.ground;
    ctx.fillRect(
      0,
      ctx.canvas.height - this.groundY * 16,
      ctx.canvas.width,
      this.groundY * 16,
    );

    // draw platforms
    this.platforms.forEach((platform) => {
      platform.draw(ctx);
    });

    // draw coins
    this.coins.forEach((coin) => {
      coin.draw(ctx);
    });

    // draw dino
    this.dino.draw(ctx);

    // draw obstacles
    this.obstacles.forEach((obstacle) => {
      obstacle.draw(ctx);
    });
  }
}

export async function loadGame(
  textures: TexturesInfo,
  colors: { ground: string; platform: string },
) {
  return new Game(await loadTextures(textures), colors);
}

export default Game;
