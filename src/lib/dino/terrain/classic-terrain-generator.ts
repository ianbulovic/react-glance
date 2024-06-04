import Game from "../game";
import { TerrainGenerator, TerrainEvent } from "../types";

class ClassicTerrainGenerator implements TerrainGenerator {
  game: Game;
  eventTimer: number = 2;
  events: TerrainEvent[] = [
    { event: this.spawnCactus, weight: 5 },
    { event: this.spawnCactusBunch, weight: 3 },
    { event: this.spawnCactusWithCoin, weight: 2 },
    { event: this.spawnFloorCoinBunch, weight: 1 },
    { event: this.spawnFloatingCoin, weight: 2 },
    { event: this.spawnPlatformOverCacti, weight: 2 },
  ];
  totalWeight: number = this.events.reduce(
    (acc, event) => acc + event.weight,
    0,
  );

  constructor(game: Game) {
    this.game = game;
  }

  generate(dt: number) {
    this.eventTimer -= dt;
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

  spawnCactus(game: Game) {
    game.spawnCactus(0, 0, 1.5 + Math.random() * 0.5);
  }

  spawnCactusWithCoin(game: Game) {
    game.spawnCactus();
    game.spawnCoin(0.5, 5);
  }

  spawnCactusBunch(game: Game) {
    if (Math.random() < 0.5) {
      game.spawnCactus();
      game.spawnCactus(2, 0, 1.5);
    } else {
      game.spawnCactus(0, 0, 1.5);
      game.spawnCactus(1.5, 0, 2);
    }
  }

  spawnFloorCoinBunch(game: Game) {
    game.spawnCoin(0, 0.5);
    game.spawnCoin(2, 0.5);
    game.spawnCoin(4, 0.5);
  }

  spawnFloatingCoin(game: Game) {
    game.spawnCoin(0, 5);
  }

  spawnPlatformOverCacti(game: Game) {
    const width = Math.random() * 5 + 5;
    game.spawnPlatform(width, 0, 3);
    for (let i = 0; i < width - 1; i += 2) {
      if (Math.random() < 0.5) {
        game.spawnCactus(i, 0, 1.5 + Math.random() * 0.5);
      }
    }
  }
}

export default ClassicTerrainGenerator;
