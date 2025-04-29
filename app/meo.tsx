import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, FlatList, SafeAreaView, Alert, Image } from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Get a proper Gemini API key from https://makersuite.google.com/app/apikey
const API_KEY = 'AIzaSyAIyiX5B9LBmnr3ZrCWkhTF3v_zAl9swxw'; // Replace this with your actual Gemini API key
const genAI = new GoogleGenerativeAI(API_KEY);

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
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

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
      <View style={{ 
        alignItems: 'center', 
        padding: 20,
        backgroundColor: '#7c4dff',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}>
        <Text style={{ 
          fontSize: 32, 
          fontWeight: 'bold', 
          color: 'white',
          marginTop: 10,
          textShadowColor: 'rgba(0, 0, 0, 0.2)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 2,
        }}>
          🐱 MeowAI
        </Text>
      </View>

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
        <TextInput
          style={{
            borderWidth: 2,
            borderColor: '#b388ff',
            borderRadius: 20,
            padding: 12,
            marginBottom: 10,
            backgroundColor: '#fff',
            fontSize: 16,
            maxHeight: 100,
            fontFamily: 'System',
          }}
          placeholder="Ask me anything... 😊"
          placeholderTextColor="#9e9e9e"
          value={input}
          onChangeText={setInput}
          multiline
        />
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