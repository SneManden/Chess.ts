import { Board } from "./Board.ts";
import { ChessPiece } from "./ChessPiece.ts";
import { Bishop } from "./pieces/Bishop.ts";
import { King } from "./pieces/King.ts";
import { Knight } from "./pieces/Knight.ts";
import { Queen } from "./pieces/Queen.ts";
import { Pawn } from "./pieces/Pawn.ts";
import { Rook } from "./pieces/Rook.ts";
import { Col, Position, Row } from "./Position.ts";
import { Player } from "./Player.ts";

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

export type BoardDict = { [R in Row]: { [C in Col]: Square } };

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
    const white = this.createPieces(Color.White, 1, 2);
    const black = this.createPieces(Color.Black, 8, 7);

    console.log("Board with pieces:");
    console.log(this.board.drawBoardString());

    this.white = white;
    this.black = black;

    this.playerWhite = p1;
    this.playerBlack = p2;

    p1.initialize(Color.White, this.board, white);
    p2.initialize(Color.Black, this.board, black);

    this.nextTurn = p1;

    this.board.initialize(white, black);
  }

  startGame(): void {
    const totalRounds = 10;

    if (!this.playerWhite || !this.playerBlack) {
      throw new Error("Game needs players!");
    }
    
    for (let round = 1; round <= totalRounds; round++) {
      const activePlayer = this.nextTurn;
      if (!activePlayer) {
        break;
      }
      console.group("\nRound", round, ":", activePlayer.name, "(", Color[activePlayer.color], ")");

      const other = activePlayer === this.playerWhite ? this.playerBlack : this.playerWhite;

      const move = activePlayer.makeMove();
      if (move === "give up") {
        console.log(activePlayer.name, "has given up.", other.name, "wins");
        break;
      } else {
        console.log(activePlayer.name, "moves", move.piece.name, "to", move.to.toString());
      }

      const replacement = this.board.replace(move.piece, move.to);
      if (replacement) {
        console.log("takes", replacement.name);
      }

      console.log(this.board.drawBoardString());

      this.nextTurn = other;
      console.groupEnd();
    }
    console.groupEnd();

    console.log("Game ended");
  }

  private createPieces<C extends Color>(color: C, homeRank: HomeRank<C>, pawnRank: PawnRank<C>): ChessPiece[] {
    const board = this.board;
    
    const pawns = Position.cols.map(col => new Pawn<C>(board, color, new Position(pawnRank, col)));
    return [
      // Home Rank: left to right
      new Rook<C>(board, color, new Position(homeRank, "A")),
      new Knight<C>(board, color, new Position(homeRank, "B")),
      new Bishop<C>(board, color, new Position(homeRank, "C")),
      new Queen<C>(board, color, new Position(homeRank, "D")),
      new King<C>(board, color, new Position(homeRank, "E")),
      new Bishop<C>(board, color, new Position(homeRank, "F")),
      new Knight<C>(board, color, new Position(homeRank, "G")),
      new Rook<C>(board, color, new Position(homeRank, "H")),
      // Pawn Rank:
      ...pawns
    ];
  }
}

// TODO:
// 1. Castling
// 2. En pessant (pawn reaches back rang => exchange with queen, rook, bishop, or knight)
// 3. Move validity (own king must not be check by move)
