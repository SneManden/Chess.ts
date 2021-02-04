import { assert, assertArrayIncludes, assertEquals, assertExists } from "https://deno.land/std@0.85.0/testing/asserts.ts";
import { Board } from "../Board.ts";
import { Color } from "../Game.ts";
import { Pawn } from "../pieces/Pawn.ts";
import { Position } from "../Position.ts";
import { Rook } from "../pieces/Rook.ts";
import { King } from "../pieces/King.ts";

// When TS 4.2 is available, use: expected: `${Col}${Row}`[]
export function assertMovesEquals(moves: Position[], expected: string[], msg?: string): void {
  const movesSorted = moves.slice().map(m => m.toString()).sort((a,b) => a.localeCompare(b));
  const expectedSorted = expected.slice().sort((a,b) => a.localeCompare(b));
  return assertEquals(movesSorted, expectedSorted, msg);
}

export function assertMovesDoesNotContain(moves: Position[], notExpected: string[], msg?: string): void {
  const movesMapped = moves.slice().map(m => m.toString());
  assertEquals(movesMapped, movesMapped.filter(e => !notExpected.includes(e)), msg);
  // return assert(notExpected.every(element => !movesMapped.includes(element)), msg);
}

export function assertPositionEquals(position: Position | null | undefined, value: string, msg?: string): void {
  return assertEquals(position?.toString(), value);
}

export function pawnAt<C extends Color>(board: Board, color: C, at: Position): Pawn<C> {
  const pawn = new Pawn(board, color, null);
  board.add(pawn, at);
  return pawn;
}

export function rookAt<C extends Color>(board: Board, color: C, at: Position): Rook<C> {
  const rook = new Rook(board, color, null);
  board.add(rook, at);
  return rook;
}

export function kingAt<C extends Color>(board: Board, color: C, at: Position): King<C> {
  const king = new King(board, color, null);
  board.add(king, at);
  return king;
}
