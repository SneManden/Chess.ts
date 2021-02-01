import { Board } from "../../Board.ts";
import { Color } from "../../Game.ts";
import { Position } from "../../Position.ts";
import { assertMovesDoesNotContain, assertMovesEquals, kingAt, rookAt } from "../testUtilities.ts";

Deno.test("king moves 1 square in all directions", () => {
  const board = new Board();
  const king = kingAt(board, Color.White, new Position(4, "D"));
  assertMovesEquals(king.validMoves(), ["D5", "C5", "E5", "D3", "C3", "E3", "C4", "E4"]);
});

Deno.test("king cannot move to squares under attack", () => {
  const board = new Board();
  const king = kingAt(board, Color.White, new Position(4, "D"));
  rookAt(board, Color.Black, new Position(5, "A"));
  assertMovesDoesNotContain(king.validMoves(), ["D5", "C5", "E5"]);
});
