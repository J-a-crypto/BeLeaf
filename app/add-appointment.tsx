import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from './configuration';

const AddAppointmentScreen = () => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');
  const [teacher, setTeacher] = useState('');
  const [location, setLocation] = useState('');
  const [authLoaded, setAuthLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoaded(true);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to add an appointment.');
      return;
    }

    if (!title || !time || !duration || !teacher || !location) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const appointment = {
        title,
        date: new Date().toISOString().split('T')[0],
        time,
        duration,
        teacher,
        location,
        status: 'upcoming',
        createdAt: serverTimestamp(),
        userId: currentUser.uid
      };

      await addDoc(collection(db, 'appointments', currentUser.uid, 'items'), appointment);

      Alert.alert('Success', 'Appointment added successfully');
      router.replace('/appointments');
    } catch (error) {
      console.error('Error saving appointment:', error);
      Alert.alert('Error', 'Failed to save appointment');
    }
  };

  if (!authLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#5e17eb" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Add Appointment</Text>
      <TextInput placeholder="Title" style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput placeholder="Time" style={styles.input} value={time} onChangeText={setTime} />
      <TextInput placeholder="Duration" style={styles.input} value={duration} onChangeText={setDuration} />
      <TextInput placeholder="Teacher" style={styles.input} value={teacher} onChangeText={setTeacher} />
      <TextInput placeholder="Location" style={styles.input} value={location} onChangeText={setLocation} />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFCF9', padding: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#5e17eb' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#E0E0E0' },
  submitButton: { backgroundColor: '#5e17eb', padding: 15, borderRadius: 10, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default AddAppointmentScreen;



