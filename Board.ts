import { ChessPiece } from "./ChessPiece.ts";
import { BoardDict, Color, Square, HomeRank, PawnRank } from "./Game.ts";
import { Row, Col, Position } from "./Position.ts";
import { Rook } from "./pieces/Rook.ts";
import { Pawn } from "./pieces/Pawn.ts";
import { Knight } from "./pieces/Knight.ts";
import { Bishop } from "./pieces/Bishop.ts";
import { Queen } from "./pieces/Queen.ts";
import { King } from "./pieces/King.ts";

export class Board {
  private rows: Row[] = [1, 2, 3, 4, 5, 6, 7, 8];
  private cols: Col[] = ["A", "B", "C", "D", "E", "F", "G", "H"];
  private board: BoardDict = this.createEmptyBoard();

  private pieces: { [pieceId: string]: Position | null } = {};

  private white: ChessPiece[] = [];
  private black: ChessPiece[] = [];

  constructor() {
  }

  setupNewGame(): void {
    this.white = this.createPieces(Color.White, 1, 2);
    this.black = this.createPieces(Color.Black, 8, 7);
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
    return opponents.some(opp => opp.moves().find(movePosition => movePosition.equals(pos)));
  }

  isValidMove(pos: Position, self: Color): boolean {
    const team = self === Color.White ? this.white : this.black;
    if (this.lookAt(pos)?.color === self) {
      return false; // Cannot move to position with a teammate 
    }

    // const king = team.find(piece => piece.piece === Piece.King);
    // if (!king) {
    //   throw new Error(`Cannot check for move validity: the board is without a ${self} king!`);
    // }
    // const kingPosition = this.getPosition(king);
    // if (!kingPosition) {
    //   throw new Error(`Cannot check for move validity: the king is not positioned on the board!`);
    // }
    // TODO: check that own king is not in check
    
    return true;
  }

  private createPieces<C extends Color>(color: C, homeRank: HomeRank<C>, pawnRank: PawnRank<C>): ChessPiece[] {
    const pawns = Position.cols.map(col => new Pawn<C>(this, color, new Position(pawnRank, col)));
    return [
      // Home Rank: left to right
      new Rook<C>(this, color, new Position(homeRank, "A")),
      new Knight<C>(this, color, new Position(homeRank, "B")),
      new Bishop<C>(this, color, new Position(homeRank, "C")),
      new Queen<C>(this, color, new Position(homeRank, "D")),
      new King<C>(this, color, new Position(homeRank, "E")),
      new Bishop<C>(this, color, new Position(homeRank, "F")),
      new Knight<C>(this, color, new Position(homeRank, "G")),
      new Rook<C>(this, color, new Position(homeRank, "H")),
      // Pawn Rank:
      ...pawns
    ];
  }

  private updatePosition(piece: ChessPiece, pos: Position | null): void {
    if (pos) {
      this.board[pos.row][pos.col] = piece;
    }
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