import { assert, assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";
import { Board } from "../Board.ts";
import { Color } from "../Game.ts";
import { Pawn } from "../pieces/Pawn.ts";
import { Position } from "../Position.ts";
import { kingAt } from "./testUtilities.ts";

Deno.test("replace to empty position should move a piece", () => {
  const board = new Board();
  const pawn = new Pawn(board, Color.White, new Position("E", 2));
  board.replace(pawn, Position.create("E4"));
  assertEquals(board.lookAt(Position.create("E2")), null);
  assertEquals(board.lookAt(Position.create("E4")), pawn);
});

Deno.test("check validity should not alter board", () => {
  const board = new Board();
  board.createPieces(Color.White, 1, 2);
  board.createPieces(Color.Black, 8, 7);
  const pawnPos = Position.create("D2");
  const movePos = Position.create("E4");
  const pawn = board.lookAt(pawnPos); // some pawn
  // Assumption
  assert(pawn !== null, "there must be a pawn at D2");

  // Act
  const isValid = board.isValidMove(pawn, { to: movePos });
  
  // Assert
  assertEquals(board.getPosition(pawn)?.toString(), pawnPos.toString(), "pawn must still be at D2");
  assertEquals(board.lookAt(movePos), null, "there should be nothing at D4");
  assertEquals(isValid, true, "move should be valid");
});

Deno.test("checkmate by queen and rook", () => {
  const board = new Board();
  board.setupBoard({ white: ["Rf1", "Kg1", "f2", "g2"], black: ["Ke8", "Rh5", "Qh1"] });
  const status = board.kingStatus(Color.White);
  assertEquals(status, "checkmate");
});

Deno.test("stalemate", () => {
  const board = new Board();
  board.setupBoard({ white: ["Ke3", "Qd5", "Be5"], black: ["Kc8"] });
  const status = board.kingStatus(Color.Black);
  assertEquals(status, "stalemate");
});
