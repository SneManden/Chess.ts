import { Board } from "../../Board.ts";
import { Color } from "../../Game.ts";
import { Knight } from "../../pieces/Knight.ts";
import { Pawn } from "../../pieces/Pawn.ts";
import { Rook } from "../../pieces/Rook.ts";
import { Position } from "../../Position.ts";
import { assertMovesEquals, pawnAt, rookAt } from "../testUtilities.ts";

Deno.test("rook alone in corner should be able to move entire row and column", () => {
  const board = new Board();
  const rook = new Rook(board, Color.White, new Position("A", 1));
  assertMovesEquals(
    rook.validMoves(),
    [
      ...["A2", "A3", "A4", "A5", "A6", "A7", "A8"],
      ...["B1", "C1", "D1", "E1", "F1", "G1", "H1"]
    ]
  );
});

Deno.test("rook with pawn in front should only be able to move horizontally", () => {
  const board = new Board();
  const rook = new Rook(board, Color.White, new Position("A", 1));
  new Pawn(board, Color.White, new Position("A", 2));
  assertMovesEquals(
    rook.validMoves(),
    ["B1", "C1", "D1", "E1", "F1", "G1", "H1"]
  );
});

Deno.test("rook cornered by pawn and knigh should not be able to move", () => {
  const board = new Board();
  const rook = new Rook(board, Color.White, new Position("A", 1));
  new Pawn(board, Color.White, new Position("A", 2));
  new Knight(board, Color.White, new Position("B", 1));
  assertMovesEquals(rook.validMoves(), []);
});

Deno.test("rook should include opponnent in moves (attack)", () => {
  const board = new Board();
  const rook = rookAt(board, Color.White, Position.create("D4"));
  pawnAt(board, Color.Black, Position.create("D2")); // below
  pawnAt(board, Color.White, Position.create("D6")); // above
  pawnAt(board, Color.Black, Position.create("B4")); // left
  pawnAt(board, Color.White, Position.create("F4")); // right
  assertMovesEquals(
    rook.validMoves(),
    [
      ...["D3", "D2"],  // below (opponent pos included)
      ...["D5"],        // above (teammate pos NOT included)
      ...["C4", "B4"],  // left (opponent pos included)
      ...["E4"],        // right (teammate pos NOT included)
    ]
  );
});
