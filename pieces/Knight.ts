import { Board } from "../Board.ts";
import { ChessPiece } from "../pieces/ChessPiece.ts";
import { Color, HomeRank, Piece } from "../Game.ts";
import { Position } from "../Position.ts";
import { notNullish } from "../utility.ts";

export class Knight<C extends Color> extends ChessPiece {
  constructor(board: Board, color: C, pos: Position<"B" | "G", HomeRank<C>> | null) {
    super(board, Piece.Knight, color, pos);
  }

  protected moves(): Position[] {
    const pos = this.position();
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
}
