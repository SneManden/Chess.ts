import { Board } from "../Board";
import { ChessPiece } from "../ChessPiece";
import { Color, PawnRank, Piece } from "../Game";
import { Col, Position, RestrictedPosition } from "../Position";

export class Pawn<T extends Color> extends ChessPiece {
  constructor(board: Board, color: T, pos: RestrictedPosition<PawnRank<T>, Col>){
    super(board, Piece.Pawn, color, `Pawn ${pos.col}`, pos);
  }

  moves(): Position[] {
    const pos = this.position();
    if (!pos) {
      return [];
    }
    return [
      pos.forward(this.color),
      pos.forward(this.color)?.left(),
      pos.forward(this.color)?.right(),
      this.pristine ? pos.forward(this.color)?.forward(this.color) : null,
    ].filter(pos => pos !== null).filter(pos => this.board.isValidMove(pos, this.color));
  }
}
