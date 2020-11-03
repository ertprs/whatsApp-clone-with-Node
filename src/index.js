import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import StateProvider from "./contextAPI/StateProvider";
import reducer, { initialState } from "./contextAPI/reducer";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <StateProvider initialState={initialState} reducer={reducer}>
        <App />
      </StateProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
