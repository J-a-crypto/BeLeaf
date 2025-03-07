import { Text, View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DocumentPicker from 'react-native-document-picker';
import * as Speech from 'expo-speech';
import Voice from 'react-native-voice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';  // For reading text files
import axios from 'axios';  // For API requests

let initialSampleText = "I need you to try to read this text and pronounce it very well";

export default function Index() {
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
      await Voice.start('en-US');
    } catch (error) {
      console.error(error);
    }
  };

  const highlightWords = (spokenText) => {
    const spokenWords = spokenText.trim().split(' ');
    const originalWords = sampleText.trim().split(' ');

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
        type: [DocumentPicker.types.plainText],
      });

      const filePath = res.uri;
      const content = await RNFS.readFile(filePath, 'utf8');

      setFileText(content); // Set the file content as the sample text
      setSampleText(content); // Update the sampleText for reading
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User canceled the picker");
      } else {
        throw err;
      }
    }
  };

  const generateStory = async () => {
    try {
      const response = await axios.post('https://api.openai.com/v1/completions', {
        model: 'gpt-4', // You can change this to another model if you prefer
        prompt: "Generate a short story for a child.",
        max_tokens: 200,
        temperature: 0.7,
      }, {
        headers: {
          'Authorization': `API-KEY`, // Replace with your actual OpenAI API key
        },
      });

      const story = response.data.choices[0].text.trim();
      setGeneratedStory(story); // Set the generated story text
      setSampleText(story); // Set the story as the sample text for the user to read
    } catch (error) {
      console.error('Error generating story:', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#f7f9fc',
    },
    center: {
      textAlign: 'center',
      fontSize: 22,
      marginBottom: 20,
      fontFamily: 'Arial',
      color: '#333',
    },
    text: {
      fontSize: 24,
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'center',
      textAlign: 'center',
      marginVertical: 20,
    },
    wordCorrect: {
      color: 'green',
      fontWeight: 'bold',
      fontSize: 28,
      padding: 5,
      backgroundColor: 'lightgreen',
      borderRadius: 5,
      margin: 2,
    },
    wordIncorrect: {
      color: 'red',
      fontWeight: 'bold',
      fontSize: 28,
      padding: 5,
      backgroundColor: '#ffcccb',
      borderRadius: 5,
      margin: 2,
    },
    microphoneIcon: {
      fontSize: 60,
      color: '#ff6f61',
      marginVertical: 20,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginVertical: 10,
      paddingLeft: 10,
      width: '80%',
      fontSize: 18,
      borderRadius: 5,
    },
    congratsText: {
      fontSize: 28,
      color: 'green',
      fontWeight: 'bold',
      marginTop: 20,
    },
    resetButton: {
      backgroundColor: '#ff6f61',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 25,
      marginTop: 20,
    },
    resetButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    fileButton: {
      backgroundColor: '#4CAF50',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 25,
      marginVertical: 20,
    },
    fileButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    storyButton: {
      backgroundColor: '#2196F3',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 25,
      marginVertical: 20,
    },
    storyButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <SafeAreaView>
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

            <TouchableOpacity
              style={styles.fileButton}
              onPress={handleFilePicker}>
              <Text style={styles.fileButtonText}>Upload File</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.storyButton}
              onPress={generateStory}>
              <Text style={styles.storyButtonText}>Generate Story</Text>
            </TouchableOpacity>

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
            <Text style={styles.congratsText}>Congrats! You did it!</Text>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}>
              <Text style={styles.resetButtonText}>Go Back</Text>
            </TouchableOpacity>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}
