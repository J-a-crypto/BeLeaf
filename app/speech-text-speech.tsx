import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import * as FileSystem from 'expo-file-system';
import { functions } from './firebase';
import { httpsCallable } from 'firebase/functions';
import { auth } from './configuration';
import { signInAnonymously } from 'firebase/auth';

const convertSpeechToText = httpsCallable(functions, 'convertSpeechToText');

const SpeechTextSpeechScreen: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
  const router = useRouter();

  const startRecording = async () => {
    try {
      // Ensure user is authenticated
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }

      // Verify Firebase connection
      console.log('Checking Firebase connection...');
      const testFunction = httpsCallable(functions, 'convertSpeechToText');
      console.log('Firebase Functions client initialized successfully');

      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access microphone is required!');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Configure recording for WAV format with LINEAR16 encoding
      const { recording } = await Audio.Recording.createAsync({
        android: {
          extension: '.wav',
          outputFormat: Audio.AndroidOutputFormat.DEFAULT,
          audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.IOSOutputFormat.LINEARPCM,
          audioQuality: Audio.IOSAudioQuality.MAX,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/wav',
          bitsPerSecond: 128000,
        },
      });

      setRecording(recording);
      setIsRecording(true);
      console.log('Recording started successfully');
    } catch (err) {
      console.error('Failed to start recording:', err);
      alert('Failed to start recording. Please check your connection and try again.');
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) {
        console.log('No recording found to stop');
        return;
      }

      // Ensure user is authenticated
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }

      console.log('Stopping recording...');
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(undefined);

      if (uri) {
        console.log('Recording URI:', uri);
        console.log('Processing audio file...');
        const audioData = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        console.log('Audio data length:', audioData.length);
        console.log('First 100 characters of audio data:', audioData.substring(0, 100));
        console.log('Sending audio to Firebase Function...');

        const result = await convertSpeechToText({ audioContent: audioData });
        console.log('Received response from Firebase Function:', result);

        const { transcription } = result.data as { transcription: string };
        setTranscribedText(transcription);
        console.log('Transcription completed:', transcription);
      } else {
        console.log('No URI found for the recording');
      }
    } catch (err) {
      console.error('Failed to stop recording:', err);
      alert('Failed to convert speech to text. Please try again.');
    }
  };

  const playText = async () => {
    if (transcribedText) {
      await Speech.speak(transcribedText, {
        language: 'en',
        pitch: 1.0,
        rate: 1.0,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: "Speech to Text to Speech",
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#fff' },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#7B68EE" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Image
            source={require('./assets/speech.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.transcribedText}>
            {transcribedText || "Your speech will appear here..."}
          </Text>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.recordButton, isRecording && styles.recordingButton]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Ionicons
              name={isRecording ? "stop" : "mic"}
              size={32}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playButton, !transcribedText && styles.disabledButton]}
            disabled={!transcribedText}
            onPress={playText}
          >
            <Ionicons name="play" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 32,
  },
  transcribedText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    backgroundColor: '#f8f6ff',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    minHeight: 100,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  recordButton: {
    backgroundColor: '#5e17eb',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5e17eb',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recordingButton: {
    backgroundColor: '#ff4444',
  },
  playButton: {
    backgroundColor: '#5e17eb',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5e17eb',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  backButton: {
    marginLeft: 16,
    padding: 8,
  },
});

export default SpeechTextSpeechScreen; 