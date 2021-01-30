export enum Piece {
  Pawn,   // Bonde
  Rook,   // Tårn
  Knight, // Hest
  Bishop, // Løber
  Queen,  // Dronning
  King,   // Konge
}
export enum Color { White, Black }

export type Col = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
export type Row = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Empty = null;
export type Square = ChessPiece | Empty;

export type BoardDict = { [R in Row]: { [C in Col]: Square } };

export class Position {
  constructor(readonly row: Row, readonly col: Col){}

  left(): Position | null {
    const col = this.colToLeft();
    return col ? new Position(this.row, col) : null;
  }
  right(): Position | null {
    const col = this.colToRight();
    return col ? new Position(this.row, col) : null;
  }
  up(): Position | null {
    const row = this.row + 1;
    return Position.isRow(row) ? new Position(row, this.col) : null;
  }
  down(): Position | null {
    const row = this.row - 1;
    return Position.isRow(row) ? new Position(row, this.col) : null;
  }

  private colToLeft(): Col | null {
    return Position.cols[Position.cols.indexOf(this.col) - 1] ?? null;
  }
  private colToRight(): Col | null {
    return Position.cols[Position.cols.indexOf(this.col) - 1] ?? null;
  }

  static get rows(): Row[] {
    return [1, 2, 3, 4, 5, 6, 7, 8];
  }
  static get cols(): Col[] {
    return ["A", "B", "C", "D", "E", "F", "G", "H"];
  }
  static isRow(value: number): value is Row {
    return Position.rows.map(r => r as number).includes(value);
  }
}

export class Board {
  private rows: Row[] = [1, 2, 3, 4, 5, 6, 7, 8];
  private cols: Col[] = ["A", "B", "C", "D", "E", "F", "G", "H"];
  private board: BoardDict = this.createEmptyBoard();

  private pieces: { [pieceId: string]: Position | null };

  constructor() {
  }

  replace(piece: ChessPiece, pos: Position): Square {
    const current = this.get(pos);
    if (current) {
      this.pieces[current.id] = null;
    }
    this.updatePosition(piece, pos);
    return current;
  }

  get(pos: Position): Square {
    return this.board[pos.row][pos.col];
  }

  piece(piece: ChessPiece): Position | null {
    return this.pieces[piece.id] ?? null;
  }

  private updatePosition(piece: ChessPiece, pos: Position): void {
    this.board[pos.row][pos.col] = piece;
    this.pieces[piece.id] = pos;
  }

  private createEmptyBoard(): BoardDict {
    return this.rows.reduce((p, r) => {
      p[r] = this.cols.reduce((x, c) => {
        x[c] = "empty";
        return x;
      }, {});
      return p;
    }, {}) as BoardDict;
  }
}

export abstract class ChessPiece {
  constructor(
    private readonly board: Board,
    public readonly piece: Piece,
    public readonly color: Color,
    public readonly id: string,
    pos: Position
  ) {
    this.board.replace(this, pos);
  }

  abstract moves(): Position[];

  get isOnBoard(): boolean {
    return this.position() !== null;
  }

  move(to: Position): Square {
    if (!this.moves().includes(to)) {
      throw new Error(`Invalid position; cannot move to `);
    }
    return this.board.replace(this, to);
  }

  toString(): string {
    return `${this.color} ${this.piece}`;
  }

  protected position(): Position | null {
    return this.board.piece(this);
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
      if (this.board.get(next)) {
        break; // include next, but don't go further
      }
      next = direction(next);
    };
    return ups;
  }
}

export class Rook extends ChessPiece {
  constructor(board: Board, color: Color, id: Extract<Col, "A" | "H">, pos: Position){
    super(board, Piece.Pawn, color, id, pos);
  }

  moves(): Position[] {
    const pos = this.position();
    if (!pos) {
      return [];
    }
    return [
      ...this.range((pos: Position) => pos.up()),
      ...this.range((pos: Position) => pos.down()),
      ...this.range((pos: Position) => pos.left()),
      ...this.range((pos: Position) => pos.right()),
    ].filter(pos => pos !== null);
  }
}

export class Pawn extends ChessPiece {
  constructor(board: Board, color: Color, id: Col, pos: Position){
    super(board, Piece.Pawn, color, id, pos);
  }

  moves(): Position[] {
    if (!this.isOnBoard) {
      return [];
    }
    return [
      this.forward(),
      this.forwardLeft(),
      this.forwardRight(),
    ].filter(pos => pos !== null);
  }

  private forwardLeft(): Position | null {
    return this.forward()?.left() ?? null;
  }
  
  private forwardRight(): Position | null {
    return this.forward()?.right() ?? null;
  }

  private forward(): Position | null {
    const pos = this.position();
    if (!pos) {
      return null;
    }
    return this.color === Color.White ? pos.up() : pos.down();
  }
}
