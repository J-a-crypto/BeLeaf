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
import * as Speech from 'expo-speech';

// Get a proper Gemini API key from https://makersuite.google.com/app/apikey
const API_KEY = 'AIzaSyAIyiX5B9LBmnr3ZrCWkhTF3v_zAl9swxw';
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `You are MeowAI, a friendly and helpful AI assistant designed for children and parents. 
Your responses should be:
1. Kid-friendly and easy to understand
2. Encouraging and positive
3. Educational when appropriate
4. Safe and appropriate for all ages
5. Fun and engaging with occasional cat-themed expressions (like "meow" or "purr-fect")
6. Helpful for both children and parents
7. Clear and concise
8. Supportive and empathetic

Remember to:
- Use simple language
- Be patient and understanding
- Include positive reinforcement
- Make learning fun
- Stay in character as a friendly cat AI`;

// // Add validation
// if (!API_KEY || API_KEY === 'AIzaSyAIyiX5B9LBmnr3ZrCWkhTF3v_zAl9swxw') {
//   console.error('Invalid or missing Gemini API key');
//   Alert.alert('Error', 'Please set a valid Gemini API key');
// }

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
  const [isSpeaking, setIsSpeaking] = useState(false);

  const startRecording = React.useCallback(async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        web: {
          mimeType: 'audio/mp4',
          bitsPerSecond: 128000,
        },
      });
      
      setRecording(recording);
      setIsRecording(true);
      console.log('Recording started successfully');
    } catch (err) {
      console.error('Failed to start recording:', err);
      Alert.alert('Error', 'Failed to start recording. Please check your connection and try again.');
    }
  }, []);

  const stopRecording = React.useCallback(async () => {
    try {
      if (!recording) {
        console.log('No recording found to stop');
        return;
      }

      console.log('Stopping recording...');
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(undefined);

      if (uri) {
        // Generate a random prompt to get a unique response
        const prompts = [
          "Tell me a fun cat fact!",
          "What's a fun activity we can do today?",
          "Tell me something interesting about nature!",
          "Share a kid-friendly joke!",
          "Give me a fun learning tip!"
        ];
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        
        // Add the user's action to chat history
        const userMessage = {
          role: 'user' as const,
          content: '🎤 *Used voice message*',
          timestamp: Date.now()
        };
        setChatHistory(prev => [...prev, userMessage]);
        
        // Generate AI response using Gemini
        try {
          const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
          const chat = model.startChat({
            history: [
              {
                role: "user",
                parts: [{ text: SYSTEM_PROMPT }],
              },
              {
                role: "model",
                parts: [{ text: "Meow! I understand my role as a friendly and helpful AI assistant. I'll be sure to keep my responses kid-friendly, educational, and fun!" }],
              }
            ],
          });

          const result = await chat.sendMessage(randomPrompt);
          const response = await result.response;
          const responseText = response.text();

          // Add AI response to chat history
          setChatHistory(prev => [...prev, {
            role: 'assistant' as const,
            content: responseText,
            timestamp: Date.now()
          }]);

          // Speak the response
          await Speech.speak(responseText, {
            language: 'en',
            pitch: 1.2,
            rate: 0.9,
          });
        } catch (error) {
          console.error('Error generating response:', error);
          const fallbackResponse = "Meow! I heard you but I'm having trouble thinking of what to say. Could you try again?";
          setChatHistory(prev => [...prev, {
            role: 'assistant' as const,
            content: fallbackResponse,
            timestamp: Date.now()
          }]);
          await Speech.speak(fallbackResponse, {
            language: 'en',
            pitch: 1.2,
            rate: 0.9,
          });
        }
      }
    } catch (err) {
      console.error('Recording error:', err);
      Alert.alert('Error', 'Failed to process your recording. Please try again.');
    }
  }, [recording]);

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
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: SYSTEM_PROMPT }],
          },
          {
            role: "model",
            parts: [{ text: "Meow! I understand my role as a friendly and helpful AI assistant. I'll be sure to keep my responses kid-friendly, educational, and fun! How can I help you today? 😺" }],
          }
        ],
      });

      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      const responseText = response.text();
      
      setChatHistory(prev => [...prev, { 
        role: 'assistant' as const, 
        content: responseText,
        timestamp: Date.now()
      }]);

      // Speak the response
      if (!isSpeaking) {
        setIsSpeaking(true);
        await Speech.speak(responseText, {
          language: 'en',
          pitch: 1.2,
          rate: 0.9,
          onDone: () => setIsSpeaking(false),
        });
      }
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