import { Board } from "../Board.ts";
import { ChessPiece } from "../pieces/ChessPiece.ts";
import { Color, HomeRank, Piece } from "../Game.ts";
import { Col, Position } from "../Position.ts";
import { notNullish } from "../utility.ts";

export class Rook<C extends Color> extends ChessPiece {
  constructor(board: Board, color: C, pos: Position<HomeRank<C>, "A" | "H"> | null) {
    super(board, Piece.Pawn, color, pos);
  }

  protected moves(): Position[] {
    const pos = this.position();
    if (!pos) {
      return [];
    }
    return [
      ...this.range((pos: Position) => pos.up()),
      ...this.range((pos: Position) => pos.down()),
      ...this.range((pos: Position) => pos.left()),
      ...this.range((pos: Position) => pos.right()),
    ].filter(notNullish);
  }
}
