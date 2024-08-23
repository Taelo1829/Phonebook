import React, { useCallback, useEffect, useState } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { firebase } from "../firebaseConfig";
import { userType } from "@/types";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { HelloWave } from "@/components/HelloWave";

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
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState("");
  const [typingMessage, setTypingMessage] = useState("");
  const [imTyping, setImTyping] = useState(false);
  const [typingId, setTypingId] = useState("");
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
        setLoading(false);
      });

    const unsubscribeTyping = firebase
      .firestore()
      .collection("typing")
      .onSnapshot((snapshot) => {
        let isTypingId = snapshot.docs.filter((item) => item.id !== typingId)[0]
          ?.id;

        if (isTypingId) {
          setIsTyping(isTypingId);
        } else {
          setIsTyping("");
        }
      });

    if (user?.name.includes("sbongile")) {
      setTypingMessage("He is Typing...");
    } else {
      setTypingMessage("Mi Amor is Typing...");
    }

    return () => {
      unsubscribe();
      unsubscribeTyping();
    };
  }, []);

  const sendTypingStatus = async (text: string) => {
    try {
      if (text.length) {
        if (!imTyping) {
          setImTyping(true);
          let doc = await firebase.firestore().collection("typing").add({
            _id: user.name,
          });
          setTypingId(doc.id);
        }
      } else {
        removeTypingStatus();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const removeTypingStatus = async () => {
    if (imTyping) {
      setImTyping(false);
      await firebase.firestore().collection("typing").doc(typingId).delete();
      setTypingId("");
    }
  };

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
  let showTyping = isTyping && isTyping !== typingId;
  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <GiftedChat
          messages={messages}
          renderBubble={renderBubble}
          onSend={(messages) => onSend(messages)}
          onInputTextChanged={sendTypingStatus}
          user={user}
        />
      )}

      {showTyping && (
        <View style={styles.typing}>
          <Text>{typingMessage}</Text>
        </View>
      )}
    </View>
  );
};

let styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#fff",
    position: "relative",
    paddingTop: 25,
  },
  loader: {
    flex: 1,
    textAlignVertical: "center",
    textAlign: "center",
    alignItems: "center",
  },
  typing: {
    position: "absolute",
    top: 0,
  },
});

export default ChatScreen;
