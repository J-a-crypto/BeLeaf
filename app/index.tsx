import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

const App = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Login Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.hero}>
        <Image 
          source={require('./assets/logo.png')}
          style={styles.mainLogo}
        />
        <Text style={styles.title}>Empowering Every Step</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/login?role=parent')}
          >
            <View style={styles.buttonContent}>
              <Image 
                source={require('./assets/ParentCAT.png')}
         
              />
              <Text style={styles.buttonText}>I'm a Parent</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/login?role=teacher')}
          >
            <View style={styles.buttonContent}>
              <Image 
                source={require('./assets/TeacherCAT.png')} 
              
              />
              <Text style={styles.buttonText}>I'm a Teacher</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/login?role=student')}
          >
            <View style={styles.buttonContent}>
              <Image 
                source={require('./assets/StudentCAT.png')}
      
              />
              <Text style={styles.buttonText}>I'm a Student</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  loginText: {
    color: '#4020b8',
    fontWeight: 'bold',
    fontSize: 16,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    backgroundColor: '#ffffff',
    height: 90,
    paddingHorizontal: 30,
    borderRadius: 45,
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#4020b8',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  '@media android': {
    button: {
      elevation: 8,
    },
  },
  '@media ios': {
    button: {
      shadowColor: '#6020b8',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.3,
      shadowRadius: 12,
    },
  },
  buttonText: {
    color: '#333333',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  buttonLogo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  mainLogo: {
    width: 130,
    height: 130,
    marginBottom: 20,
    resizeMode: 'contain',
  },
});

export default App;