import { ChessPiece } from "./ChessPiece";
import { BoardDict, Color, Square, HomeRank, PawnRank } from "./Game";
import { Row, Col, Position, RestrictedPosition } from "./Position";
import { Rook } from "./pieces/Rook";
import { Pawn } from "./pieces/Pawn";

export class Board {
  private rows: Row[] = [1, 2, 3, 4, 5, 6, 7, 8];
  private cols: Col[] = ["A", "B", "C", "D", "E", "F", "G", "H"];
  private board: BoardDict = this.createEmptyBoard();

  private pieces: { [pieceId: string]: Position | null };

  private white: ChessPiece[] = [];
  private black: ChessPiece[] = [];

  constructor() {
    const whiteTeam = <W extends Color.White>(white: W) => {
      const pawns = Position.cols.map(col => new Pawn<W>(this, white, new RestrictedPosition(2, col)));
      return [
        new Rook(this, white, new RestrictedPosition(2, "A")),
        ...pawns
      ];
    };
    this.white = whiteTeam(Color.White);

    const blackTeam = <B extends Color.Black>(color: B) => {
      const pawns = Position.cols.map(col => new Pawn<B>(this, color, new RestrictedPosition(7, col)));
      return [
        ...pawns
      ];
    };
    this.black = blackTeam(Color.Black);

    // interface Config<C extends Color> {
    //   color: C,
    //   homeRank: HomeRank<C>,
    //   pawnRank: PawnRank<C>
    // }
    // const colors = [Color.White, Color.Black];
    // const config = colors.map(c => ({
    //   color: c,
    //   homeRank: Position.homeRank(c),
    //   pawnRank: Position.pawnRank(c),
    // }));
    // for (const { homeRank, pawnRank, color } of config) {
    //   const team = [
    //     new Rook(this, color, new RestrictedPosition(homeRank, "A")),
    //     new Rook(this, color, new RestrictedPosition(homeRank, "H")),
    //     // ...,
    //     ...[Position.cols.map(col => new Pawn(this, color, new RestrictedPosition(pawnRank, col)))]
    //   ];
    //   if (color === Color.White) {
    //     this.white = team;
    //   } else {
    //     this.black = team;
    //   }
    // }
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

  private updatePosition(piece: ChessPiece, pos: Position | null): void {
    if (pos) {
      this.board[pos.row][pos.col] = piece;
    }
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