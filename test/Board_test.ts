import { assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";
import { Board } from "../Board.ts";
import { Color } from "../Game.ts";
import { Pawn } from "../pieces/Pawn.ts";
import { Position } from "../Position.ts";

Deno.test("replace to empty position should move a piece", () => {
  const board = new Board();
  const pawn = new Pawn(board, Color.White, new Position(2, "E"));
  board.replace(pawn, new Position(4, "E"));
  assertEquals(board.lookAt(new Position(2, "E")), null);
  assertEquals(board.lookAt(new Position(4, "E")), pawn);
});
