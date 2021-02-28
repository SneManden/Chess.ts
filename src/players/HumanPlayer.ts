import { Notation } from "../Notation.ts";
import { Action, Move, Player } from "./Player.ts";

export class HumanPlayer extends Player {
  private giveUpStrings = ["resign"];

  readonly helpString = `
    Commands:
      help      prints this help
      resign    resign and exit game

    Make a move (one of):
      <piece><departing col?><departing row?><capture?><to><promotion?>
      0-0
      0-0-0

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
      =<piece>  promotion to piece
      
    Examples (simple moves):
      Qd4     Queen to D4
      d3      Pawn to D3
    Example  (captures):
      Bxe5    Bishop captures piece on E5
    Examples (disambiguation):
      Rdf8    Rook of column D to F8 (if the other rook can also move to F8)
      R1a3    Rook of row 1 to A3 (if the other rook can also move to A3)
      Qh4e1   Queen at H4 to E1 (if other (promoted) queens can also move to E1)
    Example  (promotion):
      d8=Q    Pawn to D8 with promotion to Queen
    Examples (castling):
      0-0     King castling with kingside rook (short)
      0-0-0   King castling with queenside rook (long)
  `;

  constructor(name: string) {
    super(name);
  }

  async makeMove(): Promise<Action> {
    let move: Move | null = null;
    while (!move) {
      console.log("What's your move? ");
      const input = (await this.getInput())?.trim();
      if (!input) {
        continue;
      }
      if (this.giveUpStrings.includes(input?.toLowerCase())) {
        return "resign";
      }
      if (input.toLowerCase() === "help") {
        console.log(this.helpString);
        continue;
      }
      move = Notation.parseMove(input, this.availablePieces);
    }
    return move;
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
