import { ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from '@expo/vector-icons/MaterialIcons';

let initialSampleText = "I need you to try to read this text and pronounce it very well";

export default function ReadingFunction() {
  const [sampleText, setSampleText] = useState(initialSampleText);
  const [userInputText, setUserInputText] = useState('');
  const [isCongratulated, setIsCongratulated] = useState(false);

  const handleTextSubmit = () => {
    setSampleText(userInputText);
    setUserInputText('');
    setIsCongratulated(false);
  };

  const handleReset = () => {
    setIsCongratulated(false);
    setUserInputText('');
    setSampleText(initialSampleText);
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
      backgroundColor: '#FFFCF9',
    },
    center: {
      textAlign: 'center',
      fontSize: 30,
      fontFamily: 'Poppins',
      fontWeight: 'bold',
      color: '#FF6F61',
      marginBottom: 20,
    },
    inputContainer: {
      width: '100%',
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      backgroundColor: 'fff',
    },
    text: {
      fontSize: 22,
      color: '#333',
      textAlign: 'center',
      marginVertical: 10,
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
      elevation: 6,
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
            <Text style={styles.center}>Read the following text:</Text>
            <Text style={styles.text}>{sampleText}</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter text here"
                value={userInputText}
                onChangeText={setUserInputText}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleTextSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.congratsText}>Congratulations! You Did It!</Text>
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
