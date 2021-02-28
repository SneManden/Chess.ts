import { Board } from "../../Board.ts";
import { Color } from "../../Game.ts";
import { Position } from "../../Position.ts";
import { assertMovesDoesNotContain, assertMovesEquals, kingAt, rookAt } from "../testUtilities.ts";

Deno.test("king moves 1 square in all directions", () => {
  const board = new Board();
  const king = kingAt(board, Color.White, Position.create("D4"));
  assertMovesEquals(king.validMoves(), ["D5", "C5", "E5", "D3", "C3", "E3", "C4", "E4"]);
});

Deno.test("king cannot move to squares under attack", () => {
  const board = new Board();
  const king = kingAt(board, Color.White, Position.create("D4"));
  rookAt(board, Color.Black, Position.create("A5"));
  assertMovesDoesNotContain(king.validMoves(), ["D5", "C5", "E5"]);
});

Deno.test("king (white) is check should restrict possible moves for white", () => {
  const board = new Board();
  const king = kingAt(board, Color.White, Position.create("D4"));
  const rookW = rookAt(board, Color.White, Position.create("A5"));
  rookAt(board, Color.Black, Position.create("D8"));
  assertMovesDoesNotContain(king.validMoves(), ["D5", "D3"]); // Must move away from column D under attack
  assertMovesEquals(rookW.validMoves(), ["D5"]); // Only valid move is to protect king
});
