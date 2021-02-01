import { Board } from "../Board.ts";
import { ChessPiece } from "../ChessPiece.ts";
import { Color, HomeRank, Piece } from "../Game.ts";
import { Col, Position } from "../Position.ts";
import { notNullish } from "../utility.ts";

export class Bishop<C extends Color> extends ChessPiece {
  constructor(board: Board, color: C, pos: Position<HomeRank<C>, "C" | "F"> | null) {
    super(board, Piece.Bishop, color, pos);
  }

  protected moves(): Position[] {
    const pos = this.position();
    if (!pos) {
      return [];
    }
    return [
      ...this.range((pos: Position) => pos.leftUp()),
      ...this.range((pos: Position) => pos.leftDown()),
      ...this.range((pos: Position) => pos.rightDown()),
      ...this.range((pos: Position) => pos.rightUp()),
    ].filter(notNullish);
  }
}

