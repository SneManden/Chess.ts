import { Game } from "./Game.ts";
import { RandomPlayer } from "./players/RandomPlayer.ts";
import { GreedyPlayer } from "./players/GreedyPlayer.ts";

const game = new Game();

const p1 = new RandomPlayer("RandomPlayer1");
const p2 = new GreedyPlayer("GreedyPlayer2");

game.setupNewGame(p1, p2);
await game.startGame();
