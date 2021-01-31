import { Board } from "../Board.ts";
import { ChessPiece } from "../ChessPiece.ts";
import { Color, HomeRank, Piece } from "../Game.ts";
import { Col, Position } from "../Position.ts";
import { notNullish } from "../utility.ts";

export class Rook<C extends Color> extends ChessPiece {
  constructor(board: Board, color: Color, pos: Position<HomeRank<C>, "A" | "H">) {
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
    ].filter(notNullish).filter(pos => this.board.isValidMove(pos, this.color));
  }
}