import { Board } from "../Board.ts";
import { ChessPiece } from "../pieces/ChessPiece.ts";
import { Color, PawnRank, Piece } from "../Game.ts";
import { Col, Position } from "../Position.ts";
import { notNullish } from "../utility.ts";

export class Pawn<C extends Color> extends ChessPiece {
  readonly notation = "";

  constructor(board: Board, color: C, pos: Position<Col, PawnRank<C>> | null){
    super(board, Piece.Pawn, color, pos);
  }

  protected moves(): Position[] {
    const pos = this.position();
    if (!pos) {
      return [];
    }

    // Pawn can move 2 squares forward in the first move, only to an empty square
    const basicMoves = [
      ...this.range((pos: Position) => pos.forward(this.color), this.pristine ? 2 : 1),
    ].filter(notNullish).filter(pos => !this.board.lookAt(pos));
    
    // Pawn only attacks in the immediate forward diagonals
    const attackMoves = [
      pos.forward(this.color)?.left(),
      pos.forward(this.color)?.right(),
    ].filter(notNullish).filter(pos => this.isOpponent(this.board.lookAt(pos)));
    
    return [
      ...basicMoves,
      ...attackMoves,
    ];
  }
}
