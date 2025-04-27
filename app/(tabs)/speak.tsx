import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SpeakScreen: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: 'Speak',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#fff' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 16, padding: 8 }}>
              <Ionicons name="arrow-back" size={24} color="#5e17eb" />
            </TouchableOpacity>
          ),
          headerShown: true,
        }}
      />
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.cardButton}
          onPress={() => router.push('../../speech-text-speech')}
        >
          <Image source={require('../assets/speech.png')} style={styles.cardImage} resizeMode="contain" />
          <Text style={styles.cardLabel}>Speech-text-speech</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cardButton}>
          <Image source={require('../assets/reading.png')} style={styles.cardImage} resizeMode="contain" />
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
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 200,
    height: 220,
    justifyContent: 'flex-end',
  },
  cardImage: {
    width: 140,
    height: 140,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5e17eb',
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default SpeakScreen; 