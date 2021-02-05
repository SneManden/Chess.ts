import { Game, GameOptions } from "./Game.ts";
import { RandomPlayer } from "./players/RandomPlayer.ts";
import { GreedyPlayer } from "./players/GreedyPlayer.ts";
import { HumanPlayer } from "./players/HumanPlayer.ts";
import { moves as checkmate22moves } from "./doc/games/checkmate_22.ts";

const game = new Game();

const p1 = new HumanPlayer("HumanPlayer1");
const p2 = new HumanPlayer("HumanPlayer2");
// const p1 = new RandomPlayer("RandomPlayer2");
// const p2 = new GreedyPlayer("GreedyPlayer1");

const hasHuman = p1.name.startsWith("Human");
const options: GameOptions = {
  delay: hasHuman ? 1_000 : null,
  drawBoard: hasHuman ? true : "final",
  maxRounds: 200,
};


game.setupNewGame(p1, p2);

// game.playSequence(checkmate22moves.slice(0, -1));

const results = await game.startGame(options);

console.log("Results:", {
  winner: results.winner === "draw" ? "draw" : results.winner.name,
  rounds: results.roundsPlayed,
  moves: results.moves,
});
