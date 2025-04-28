import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Dimensions, Text, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get('window');

const Splash = () => {
  const router = useRouter();
  const [imageError, setImageError] = useState<string | null>(null);
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('Splash screen component mounted');
    
    // Start slide up animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Start fade in animation after slide up
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 1000);

    // Navigate to home after 3 seconds
    const timer = setTimeout(() => {
      console.log('Splash screen navigating to home');
      router.replace('/');
    }, 3000);

    return () => {
      console.log('Splash screen unmounting');
      clearTimeout(timer);
    };
  }, []);

  console.log('Splash screen rendering');

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Image
          source={require('./assets/student.png')}
          style={styles.logo}
          resizeMode="contain"
          onError={(error) => {
            console.log('Image loading error:', error);
            setImageError('Failed to load image');
          }}
          onLoad={() => console.log('Image loaded successfully')}
        />
        <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
          BeLeaf
        </Animated.Text>
        {imageError && <Text style={styles.errorText}>{imageError}</Text>}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
    maxWidth: 300,
    maxHeight: 300,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00000',
    marginTop: 20,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default Splash; 