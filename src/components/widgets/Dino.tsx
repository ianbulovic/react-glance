"use client";

import { useEffect, useRef, useState } from "react";

import useKeyDown from "@/hooks/useKeyShortcut";
import useCookie from "@/hooks/useCookie";
import resolveConfig from "tailwindcss/resolveConfig";
import twConfig from "../../../tailwind.config";

const fullConfig = resolveConfig(twConfig);

import Widget from "./Widget";
import NoSsr from "../NoSsr";

import Game, { loadGame } from "@/lib/dino/game";

export default function Dino() {
  const [game, setGame] = useState<Game | null>(null);
  const [lastFrame, setLastFrame] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [highScore, setHighScore] = useCookie("dino-high-score", 0, 1000);

  const jumpKey = useKeyDown(" ", {
    onKeyDown: () => {
      if (game?.status === "title") {
        game.start();
      } else if (game?.status === "over") {
        game.restart();
      }
    },
  });

  // Load game
  useEffect(() => {
    loadGame(
      {
        dino: {
          path: "dino.png",
          // @ts-ignore
          color: fullConfig.theme.colors.aqua[200],
        },
        cactus: {
          path: "cactus.png",
          color: fullConfig.theme.colors.green[200],
        },
        pterodactyl: {
          path: "pterodactyl.png",
          color: fullConfig.theme.colors.red[200],
        },
        coin: {
          path: "coin.png",
          color: fullConfig.theme.colors.yellow[200],
        },
      },
      {
        ground: fullConfig.theme.colors.yellow[200],
        platform: fullConfig.theme.colors.purple[200],
      },
    ).then((game) => {
      setGame(game);
    });
  }, []);

  useEffect(() => {
    if (!game) return;

    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
  }, [game]);

  useEffect(() => {
    if (!game) return;

    let animationFrame = 0;

    const tick = () => {
      const now = performance.now();
      const dt = (now - lastFrame) / 1000;
      setLastFrame(now);

      if (game.status === "over") {
        if (game.score > highScore) {
          setHighScore(game.score);
        }
      }
      game.update(dt, jumpKey, canvasRef.current!);
      game.draw(canvasRef.current!.getContext("2d")!);
    };

    const timeout = setTimeout(() => {
      animationFrame = requestAnimationFrame(tick);
    }, 1000 / 120);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrame);
    };
  }, [game, jumpKey, lastFrame, highScore, setHighScore]);

  return (
    <Widget title="Dino Game">
      <div className="flex flex-col gap-2 h-48">
        <div
          className={`text-lg pt-8 text-dark-500 dark:text-light-500 text-opacity-75 dark:text-opacity-75 fixed self-center text-center ${
            game?.status === "running" && "hidden"
          }`}
        >
          {game?.status === "over" ? (
            <>
              <p>Game Over!</p>
              <p>Press Space to Restart </p>
            </>
          ) : game?.status === "title" ? (
            "Press Space to Start"
          ) : (
            game?.status === "paused" && "Press Space to Resume"
          )}
        </div>
        <div
          className={
            "mx-4 my-3 text-lg text-dark-500 dark:text-light-500 text-opacity-75 dark:text-opacity-75 fixed self-end text-right"
          }
        >
          Score: {String(game?.score || 0).padStart(6, "0")} <br />
          <NoSsr>Best: {String(highScore).padStart(6, "0")}</NoSsr>
        </div>
        <div
          className="w-full h-48 rounded-lg border border-dark-700 dark:border-light-700 border-opacity-15 dark:border-opacity-50"
          ref={containerRef}
        >
          {containerRef.current && game && (
            <canvas
              ref={canvasRef}
              width={containerRef.current.clientWidth || 0}
              height={containerRef.current.clientHeight || 0}
              className="rounded-lg"
            />
          )}
        </div>
      </div>
    </Widget>
  );
}
