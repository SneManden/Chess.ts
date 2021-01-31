import { ChessPiece } from "../ChessPiece.ts";
import { Piece } from "../Game.ts";
import { Position } from "../Position.ts";
import { Move, Player } from "./Player.ts";

export class GreedyPlayer extends Player {
  constructor(
    id: string
  ) {
    super(id);
  }

  makeMove(): Move | "give up" {
    const bestAttackMove = this.getBestAttackingMove();
    if (bestAttackMove) {
      return bestAttackMove;
    }
    return this.randomMove();
  }

  private randomMove(): Move | "give up" {
    const piece = this.getRandomPiece({ mustHaveMoves: true });
    if (!piece) {
      return "give up";
    }
    const randomMove = this.getRandomMove(piece);
    return { piece, to: randomMove };
  }

  private getBestAttackingMove(): Move | null {
    const attackingPieces = this.pieces
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
    return { piece: bestAttackPiece.piece, to: bestAttackPiece.attackMoves[0] };
  }

  private attackingMoves(piece: ChessPiece): Position[] {
    return piece.moves()
      .filter(pos => this.isOpponent(this.board?.lookAt(pos) ?? null))
      .sort((a, b) =>
        this.importance(this.board?.lookAt(b) ?? null)
        -
        this.importance(this.board?.lookAt(a) ?? null)
      );
  }

  private getRandomPiece(options: { mustHaveMoves: boolean; }): ChessPiece | null {
    const pieces = options.mustHaveMoves ? this.pieces.filter(p => p.moves().length > 0) : this.pieces;

    if (pieces.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * pieces.length);
    const randomPiece = pieces[randomIndex];
    return randomPiece;
  }

  private getRandomMove(piece: ChessPiece): Position {
    const moves = piece.moves();
    if (moves.length === 0) {
      throw new Error("Cannot get random move: Piece cannot move!");
    }

    const randomIndex = Math.floor(Math.random() * moves.length);
    const randomMove = moves[randomIndex];
    return randomMove;
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
