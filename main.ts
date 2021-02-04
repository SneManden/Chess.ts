import { Game } from "./Game.ts";
import { RandomPlayer } from "./players/RandomPlayer.ts";
import { GreedyPlayer } from "./players/GreedyPlayer.ts";
import { HumanPlayer } from "./players/HumanPlayer.ts";

const game = new Game();

// const p1 = new HumanPlayer("HumanPlayer1");
const p2 = new GreedyPlayer("GreedyPlayer1");
const p1 = new RandomPlayer("RandomPlayer2");

const hasHuman = p1.name.startsWith("Human");

game.setupNewGame(p1, p2);

const results = await game.startGame({
  delay: hasHuman ? 1_000 : null,
  drawBoard: hasHuman,
  maxRounds: 200,
});

console.log("Results:", {
  winner: results.winner === "draw" ? "draw" : results.winner.name,
  rounds: results.roundsPlayed,
  moves: results.moves,
});
