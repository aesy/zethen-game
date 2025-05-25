import { TileMapSystem } from "@/game/system/tilemap";
import { PlayerControlSystem } from "@/game/system/player";
import { MoveSystem } from "@/game/system/move";
import { CollisionSystem } from "@/game/system/collision";
import { AttachSystem } from "@/game/system/attach";
import { AnimationSystem } from "@/game/system/animation";
import { ShapeRenderer } from "@/game/renderer/shape";
import { ImageRenderer } from "@/game/renderer/image";
import {
  CameraDebugRenderer,
  ColliderDebugRenderer,
  CollisionDebugRenderer,
  VelocityDebugRenderer,
} from "@/game/renderer/debug";
import { createTileMap } from "@/game/entity/tilemap";
import { createPlayer } from "@/game/entity/player";
import { createCamera } from "@/game/entity/camera";
import { createBox } from "@/game/entity/box";
import { createBall } from "@/game/entity/ball";
import { Scene } from "@/engine/game/scene";
import { Game } from "@/engine/game/game";

const resolutionScaling = window.devicePixelRatio ?? 1.0;

function onResize(canvas: HTMLCanvasElement): void {
  const { clientWidth, clientHeight } = canvas;

  canvas.width = Math.floor(clientWidth * resolutionScaling);
  canvas.height = Math.floor(clientHeight * resolutionScaling);
}

function onVisibilityChange(game: Game): void {
  if (document.hidden) {
    console.warn("Stopping game due to visibility change");
    game.stop();
  } else if (!game.isRunning) {
    console.info("Starting game after visibility change");
    game.start();
  }
}

export async function createGame(): Promise<Game> {
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

  const [tileMap, tileSet] = await createTileMap();

  const game = new Game();
  const {
    scene: { systems, entities },
  } = game;
  systems.add({
    update(_scene: Scene, _dt: number): void {
      const canvas = context.canvas;
      context.clearRect(0, 0, canvas.width, canvas.height);
    },
  });
  systems.add(new PlayerControlSystem());
  // systems.add(new GravitySystem());
  systems.add(new MoveSystem());
  systems.add(new AttachSystem());
  systems.add(new CollisionSystem());
  systems.add(new AnimationSystem());
  systems.add(new TileMapSystem(context, tileMap, tileSet));
  systems.add(new ImageRenderer(context));
  systems.add(new ShapeRenderer(context));
  systems.add(new ColliderDebugRenderer(context));
  systems.add(new CollisionDebugRenderer(context));
  systems.add(new VelocityDebugRenderer(context, 0.5));
  systems.add(new CameraDebugRenderer(context));
  // systems.add(new WebGLRenderer(context));

  const player = await createPlayer(entities);
  createCamera(entities, player);

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
