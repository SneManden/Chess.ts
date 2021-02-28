import { Game, GameOptions } from "./Game.ts";
import { RandomPlayer } from "./players/RandomPlayer.ts";
import { GreedyPlayer } from "./players/GreedyPlayer.ts";
import { HumanPlayer } from "./players/HumanPlayer.ts";
// import { moves as checkmate22moves } from "./doc/games/checkmate_22.ts";
import { moves as carlsonVSanand2013rnd5 } from "./doc/games/carlson_vs_anand_rnd5_2013.ts";

const game = new Game();

const p1 = new HumanPlayer("Carlson");
const p2 = new HumanPlayer("Anand");
// const p1 = new RandomPlayer("RandomPlayer2");
// const p2 = new GreedyPlayer("GreedyPlayer1");

const hasHuman = p1.name.startsWith("Human");
const options: GameOptions = {
  delay: hasHuman ? 1_000 : null,
  drawBoard: hasHuman ? true : "final",
  maxRounds: 200,
};


game.setupNewGame(p1, p2);

await game.playSequence(carlsonVSanand2013rnd5, { delay: 0, drawBoard: true });

// const results = await game.startGame(options);

// console.log("Results:", {
//   winner: results.winner === "draw" ? "draw" : results.winner.name,
//   rounds: results.roundsPlayed,
//   moves: results.moves,
// });
