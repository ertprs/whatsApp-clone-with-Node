import React, { useEffect, useState } from "react";
import "./App.scss";
import Chat from "./components/Chat";
import Sidebar from "./components/Sidebar";
import { Switch, Route } from "react-router-dom";
import Login from "./components/Login";
import { useStateValue } from "./contextAPI/StateProvider";
import Pusher from "pusher-js";
import axios from "./axios";

function App() {
  const [{ user }] = useStateValue();
  const [messages, setMessages] = useState([])
  
  useEffect(() => {
    axios.get("/messages")
      .then((response) => setMessages(response.data));
  }, []);

  useEffect(() => {
    const pusher = new Pusher("cdf43416aafbcf93fc2c", {
      cluster: "ap4",
    });
    const channel = pusher.subscribe("messages");
    channel.bind("inserted", function (data) {
      setMessages([...messages, data])
    });
    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [messages]);


  return (
    <div className="app">
      {user ? (
        <div className="app__body">
          <Sidebar />
          <Switch>
            <Route path="/rooms/:roomId">
              <Chat messages={messages}/>
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
