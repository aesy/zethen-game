import "@/globals";
import { createBrickBreakerGame } from "@/game/brickbreaker";

try {
  const game = createBrickBreakerGame();
  game.start();
} catch (error) {
  console.error(error);
  alert(error);
}
