import { Board } from "./Board.ts";
import { Color, Piece, Square } from "./Game.ts";
import { Position } from "./Position.ts";
import { notNullish, uuidv4 } from "./utility.ts";

export abstract class ChessPiece {
  readonly id = uuidv4();
  readonly name!: string;

  constructor(
    protected readonly board: Board,
    public readonly piece: Piece,
    public readonly color: Color,
    private initialPosition: Position | null
  ) {
    this.name = this.createName();
    if (initialPosition) {
      this.board.replace(this, initialPosition);
    }
  }

  abstract moves(): Position[];

  get isOnBoard(): boolean {
    return this.position() !== null;
  }

  protected get pristine(): boolean {
    const position = this.position();
    return notNullish(position) && this.initialPosition?.equals(position) === true;
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

  protected range(direction: (pos: Position) => Position | null, distance = 8): Position[] {
    const pos = this.position();
    if (!pos) {
      return [];
    }
    const positions: Position[] = [];
    let next = direction(pos);
    while (next && positions.length < distance) {
      positions.push(next);
      if (this.board.lookAt(next)) {
        break; // include next, but don't go further
      }
      next = direction(next);
    }
    return positions;
  }

  protected isOpponent(other: Square): boolean {
    return notNullish(other) && other.color !== Color.Undefined && other.color !== this.color;
  }
  protected isTeammate(other: Square): boolean {
    return notNullish(other) && other.color !== Color.Undefined && other.color === this.color;
  }

  private createName(): string {
    return `${Color[this.color]} ${Piece[this.piece]}`.trim();
  } 
}
