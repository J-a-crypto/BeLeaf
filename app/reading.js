import { ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DocumentPicker from 'react-native-document-picker';
import * as Speech from 'expo-speech';
import Voice from 'react-native-voice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';
import axios from 'axios';

let initialSampleText = "I need you to try to read this text and pronounce it very well";
let API_KEY = "API-KEY";

export default function ReadingFunction() {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [highlightedText, setHighlightedText] = useState([]);
  const [sampleText, setSampleText] = useState(initialSampleText);
  const [userInputText, setUserInputText] = useState('');
  const [isCongratulated, setIsCongratulated] = useState(false);
  const [fileText, setFileText] = useState(''); // To store text from the file
  const [generatedStory, setGeneratedStory] = useState(''); // To store generated story

  useEffect(() => {
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => {
      setIsListening(false);
      setRecognizedText('');
      setIsCongratulated(true);
    };
    Voice.onSpeechResults = (event) => {
      setRecognizedText(event.value[0]);
      highlightWords(event.value[0]);

      if (event.value[0].trim().toLowerCase() === sampleText.trim().toLowerCase()) {
        setIsCongratulated(true);
      }
    };
    Voice.onSpeechError = (error) => console.log('error', error);

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [sampleText]);

  const startListening = async () => {
    try {
      console.log('Starting voice recognition...');
      await Voice.start('en-US');
    } catch (error) {
      console.error(error);
    }
  };

  const highlightWords = (spokenText) => {
    // Remove punctuation from both spokenText and sampleText
    const cleanSpokenText = spokenText.trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
    const cleanSampleText = sampleText.trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");

    const spokenWords = cleanSpokenText.split(' ');
    const originalWords = cleanSampleText.split(' ');

    const highlighted = originalWords.map((word, index) => {
      const spokenWord = spokenWords[index] || '';
      return {
        word: word,
        isCorrect: word.toLowerCase() === spokenWord.toLowerCase(),
      };
    });

    setHighlightedText(highlighted);
  };


  const handleTextSubmit = () => {
    setSampleText(userInputText);
    setUserInputText('');
    setHighlightedText([]);
    setRecognizedText('');
    setIsCongratulated(false);
  };

  const handleReset = () => {
    setIsCongratulated(false);
    setRecognizedText('');
    setHighlightedText([]);
    setUserInputText('');
    setSampleText(initialSampleText);
  };

  const handleFilePicker = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // Allow any file type
      });

      const filePath = res[0]['uri'];
      const fileType = res[0]['type'];

      if (!filePath) {
        throw new Error("Invalid file path");
      }

      console.log('File selected: ', res);

      // On iOS, the URI might need to be fixed or converted for use with RNFS
      let formattedPath = filePath;
      if (formattedPath.startsWith('file://')) {
        formattedPath = formattedPath.substring(7); // Strip 'file://' prefix
      }

      // Handle different types of files
      if (fileType === 'text/plain') {
        // Read text files
        const content = await RNFS.readFile(formattedPath, 'utf8');
        setFileText(content);  // Set the file content
        setSampleText(content); // Use as sample text
      } else {
        // Handle other types of files (images, audio, video, etc.)
        console.log(`File of type ${fileType} selected. Handle appropriately.`);
        // You can display or process the file differently based on its type
      }

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User canceled the picker");
      } else {
        console.error("Error picking the file:", err);
      }
    }
  };





  const generateStory = async () => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant.',
            },
            {
              role: 'user',
              content: userInputText,
            },
          ],
          max_tokens: 200,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`, // Replace with your actual OpenAI API key
            'Content-Type': 'application/json',
          },
        }
      );

      const story = response.data.choices[0].message.content.trim(); // Adjusted for the chat model's response structure
      setGeneratedStory(story); // Set the generated story text
      setSampleText(story); // Set the story as the sample text for the user to read
    } catch (error) {
      console.error('Error generating story:', error.response ? error.response.data : error.message);
    }
  };


  const styles = StyleSheet.create({
    input: {
      height: 50,
      width: '75%',
      borderColor: 'black',
      borderStyle: 'solid',
      borderWidth: 1,
      borderEndStartRadius: 15,
      borderStartStartRadius: 15,
      paddingHorizontal: 10,
      marginVertical: 10,
      fontSize: 18,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#FFFCF9', // Light pastel background
    },
    center: {
      textAlign: 'center',
      fontSize: 30,
      fontFamily: 'Poppins', // Fun, rounded font
      fontWeight: 'bold',
      color: '#FF6F61', // Bright Coral color
      marginBottom: 20,
    },
    inputContainer: {
      width: '100%', // Make sure the container takes full width
      marginBottom: 20, // Some space at the bottom
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row', // Align items in a row
      backgroundColor: 'fff', // Light background for input area
    },
    text: {
      fontSize: 22,
      color: '#333',
      textAlign: 'center',
      marginVertical: 10,
    },
    wordCorrect: {
      color: '#4CAF50',
      fontWeight: 'bold',
      fontSize: 28,
      padding: 10,
      backgroundColor: '#A8E6A1', // Light green
      borderRadius: 10,
      margin: 5,
    },
    wordIncorrect: {
      color: '#FF5733',
      fontWeight: 'bold',
      fontSize: 28,
      padding: 10,
      backgroundColor: '#FFCCCB', // Light red background
      borderRadius: 10,
      margin: 5,
    },
    microphoneIcon: {
      fontSize: 350,
      color: '#FF6F61',
      marginVertical: 30,
    },
    button: {
      backgroundColor: '#FFABAB',
      borderRadius: 150,
      paddingVertical: 15,
      paddingHorizontal: 40,
      marginVertical: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 6, // For Android
    },
    buttonText: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    resetButton: {
      backgroundColor: '#FF5733',
      borderRadius: 50,
      paddingVertical: 15,
      paddingHorizontal: 40,
      marginTop: 20,
    },
    resetButtonText: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
    },
    fileButton: {
      backgroundColor: '#FFB3B3',
      paddingVertical: 9,
      borderColor: 'black',
      borderStyle: 'solid',
      borderWidth: 1,
      paddingHorizontal: 5,
    },
    fileButtonText: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
    },
    storyButton: {
      backgroundColor: '#FF9CFF', // Purple button
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 0,
      paddingVertical: 9,
      paddingHorizontal: 5,
      borderStartEndRadius: 15,
      borderEndEndRadius: 15,
    },
    congratsText: {
      fontSize: 32,
      color: '#4CAF50',
      fontWeight: 'bold',
      marginTop: 20,
      textAlign: 'center',
    },
  });



  return (
    <ScrollView>
      <View style={styles.container}>
        {!isCongratulated ? (
          <>
            <Text style={styles.center}>
              {isListening ? 'Listening...' : 'Tap the microphone to start'}
            </Text>

            <TouchableOpacity
              onPress={() => {
                if (isListening) {
                  Voice.stop();  // Automatically stop listening when tapped again
                } else {
                  startListening(); // Start listening when tapped
                }
              }}>
              <Icon
                name={isListening ? 'mic-off' : 'mic'}
                style={styles.microphoneIcon}
              />
            </TouchableOpacity>

            {/* Input and Buttons Container */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter text here"
                value={userInputText}
                onChangeText={setUserInputText}
              />

              <TouchableOpacity
                style={styles.fileButton}
                onPress={handleFilePicker}>
                <Icon name="attach-file" size={30} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.storyButton}
                onPress={generateStory}>
                <Icon name="send" size={30} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.center}>Read the following text:</Text>
            <Text style={styles.text}>
              {sampleText.split(' ').map((word, index) => {
                const highlighted = highlightedText[index];
                if (highlighted) {
                  return (
                    <Text
                      key={index}
                      style={highlighted.isCorrect ? styles.wordCorrect : styles.wordIncorrect}
                    >
                      {word}{" "}
                    </Text>
                  );
                } else {
                  return <Text key={index}>{word} </Text>;
                }
              })}
            </Text>

            <Text style={styles.center}>Recognized Text: {recognizedText}</Text>
          </>
        ) : (
          <>
            <Text style={styles.congratsText}>Congraduations! You Did It!</Text>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}>
              <Text style={styles.resetButtonText}>Go Back</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}
// npm install react-native-document-picker react-native-voice expo-speech axios react-native-fs
