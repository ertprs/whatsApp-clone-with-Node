import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./SidebarChat.scss";
import db from '../firebase'
import {Link} from 'react-router-dom'

const SidebarChat = ({ addNewChat, name, roomId }) => {
  const [seed, setSeed] = useState("");
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const createChat = () => {
    const roomName = prompt("Please enter name for Chat");
      if (roomName) {
          db.collection('whatsappRoom').add({
            name:roomName
        }).catch(err => console.log(err))
    }
  };
  return !addNewChat ? (
    <Link to ={`/rooms/${roomId}`}>
    <div className="sidebarChat">
      <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
      <div className="sidebarChat__info">
        <h2>{name}</h2>
        <p>last message...</p>
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
