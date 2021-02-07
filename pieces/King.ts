import { Board } from "../Board.ts";
import { CastlingMove, ChessPiece, Piece, PieceMove } from "../pieces/ChessPiece.ts";
import { Color, HomeRank } from "../Game.ts";
import { Col, Position } from "../Position.ts";
import { notNullish } from "../utility.ts";

export class King<C extends Color> extends ChessPiece {
  readonly notation = "K";

  constructor(board: Board, color: C, pos: Position<"E", HomeRank<C>> | null) {
    super(board, Piece.King, color, pos);
  }

  protected moves(): Position[] {
    const pos = this.positionSafe();
    if (!pos) {
      return [];
    }
    return [
      pos.up(),
      pos.right(),
      pos.down(),
      pos.left(),
      pos.leftDown(),
      pos.leftUp(),
      pos.rightUp(),
      pos.rightDown(),
    ].filter(notNullish);
  }

  protected specialMoves(skipValidityCheck: boolean): PieceMove[] {
    return [
      this.castling("short", skipValidityCheck),
      this.castling("long", skipValidityCheck)
    ].filter(notNullish);
  }

  private castling(type: "short" | "long", skipValidityCheck: boolean): CastlingMove | null {
    if (!this.pristine) {
      return null;
    }
    const rook = this.rook(type === "short" ? "H" : "A");
    if (rook?.pristine !== true) {
      return null;
    }
    const kingMoveSequence = type === "short"
      ? this.range(pos => pos.right(), 2)
      : this.range(pos => pos.left(), 2);
    const kingMove = kingMoveSequence.last();
    if (!kingMove) {
      return null;
    }
    if (!this.validCastlingMove(kingMoveSequence, skipValidityCheck)) {
      return null;
    }
    return { to: kingMove, from: this.position(), special: "Castling", rook, type };
  }

  private validCastlingMove(sequence: Position[], skipValidityCheck: boolean): boolean {
    if (sequence.some(pos => this.board.lookAt(pos))) {
      return false;
    }
    if (!skipValidityCheck && sequence.some(pos => this.board.underAttack(pos, this.color))) {
      return false;
    }
    return true;
  }

  private rook(col: Extract<Col, "A" | "H">): ChessPiece | null {
    const desired = new Position(col, this.color === Color.White ? 1 : 8);
    return this.board.getRooks(this.color).find(r => r.positionSafe()?.equals(desired)) ?? null;
  }
}
