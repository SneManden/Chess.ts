import { Board } from "./Board.ts";
import { ChessPiece, isCastling, isEnPassant, isPromotion, Piece, PieceMove, PieceNotation, pieceToNotation } from "./pieces/ChessPiece.ts";
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

    if (move === "0-0" || move === "0-0-0") {
      const type = move === "0-0" ? "short" : "long";
      const king = availablePieces.find(p => p.piece === Piece.King);
      const castlingMove = king?.validMoves().filter(isCastling).find(m => m.type === type);
      if (!king || !castlingMove) {
        this.DEBUG && console.warn(`King cannot castle (${type})`);
        return null;
      }
      return {
        notation: move,
        move: castlingMove,
        piece: king,
      };
    }

    const regex = /^(|R|N|B|Q|K)(|[a-h])(|[1-8])(|x)([a-h][1-8])(?:(?:=(R|N|B|Q))|e\.p\.)?$/;
    const match = regex.exec(move);
    this.DEBUG && console.log("parseMove(move:", move, ") match:", match);
    if (!match) {
      this.DEBUG && console.warn("move does not match notation regular expression");
      return null;
    }
    
    const [_, pId, depCol, depRow, captures, to, special] = match;
    const toPosition = Position.create(to.toUpperCase() as `${Col}${Row}`);
    const candidates = availablePieces
      .filter(p => p.notation === pId)
      .filter(p => p.validMoves().some(move => move.to.equals(toPosition)));
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
    if (special && special !== "e.p.") {
      const promotionMove = piece.validMoves().filter(isPromotion).find(m => pieceToNotation(m.piece) === special);
      if (!promotionMove) {
        this.DEBUG && console.warn("Piece has no promotion move to", special);
        return null;
      }
      return { piece, move: promotionMove, notation: move };
    }

    return { piece, move: { to: toPosition, from: piece.position() }, notation: move };
  }

  static toAlgebraicNotation(piece: ChessPiece, move: PieceMove, team: ChessPiece[]): string {
    const piecePosition = piece.positionSafe();
    if (!piecePosition) {
      throw new Error("Piece must be on the board!");
    }

    const moveTo = move.to.toString().toLowerCase();

    if (isPromotion(move)) {
      const promotion = pieceToNotation(move.piece);
      return `${moveTo}=${promotion}`;
    } else if (isCastling(move)) {
      return move.type === "short" ? "0-0" : "0-0-0";
    } else if (isEnPassant(move)) {
      return `${piece.position().col.toLowerCase()}x${moveTo}e.p.`;
    }
    
    const otherPieces = team
      .filter(p => p !== piece)
      .filter(p => p.isOnBoard)
      .filter(p => p.piece === piece.piece);
    const disambiguation = otherPieces.filter(p => p.validMoves().some(pos => pos.to.equals(move.to)));
    if (disambiguation.length === 0) {
      return `${piece.notation}${moveTo}`;
    }
    const disambiguationCol = disambiguation.filter(p => p.positionSafe()?.col === piecePosition.col);
    if (disambiguationCol.length === 0) {
      return `${piece.notation}${piecePosition.col.toLocaleLowerCase()}${moveTo}`;
    } else {
      return `${piece.notation}${piecePosition.col.toLocaleLowerCase()}${piecePosition.row}${moveTo}`;
    }
  }

  private static getPiece(pieces: ChessPiece[], depCol?: Col, depRow?: Row): ChessPiece | null {
    this.DEBUG && console.log("getPiece(pieces:", pieces.map(p => p.toString()), ", depCol:", depCol, ", depRow:", depRow, ")");
    let candidates: ChessPiece[];
    if (depCol && depRow) {
      candidates = pieces.filter(p => p.positionSafe() === new Position(depCol, depRow));
    } else if (depCol) {
      candidates = pieces.filter(p => p.positionSafe()?.col === depCol);
    } else if (depRow) {
      candidates = pieces.filter(p => p.positionSafe()?.row === depRow);
    } else if (pieces.length === 1) {
      return pieces[0];
    } else {
      return null;
    }
    return candidates.length === 1 ? candidates[0] : null;
  }
}
