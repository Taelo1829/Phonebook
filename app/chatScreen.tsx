import React, { useState } from "react";
import { View, Text } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

const ChatScreen = () => {
  let messageType: any[] = [];
  const [messages, setMessages] = useState(messageType);

  function onSend(messages: any = []) {}
  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      // user={{
      //   _id: firebase.auth().currentUser.uid,
      //   name: firebase.auth().currentUser.email,
      // }}
    />
  );
};

export default ChatScreen;
