import React, { useCallback, useEffect, useState } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { firebase } from "../firebaseConfig";
import { userType } from "@/types";
import { View, StyleSheet } from "react-native";

function renderBubble(props: any) {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#0084ff",
        },
        left: {
          backgroundColor: "#00674F",
        },
      }}
      textStyle={{
        right: {
          color: "#fff",
        },
        left: {
          color: "#fff",
        },
      }}
    />
  );
}

const ChatScreen = () => {
  let messageType: any[] = [];
  const [messages, setMessages] = useState(messageType);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("chats")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({
            _id: doc.id,
            text: doc.data().text,
            createdAt: doc.data().createdAt.toDate(),
            user: doc.data().user,
          }))
        );
      });
    return () => unsubscribe();
  }, []);

  const onSend = useCallback((messages: any = []) => {
    const { _id, createdAt, text, user } = messages[0];
    firebase.firestore().collection("chats").add({
      _id,
      createdAt,
      text,
      user,
    });
  }, []);
  let user: userType = {
    _id: firebase?.auth()?.currentUser?.uid,
    name: firebase?.auth()?.currentUser?.email,
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={user}
      />
    </View>
  );
};

let styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#fff",
  },
});

export default ChatScreen;
