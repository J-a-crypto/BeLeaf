import { Text, View, Button, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Speech from 'expo-speech';
import Voice from 'react-native-voice';
//In order to get this working I need to run it like this: 'npx expo run:ios
export default function Speaking() {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');

  useEffect(() => {
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = (event) => {
      setRecognizedText(event.value[0]);
      // Speech.speak(event.value[0]);
    };
    Voice.onSpeechError = (error) => console.log('error', error);

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.error(error);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error(error);
    }
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    center: {
      textAlign: 'center',
      fontsize: 20,
    }

  });

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text> {isListening ? 'Listening...' : 'Not Listening'}</Text>
        <Button title="Start Listening" onPress={startListening} disabled={isListening} />
        <Button title="Stop Listening" onPress={stopListening} disabled={!isListening} />
        <Text style={styles.center}> Recognized Text: {recognizedText} </Text>
      </SafeAreaView>
    </View>
  );


}