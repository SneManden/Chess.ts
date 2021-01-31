import { assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";
import { Board } from "../Board.ts";
import { Color } from "../Game.ts";
import { Pawn } from "../pieces/Pawn.ts";
import { Position } from "../Position.ts";
import { Rook } from "../pieces/Rook.ts";

// When TS 4.2 is available, use: expected: `${Col}${Row}`[]
export function assertMovesEquals(moves: Position[], expected: string[], msg?: string): void {
  const movesSorted = moves.slice().map(m => m.toString()).sort((a,b) => a.localeCompare(b));
  const expectedSorted = expected.slice().sort((a,b) => a.localeCompare(b));
  return assertEquals(movesSorted, expectedSorted, msg);
}

export function pawnAt<C extends Color>(board: Board, color: C, at: Position): Pawn<C> {
  const pawn = new Pawn(board, color, null);
  board.replace(pawn, at);
  return pawn;
}

export function rookAt<C extends Color>(board: Board, color: C, at: Position): Rook<C> {
  const rook = new Rook(board, color, null);
  board.replace(rook, at);
  return rook;
}
