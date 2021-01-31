import { Board } from "../Board";
import { ChessPiece } from "../ChessPiece";
import { Color, Piece } from "../Game";
import { Col, Position } from "../Position";

export class Bishop extends ChessPiece {
  constructor(board: Board, color: Color, pos: Position) {
    super(board, Piece.Pawn, color, `Bishop ${pos.col}`, pos);
  }

  moves(): Position[] {
    const pos = this.position();
    if (!pos) {
      return [];
    }
    return [
      ...this.range((pos: Position) => pos.leftUp()),
      ...this.range((pos: Position) => pos.leftDown()),
      ...this.range((pos: Position) => pos.rightDown()),
      ...this.range((pos: Position) => pos.rightUp()),
    ].filter(pos => pos !== null).filter(pos => this.board.isValidMove(pos, this.color));
  }
}

