import { GameStatus, GameTextures, TexturesInfo } from "./types";

import Dino from "./dino";
import Obstacle from "./obstacle";
import loadTextures from "./load-textures";

// TODO:
/* 
- Scoring
- Collision detection
- Sounds?
- Render ground
- Decoration
- Title/Game over screens?
*/

class Game {
  status: GameStatus = "title";
  dino: Dino;
  obstacles: Obstacle[] = [];
  textures: GameTextures;
  timers: {
    spawnObstacle: number;
  } = {
    spawnObstacle: 2,
  };
  groundY: number = 1;
  elapsedTime: number = 0;
  score: number = 0;

  constructor(textures: GameTextures) {
    this.textures = textures;
    this.dino = new Dino(this.textures.dino, this.groundY);
  }

  reset() {
    this.dino.position.y = 0;
    this.dino.vy = 0;
    this.obstacles = [];
    this.timers.spawnObstacle = 2;
    this.elapsedTime = 0;
    this.score = 0;
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

  update(dt: number, jumpKey: boolean, canvas: HTMLCanvasElement) {
    if (this.status === "running") {
      this.elapsedTime += dt;
      this.score = Math.floor(this.elapsedTime * 10);

      this.dino.update(dt, jumpKey);

      this.timers.spawnObstacle -= dt;
      if (this.timers.spawnObstacle <= 0) {
        this.timers.spawnObstacle = 0.3 + Math.random() * 2;
        if (Math.random() < 0.5) {
          this.obstacles.push(
            new Obstacle(this.textures.cactus, canvas.width / 16, this.groundY)
          );
        } else {
          this.obstacles.push(
            new Obstacle(
              this.textures.pterodactyl,
              canvas.width / 16,
              this.groundY + 3,
              "wiggle"
            )
          );
        }
      }

      this.obstacles.forEach((obstacle) => {
        obstacle.update(dt);
      });
      this.obstacles = this.obstacles.filter((obstacle) => !obstacle.isOut());

      // check collision
      this.obstacles.forEach((obstacle) => {
        if (this.dino.collidesWith(obstacle)) {
          this.stop();
        }
      });
    }
  }

  draw(ctx: CanvasRenderingContext2D, groundColor: string) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // draw ground
    ctx.fillStyle = groundColor;
    ctx.fillRect(
      0,
      ctx.canvas.height - this.groundY * 16,
      ctx.canvas.width,
      this.groundY * 16
    );

    // draw dino
    this.dino.draw(ctx);

    // draw obstacles
    this.obstacles.forEach((obstacle) => {
      obstacle.draw(ctx);
    });
  }
}

export async function loadGame(textures: TexturesInfo) {
  return new Game(await loadTextures(textures));
}

export default Game;
