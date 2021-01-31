import { Game } from "./Game.ts";
import { RandomPlayer } from "./RandomPlayer.ts";

const game = new Game();

const p1 = new RandomPlayer("Player 1");
const p2 = new RandomPlayer("Player 2");

game.setupNewGame(p1, p2);
game.startGame();
