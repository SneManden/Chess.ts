import { Board } from "../Board.ts";
import { ChessPiece, Piece, PieceMove } from "../pieces/ChessPiece.ts";
import { Color, HomeRank } from "../Game.ts";
import { Position } from "../Position.ts";
import { notNullish } from "../utility.ts";

export class Knight<C extends Color> extends ChessPiece {
  readonly notation = "N";

  constructor(board: Board, color: C, pos: Position<"B" | "G", HomeRank<C>> | null) {
    super(board, Piece.Knight, color, pos);
  }

  protected moves(): Position[] {
    const pos = this.positionSafe();
    if (!pos) {
      return [];
    }
    return [
      pos.left()?.left()?.up(),
      pos.left()?.left()?.down(),

      pos.right()?.right()?.up(),
      pos.right()?.right()?.up(),

      pos.up()?.up()?.left(),
      pos.up()?.up()?.right(),

      pos.down()?.down()?.left(),
      pos.down()?.down()?.right(),
    ].filter(notNullish);
  }

  protected specialMoves(): PieceMove[] {
    return [];
  }
}
