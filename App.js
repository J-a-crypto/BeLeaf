import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import EmotionDetector from './EmotionDetector';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <EmotionDetector />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
}); 