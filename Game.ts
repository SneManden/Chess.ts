import { Board } from "./Board.ts";
import { ChessPiece } from "./pieces/ChessPiece.ts";
import { Player } from "./players/Player.ts";
import { delay } from 'https://deno.land/x/delay@v0.2.0/mod.ts';

export enum Color { Undefined = 0, White, Black }

export type HomeRank<C extends Color> = C extends Color.White ? 1 : 8;
export type PawnRank<C extends Color> = C extends Color.White ? 2 : 7;

export type Empty = null;
export type Square = ChessPiece | Empty;

export interface GameOptions {
  delay: number | null;
  maxRounds: number;
  drawBoard: boolean;
}

export interface GameResults {
  roundsPlayed: number;
  winner: Player | "draw";
  moves: string[];
}

export class Game {
  readonly DEFAULT_GAME_OPTIONS: GameOptions = {
    delay: 1_000,
    maxRounds: 100,
    drawBoard: true,
  };
  
  private board = new Board();

  private playerWhite: Player | null = null;
  private playerBlack: Player | null = null;

  nextTurn: Player | null = null;

  constructor() {
  }

  setupNewGame(p1: Player, p2: Player): void {
    const white = this.board.createPieces(Color.White, 1, 2);
    const black = this.board.createPieces(Color.Black, 8, 7);

    this.playerWhite = p1;
    this.playerBlack = p2;

    p1.initialize(Color.White, this.board, white);
    p2.initialize(Color.Black, this.board, black);

    this.nextTurn = p1;
  }

  async startGame(options?: Partial<GameOptions>): Promise<GameResults> {
    if (!this.playerWhite || !this.playerBlack) {
      throw new Error("Game needs players!");
    }

    const opt: GameOptions = { ...this.DEFAULT_GAME_OPTIONS, ...options };

    let winner: Player | null = null;
    const moves: string[] = [];

    if (opt.drawBoard) {
      console.log(this.board.drawLargeBoardString());
    }
    
    let round = 1;
    for (; round <= opt.maxRounds; round++) {
      const activePlayer = this.nextTurn;
      if (!activePlayer) {
        break;
      }
      console.group("\nRound", round, ":", activePlayer.name, "(", Color[activePlayer.color], ")");

      const other = activePlayer === this.playerWhite ? this.playerBlack : this.playerWhite;

      const move = await activePlayer.makeMove();
      moves.push(move === "give up" ? "resign" : move.notation);
      if (move === "give up") {
        console.log(activePlayer.name, "has given up.");
        winner = other;
        break;
      }
      
      const replacement = move.piece.move(move.to);

      const kingCheck = this.board.kingStatus(other.color);
      console.log(move.piece.name, "to", move.to.toString(), ...(replacement ? ["takes", replacement.name]:[]), ...(kingCheck !== "none" ? ["...", kingCheck]:[]));

      if (opt.drawBoard) {
        console.log(this.board.drawLargeBoardString());
      }

      if (kingCheck === "checkmate") {
        winner = activePlayer;
        break;
      }

      this.nextTurn = other;
      console.groupEnd();
      if (opt.delay) {
        await delay(opt.delay);
      }
    }
    console.groupEnd();

    if (winner) {
      console.log("Winner:", winner.name);
    } else {
      console.log("The game was a draw.");
    }

    console.log("Game over.");

    return {
      roundsPlayed: round,
      winner: winner ?? "draw",
      moves,
    };
  }
}
