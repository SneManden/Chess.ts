import { Board } from "../Board.ts";
import { ChessPiece, EnPassantMove, Piece, PieceMove, PromotionMove } from "../pieces/ChessPiece.ts";
import { Color, PawnRank } from "../Game.ts";
import { Col, Position, Row } from "../Position.ts";
import { notNullish } from "../utility.ts";
import { Move } from "../players/Player.ts";

export class Pawn<C extends Color> extends ChessPiece {
  readonly notation = "";

  constructor(board: Board, color: C, pos: Position<Col, PawnRank<C>> | null){
    super(board, Piece.Pawn, color, pos);
  }

  protected moves(): Position[] {
    const pos = this.positionSafe();
    if (!pos) {
      return [];
    }

    // Pawn can move 2 squares forward in the first move, only to an empty square
    const basicMoves = [
      ...this.range((pos: Position) => pos.forward(this.color), this.pristine ? 2 : 1),
    ].filter(notNullish).filter(pos => !this.board.lookAt(pos));
    
    return [
      ...basicMoves,
      ...this.attackMoves(),
    ].filter(pos => pos.row !== this.opponentEnemyRank); // do not include promotion moves here
  }
  
  private attackMoves(): Position[] {
    // Pawn only attacks in the immediate forward diagonals
    return [
      this.position().forward(this.color)?.left(),
      this.position().forward(this.color)?.right(),
    ].filter(notNullish).filter(pos => this.isOpponent(this.board.lookAt(pos)));
  }

  protected specialMoves(skipValidityCheck: boolean): PieceMove[] {
    return [
      ...this.promotionMoves(),
      ...this.enPassantMoves(),
    ];
  }

  private promotionMoves(): PromotionMove[] {
    const pos = this.positionSafe();
    if (!pos) {
      return [];
    }

    const movesToEnemyRank = [
      ...[pos.forward(this.color)].filter(notNullish).filter(p => !this.board.lookAt(p)),
      ...this.attackMoves().filter(notNullish).filter(p => this.isOpponent(this.board.lookAt(p))),
    ].filter(p => p.row === this.opponentEnemyRank);
    
    if (movesToEnemyRank.length === 0) {
      return [];
    }

    return movesToEnemyRank.reduce<PromotionMove[]>((allMoves, p) => {
      allMoves.push(...this.promotionPieces.map<PromotionMove>(piece => ({
        to: p, from: pos, special: "Promotion", piece
      })));
      return allMoves;
    }, []);
  }

  private get promotionPieces(): Piece[] {
    return [Piece.Queen, Piece.Knight, Piece.Bishop, Piece.Rook];
  }

  private get opponentEnemyRank(): Extract<Row, 1 | 8> {
    return this.color === Color.White ? 8 : 1;
  }

  private enPassantMoves(): EnPassantMove[] {
    const pos = this.positionSafe();
    if (!pos) {
      return [];
    }

    const lastMove = this.board.lastMove;
    if (!lastMove) {
      return [];
    }

    const victimPawns = [pos.left(), pos.right()]
      .filter(notNullish)
      .map(p => this.board.lookAt(p))
      .filter(notNullish)
      .filter(p => p.piece === Piece.Pawn && this.isOpponent(p))
      .filter(p => this.lastMoveWasPawnInitialDoubleForward(lastMove, p));
    
    return victimPawns.map(p => this.createEnPassantMove(p));
  }

  private createEnPassantMove(pawn: ChessPiece): EnPassantMove {
    const moveTo = pawn.position().forward(this.color);
    if (!moveTo) {
      throw new Error("En passant move to position is null!");
    }
    return {
      from: this.position(),
      to: moveTo,
      special: "En passant",
      pawn,
    };
  }

  private lastMoveWasPawnInitialDoubleForward(lastMove: Move, pawn: ChessPiece): boolean {
    if (lastMove.piece !== pawn) {
      return false;
    }

    const doubleForward = Math.abs(lastMove.move.from.row - lastMove.move.to.row) === 2;
    return doubleForward;
  }
}
