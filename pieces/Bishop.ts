import { Board } from "../Board.ts";
import { ChessPiece, Piece } from "../pieces/ChessPiece.ts";
import { Color, HomeRank } from "../Game.ts";
import { Position } from "../Position.ts";
import { notNullish } from "../utility.ts";

export class Bishop<C extends Color> extends ChessPiece {
  readonly notation = "B";

  constructor(board: Board, color: C, pos: Position<"C" | "F", HomeRank<C>> | null) {
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

