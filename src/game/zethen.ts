import { PlayerControlSystem } from "@/engine/system/player";
import { CollisionSystem } from "@/engine/system/collision";
import { AnimationSystem } from "@/engine/system/animation";
import { ShapeRenderer } from "@/engine/renderer/shape";
import { ImageRenderer } from "@/engine/renderer/image";
import {
  ColliderDebugRenderer,
  CollisionDebugRenderer,
  VelocityDebugRenderer,
} from "@/engine/renderer/debug";
import { Game } from "@/engine/game";
import { createPlayer } from "@/engine/entity/player";
import { createBox } from "@/engine/entity/box";
import { createBall } from "@/engine/entity/ball";

function onResize(canvas: HTMLCanvasElement): void {
  const { clientWidth, clientHeight } = canvas;

  canvas.width = clientWidth;
  canvas.height = clientHeight;
}

function onVisibilityChange(game: Game): void {
  if (document.hidden) {
    console.warn("Stopping game due to visibility change");
    game.stop();
  } else {
    console.info("Starting game after visibility change");
    game.start();
  }
}

export function createGame(): Game {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;

  if (!canvas) {
    throw new Error("Canvas element not found :-(");
  }

  const context = canvas.getContext("2d", {
    alpha: false,
    desynchronized: true,
  });

  // const context = WebGL.fromCanvas(canvas, true);

  if (!context) {
    throw new Error("2D canvas is not supported :-(");
  }

  const game = new Game();
  const {
    scene: { systems, entities },
  } = game;
  systems.add(new PlayerControlSystem());
  // systems.add(new GravitySystem());
  // systems.add(new MoveSystem());
  systems.add(new AnimationSystem());
  systems.add(new CollisionSystem());
  systems.add(new ShapeRenderer(context));
  systems.add(new ImageRenderer(context));
  systems.add(new ColliderDebugRenderer(context));
  systems.add(new CollisionDebugRenderer(context));
  systems.add(new VelocityDebugRenderer(context, 0.2));
  // systems.add(new WebGLRenderer(context));

  void createPlayer(entities);

  for (let i = 0; i < 10; i++) {
    createBall(entities);
  }

  for (let i = 0; i < 10; i++) {
    createBox(entities);
  }

  window.addEventListener("visibilitychange", () => onVisibilityChange(game));
  window.addEventListener("resize", () => onResize(canvas));
  onResize(canvas);

  return game;
}
