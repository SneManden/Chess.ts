import { assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";
import { Board } from "../Board.ts";
import { Color } from "../Game.ts";
import { Pawn } from "../pieces/Pawn.ts";
import { Position } from "../Position.ts";

Deno.test("replace to empty position should move a piece", () => {
  const board = new Board();
  const pawn = new Pawn(board, Color.White, new Position("E", 2));
  board.replace(pawn, Position.create("E4"));
  assertEquals(board.lookAt(Position.create("E2")), null);
  assertEquals(board.lookAt(Position.create("E4")), pawn);
});
