import React, { Component } from "react";

export default class App extends Component {
  constructor() {
    super();
    this.state = { moves: [] };
  }

  async makeMove(e) {
    console.log("makeMove(e:", e, ")");
    const response = await fetch("/move?player=white&move=d4", {
      method: "POST",
      headers: {
        'Content-Type': 'text/plain'
      },
    })
    const move = await response.text();
    this.setState((state) => ({ moves: [...state.moves, move] }));
  }

  render(props, state) {
    const { moves } = state;
    return (
      <div>
        <h1>Make a move!</h1>
        <button onClick={e => this.makeMove(e)}>Move pawn @ d2</button>
        <ul>
          {moves.map(move => (
            <li>{ move }</li>
          ))}
        </ul>
      </div>
    )
  }
}
