import { Board } from "../Board.ts";
import { Color, Square } from "../Game.ts";
import { Position } from "../Position.ts";
import { notNullish, uuidv4 } from "../utility.ts";

export enum Piece {
  Pawn,   // Bonde
  Rook,   // Tårn
  Knight, // Hest
  Bishop, // Løber
  Queen,  // Dronning
  King,   // Konge
}

export type PieceNotation = "" | "R" | "N" | "B" | "Q" | "K";

export type SpecialMove = "Promotion" | `Castling` | "En passant";

export interface PieceMove {
  to: Position;
  special?: SpecialMove;
}

export interface PromotionMove extends PieceMove {
  special: "Promotion";
  piece: Piece;
}

export interface CastlingMove extends PieceMove {
  special: "Castling";
  rook: ChessPiece;
  type: "short" | "long";
}

export function isPromotion(move: PieceMove): move is PromotionMove {
  return move.special === "Promotion";
}

export function isCastling(move: PieceMove): move is CastlingMove {
  return move.special === "Castling";
}

export function pieceToNotation(piece: Piece): PieceNotation {
  switch (piece) {
    case Piece.Pawn: return "";
    case Piece.Rook: return "R";
    case Piece.Knight: return "N";
    case Piece.Bishop: return "B";
    case Piece.Queen: return "Q";
    case Piece.King: return "K";
  }
}

export abstract class ChessPiece {
  private _pristine = true;
  
  readonly id = uuidv4();
  readonly name!: string;
  abstract readonly notation: PieceNotation;

  get pristine(): boolean { return this._pristine; }

  constructor(
    protected readonly board: Board,
    public readonly piece: Piece,
    public readonly color: Color,
    initialPosition: Position | null
  ) {
    this.name = this.createName();
    if (initialPosition) {
      this.board.add(this, initialPosition);
    }
  }

  protected abstract moves(): Position[];
  protected abstract specialMoves(): PieceMove[];

  validMoves(skipValidityCheck = false): PieceMove[] {
    if (!this.isOnBoard) {
      return [];
    }
    const basicMoves = this.moves().map<PieceMove>(to => ({ to }))
      .filter(move => !this.isTeammate(this.board.lookAt(move.to)))
      .filter(move => skipValidityCheck || this.board.isValidMove(this, move));

    const specialMoves = this.specialMoves();
      
    return [
      ...basicMoves,
      ...specialMoves,
    ]
  }

  get isOnBoard(): boolean {
    return this.position() !== null;
  }

  move(to: Position): Square {
    if (!this.isOnBoard) {
      throw new Error("Piece cannot make a move: It's not on the board!");
    }
    if (!this.validMoves().some(move => move.to.equals(to))) {
      throw new Error(`Invalid position; cannot move to ${to.toString()}`);
    }
    this._pristine = false;
    return this.board.replace(this, to);
  }

  toString(): string {
    return `${this.name} @ ${this.position() ?? "not on board"}`;
  }

  pieceIcon(ignoreColor = false): string {
    switch (this.piece) {
      case Piece.Pawn: return this.color === Color.White && !ignoreColor ? "♙" : "♟︎";
      case Piece.Rook: return this.color === Color.White && !ignoreColor ? "♖" : "♜";
      case Piece.Knight: return this.color === Color.White && !ignoreColor ? "♘" : "♞";
      case Piece.Bishop: return this.color === Color.White && !ignoreColor ? "♗" : "♝";
      case Piece.Queen: return this.color === Color.White && !ignoreColor ? "♕" : "♛";
      case Piece.King: return this.color === Color.White && !ignoreColor ? "♔" : "♚";
      default: return "";
    }
  }

  position(): Position | null {
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
