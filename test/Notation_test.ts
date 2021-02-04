import { assert, assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";
import { Board } from "../Board.ts";
import { Color } from "../Game.ts";
import { Piece } from "../pieces/ChessPiece.ts";
import { Notation } from "../Notation.ts";
import { ChessPiece } from "../pieces/ChessPiece.ts";
import { assertMoveIs as assertMoveEquals, assertPositionEquals } from "./testUtilities.ts";
import { Position } from "../Position.ts";

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

Deno.test("valid move (white): 'd4' should move Pawn forward to D4", () => {
  const game = createBoardWithPieces();
  const move = Notation.parseMove("d4", game.pieces.white);
  assertMoveEquals(move, Piece.Pawn, Position.create("D2"), Position.create("D4"));
});

Deno.test("invalid move (black): 'd4' is not a valid initial move for black", () => {
  const game = createBoardWithPieces();
  const move = Notation.parseMove("d4", game.pieces.black);
  assertEquals(move, null);
});

Deno.test("invalid move (white): 'bf4' is not a valid move", () => {
  const game = createBoardWithPieces();  
  game.pieces.white.find(p => p.position()?.equals(Position.create("D2")))?.move(Position.create("D4")); // Clear way for bishop to move to F4
  const move = Notation.parseMove("bf4", game.pieces.white);
  assertEquals(move, null);
});

Deno.test("valid move (white): 'Bf4' should move Bishop to F4", () => {
  const game = createBoardWithPieces();  
  game.pieces.white.find(p => p.position()?.equals(Position.create("D2")))?.move(Position.create("D4")); // Clear way for bishop to move to F4
  const move = Notation.parseMove("Bf4", game.pieces.white);
  assertMoveEquals(move, Piece.Bishop, Position.create("C1"), Position.create("F4"));
})
