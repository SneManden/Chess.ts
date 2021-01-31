import { Board } from "../Board.ts";
import { ChessPiece } from "../ChessPiece.ts";
import { Color, HomeRank, Piece } from "../Game.ts";
import { Position } from "../Position.ts";
import { notNullish } from "../utility.ts";

export class King<C extends Color> extends ChessPiece {
  constructor(board: Board, color: C, pos: Position<HomeRank<C>, "E">) {
    super(board, Piece.King, color, "King", pos);
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
      .filter(notNullish)
      .filter(pos => !this.board.underAttack(pos, this.color))
      .filter(pos => this.board.isValidMove(pos, this.color));
  }
}
