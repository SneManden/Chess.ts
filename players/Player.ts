import { Board } from "../Board.ts";
import { ChessPiece } from "../pieces/ChessPiece.ts";
import { Color, Square } from "../Game.ts";
import { Position } from "../Position.ts";
import { notNullish, uuidv4 } from "../utility.ts";
import { Notation } from "../Notation.ts";

export interface Move {
  notation: string;
  piece: ChessPiece;
  to: Position;
}

export type Action = Move | "resign";

export abstract class Player {
  readonly id = uuidv4();
  
  public color: Color = Color.Undefined;
  protected board: Board | null = null;
  private pieces: ChessPiece[] = [];

  constructor(
    public readonly name: string,
  ) { }

  initialize(color: Color, board: Board, pieces: ChessPiece[]): void {
    this.color = color;
    this.board = board;
    this.pieces = pieces;
  }

  get availablePieces(): ChessPiece[] {
    return this.pieces.filter(p => p.isOnBoard);
  }

  get takenPieces(): ChessPiece[] {
    return this.pieces.filter(p => p.isOnBoard);
  }

  abstract makeMove(): Promise<Action>;

  protected createMove(piece: ChessPiece, to: Position): Move {
    return {
      piece,
      to,
      notation: Notation.toAlgebraicNotation(piece, to, this.availablePieces),
    }
  }

  protected isOpponent(other: Square): boolean {
    return notNullish(other) && other.color !== Color.Undefined && other.color !== this.color;
  }
  
  protected isTeammate(other: Square): boolean {
    return notNullish(other) && other.color !== Color.Undefined && other.color === this.color;
  }
}
