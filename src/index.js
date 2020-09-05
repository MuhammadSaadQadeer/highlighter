import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { TodoContext } from "./ctx/TodoCtx";

ReactDOM.render(
  <React.StrictMode>
    <TodoContext.Provider value={[{ id: 1, text: "sometext" }]}>
      <App  />
    </TodoContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
