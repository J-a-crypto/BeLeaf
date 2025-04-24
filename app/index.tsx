import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { useRouter, Link, Stack } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

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
});

export default App;