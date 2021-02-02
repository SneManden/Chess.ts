import { ChessPiece } from "./pieces/ChessPiece.ts";
import { Color, HomeRank, PawnRank, Piece, Square } from "./Game.ts";
import { Row, Col, Position } from "./Position.ts";
import { Pawn } from "./pieces/Pawn.ts";
import { Bishop } from "./pieces/Bishop.ts";
import { King } from "./pieces/King.ts";
import { Knight } from "./pieces/Knight.ts";
import { Queen } from "./pieces/Queen.ts";
import { Rook } from "./pieces/Rook.ts";
import * as Colors from "https://deno.land/std/fmt/colors.ts";

export type BoardDict = { [R in Row]: { [C in Col]: Square } };

export interface DrawOptions {
  labels?: boolean;
  offBoardPieces?: boolean;
}

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
    const originalPosition = this.getPosition(piece);
    if (!originalPosition) {
      throw new Error("Cannot check for invalid move for piece not on board");
    }
    const replaced = this.replace(piece, to);
    const kingIsCheck = this.isKingCheck(piece.color);

    this.undoMove(piece, to, replaced, originalPosition);
    return !kingIsCheck;
  }

  private undoMove(piece: ChessPiece, move: Position, moveSquare: Square, originalPosition: Position): void {
    this.replace(piece, originalPosition);
    if (moveSquare) {
      this.replace(moveSquare, move);
    }
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

  // Inspiration from https://www.daniweb.com/programming/software-development/code/423640/unicode-chessboard-in-a-terminal
  drawLargeBoardString(): string {
    const allBoxDrawingCharacters = [...Array(200).keys()].map(i => String.fromCharCode(9472 + i));
    const boxChars = [2, 0, 12, 16, 20, 24, 44, 52, 28, 36, 60].map(i => allBoxDrawingCharacters[i]);
    const [vbar, hbar, ul, ur, ll, lr, nt, st, wt, et, plus] = boxChars;

    const bgBlack = 0x402902;
    const bgWhite = 0x9c6508;

    const h3 = `${hbar}${hbar}${hbar}`;
    const topline = Colors.white(Colors.bgRgb24(`${ul}${[...Array(7).keys()].map(_ => h3 + nt).join("")}${h3}${ur}`, bgBlack));
    const midline = Colors.white(Colors.bgRgb24(`${wt}${[...Array(7).keys()].map(_ => h3 + plus).join("")}${h3}${et}`, bgBlack));
    const botline = Colors.white(Colors.bgRgb24(`${ll}${[...Array(7).keys()].map(_ => h3 + st).join("")}${h3}${lr}`, bgBlack));
    const tplBlack = (x: string) => Colors.bgRgb24(` ${x} `, bgBlack) + Colors.white(Colors.bgRgb24(vbar, bgBlack));
    const tplWhite = (x: string) => Colors.bgRgb24(` ${x} `, bgWhite) + Colors.white(Colors.bgRgb24(vbar, bgBlack));
    const drawBlackSquare = (col: Col, row: Row) => {
      const colIndex = (Position.cols.indexOf(col) + 1) % 2;
      return (((row % 2) + colIndex) % 2) === 0;
    }
    const tpl = (x: string, col: Col, row: Row) => drawBlackSquare(col, row) ? tplBlack(x) : tplWhite(x);
    const dp = (s: Square) => s?(s.color === Color.White ? Colors.white(s.toString(true)):Colors.black(s.toString(true))):" ";

    const rowString = (squares: [Square, Col, Row][]): string => {
      return `${Colors.white(Colors.bgRgb24(vbar,bgBlack))}${squares.map(([s, c, r]) => tpl(dp(s), c, r)).join("")}`;
    };

    const rowStrings = [];
    for (const row of Position.rows.slice().reverse()) {
      rowStrings.push(row === 8 ? topline : midline);
      rowStrings.push(rowString(Position.cols.map(col => [this.lookAt(new Position(col, row)),col,row])));
    }
    rowStrings.push(botline);
    return rowStrings.join("\n");
  }

  drawSimpleBoardString(options: Partial<DrawOptions> = { labels: true, offBoardPieces: true }): string {
    const blackSquare = "■";

    const drawBlackSquare = (row: Row, col: Col) => {
      const colIndex = (Position.cols.indexOf(col) + 1) % 2;
      return (((row % 2) + colIndex) % 2) === 0;
    }

    let result = "";
    for (const row of Position.rows.slice().reverse()) {
      let rowString = `${options?.labels ? row : " "} `;
      for (const col of Position.cols) {
        const square = this.lookAt(new Position(col, row));
        if (square) {
          rowString += square.toString();
        } else if (drawBlackSquare(row, col)) {
          rowString += blackSquare;
        } else {
          rowString += " ";
        }
      }
      result += `${rowString}`;
      if (options?.offBoardPieces && row === 1) {
        result += `   taken: ${this.whiteOffBoard.map(p => p.toString()).join("")}`;
      } else if (options?.offBoardPieces && row === 8) {
        result += `   taken: ${this.blackOffBoard.map(p => p.toString()).join("")}`;
      }
      result += "\n";
    }
    result += `  ${Position.cols.join("")}`;
    return result;
  }

  createPieces<C extends Color>(color: C, homeRank: HomeRank<C>, pawnRank: PawnRank<C>): ChessPiece[] {
    const pawns = Position.cols.map(col => new Pawn<C>(this, color, new Position(col, pawnRank)));
    return [
      // Home Rank: left to right
      new Rook<C>(this, color,   new Position("A", homeRank)),
      new Knight<C>(this, color, new Position("B", homeRank)),
      new Bishop<C>(this, color, new Position("C", homeRank)),
      new Queen<C>(this, color,  new Position("D", homeRank)),
      new King<C>(this, color,   new Position("E", homeRank)),
      new Bishop<C>(this, color, new Position("F", homeRank)),
      new Knight<C>(this, color, new Position("G", homeRank)),
      new Rook<C>(this, color,   new Position("H", homeRank)),
      // Pawn Rank:
      ...pawns
    ];
  }

  get whiteOnBoard(): ChessPiece[] {
    return this.white.filter(p => this.isOnBoard(p));
  }
  get whiteOffBoard(): ChessPiece[] {
    return this.white.filter(p => this.isOffBoard(p));
  }
  get blackOnBoard(): ChessPiece[] {
    return this.black.filter(p => this.isOnBoard(p));
  }
  get blackOffBoard(): ChessPiece[] {
    return this.black.filter(p => this.isOffBoard(p));
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

  private isOnBoard(piece: ChessPiece): boolean {
    return this.getPosition(piece) !== null;
  }

  private isOffBoard(piece: ChessPiece): boolean {
    return this.getPosition(piece) === null;
  }
}