import { Board } from "../Board";
import { ChessPiece } from "../ChessPiece";
import { Color, HomeRank, Piece } from "../Game";
import { Col, Position, RestrictedPosition } from "../Position";

export class Rook<C extends Color> extends ChessPiece {
  constructor(board: Board, color: Color, pos: RestrictedPosition<HomeRank<C>, "A" | "H">) {
    super(board, Piece.Pawn, color, `Rook ${pos.col}`, pos);
  }

  moves(): Position[] {
    const pos = this.position();
    if (!pos) {
      return [];
    }
    return [
      ...this.range((pos: Position) => pos.up()),
      ...this.range((pos: Position) => pos.down()),
      ...this.range((pos: Position) => pos.left()),
      ...this.range((pos: Position) => pos.right()),
    ].filter(pos => pos !== null).filter(pos => this.board.isValidMove(pos, this.color));
  }
}


