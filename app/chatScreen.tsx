import React, { useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { firebase } from "../firebaseConfig";
import { userType } from "@/types";

const ChatScreen = () => {
  let messageType: any[] = [];
  const [messages, setMessages] = useState(messageType);

  function onSend(messages: any = []) {
    console.log(messages);
  }
  let user: userType = {
    _id: firebase?.auth()?.currentUser?.uid,
    name: firebase?.auth()?.currentUser?.email,
  };
  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={user}
    />
  );
};

export default ChatScreen;
