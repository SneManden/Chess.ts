import { ChessPiece } from "../pieces/ChessPiece.ts";
import { Col, Position, Row } from "../Position.ts";
import { Move, Player } from "./Player.ts";

export class HumanPlayer extends Player {
  private giveUpStrings = ["quit", "exit", "give up"];

  readonly helpString = `
    Commands:
      help      prints this help
      exit      exit game
      quit      exit game
      give up   exit game

    Make a move:
      <piece><departing col?><departing row?><capture?><to>

    Notation:
      (none)    pawn
      R         Rook
      N         kNight
      B         Bishop
      Q         Queen
      K         King
      x         capture (optional)
      a-h       column/file
      1-8       row/rank
      
      examples (simple moves):
        Qd4     Queen to D4
        d3      Pawn to D3
      examples (captures):
        Bxe5    Bishop captures piece on E5
      examples (disambiguation):
        Rdf8    Rook of column D to F8 (if the other rook can also move to F8)
        R1a3    Rook of row 1 to A3 (if the other rook can also move to A3)
        Qh4e1   Queen at H4 to E1 (if other (promoted) queens can also move to E1)
  `;

  constructor(id: string) {
    super(id);
  }

  async makeMove(): Promise<Move | "give up"> {
    let move: Move | null = null;
    while (!move) {
      console.log("What's your move? ");
      const input = (await this.getInput())?.trim();
      if (!input) {
        continue;
      }
      if (this.giveUpStrings.includes(input?.toLowerCase())) {
        return "give up";
      }
      if (input.toLowerCase() === "help") {
        console.log(this.helpString);
        continue;
      }
      move = this.parseMove(input);
    }
    return move;
  }

  private parseMove(move: string): Move | null {
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
    const candidates = this.pieces
      .filter(p => p.isOnBoard)
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

  private getPiece(pieces: ChessPiece[], depCol?: Col, depRow?: Row): ChessPiece | null {
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

  protected async getInput(): Promise<string | null> {
    const buf = new Uint8Array(1024);
    const n = await Deno.stdin.read(buf);
    if (!n) {
      return null;
    }
    return new TextDecoder().decode(buf.subarray(0, n));
  }
}