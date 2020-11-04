import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./SidebarChat.scss";
import db from "../firebase";
import { Link } from "react-router-dom";

const SidebarChat = ({ addNewChat, name, roomId }) => {
  const [seed, setSeed] = useState("");
  const [messages, setMessages] = useState([])

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  useEffect(() => {
    if (roomId) {
      db.collection("whatsappRoom")
        .doc(roomId)
        .collection("messages")
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapshot => (
        setMessages(snapshot.docs.map(doc => doc.data()))
      ))
    }
  }, [roomId]);
  
  const truncate = (str,n) => {
    return str?.length > n ? str.substr(0, n-1) + '...' : str;
}

  const createChat = () => {
    const roomName = prompt("Please enter name for Chat");
    if (roomName) {
      db.collection("whatsappRoom")
        .add({
          name: roomName,
        })
        .catch((err) => console.log(err));
    }
  };
  return !addNewChat ? (
    <Link to={`/rooms/${roomId}`}>
      <div className="sidebarChat">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          <p>{truncate(messages[0]?.content, 10)}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2>Add new Chat</h2>
    </div>
  );
};

export default SidebarChat;
