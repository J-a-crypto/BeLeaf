import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ref, push, update } from 'firebase/database';
import { auth, database } from './configuration';

const AddAppointmentScreen = () => {
  const router = useRouter();
  const { selectedDate } = useLocalSearchParams();

  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');
  const [teacher, setTeacher] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async () => {
    if (!title || !time || !duration || !teacher || !location) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    const appointmentsRef = ref(database, `appointments/${userId}`);
    const newAppointment = {
      title,
      date: selectedDate || new Date().toISOString().split('T')[0],
      time,
      duration,
      teacher,
      location,
      status: 'upcoming',
    };

    try {
      await push(appointmentsRef, newAppointment);
      router.replace('/appointments');
    } catch (error) {
      Alert.alert('Error', 'Failed to add appointment');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.dateText}>
          Date: {selectedDate || new Date().toISOString().split('T')[0]}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Appointment Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Time (e.g., 2:30 PM)"
          value={time}
          onChangeText={setTime}
        />
        <TextInput
          style={styles.input}
          placeholder="Duration (e.g., 30 min)"
          value={duration}
          onChangeText={setDuration}
        />
        <TextInput
          style={styles.input}
          placeholder="Teacher Name"
          value={teacher}
          onChangeText={setTeacher}
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Appointment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFCF9' },
  form: { padding: 20 }, // ✅ comma was missing here before
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#E0E0E0' },
  submitButton: { backgroundColor: '#5e17eb', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  dateText: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#333' },
});

export default AddAppointmentScreen;

