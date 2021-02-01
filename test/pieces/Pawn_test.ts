import { Board } from "../../Board.ts";
import { Color } from "../../Game.ts";
import { Pawn } from "../../pieces/Pawn.ts";
import { Position } from "../../Position.ts";
import { assertMovesEquals, pawnAt } from "../testUtilities.ts";

Deno.test("white pawn alone at D2 should be able to move to D3 and D4", () => {
  const board = new Board();
  const pawn = new Pawn(board, Color.White, new Position("D", 2));
  assertMovesEquals(pawn.validMoves(), ["D3", "D4"]);
});

Deno.test("second move with pawn should only allow 1 square forward", () => {
  const board = new Board();
  const pawn = new Pawn(board, Color.White, new Position("D", 2));
  pawn.move(Position.create("D4"));
  assertMovesEquals(pawn.validMoves(), ["D5"]);
});

Deno.test("black pawn alone at D7 should be able to move to D6 and D5", () => {
  const board = new Board();
  const pawn = new Pawn(board, Color.Black, new Position("D", 7));
  assertMovesEquals(pawn.validMoves(), ["D6", "D5"]);
});

Deno.test("pawn with opponent in forward diagonal should be included in moves", () => {
  const board = new Board();
  const pawn = new Pawn(board, Color.White, new Position("D", 2));
  pawnAt(board, Color.Black, Position.create("C3"));
  assertMovesEquals(pawn.validMoves(), ["D3", "D4", "C3"]);
});

Deno.test("pawn with opponent directly in front should not be able to move", () => {
  const board = new Board();
  const pawn = new Pawn(board, Color.White, new Position("D", 2));
  pawnAt(board, Color.Black, Position.create("D3"));
  assertMovesEquals(pawn.validMoves(), []);
});
