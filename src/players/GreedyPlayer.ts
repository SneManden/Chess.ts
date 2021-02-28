import { ChessPiece, isPromotion, PieceMove } from "../pieces/ChessPiece.ts";
import { Piece } from "../pieces/ChessPiece.ts";
import { Action, Move } from "./Player.ts";
import { RandomPlayer } from "./RandomPlayer.ts";

export class GreedyPlayer extends RandomPlayer {
  constructor(name: string) {
    super(name);
  }

  makeMove(): Promise<Action> {
    const bestAttackMove = this.getBestAttackingMove();
    if (bestAttackMove) {
      return Promise.resolve(bestAttackMove);
    }
    return super.makeMove();
  }

  private getBestAttackingMove(): Move | null {
    const attackingPieces = this.availablePieces
      .map(p => ({ piece: p, attackMoves: this.attackingMoves(p) }))
      .filter(({ attackMoves }) => attackMoves.length > 0);
    if (attackingPieces.length === 0) {
      return null;
    }

    const bestAttackPiece = attackingPieces.sort((a,b) =>
      this.importance(a.attackMoves[0])
      -
      this.importance(b.attackMoves[0])
    )[0];
    return this.createMove(bestAttackPiece.piece, bestAttackPiece.attackMoves[0]);
  }

  private attackingMoves(piece: ChessPiece): PieceMove[] {
    return piece.validMoves()
      .filter(move => this.isOpponent(this.board?.lookAt(move.to) ?? null))
      .sort((a, b) =>
        this.importance(b)
        -
        this.importance(a)
      );
  }

  private importance(move: PieceMove): 0 | 1 | 2 | 3 | 4 | 5 {
    if (isPromotion(move)) {
      return move.piece === Piece.Queen ? 5 : 4;
    }

    const piece = this.board?.lookAt(move.to) ?? null
    if (!piece) {
      return 0;
    }
    switch (piece.piece) {
      case Piece.Pawn:
        return 1;
      case Piece.Rook:
      case Piece.Knight:
      case Piece.Bishop:
        return 2;
      case Piece.Queen:
        return 3;
      case Piece.King:
        return 4;
    }
  }
}
