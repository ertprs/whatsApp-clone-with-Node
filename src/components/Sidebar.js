import { Avatar, IconButton } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import React, { useState, useEffect } from "react";
import "./Sidebar.scss";
import SidebarChat from "./SidebarChat";
import db from "../firebase";
import {useStateValue} from '../contextAPI/StateProvider'


const Sidebar = () => {
  const [rooms, setRooms] = useState([]);
  const [{user}] = useStateValue()

  useEffect(() => {
   const unsubscribe = db.collection("whatsappRoom").onSnapshot((snapshot) => {
      setRooms(
        snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
    return () => {
      unsubscribe()
    }
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL}/>
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search or start new chat" />
        </div>
      </div>
      <div className="sidebar__chats">
        <SidebarChat addNewChat />
        {rooms?.map(({ id, name }) => (
          <SidebarChat key={id} name={name} roomId={id}/>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
