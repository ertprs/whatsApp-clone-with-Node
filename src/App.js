import React from "react";
import "./App.scss";
import Chat from "./components/Chat";
import Sidebar from "./components/Sidebar";
import { Switch, Route } from "react-router-dom";
import Login from "./components/Login";
import { useStateValue } from "./contextAPI/StateProvider";

function App() {
  const [{ user }] = useStateValue();

  return (
    <div className="app">
      {user ? (
        <div className="app__body">
          <Sidebar />
          <Switch>
            <Route path="/rooms/:roomId">
              <Chat />
            </Route>
            <Route path="/">
              <Chat />
            </Route>
          </Switch>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
