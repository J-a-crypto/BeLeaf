import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, FlatList, SafeAreaView, Alert, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { signInAnonymously } from 'firebase/auth';
import { auth } from './configuration';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';

// Get a proper Gemini API key from https://makersuite.google.com/app/apikey
const API_KEY = 'AIzaSyAIyiX5B9LBmnr3ZrCWkhTF3v_zAl9swxw';
const genAI = new GoogleGenerativeAI(API_KEY);

// // Add validation
// if (!API_KEY || API_KEY === 'AIzaSyAIyiX5B9LBmnr3ZrCWkhTF3v_zAl9swxw') {
//   console.error('Invalid or missing Gemini API key');
//   Alert.alert('Error', 'Please set a valid Gemini API key');
// }

const convertSpeechToText = async ({ audioContent }: { audioContent: string }) => {
  try {
    const response = await fetch('https://us-central1-beleaf-4a5c8.cloudfunctions.net/convertSpeechToText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ audioContent }),
    });

    if (!response.ok) {
      throw new Error('Failed to convert speech to text');
    }

    return await response.json();
  } catch (error) {
    console.error('Error converting speech to text:', error);
    throw error;
  }
};

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function Index() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [recording, setRecording] = useState<Audio.Recording | undefined>();
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      console.log('Recording started successfully');
    } catch (err) {
      console.error('Failed to start recording:', err);
      Alert.alert('Error', 'Failed to start recording. Please check your connection and try again.');
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) {
        console.log('No recording found to stop');
        return;
      }

      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }

      console.log('Stopping recording...');
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(undefined);

      if (uri) {
        console.log('Processing audio file...');
        const audioData = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const result = await convertSpeechToText({ audioContent: audioData });
        const { transcription } = result.data as { transcription: string };
        setInput(transcription);
      }
    } catch (err) {
      console.error('Failed to stop recording:', err);
      Alert.alert('Error', 'Failed to convert speech to text. Please try again.');
    }
  };

  const fetchGeminiResponse = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    const userMessage = input;
    setInput('');

    const newUserMessage = {
      role: 'user' as const,
      content: userMessage,
      timestamp: Date.now()
    };
    
    setChatHistory(prev => [...prev, newUserMessage]);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(userMessage);
      const response = await result.response;
      
      setChatHistory(prev => [...prev, { 
        role: 'assistant' as const, 
        content: response.text(),
        timestamp: Date.now()
      }]);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Oops!', 'Something went wrong. Let\'s try again!');
      setChatHistory(prev => [...prev, { 
        role: 'assistant' as const, 
        content: 'Sorry, I\'m having trouble thinking right now. Can you try again?',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderChatMessage = ({ item }: { item: ChatMessage }) => (
    <View style={{ 
      alignSelf: item.role === 'user' ? 'flex-end' : 'flex-start',
      backgroundColor: item.role === 'user' ? '#7c4dff' : '#e6dcff',
      padding: 12,
      borderRadius: 15,
      maxWidth: '80%',
      marginVertical: 5,
      borderWidth: 2,
      borderColor: item.role === 'user' ? '#6200ee' : '#b388ff',
    }}>
      <Text style={{ 
        color: item.role === 'user' ? 'white' : '#4a148c',
        fontSize: 16,
        fontFamily: 'System',
      }}>
        {item.content}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f0ff' }}>
      <Stack.Screen
        options={{
          title: "MeowAI",
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

      <FlatList
        data={chatHistory}
        renderItem={renderChatMessage}
        keyExtractor={(item) => item.timestamp.toString()}
        style={{ flex: 1, padding: 15 }}
        inverted={false}
      />

      <View style={{ 
        padding: 15, 
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
      }}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything... 😊"
            placeholderTextColor="#9e9e9e"
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity
            style={[styles.recordButton, isRecording && styles.recordingButton]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Ionicons
              name={isRecording ? "stop" : "mic"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        <Button 
          title={isLoading ? "🤔 Thinking..." : "✨ Send"} 
          onPress={fetchGeminiResponse}
          color="#7c4dff"
          disabled={isLoading || !input.trim()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    padding: 10,
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#b388ff',
    borderRadius: 20,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    maxHeight: 100,
    fontFamily: 'System',
    marginRight: 10,
  },
  recordButton: {
    backgroundColor: '#7c4dff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: '#e74c3c',
  },
});