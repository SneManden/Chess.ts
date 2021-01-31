import { Board } from "../../Board.ts";
import { Color } from "../../Game.ts";
import { Knight } from "../../pieces/Knight.ts";
import { Pawn } from "../../pieces/Pawn.ts";
import { Rook } from "../../pieces/Rook.ts";
import { Position } from "../../Position.ts";
import { assertMovesEquals, pawnAt, rookAt } from "../testUtilities.ts";

Deno.test("rook alone in corner should be able to move entire row and column", () => {
  const board = new Board();
  const rook = new Rook(board, Color.White, new Position(1, "A"));
  assertMovesEquals(
    rook.moves(),
    [
      ...["A2", "A3", "A4", "A5", "A6", "A7", "A8"],
      ...["B1", "C1", "D1", "E1", "F1", "G1", "H1"]
    ]
  );
});

Deno.test("rook with pawn in front should only be able to move horizontally", () => {
  const board = new Board();
  const rook = new Rook(board, Color.White, new Position(1, "A"));
  new Pawn(board, Color.White, new Position(2, "A"));
  assertMovesEquals(
    rook.moves(),
    ["B1", "C1", "D1", "E1", "F1", "G1", "H1"]
  );
});

Deno.test("rook cornered by pawn and knigh should not be able to move", () => {
  const board = new Board();
  const rook = new Rook(board, Color.White, new Position(1, "A"));
  new Pawn(board, Color.White, new Position(2, "A"));
  new Knight(board, Color.White, new Position(1, "B"));
  assertMovesEquals(rook.moves(), []);
});

Deno.test("rook should include opponnent in moves (attack)", () => {
  const board = new Board();
  const rook = rookAt(board, Color.White, new Position(4, "D"));
  pawnAt(board, Color.Black, new Position(2, "D")); // below
  pawnAt(board, Color.White, new Position(6, "D")); // above
  pawnAt(board, Color.Black, new Position(4, "B")); // left
  pawnAt(board, Color.White, new Position(4, "F")); // right
  console.log(board.drawBoardString());
  assertMovesEquals(
    rook.moves(),
    [
      ...["D3", "D2"],  // below (opponent pos included)
      ...["D5"],        // above (teammate pos NOT included)
      ...["C4", "B4"],  // left (opponent pos included)
      ...["E4"],        // right (teammate pos NOT included)
    ]
  );
});
