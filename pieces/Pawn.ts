import { Board } from "../Board.ts";
import { ChessPiece } from "../ChessPiece.ts";
import { Color, PawnRank, Piece } from "../Game.ts";
import { Col, Position } from "../Position.ts";
import { notNullish } from "../utility.ts";

export class Pawn<C extends Color> extends ChessPiece {
  constructor(board: Board, color: C, pos: Position<PawnRank<C>, Col>){
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
    ].filter(notNullish).filter(pos => this.board.isValidMove(pos, this.color));
  }
}
