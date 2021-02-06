import { Board } from "../Board.ts";
import { ChessPiece, Piece, PieceMove, PromotionMove } from "../pieces/ChessPiece.ts";
import { Color, PawnRank } from "../Game.ts";
import { Col, Position, Row } from "../Position.ts";
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

  protected specialMoves(): PieceMove[] {
    return [
      ...this.promotionMoves(),
      ...this.enPassantMoves(),
    ];
  }

  private promotionMoves(): PromotionMove[] {
    const pos = this.position();
    if (!pos) {
      return [];
    }

    const forward = pos.forward(this.color);
    if (forward?.row !== this.opponentEnemyRank) {
      return [];
    }

    return [Piece.Queen, Piece.Knight, Piece.Bishop, Piece.Rook].map(piece => (
      { to: forward, special: "Promotion", piece }
    ));
  }

  private get opponentEnemyRank(): Extract<Row, 1 | 8> {
    return this.color === Color.White ? 8 : 1;
  }

  private enPassantMoves(): PieceMove[] {
    const pos = this.position();
    if (!pos) {
      return [];
    }

    // TODO
    return [];
    
    // return [
    //   pos.forward(this.color)?.left(),
    //   pos.forward(this.color)?.right(),
    // ].filter(notNullish).filter(pos => this.isOpponent(this.board.lookAt(pos)));
  }
}
