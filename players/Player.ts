import { Board } from "../Board.ts";
import { ChessPiece } from "../pieces/ChessPiece.ts";
import { Color, Square } from "../Game.ts";
import { Position } from "../Position.ts";
import { notNullish, uuidv4 } from "../utility.ts";

export interface Move {
  piece: ChessPiece,
  to: Position,
}

export abstract class Player {
  readonly id = uuidv4();
  
  public color: Color = Color.Undefined;
  protected board: Board | null = null;
  protected pieces: ChessPiece[] = [];

  constructor(
    public readonly name: string,
  ) { }

  initialize(color: Color, board: Board, pieces: ChessPiece[]): void {
    this.color = color;
    this.board = board;
    this.pieces = pieces;
  }

  abstract makeMove(): Move | "give up";

  protected isOpponent(other: Square): boolean {
    return notNullish(other) && other.color !== Color.Undefined && other.color !== this.color;
  }
  
  protected isTeammate(other: Square): boolean {
    return notNullish(other) && other.color !== Color.Undefined && other.color === this.color;
  }
}
