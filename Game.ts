import { ChessPiece } from "./ChessPiece";
import { Col, Row } from "./Position";

export enum Piece {
  Pawn,   // Bonde
  Rook,   // Tårn
  Knight, // Hest
  Bishop, // Løber
  Queen,  // Dronning
  King,   // Konge
}

export enum Color { White, Black }

export type HomeRank<Color> = Color extends Color.White ? 1 : 8;
export type PawnRank<Color> = Color extends Color.White ? 2 : 7;

export type Empty = null;
export type Square = ChessPiece | Empty;

export type BoardDict = { [R in Row]: { [C in Col]: Square } };

// TODO:
// 1. Castling
// 2. En pessant (pawn reaches back rang => exchange with queen, rook, bishop, or knight)
// 3. Move validity (own king must not be check by move)

