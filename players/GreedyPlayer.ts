import { ChessPiece } from "../pieces/ChessPiece.ts";
import { Piece } from "../pieces/ChessPiece.ts";
import { Position } from "../Position.ts";
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
      this.importance(this.board?.lookAt(a.attackMoves[0]) ?? null)
      -
      this.importance(this.board?.lookAt(b.attackMoves[0]) ?? null)
    )[0];
    return this.createMove(bestAttackPiece.piece, bestAttackPiece.attackMoves[0]);
  }

  private attackingMoves(piece: ChessPiece): Position[] {
    return piece.validMoves()
      .filter(pos => this.isOpponent(this.board?.lookAt(pos) ?? null))
      .sort((a, b) =>
        this.importance(this.board?.lookAt(b) ?? null)
        -
        this.importance(this.board?.lookAt(a) ?? null)
      );
  }

  private importance(piece: ChessPiece | null): 0 | 1 | 2 | 3 | 4 {
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
