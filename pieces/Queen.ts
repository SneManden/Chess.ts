import { Board } from "../Board.ts";
import { ChessPiece, Piece, PieceMove } from "../pieces/ChessPiece.ts";
import { Color, HomeRank } from "../Game.ts";
import { Position } from "../Position.ts";
import { notNullish } from "../utility.ts";

export class Queen<C extends Color> extends ChessPiece {
  readonly notation = "Q";
  
  constructor(board: Board, color: C, pos: Position<"D", HomeRank<C>> | null) {
    super(board, Piece.Queen, color, pos);
  }

  protected moves(): Position[] {
    const pos = this.position();
    if (!pos) {
      return [];
    }
    return [
      ...this.range((pos: Position) => pos.up()),
      ...this.range((pos: Position) => pos.down()),
      ...this.range((pos: Position) => pos.left()),
      ...this.range((pos: Position) => pos.right()),

      ...this.range((pos: Position) => pos.leftUp()),
      ...this.range((pos: Position) => pos.leftDown()),
      ...this.range((pos: Position) => pos.rightDown()),
      ...this.range((pos: Position) => pos.rightUp()),
    ].filter(notNullish);
  }

  protected specialMoves(): PieceMove[] {
    return [];
  }
}
