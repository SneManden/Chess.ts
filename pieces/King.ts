import { Board } from "../Board.ts";
import { ChessPiece } from "../pieces/ChessPiece.ts";
import { Color, HomeRank, Piece } from "../Game.ts";
import { Position } from "../Position.ts";
import { notNullish } from "../utility.ts";

export class King<C extends Color> extends ChessPiece {
  readonly notation = "K";

  constructor(board: Board, color: C, pos: Position<"E", HomeRank<C>> | null) {
    super(board, Piece.King, color, pos);
  }

  protected moves(): Position[] {
    const pos = this.position();
    if (!pos) {
      return [];
    }
    // TODO: dissallow under attack
    return [
      pos.up(),
      pos.right(),
      pos.down(),
      pos.left(),
      pos.leftDown(),
      pos.leftUp(),
      pos.rightUp(),
      pos.rightDown(),
    ].filter(notNullish);
  }
}
