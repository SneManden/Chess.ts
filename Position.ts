import { Color, PawnRank } from "./Game.ts";

export type Col = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
export type Row = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export class Position<C extends Col = Col, R extends Row = Row> {
  constructor(readonly col: C, readonly row: R){}

  left(): Position | null {
    const col = this.colToLeft();
    return col ? new Position(col, this.row, ) : null;
  }
  right(): Position | null {
    const col = this.colToRight();
    return col ? new Position(col, this.row, ) : null;
  }
  up(): Position | null {
    const row = this.row + 1;
    return Position.isRow(row) ? new Position(this.col, row) : null;
  }
  down(): Position | null {
    const row = this.row - 1;
    return Position.isRow(row) ? new Position(this.col, row) : null;
  }

  leftUp(): Position | null {
    return this.left()?.up() ?? null;
  }
  rightUp(): Position | null {
    return this.right()?.up() ?? null;
  }
  rightDown(): Position | null {
    return this.right()?.down() ?? null;
  }
  leftDown(): Position | null {
    return this.left()?.down() ?? null;
  }

  forward(color: Color): Position | null {
    return color === Color.White ? this.up() : this.down();
  }

  equals(other: Position): boolean {
    return this.row === other.row && this.col === other.col;
  }

  toString(): string {
    return `${this.col}${this.row}`;
  }

  private colToLeft(): Col | null {
    return Position.cols[Position.cols.indexOf(this.col) - 1] ?? null;
  }
  private colToRight(): Col | null {
    return Position.cols[Position.cols.indexOf(this.col) + 1] ?? null;
  }

  static create<C extends Col = Col, R extends Row = Row>(str: `${C}${R}`): Position<C, R> {
    return new Position(str[0] as C, parseInt(str[1]) as R);
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
