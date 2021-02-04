import { ChessPiece } from "./pieces/ChessPiece.ts";
import { Move } from "./players/Player.ts";
import { Col, Position, Row } from "./Position.ts";

export class Notation {
  static parseMove(move: string, availablePieces: ChessPiece[]): Move | null {
    if (!move) {
      return null;
    }

    const regex = /(|R|N|B|Q|K)(|[a-h])(|[1-8])(|x)([a-h][1-8])/;
    const match = regex.exec(move);
    if (!match) {
      return null;
    }
    
    const [_, pId, depCol, depRow, captures, to] = match;
    const toPosition = Position.create(to.toUpperCase() as `${Col}${Row}`);
    const candidates = availablePieces
      .filter(p => p.notation === pId)
      .filter(p => p.validMoves().map(m => m.toString()).includes(toPosition.toString()));
    if (candidates.length === 0) {
      return null;
    }

    const departureCol = depCol?.toUpperCase() as Col;
    const departureRow = depRow ? parseInt(depRow) as Row : undefined;
    const piece = this.getPiece(candidates, departureCol, departureRow);
    if (!piece) {
      return null;
    }
    return { piece, to: toPosition };
  }

  private static getPiece(pieces: ChessPiece[], depCol?: Col, depRow?: Row): ChessPiece | null {
    let candidates: ChessPiece[];
    if (pieces.length === 1) {
      return pieces[0];
    } else if (depCol && depRow) {
      candidates = pieces.filter(p => p.position() === new Position(depCol, depRow));
    } else if (depCol) {
      candidates = pieces.filter(p => p.position()?.col === depCol);
    } else if (depRow) {
      candidates = pieces.filter(p => p.position()?.row === depRow);
    } else {
      return null;
    }
    return candidates.length === 1 ? candidates[0] : null;
  }
}
