import { ChessPiece } from "./pieces/ChessPiece.ts";
import { Color, Piece, Square } from "./Game.ts";
import { Row, Col, Position } from "./Position.ts";

export type BoardDict = { [R in Row]: { [C in Col]: Square } };

export class Board {
  private DEBUG = false;

  private rows: Row[] = [1, 2, 3, 4, 5, 6, 7, 8];
  private cols: Col[] = ["A", "B", "C", "D", "E", "F", "G", "H"];
  private board: BoardDict = this.createEmptyBoard();

  private pieces: { [pieceId: string]: Position | null } = {};

  private white: ChessPiece[] = [];
  private black: ChessPiece[] = [];

  constructor() {
  }

  add(piece: ChessPiece, pos: Position): void {
    if (this.lookAt(pos)) {
      throw new Error(`Cannot add piece ${piece.name} at ${pos.toString()}: square is vacant!`);
    }
    this.updatePosition(piece, pos);
    if (piece.color === Color.White) {
      this.white.push(piece);
    } else {
      this.black.push(piece);
    }
  }

  replace(piece: ChessPiece, pos: Position): Square {
    const current = this.lookAt(pos);
    if (current) {
      this.updatePosition(current, null);
    }
    this.updatePosition(piece, pos);
    return current;
  }

  lookAt(pos: Position): Square {
    return this.board[pos.row][pos.col];
  }

  getPosition(piece: ChessPiece): Position | null {
    return this.pieces[piece.id] ?? null;
  }

  underAttack(pos: Position, self: Color): boolean {
    const opponents = self === Color.White ? this.black : this.white;
    return opponents.some(opp => opp.validMoves(true).find(movePosition => movePosition.equals(pos)));
  }

  isValidMove(piece: ChessPiece, to: Position): boolean {
    if (this.lookAt(to)?.color === piece.color) {
      return false; // Cannot move to position with a teammate 
    }

    // Try to make the move and check if:
    //    is king in Check => invalid move; undo move
    // otherwise, good to go
    const prevPosition = this.getPosition(piece);
    if (!prevPosition) {
      throw new Error("Cannot check for invalid move for piece not on board");
    }
    const replaced = this.replace(piece, to);
    if (this.isKingCheck(piece.color)) {
      // Undo move
      this.replace(piece, prevPosition);
      if (replaced) {
        this.replace(replaced, to);
      }
      return false;
    }
    
    return true;
  }

  isKingCheck(color: Color): boolean {
    const team = color === Color.White ? this.white : this.black;
    const king = team.find(piece => piece.piece === Piece.King);
    if (!king) {
      this.DEBUG && console.warn(`Cannot check for move validity: the board is without a ${Color[color]} king!`);
      return false;
    }
    const kingPosition = this.getPosition(king);
    if (!kingPosition) {
      this.DEBUG && console.warn(`Cannot check for move validity: the king is not positioned on the board!`);
      return false;
    }
    return this.underAttack(kingPosition, color);
  }

  drawBoardString(): string {
    const blackSquare = "■";

    const drawBlackSquare = (row: Row, col: Col) => {
      const colIndex = (Position.cols.indexOf(col) + 1) % 2;
      return (((row % 2) + colIndex) % 2) === 0;
    }

    let result = "";
    for (const row of Position.rows.slice().reverse()) {
      let rowString = "";
      for (const col of Position.cols) {
        const square = this.lookAt(new Position(row, col));
        if (square) {
          rowString += square.toString();
        } else if (drawBlackSquare(row, col)) {
          rowString += blackSquare;
        } else {
          rowString += " ";
        }
      }
      result += `${rowString}\n`;
    }
    return result;
  }

  private updatePosition(piece: ChessPiece, pos: Position | null): void {
    // Remove from current position
    const currentPos = this.getPosition(piece);
    if (currentPos) {
      this.board[currentPos.row][currentPos.col] = null;
    }
    // Place at position
    if (pos) {
      this.board[pos.row][pos.col] = piece;
    }
    // Update position lookup for piece
    this.pieces[piece.id] = pos;
  }

  private createEmptyBoard(): BoardDict {
    const rowNumbers = this.rows.map(r => r as number);
    const colStrings = this.cols.map(c => c as string);

    const dict = rowNumbers.reduce<{ [key: number]: { [key: string]: Square }}>((rows, row) => {
      rows[row] = colStrings.reduce<{ [key: string]: Square }>((cols, col) => {
        cols[col] = null;
        return cols;
      }, {});
      return rows;
    }, {})
    return dict as BoardDict;
  }
}