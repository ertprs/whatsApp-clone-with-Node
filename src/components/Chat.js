import { Avatar, IconButton } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { useParams } from "react-router-dom";
import { useStateValue } from "../contextAPI/StateProvider";
import db from "../firebase";
import "./Chat.scss";
import axios from '../axios'

const Chat = ({messages}) => {
  const [{ user }] = useStateValue();

  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [seed, setSeed] = useState("");
  const [message, setMessage] = useState("");


  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      db.collection("whatsappRoom")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomName(snapshot.data().name))
    }
  }, [roomId]);

  const sendMessage = async(e) => {
    e.preventDefault();
   await axios.post('/messages/add', {
      message,
      name: user.displayName,
      received:false
    })
    setMessage("");
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>Last seen </p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlinedIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
      {messages?.map(({ id, message,name, timestamp, received }) => (
        <div key={id}>
          <div className={`chat__message ${received && 'chat__receiver'}`} >
            <span>{message} </span>
            <span className={`chat__name ${!received && 'chat__name--receiver'}`}>{name}</span>
            <span className="chat__timestamp">{timestamp}</span>
          </div>
        </div>
      ))}
      </div>
      <div className="chat__footer">
        <InsertEmoticonIcon />
        <form>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            placeholder="Type a message"
          />
          <button type="submit" onClick={sendMessage}>
            Send a message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
};

export default Chat;
