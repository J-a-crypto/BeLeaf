import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import EmotionDetector from './EmotionDetector';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <EmotionDetector />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
}); 