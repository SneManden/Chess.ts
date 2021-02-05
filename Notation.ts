import { ChessPiece, PieceNotation } from "./pieces/ChessPiece.ts";
import { Move } from "./players/Player.ts";
import { Col, Position, Row } from "./Position.ts";

export type PiecePosition = `${PieceNotation}${Lowercase<Col>}${Row}`;
// export type MoveNotation = `${PieceNotation}${Lowercase<Col | "">}${Row | ""}${"x" | ""}${Lowercase<Col>}${Row}`;

export class Notation {
  private static DEBUG = false;
  
  static parseMove(move: string, availablePieces: ChessPiece[]): Move | null {
    if (!move) {
      return null;
    }

    const regex = /^(|R|N|B|Q|K)(|[a-h])(|[1-8])(|x)([a-h][1-8])$/;
    const match = regex.exec(move);
    this.DEBUG && console.log("parseMove(move:", move, ") match:", match);
    if (!match) {
      this.DEBUG && console.warn("move does not match notation regular expression");
      return null;
    }
    
    const [_, pId, depCol, depRow, captures, to] = match;
    const toPosition = Position.create(to.toUpperCase() as `${Col}${Row}`);
    const candidates = availablePieces
      .filter(p => p.notation === pId)
      .filter(p => p.validMoves().map(m => m.toString()).includes(toPosition.toString()));
    if (candidates.length === 0) {
      this.DEBUG && console.warn("No piece of type", pId || "pawn", "contain a move to position", toPosition.toString());
      return null;
    }

    const departureCol = depCol?.toUpperCase() as Col;
    const departureRow = depRow ? parseInt(depRow) as Row : undefined;
    const piece = this.getPiece(candidates, departureCol, departureRow);
    if (!piece) {
      this.DEBUG && console.warn("No piece among candidates", candidates.map(c => c.toString()), "at", departureCol, departureRow, "found");
      return null;
    }
    return { piece, to: toPosition, notation: move };
  }

  static toAlgebraicNotation(piece: ChessPiece, to: Position, team: ChessPiece[]): string {
    const piecePosition = piece.position();
    if (!piecePosition) {
      throw new Error("Piece must be on the board!");
    }
    
    const otherPieces = team.filter(p => p !== piece).filter(p => p.isOnBoard).filter(p => p.piece === piece.piece);
    const disambiguation = otherPieces.filter(p => p.validMoves().some(pos => pos.equals(to)));
    if (disambiguation.length === 0) {
      return `${piece.notation}${to.toString().toLowerCase()}`;
    }
    const disambiguationCol = disambiguation.filter(p => p.position()?.col === piecePosition.col);
    if (disambiguationCol.length === 0) {
      return `${piece.notation}${piecePosition.col.toLocaleLowerCase()}${to.toString().toLowerCase()}`;
    } else {
      return `${piece.notation}${piecePosition.col.toLocaleLowerCase()}${piecePosition.row}${to.toString().toLowerCase()}`;
    }
  }

  private static getPiece(pieces: ChessPiece[], depCol?: Col, depRow?: Row): ChessPiece | null {
    this.DEBUG && console.log("getPiece(pieces:", pieces.map(p => p.toString()), ", depCol:", depCol, ", depRow:", depRow, ")");
    let candidates: ChessPiece[];
    if (depCol && depRow) {
      candidates = pieces.filter(p => p.position() === new Position(depCol, depRow));
    } else if (depCol) {
      candidates = pieces.filter(p => p.position()?.col === depCol);
    } else if (depRow) {
      candidates = pieces.filter(p => p.position()?.row === depRow);
    } else if (pieces.length === 1) {
      return pieces[0];
    } else {
      return null;
    }
    return candidates.length === 1 ? candidates[0] : null;
  }
}
