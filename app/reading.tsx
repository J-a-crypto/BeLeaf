import { ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { Stack, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { functions } from './firebase';
import { httpsCallable } from 'firebase/functions';
import { auth } from './configuration';
import { signInAnonymously } from 'firebase/auth';

// Define word highlighting interface
interface HighlightedWord {
  word: string;
  isHighlighted: boolean;
  isCorrect?: boolean;
}

// Define sample text for the initial reading
const initialSampleText = "I need you to try to read this text and pronounce it very well";

const convertSpeechToText = httpsCallable(functions, 'convertSpeechToText');

export default function ReadingPage() {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
  const [sampleText, setSampleText] = useState(initialSampleText);
  const [userInputText, setUserInputText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [highlighted, setHighlighted] = useState<HighlightedWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [fileText, setFileText] = useState('');
  const [generatedStory, setGeneratedStory] = useState('');
  const [readingSpeed, setReadingSpeed] = useState(0.8); // Default reading speed (0.8 = 80% of normal)
  const [userTranscription, setUserTranscription] = useState('');
  const [evaluationResults, setEvaluationResults] = useState<{ word: string, isCorrect: boolean }[]>([]);

  // Function to speak the text using Expo Speech
  const speakText = async () => {
    try {
      if (isSpeaking) {
        await Speech.stop();
        setIsSpeaking(false);
        setCurrentWordIndex(-1);
        return;
      }

      setIsSpeaking(true);
      setFeedback('Listening to demonstration...');

      // Get available voices (for iOS and Android)
      const voices = await Speech.getAvailableVoicesAsync();

      // Find a voice that matches the device language or use default
      let selectedVoice = voices.find(voice =>
        voice.language === 'en-US' && voice.quality === Speech.VoiceQuality.Enhanced
      );

      // Set up simulated word highlighting
      prepareHighlighting();

      // Speak the text with callbacks
      Speech.speak(sampleText, {
        voice: selectedVoice?.identifier,
        rate: readingSpeed,
        pitch: 1.0,
        onStart: () => {
          console.log("Started speaking");
          startWordHighlighting();
        },
        onDone: () => {
          console.log("Done speaking");
          setIsSpeaking(false);
          setFeedback("Try reading along with the next demonstration or practice on your own.");
          setCurrentWordIndex(-1);
        },
        onStopped: () => {
          console.log("Stopped speaking");
          setIsSpeaking(false);
          setCurrentWordIndex(-1);
        },
        onError: (error) => {
          console.log("Error speaking:", error);
          setIsSpeaking(false);
          setCurrentWordIndex(-1);
        }
      });
    } catch (error) {
      console.error("Error speaking:", error);
      setIsSpeaking(false);
      setCurrentWordIndex(-1);
    }
  };

  // Function to prepare the word highlighting
  const prepareHighlighting = () => {
    const words = sampleText.split(' ');
    const initialHighlighted: HighlightedWord[] = words.map(word => ({
      word,
      isHighlighted: false,
    }));

    setHighlighted(initialHighlighted);
    setCurrentWordIndex(-1);
  };

  // Function to simulate word highlighting during speech
  const startWordHighlighting = () => {
    const words = sampleText.split(' ');

    // Calculate average word duration based on speech rate
    // Average adult reading speed is about 150-200 words per minute
    // We'll use 175 words per minute as our baseline
    const wordsPerMinute = 175 * readingSpeed;
    const millisecondsPerWord = 60000 / wordsPerMinute;

    // Highlight words one by one with timing based on speech rate
    words.forEach((word, index) => {
      setTimeout(() => {
        if (!isSpeaking) return; // Stop if speech was interrupted

        setCurrentWordIndex(index);

        const newHighlighted = [...highlighted];

        // Reset previous words
        if (index > 0) {
          newHighlighted[index - 1] = {
            ...newHighlighted[index - 1],
            isHighlighted: false
          };
        }

        // Highlight current word
        newHighlighted[index] = {
          ...newHighlighted[index],
          isHighlighted: true
        };

        setHighlighted(newHighlighted);
      }, index * millisecondsPerWord);
    });
  };

  // Function to start recording user's speech
  const startRecording = async () => {
    try {
      // Ensure user is authenticated
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }

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
      setFeedback('Recording... Speak the text on screen');
      console.log('Recording started successfully');
    } catch (err) {
      console.error('Failed to start recording:', err);
      alert('Failed to start recording. Please check your connection and try again.');
    }
  };

  // Function to stop recording and evaluate pronunciation
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
      setFeedback('Processing your speech...');
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
        console.log('Sending audio to Firebase Function...');

        const result = await convertSpeechToText({ audioContent: audioData });
        console.log('Received response from Firebase Function:', result);

        const { transcription } = result.data as { transcription: string };
        setUserTranscription(transcription);
        console.log('Transcription completed:', transcription);

        // Evaluate the transcription against the expected text
        evaluatePronunciation(transcription);
      } else {
        console.log('No URI found for the recording');
        setFeedback('Failed to process recording. Please try again.');
      }
    } catch (err) {
      console.error('Failed to stop recording:', err);
      alert('Failed to convert speech to text. Please try again.');
      setFeedback('Error processing your speech. Please try again.');
    }
  };

  // Function to evaluate pronunciation
  const evaluatePronunciation = (transcription: string) => {
    if (!transcription) {
      setFeedback('No speech detected. Please try again.');
      return;
    }

    // Convert both texts to lowercase for case-insensitive comparison
    const expectedWords = sampleText.toLowerCase().split(/\s+/);
    const spokenWords = transcription.toLowerCase().split(/\s+/);

    // Create a map of expected words for faster lookup
    const expectedWordMap = new Map<string, number>();
    expectedWords.forEach(word => {
      expectedWordMap.set(word, (expectedWordMap.get(word) || 0) + 1);
    });

    // Create a map of spoken words
    const spokenWordMap = new Map<string, number>();
    spokenWords.forEach(word => {
      spokenWordMap.set(word, (spokenWordMap.get(word) || 0) + 1);
    });

    // Evaluate each expected word
    const results: { word: string, isCorrect: boolean }[] = [];
    expectedWords.forEach(word => {
      const isCorrect = spokenWordMap.has(word) && spokenWordMap.get(word)! > 0;
      results.push({ word, isCorrect });

      // Decrement the count if the word was found
      if (isCorrect) {
        spokenWordMap.set(word, spokenWordMap.get(word)! - 1);
      }
    });

    setEvaluationResults(results);

    // Calculate accuracy percentage
    const correctWords = results.filter(r => r.isCorrect).length;
    const accuracyPercentage = Math.round((correctWords / expectedWords.length) * 100);

    // Update feedback based on accuracy
    if (accuracyPercentage >= 90) {
      setFeedback(`Excellent! You got ${accuracyPercentage}% of the words correct.`);
    } else if (accuracyPercentage >= 70) {
      setFeedback(`Good job! You got ${accuracyPercentage}% of the words correct.`);
    } else if (accuracyPercentage >= 50) {
      setFeedback(`Keep practicing! You got ${accuracyPercentage}% of the words correct.`);
    } else {
      setFeedback(`Try again. You got ${accuracyPercentage}% of the words correct.`);
    }

    // Update highlighted words with evaluation results
    const newHighlighted = highlighted.map((item, index) => ({
      ...item,
      isHighlighted: true,
      isCorrect: results[index]?.isCorrect
    }));

    setHighlighted(newHighlighted);
  };

  const handleSpeedChange = () => {
    // Toggle between different speeds
    const speeds = [0.5, 0.8, 1.0, 1.2];
    const currentIndex = speeds.indexOf(readingSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setReadingSpeed(speeds[nextIndex]);

    // Show feedback about speed change
    const speedLabels = ["Slow", "Medium", "Normal", "Fast"];
    setFeedback(`Reading speed set to: ${speedLabels[nextIndex]}`);
  };

  const handleTextSubmit = () => {
    if (userInputText.trim()) {
      setSampleText(userInputText);
      setUserInputText('');
      setHighlighted([]);
      setEvaluationResults([]);
      setUserTranscription('');
      setFeedback('New text ready for reading practice');
    } else {
      setFeedback('Please enter some text first');
    }
  };

  const handleReset = () => {
    setSampleText(initialSampleText);
    setUserInputText('');
    setHighlighted([]);
    setEvaluationResults([]);
    setUserTranscription('');
    setFeedback('');
    setCurrentWordIndex(-1);
  };

  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/*',
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const filePath = result.assets[0].uri;

        // Read the file content
        const content = await FileSystem.readAsStringAsync(filePath);
        setFileText(content);
        setSampleText(content);
        setHighlighted([]);
        setEvaluationResults([]);
        setUserTranscription('');
        setFeedback('File loaded successfully. Tap the speaker to hear it read aloud.');
      }
    } catch (err) {
      console.error("Error picking the file:", err);
      setFeedback('Error loading file. Please try again.');
    }
  };

  const generateStory = async () => {
    if (!userInputText) {
      setFeedback('Please enter a topic or prompt for the story');
      return;
    }

    try {
      setFeedback("Generating a story for you...");

      // For demo purposes, we'll generate a simple story without an API call
      const demoStory = `Once upon a time, there was a ${userInputText}. 
        It was a beautiful day, and the ${userInputText} was very happy. 
        The ${userInputText} went on an amazing adventure and learned 
        many interesting things along the way.`;

      setGeneratedStory(demoStory);
      setSampleText(demoStory);
      setHighlighted([]);
      setEvaluationResults([]);
      setUserTranscription('');
      setFeedback('Story generated! Tap the speaker to hear it read aloud.');
    } catch (error) {
      console.error('Error generating story:', error);
      setFeedback("Sorry, I couldn't generate a story. Please try again.");
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Reading Practice",
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#FFFCF9' },
          headerTintColor: '#FF6F61',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#FF6F61" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={{ backgroundColor: '#FFFCF9' }}>
        <View style={styles.container}>
          <View style={styles.topControls}>
            <TouchableOpacity
              style={styles.speakerButton}
              onPress={speakText}>
              <MaterialIcons
                name={isSpeaking ? 'volume-off' : 'volume-up'}
                style={styles.speakerIcon}
              />
              <Text style={styles.buttonLabel}>{isSpeaking ? 'Stop' : 'Listen'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.speedButton}
              onPress={handleSpeedChange}>
              <FontAwesome5
                name="tachometer-alt"
                style={styles.speedIcon}
              />
              <Text style={styles.buttonLabel}>
                {readingSpeed === 0.5 ? 'Slow' :
                  readingSpeed === 0.8 ? 'Medium' :
                    readingSpeed === 1.0 ? 'Normal' : 'Fast'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.statusText}>
            {isSpeaking ? 'Listening to demonstration...' :
              isRecording ? 'Recording... Speak the text' :
                feedback || 'Tap Listen to start'}
          </Text>

          {/* Input and Buttons Container */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter text here"
              value={userInputText}
              onChangeText={setUserInputText}
              multiline
            />

            <TouchableOpacity
              style={styles.fileButton}
              onPress={handleFilePicker}>
              <MaterialIcons name="attach-file" size={30} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.storyButton}
              onPress={generateStory}>
              <MaterialIcons name="auto-stories" size={30} color="#fff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleTextSubmit}>
            <Text style={styles.submitButtonText}>Use this text</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Reading Text:</Text>
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              {sampleText.split(' ').map((word, index) => {
                const isCurrentWord = index === currentWordIndex;
                const isCorrect = highlighted[index]?.isCorrect;

                return (
                  <Text
                    key={index}
                    style={[
                      isCurrentWord ? styles.highlightedWord : styles.normalWord,
                      isCorrect !== undefined && !isCurrentWord ?
                        (isCorrect ? styles.correctWord : styles.incorrectWord) : {}
                    ]}
                  >
                    {word}{" "}
                  </Text>
                );
              })}
            </Text>
          </View>

          {/* User's transcription display */}
          {userTranscription ? (
            <View style={styles.transcriptionContainer}>
              <Text style={styles.transcriptionTitle}>Your speech:</Text>
              <Text style={styles.transcriptionText}>{userTranscription}</Text>
            </View>
          ) : null}

          {/* Record button for pronunciation practice */}
          <TouchableOpacity
            style={[styles.recordButton, isRecording && styles.recordingButton]}
            onPress={isRecording ? stopRecording : startRecording}>
            <MaterialIcons
              name={isRecording ? "stop" : "mic"}
              size={32}
              color="#fff"
            />
            <Text style={styles.recordButtonText}>
              {isRecording ? "Stop Recording" : "Practice Reading"}
            </Text>
          </TouchableOpacity>

          {feedback ? (
            <Text style={styles.feedbackText}>{feedback}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>

          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>How to use:</Text>
            <Text style={styles.instructionsText}>1. Enter text or load a file</Text>
            <Text style={styles.instructionsText}>2. Tap "Listen" to hear proper pronunciation</Text>
            <Text style={styles.instructionsText}>3. Adjust speed for comfortable learning</Text>
            <Text style={styles.instructionsText}>4. Tap "Practice Reading" to record your pronunciation</Text>
            <Text style={styles.instructionsText}>5. Words will be highlighted green (correct) or red (incorrect)</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 10,
  },
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
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  speakerButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF6F61',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  speedButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#5e17eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  speakerIcon: {
    fontSize: 40,
    color: '#FFFFFF',
  },
  speedIcon: {
    fontSize: 30,
    color: '#FFFFFF',
  },
  buttonLabel: {
    color: '#FFFFFF',
    marginTop: 5,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%', // Make sure the container takes full width
    marginBottom: 10, // Some space at the bottom
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row', // Align items in a row
    backgroundColor: '#FFFCF9', // Light background for input area
  },
  textContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    lineHeight: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5e17eb',
    marginTop: 20,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  highlightedWord: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
    backgroundColor: '#5e17eb', // Purple for highlighted word
    borderRadius: 5,
    padding: 3,
    margin: 1,
  },
  normalWord: {
    color: '#333',
    fontSize: 20,
  },
  correctWord: {
    color: '#FFFFFF',
    backgroundColor: '#4CAF50', // Green for correct words
    borderRadius: 5,
    padding: 3,
    margin: 1,
  },
  incorrectWord: {
    color: '#FFFFFF',
    backgroundColor: '#F44336', // Red for incorrect words
    borderRadius: 5,
    padding: 3,
    margin: 1,
  },
  submitButton: {
    backgroundColor: '#7a42f4',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#FF5733',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
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
  feedbackText: {
    fontSize: 18,
    color: '#7a42f4',
    textAlign: 'center',
    marginTop: 15,
    fontStyle: 'italic',
  },
  instructionsContainer: {
    backgroundColor: '#f0e6ff',
    padding: 20,
    borderRadius: 10,
    marginTop: 30,
    width: '100%',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5e17eb',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    lineHeight: 24,
  },
  recordButton: {
    backgroundColor: '#5e17eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  recordingButton: {
    backgroundColor: '#ff4444',
  },
  recordButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  transcriptionContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginVertical: 10,
  },
  transcriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  transcriptionText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
}); 