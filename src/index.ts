import "@/globals";
import { createGame } from "@/game/zethen";

try {
  const game = await createGame();
  game.start();
} catch (error) {
  console.error(error);
  alert(error);
}
