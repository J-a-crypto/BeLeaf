import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';

export default function Appointments({ navigation }) {
  const [appointments, setAppointments] = useState([
    {
      id: '1',
      title: 'Math Tutoring',
      date: '2023-05-10',
      time: '14:00',
      notes: 'Review calculus concepts',
    },
    {
      id: '2',
      title: 'Study Group',
      date: '2023-05-12',
      time: '16:30',
      notes: 'Prepare for upcoming exam',
    },
    {
      id: '3',
      title: 'Office Hours',
      date: '2023-05-15',
      time: '10:00',
      notes: 'Discuss project proposal',
    },
  ]);

  const [newAppointment, setNewAppointment] = useState({
    title: '',
    date: '',
    time: '',
    notes: '',
  });

  const [isAdding, setIsAdding] = useState(false);

  const addAppointment = () => {
    if (
      newAppointment.title.trim() === '' ||
      newAppointment.date.trim() === '' ||
      newAppointment.time.trim() === ''
    ) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const appointment = {
      id: Date.now().toString(),
      title: newAppointment.title,
      date: newAppointment.date,
      time: newAppointment.time,
      notes: newAppointment.notes,
    };

    setAppointments([...appointments, appointment]);
    setNewAppointment({ title: '', date: '', time: '', notes: '' });
    setIsAdding(false);
  };

  const deleteAppointment = (id) => {
    setAppointments(appointments.filter((appointment) => appointment.id !== id));
  };

  const renderAppointment = ({ item }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentContent}>
        <Text style={styles.appointmentTitle}>{item.title}</Text>
        <Text style={styles.appointmentDetails}>
          Date: {item.date} | Time: {item.time}
        </Text>
        {item.notes ? (
          <Text style={styles.appointmentNotes}>Notes: {item.notes}</Text>
        ) : null}
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteAppointment(item.id)}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appointments</Text>

      {isAdding ? (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Appointment Title"
            value={newAppointment.title}
            onChangeText={(text) =>
              setNewAppointment({ ...newAppointment, title: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={newAppointment.date}
            onChangeText={(text) =>
              setNewAppointment({ ...newAppointment, date: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Time (HH:MM)"
            value={newAppointment.time}
            onChangeText={(text) =>
              setNewAppointment({ ...newAppointment, time: text })
            }
          />
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Notes (optional)"
            value={newAppointment.notes}
            onChangeText={(text) =>
              setNewAppointment({ ...newAppointment, notes: text })
            }
            multiline
          />
          <View style={styles.formButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setIsAdding(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={addAppointment}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAdding(true)}
        >
          <Text style={styles.addButtonText}>+ Add Appointment</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={appointments}
        renderItem={renderAppointment}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5e17eb',
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#7a42f4',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  addForm: {
    backgroundColor: '#f0e6ff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#a67df2',
  },
  saveButton: {
    backgroundColor: '#7a42f4',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  appointmentCard: {
    flexDirection: 'row',
    backgroundColor: '#f0e6ff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  appointmentContent: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5e17eb',
    marginBottom: 5,
  },
  appointmentDetails: {
    fontSize: 14,
    color: '#7a42f4',
    marginBottom: 5,
  },
  appointmentNotes: {
    fontSize: 14,
    color: '#7a42f4',
    fontStyle: 'italic',
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#7a42f4',
    fontSize: 16,
    fontWeight: '500',
  },
}); 