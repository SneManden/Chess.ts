import { Board } from "./Board.ts";
import { ChessPiece } from "./ChessPiece.ts";
import { Color } from "./Game.ts";
import { Col, Position, Row } from "./Position.ts";

export interface Move {
  piece: ChessPiece,
  to: Position,
}

export abstract class Player {
  public color: Color = Color.Undefined;
  protected board: Board | null = null;
  protected pieces: ChessPiece[] = [];

  constructor(
    public readonly id: string,
  ) { }

  initialize(color: Color, board: Board, pieces: ChessPiece[]): void {
    this.color = color;
    this.board = board;
    this.pieces = pieces;
  }

  abstract makeMove(): Move | "give up";
}
