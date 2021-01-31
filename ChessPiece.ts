import { Board } from "./Board.ts";
import { Color, Piece, Square } from "./Game.ts";
import { Position } from "./Position.ts";

export abstract class ChessPiece {
  constructor(
    protected readonly board: Board,
    public readonly piece: Piece,
    public readonly color: Color,
    public readonly id: string,
    private initialPosition: Position
  ) {
    // console.log("[", id, "] Adding", Color[color], Piece[piece], "at", initialPosition);
    this.board.replace(this, initialPosition);
  }

  abstract moves(): Position[];

  get isOnBoard(): boolean {
    return this.position() !== null;
  }

  protected get pristine() {
    const position = this.position();
    return position && this.initialPosition.equals(position);
  }

  move(to: Position): Square {
    if (!this.moves().includes(to)) {
      throw new Error(`Invalid position; cannot move to `);
    }
    return this.board.replace(this, to);
  }

  toString(): string {
    switch (this.piece) {
      case Piece.Pawn: return this.color === Color.White ? "♙" : "♟︎";
      case Piece.Rook: return this.color === Color.White ? "♖" : "♜";
      case Piece.Knight: return this.color === Color.White ? "♘" : "♞";
      case Piece.Bishop: return this.color === Color.White ? "♗" : "♝";
      case Piece.Queen: return this.color === Color.White ? "♕" : "♛";
      case Piece.King: return this.color === Color.White ? "♔" : "♚";
      default: return "";
    }
  }

  protected position(): Position | null {
    return this.board.getPosition(this);
  }

  protected range(direction: (pos: Position) => Position | null): Position[] {
    const pos = this.position();
    if (!pos) {
      return [];
    }
    const ups: Position[] = [];
    let next = direction(pos);
    while (next) {
      ups.push(next);
      if (this.board.lookAt(next)) {
        break; // include next, but don't go further
      }
      next = direction(next);
    }
    return ups;
  }
}