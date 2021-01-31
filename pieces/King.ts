import { Board } from "../Board";
import { ChessPiece } from "../ChessPiece";
import { Color, Piece } from "../Game";
import { Position } from "../Position";

export class King extends ChessPiece {
  constructor(board: Board, color: Color, pos: Position) {
    super(board, Piece.Pawn, color, "King", pos);
  }

  moves(): Position[] {
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
    ]
      .filter(pos => pos !== null)
      .filter(pos => !this.board.underAttack(pos, this.color))
      .filter(pos => this.board.isValidMove(pos, this.color));
  }
}
