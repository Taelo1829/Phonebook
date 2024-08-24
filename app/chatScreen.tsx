import React, { useCallback, useEffect, useState } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { firebase } from "../firebaseConfig";
import { userType } from "@/types";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { Audio } from "expo-av";
import AudioRecorder from "./AudioRecorder";

function renderBubble(props: any) {
  const { currentMessage } = props;

  const playAudio = async (audioBase64: string) => {
    try {
      const soundObject = new Audio.Sound();
      const uri = `${audioBase64}`;
      await soundObject.loadAsync({ uri });
      await soundObject.playAsync();
    } catch (error) {
      console.error("Error playing audio");
    }
  };

  // Check if the current message has an audio property
  if (currentMessage.audio) {
    return (
      <TouchableOpacity onPress={() => playAudio(currentMessage.audio)}>
        <View style={styles.audioBubble}>
          <Text style={styles.audioText}>Play Voice Note</Text>
        </View>
      </TouchableOpacity>
    );
  }

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

  let user: userType = {
    _id: firebase?.auth()?.currentUser?.uid,
    name: firebase?.auth()?.currentUser?.email,
  };

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("chats")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        let newMessages = snapshot.docs.map((doc) => ({
          _id: doc.id,
          text: doc.data().text,
          audio: doc.data().audio,
          createdAt: doc.data().createdAt.toDate(),
          user: doc.data().user,
        }));
        let shouldPlayNotification =
          newMessages.filter((item) => item.user._id !== user._id).length !==
          messages.filter((item) => item.user._id !== user._id).length;

        if (shouldPlayNotification) {
          playSound();
        }
        setMessages(newMessages);
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

  const handleAudioRecordComplete = (sound: any) => {};
  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sounds/notification.mp3")
    );
    sound.setVolumeAsync(0.1);
    await sound.playAsync();
  };
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
      audio: "",
      text,
      user,
    });
  }, []);

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
      <AudioRecorder onRecordComplete={handleAudioRecordComplete} />
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
  audioBubble: {
    padding: 10,
    backgroundColor: "#0084ff",
    borderRadius: 10,
    maxWidth: 250,
  },
  audioText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ChatScreen;
