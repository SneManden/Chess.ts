import { Board } from "./Board.ts";
import { ChessPiece } from "./pieces/ChessPiece.ts";
import { Player } from "./players/Player.ts";
import { delay } from 'https://deno.land/x/delay@v0.2.0/mod.ts';

export enum Piece {
  Pawn,   // Bonde
  Rook,   // Tårn
  Knight, // Hest
  Bishop, // Løber
  Queen,  // Dronning
  King,   // Konge
}

export enum Color { Undefined = 0, White, Black }

export type HomeRank<C extends Color> = C extends Color.White ? 1 : 8;
export type PawnRank<C extends Color> = C extends Color.White ? 2 : 7;

export type Empty = null;
export type Square = ChessPiece | Empty;

export class Game {
  private board = new Board();

  private white: ChessPiece[] = [];
  private black: ChessPiece[] = [];

  private playerWhite: Player | null = null;
  private playerBlack: Player | null = null;

  nextTurn: Player | null = null;

  constructor() {
  }

  setupNewGame(p1: Player, p2: Player): void {
    const white = this.board.createPieces(Color.White, 1, 2);
    const black = this.board.createPieces(Color.Black, 8, 7);

    console.log("Board with pieces:");
    console.log(this.board.drawSimpleBoardString());

    this.white = white;
    this.black = black;

    this.playerWhite = p1;
    this.playerBlack = p2;

    p1.initialize(Color.White, this.board, white);
    p2.initialize(Color.Black, this.board, black);

    this.nextTurn = p1;

    // this.board.initialize(white, black);
  }

  async startGame(totalRounds = 100): Promise<void> {
    if (!this.playerWhite || !this.playerBlack) {
      throw new Error("Game needs players!");
    }
    
    for (let round = 1; round <= totalRounds; round++) {
      console.clear();
      const activePlayer = this.nextTurn;
      if (!activePlayer) {
        break;
      }
      console.group("\nRound", round, ":", activePlayer.name, "(", Color[activePlayer.color], ")");

      const other = activePlayer === this.playerWhite ? this.playerBlack : this.playerWhite;

      const move = await activePlayer.makeMove();
      if (move === "give up") {
        console.log(activePlayer.name, "has given up.", other.name, "wins");
        break;
      }
      
      // const replacement = this.board.replace(move.piece, move.to);
      const replacement = move.piece.move(move.to);
      console.log(activePlayer.name, "moves", move.piece.name, "to", move.to.toString(), ...(replacement ? ["takes", replacement.name]:[]));

      console.log(this.board.drawSimpleBoardString());

      this.nextTurn = other;
      console.groupEnd();
      await delay(1_000);
    }
    console.groupEnd();

    console.log("Game ended");
  }
}
