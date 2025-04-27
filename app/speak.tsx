import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

const SpeakScreen: React.FC = () => {
  const router = useRouter();
  
  const handleNavigation = () => {
    console.log('Attempting to navigate to speech-text-speech');
    try {
      console.log('Navigation starting...');
      router.push('/(root)/speech-text-speech');
      console.log('Navigation command executed');
    } catch (error: unknown) {
      console.error('Navigation error:', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.cardButton}
          onPress={handleNavigation}
        >
          <Image source={require('./assets/speech.png')} style={styles.cardImage} />
          <Text style={styles.cardLabel}>Speech-text-speech</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cardButton}>
          <Image source={require('./assets/reading.png')} style={styles.cardImage} />
          <Text style={styles.cardLabel}>Reading</Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  cardButton: {
    backgroundColor: '#f8f6ff',
    borderRadius: 16,
    alignItems: 'center',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 220,
  },
  cardImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5e17eb',
    textAlign: 'center',
  },
});

export default SpeakScreen; 