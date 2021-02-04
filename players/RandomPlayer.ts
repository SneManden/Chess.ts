
import { ChessPiece } from "../pieces/ChessPiece.ts";
import { Position } from "../Position.ts";
import { Move, Player } from "./Player.ts";

export class RandomPlayer extends Player {
  constructor(
    id: string
  ) {
    super(id);
  }

  makeMove(): Promise<Move | "give up"> {
    const randomPiece = this.getRandomPiece({ mustHaveMoves: true });
    if (!randomPiece) {
      return Promise.resolve("give up");
    }
    const randomMove = this.getRandomMove(randomPiece);
    return Promise.resolve({ piece: randomPiece, to: randomMove });
  }

  protected getRandomPiece(options: { mustHaveMoves: boolean }): ChessPiece | null {
    const pieces = options.mustHaveMoves ? this.availablePieces.filter(p => p.validMoves().length > 0) : this.availablePieces;

    if (pieces.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * pieces.length);
    const randomPiece = pieces[randomIndex];
    return randomPiece;
  }

  protected getRandomMove(piece: ChessPiece): Position {
    const moves = piece.validMoves();
    if (moves.length === 0) {
      throw new Error("Cannot get random move: Piece cannot move!");
    }

    const randomIndex = Math.floor(Math.random() * moves.length);
    const randomMove = moves[randomIndex];
    return randomMove;
  }
}
