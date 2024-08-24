import React, { useState } from "react";
import { View, Button, Text } from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import { Audio } from "expo-av";
import { firebase } from "../firebaseConfig";
import { userType } from "@/types";

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioRecorder = ({ onRecordComplete }: any) => {
  const [recording, setRecording] = useState<any>(false);
  const [recordingUri, setRecordingUri] = useState("");

  let user: userType = {
    _id: firebase?.auth()?.currentUser?.uid,
    name: firebase?.auth()?.currentUser?.email,
  };

  const startRecording = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        console.error("Permission to access microphone is required!");
        return;
      }
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setRecordingUri(uri);
      let blob = await convertToBase64(uri);
      saveAudioMessage(blob, user);
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };

  const requestPermissions = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    return status === "granted";
  };

  const saveAudioMessage = async (base64Audio: any, user: any) => {
    try {
      firebase
        .firestore()
        .collection("chats")
        .add({
          _id: Math.random() * 10000000000000000000000000,
          createdAt: new Date(),
          text: "",
          audio: base64Audio,
          user,
        });
    } catch (error) {
      console.error("Failed to save audio message:", error);
    }
  };

  const convertToBase64 = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  return (
    <View>
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
    </View>
  );
};

export default AudioRecorder;
