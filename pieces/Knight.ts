import { Board } from "../Board";
import { ChessPiece } from "../ChessPiece";
import { Color, Piece } from "../Game";
import { Position } from "../Position";

export class Knight extends ChessPiece {
  constructor(board: Board, color: Color, pos: Position) {
    super(board, Piece.Pawn, color, `Knight ${pos.col}`, pos);
  }

  moves(): Position[] {
    const pos = this.position();
    if (!pos) {
      return [];
    }
    return [
      pos.left()?.left()?.up() ?? null,
      pos.left()?.left()?.down() ?? null,

      pos.right()?.right()?.up() ?? null,
      pos.right()?.right()?.up() ?? null,

      pos.up()?.up()?.left() ?? null,
      pos.up()?.up()?.right() ?? null,

      pos.down()?.down()?.left() ?? null,
      pos.down()?.down()?.right() ?? null,
    ].filter(pos => pos !== null).filter(pos => this.board.isValidMove(pos, this.color));
  }
}
