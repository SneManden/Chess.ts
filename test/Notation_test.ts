import { assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";
import { Board } from "../Board.ts";
import { Color } from "../Game.ts";
import { Piece } from "../pieces/ChessPiece.ts";
import { Notation } from "../Notation.ts";
import { ChessPiece } from "../pieces/ChessPiece.ts";
import { assertPositionEquals } from "./testUtilities.ts";

interface TestGame {
  board: Board;
  pieces: {
    white: ChessPiece[],
    black: ChessPiece[]
  }
}

const createBoardWithPieces = (): TestGame => {
  const board = new Board();
  const white = board.createPieces(Color.White, 1, 2);
  const black = board.createPieces(Color.Black, 8, 7);
  return {
    board,
    pieces: {
      white,
      black
    }
  };
};

Deno.test("valid move (white): 'd4' should move pawn forward 2 squares", () => {
  const game = createBoardWithPieces();
  const move = Notation.parseMove("d4", game.pieces.white);
  assertEquals(move?.piece.piece, Piece.Pawn);
  assertPositionEquals(move?.piece.position(), "D2");
  assertPositionEquals(move?.to, "D4");
});

Deno.test("invalid move (black): 'd4' is not a valid initial move for black", () => {
  const game = createBoardWithPieces();
  const move = Notation.parseMove("d4", game.pieces.black);
  assertEquals(move, null);
});

Deno.test("invalid move: 'bd4'", () => {
  
});
