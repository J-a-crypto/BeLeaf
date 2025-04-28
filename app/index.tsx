import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image, ViewStyle, TextStyle, ImageStyle, Platform } from 'react-native';
import { useRouter, Link, Stack } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import DatabaseTest from './components/DatabaseTest';

const App = () => {
  const router = useRouter();

  const handleNavigation = (role?: string) => {
    if (role) {
      router.push({
        pathname: '/login',
        params: { role }
      });
    } else {
      router.push('/login' as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Home",
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: '#333',
        }}
      />
      {/* Main Content */}
      <View style={styles.hero}>
        <Image
          source={require('./assets/mainPage.png')}
          style={styles.mainLogo}
        />
        <Text style={styles.title}>Empowering Every Step</Text>

        {/* Database Test Component */}
        <View style={styles.dbTestContainer}>
          <DatabaseTest />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNavigation('parent')}
          >
            <View style={styles.buttonContent}>
              <Image
                source={require('./assets/parent.png')}
                style={styles.buttonLogo}
              />
              <Text style={styles.buttonText}>I'm a Parent</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNavigation('teacher')}
          >
            <View style={styles.buttonContent}>
              <Image
                source={require('./assets/teacher.png')}
                style={styles.buttonLogo}
              />
              <Text style={styles.buttonText}>I'm a Teacher</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNavigation('student')}
          >
            <View style={styles.buttonContent}>
              <Image
                source={require('./assets/student.png')}
                style={styles.buttonLogo}
              />
              <Text style={styles.buttonText}>I'm a Student</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

interface Styles {
  container: ViewStyle;
  hero: ViewStyle;
  title: TextStyle;
  buttonContainer: ViewStyle;
  button: ViewStyle;
  buttonContent: ViewStyle;
  buttonText: TextStyle;
  buttonLogo: ImageStyle;
  mainLogo: ImageStyle;
  dbTestContainer: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#ffffff',
    height: 90,
    paddingHorizontal: 30,
    borderRadius: 45,
    width: '100%',
    justifyContent: 'center',
    ...(Platform.OS === 'android' ? { elevation: 8 } : {}),
    ...(Platform.OS === 'ios' ? {
      shadowColor: '#6020b8',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
    } : {}),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  buttonText: {
    color: '#333333',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  buttonLogo: {
    width: 50,
    height: 160,
    resizeMode: 'contain',
  },
  mainLogo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  dbTestContainer: {
    width: '100%',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
});

export default App;