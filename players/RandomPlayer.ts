
import { ChessPiece } from "../ChessPiece.ts";
import { Position } from "../Position.ts";
import { Move, Player } from "./Player.ts";

export class RandomPlayer extends Player {
  constructor(
    id: string
  ) {
    super(id);
  }

  makeMove(): Move | "give up" {
    const randomPiece = this.getRandomPiece({ mustHaveMoves: true });
    if (!randomPiece) {
      return "give up";
    }
    const randomMove = this.getRandomMove(randomPiece);
    return { piece: randomPiece, to: randomMove };
  }

  private getRandomPiece(options: { mustHaveMoves: boolean }): ChessPiece | null {
    const pieces = options.mustHaveMoves ? this.pieces.filter(p => p.validMoves().length > 0) : this.pieces;

    if (pieces.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * pieces.length);
    const randomPiece = pieces[randomIndex];
    return randomPiece;
  }

  private getRandomMove(piece: ChessPiece): Position {
    const moves = piece.validMoves();
    if (moves.length === 0) {
      throw new Error("Cannot get random move: Piece cannot move!");
    }

    const randomIndex = Math.floor(Math.random() * moves.length);
    const randomMove = moves[randomIndex];
    return randomMove;
  }
}
