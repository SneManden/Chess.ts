import { Color, PawnRank } from "./Game.ts";

export type Col = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
export type Row = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export class Position<R extends Row = Row, C extends Col = Col> {
  constructor(readonly row: R, readonly col: C){}

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
