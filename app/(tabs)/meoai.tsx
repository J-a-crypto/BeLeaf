import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const MeoAIScreen: React.FC = () => {
  const [userName, setUserName] = useState('');
  const auth = getAuth();
  const firestore = getFirestore();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const safeEmail = user.email?.replace(/[.@]/g, '_') || '';
          const userDoc = await getDoc(doc(firestore, 'users', safeEmail));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(`${userData.title} ${userData.firstName} ${userData.lastName}`);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome,</Text>
        <Text style={styles.title}>{userName || 'User'}</Text>
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
    alignItems: 'center',
    padding: 16,
  },
  welcomeText: {
    fontSize: 24,
    color: '#666',
    marginTop: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5e17eb',
    marginTop: 8,
  },
});

export default MeoAIScreen; 