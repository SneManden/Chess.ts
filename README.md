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
* [ ] Allow for human to play
* [x] Better graphics
* [ ] Even better graphics
* [ ] Much more
* [ ] Play with a stop watch
