import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { getCurrentUser } from '../utils/auth';

const HomeScreen: React.FC = () => {
  const [userName, setUserName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          // Extract first name from the full name
          const firstName = user.name.split(' ').slice(-2)[0];
          setUserName(firstName);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.title}>{userName || 'User'}</Text>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.cardButton} onPress={() => router.push('../speak')}>
            <Image source={require('../assets/speak.png')} style={styles.cardImage} />
            <Text style={styles.cardLabel} numberOfLines={1}>Speak</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardButton}>
            <Image source={require('../assets/appointments.png')} style={styles.cardImage} />
            <Text style={styles.cardLabel} numberOfLines={1}>Appointments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardButton}>
            <Image source={require('../assets/assignments.png')} style={styles.cardImage} />
            <Text style={styles.cardLabel} numberOfLines={1}>Assignments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardButton}>
            <Image source={require('../assets/emotion.png')} style={styles.cardImage} />
            <Text style={styles.cardLabel} numberOfLines={1}>Emotion</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardButton}>
            <Image source={require('../assets/chat.png')} style={styles.cardImage} />
            <Text style={styles.cardLabel} numberOfLines={1}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardButton} onPress={() => router.push('../pomodoro')}>
            <Image source={require('../assets/pomodoro.png')} style={styles.cardImage} />
            <Text style={styles.cardLabel} numberOfLines={1}>Pomodoro</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 32,
    paddingTop: 16,
  },
  welcomeText: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5e17eb',
    textAlign: 'center',
    marginBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
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
    width: 160,
    margin: 8,
  },
  cardImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5e17eb',
    textAlign: 'center',
    width: '100%',
  },
});

export default HomeScreen; 