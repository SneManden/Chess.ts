# Chess.ts
My little chess game experiment. After watching the excellent mini series
Queens Gambit I couldn't resist the temptation to try and implement chess.
I could dream of (if I ever get that far...) implement some basic neural
networks and maybe train a Chess AI.

Since I hadn't yet tried out [Deno](https://deno.land/) before, I felt
like this was a perfect opportunity to try it out.

## How to run
Run the program by running:

    deno run main.ts

![Starting positions](https://github.com/SneManden/Chess.ts/blob/main/doc/img/demo.png?raw=true)

### Playing chess
Playing the game is actually possible now. Here's a screenshot from the game, when running `deno run main.ts`:

![Human Playing vs CPU](https://github.com/SneManden/Chess.ts/blob/main/doc/img/human_vs_greedy.png?raw=true)

Human plays by describing the move using [Algebraic notation (chess)](https://en.wikipedia.org/wiki/Algebraic_notation_(chess)).
Here's the help text for the game:

    Commands:
      help      prints this help
      exit      exit game
      quit      exit game
      give up   exit game

    Make a move:
      <piece><capture?><to>
      
      examples (simple moves):
        Qd4     Queen to D4
        d3      (Pawn) to D3
      examples (captures):
        Bxe5    Bishop captures piece on E5
      examples (disambiguation):
        Rdf8    Rook of column D to F8 (if the other rook can also move to F8)
        R1a3    Rook of row 1 to A3 (if the other rook can also move to A3)
        Qh4e1   Queen at H4 to E1 (if other (promoted) queens can also move to E1)

    Notation:
      (none)    pawn
      R         Rook
      N         kNight
      B         Bishop
      Q         Queen
      K         King
      x         capture (optional)

## Tests
I have made a bunch of tests. Run them by

    deno test

## TODO
* [x] Fix pristine
* [ ] Implement move "Castling"
* [ ] Implement move "Promotion" (when a pawn reaches back rank => exchange with choice of queen, rook, bishop, or knight)
* [ ] Implement "en passant" (case where pawn is taken by another pawn after an initially long move)
* [x] Check (basic) move validity (own king must not be check by move)
* [ ] Advanced chess rules (see rules about draws, stalemate, etc.)
* [ ] Check(mate) stuff
* [x] Show taken pieces
* [x] Redo Position constructor to take arguments as (col, row) instead of (row, col)
* [x] Allow for human to play
* [x] Better graphics
* [ ] Even better graphics
* [ ] Much more
* [ ] Play with a stop watch
