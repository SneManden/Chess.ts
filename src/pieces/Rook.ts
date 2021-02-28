import { Board } from "../Board.ts";
import { ChessPiece, Piece, PieceMove } from "../pieces/ChessPiece.ts";
import { Color, HomeRank } from "../Game.ts";
import { Position } from "../Position.ts";
import { notNullish } from "../utility.ts";

export class Rook<C extends Color> extends ChessPiece {
  readonly notation = "R";

  constructor(board: Board, color: C, pos: Position<"A" | "H", HomeRank<C>> | null) {
    super(board, Piece.Rook, color, pos);
  }

  castle(to: Position<"D" | "F", HomeRank<C>>): void {
    this._pristine = false;
    if (!this.isOnBoard) {
      throw new Error("Rook cannot castle: It's not on the board!");
    }
    if (this.board.lookAt(to)) {
      throw new Error(`Cannot castle to non-empty position ${to.toString()}!`);
    }
    this.board.replace(this, to);
  }

  protected moves(): Position[] {
    const pos = this.positionSafe();
    if (!pos) {
      return [];
    }
    return [
      ...this.range((pos: Position) => pos.up()),
      ...this.range((pos: Position) => pos.down()),
      ...this.range((pos: Position) => pos.left()),
      ...this.range((pos: Position) => pos.right()),
    ].filter(notNullish);
  }

  protected specialMoves(skipValidityCheck: boolean): PieceMove[] {
    return [];
  }
}
