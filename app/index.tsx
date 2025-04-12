import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

const App = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Login Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.loginText}>Log iiiiin</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.hero}>
        <Text style={styles.title}>Empowering Every Step</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/login?role=parent')}
          >
            <Text style={styles.buttonText}>I'm a parent</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/login?role=teacher')}
          >
            <Text style={styles.buttonText}>I'm a teacher</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/login?role=student')}
          >
            <Text style={styles.buttonText}>I'm a student</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loginText: {
    color: '#7B68EE',
    fontWeight: 'bold',
    fontSize: 16,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#7B68EE',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;