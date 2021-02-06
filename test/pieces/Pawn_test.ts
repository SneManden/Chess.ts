import { assert, assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";
import { Board } from "../../Board.ts";
import { Color } from "../../Game.ts";
import { Notation } from "../../Notation.ts";
import { Pawn } from "../../pieces/Pawn.ts";
import { Move } from "../../players/Player.ts";
import { Position } from "../../Position.ts";
import { assertMovesEquals, assertMovesEquals2, pawnAt } from "../testUtilities.ts";

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

Deno.test("pawn at second to last row should have pawn promotion moves", () => {
  const board = new Board();
  const pawn = pawnAt(board, Color.White, Position.create("D7"));
  const moves = pawn.validMoves().map<Move>(move => ({
    move: move,
    piece: pawn,
    notation: Notation.toAlgebraicNotation(pawn, move, [pawn]),
  }));
  assertMovesEquals2(moves, ["d8=Q", "d8=N", "d8=B", "d8=R"]);
});

Deno.test("en passant", () => {
  const board = new Board();
  const { white, black } = board.setupBoard({ white: ["a2", "b2"], black: ["a5", "b4"] });
  const [whitePawn] = white;
  const [_, blackPawn] = black;

  board.applyMove(whitePawn, { to: Position.create("A4"), from: whitePawn.position() });
  assertMovesEquals(blackPawn.validMoves(), ["B3", "A3"]);
  const enPassantMove = blackPawn.validMoves().find(m => m.to.equals(Position.create("A3")));
  assert(enPassantMove);
  const replaced = board.applyMove(blackPawn, enPassantMove);
  assertEquals(replaced, whitePawn);
});
