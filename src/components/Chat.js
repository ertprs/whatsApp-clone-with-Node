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
import firebase from "firebase/app";
import "./Chat.scss";

const Chat = () => {
  const [{ user }] = useStateValue();

  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [seed, setSeed] = useState("");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

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

  useEffect(() => {
    if (roomId) {
      db.collection("whatsappRoom")
        .doc(roomId)
        .collection("messages")
        .onSnapshot((snapshot) =>
          setChatMessages(
            snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          )
        );
        
    }
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    db.collection("whatsappRoom")
      .doc(roomId)
      .collection("messages")
      .add({
        userName: user?.displayName,
        uid: user?.uid,
        content: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
    setMessage("");
  };
  console.log(chatMessages)
  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>last seen at ...</p>
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
      {chatMessages && chatMessages.map(({ content, id, name, timestamp }) => (
        <>
          <p className={`chat__message chat__reciever`} key={id}>
            {content}
            <span className="chat__name">{name}</span>
            <span className="chat__timestamp">{timestamp}</span>
          </p>
        </>
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
