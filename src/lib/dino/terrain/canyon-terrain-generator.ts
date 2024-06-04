import Game from "../game";
import { TerrainGenerator, TerrainEvent } from "../types";

class CanyonTerrainGenerator implements TerrainGenerator {
  game: Game;
  eventTimer: number = 2;
  events: TerrainEvent[] = [
    { event: this.spawnFloatingCoin, weight: 2 },
    { event: this.spawnPlatformGap, weight: 3 },
    { event: this.spawnPterodactyl, weight: 2 },
  ];
  totalWeight: number = this.events.reduce(
    (acc, event) => acc + event.weight,
    0,
  );
  started: boolean = false;

  constructor(game: Game) {
    this.game = game;
  }

  generate(dt: number) {
    this.eventTimer -= dt;

    if (!this.started) {
      this.game.spawnPlatform(1000, 0, 3);
      this.started = true;
    }

    const lastPlatform = this.game.platforms[this.game.platforms.length - 1];
    if (lastPlatform.position.x < 0) {
      lastPlatform.freeze();
      lastPlatform.position.x = 0;
      lastPlatform.width = this.game.canvasWidth / 16;
    }

    const latestObstacle = this.game.obstacles[this.game.obstacles.length - 1];
    if (
      !latestObstacle ||
      latestObstacle.position.x < this.game.canvasWidth / 16 - 4
    ) {
      this.game.spawnCactus(Math.random() * 3, 0, 1.5 + Math.random() * 0.5);
    }

    if (this.eventTimer <= 0) {
      this.eventTimer = Math.random() * 2 + 0.5;
      let rng = Math.random() * this.totalWeight;
      for (const event of this.events) {
        rng -= event.weight;
        if (rng <= 0) {
          event.event(this.game);
          break;
        }
      }
    }
  }

  spawnPlatformGap(game: Game) {
    const lastPlatform = game.platforms[game.platforms.length - 1];
    const newWidth = game.canvasWidth / 16 - lastPlatform.position.x;
    if (newWidth < 4) {
      return;
    }
    lastPlatform.width = newWidth;
    lastPlatform.unfreeze();
    game.spawnPlatform(1000, 7, 3);
  }

  spawnFloatingCoin(game: Game) {
    game.spawnCoin(0, 7);
  }

  spawnPterodactyl(game: Game) {
    game.spawnPterodactyl(0, 4.5);
  }
}

export default CanyonTerrainGenerator;
