/// <reference lib="dom" />
import React from "react";
import * as ReactDOM from "react-dom";
import App from "./App.jsx";

function Index() {
  return (
    <App />
  );
}

ReactDOM.render(<Index />, document.getElementById("root"));
