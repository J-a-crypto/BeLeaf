import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';

export default function Assignments({ navigation }) {
  const [assignments, setAssignments] = useState([
    {
      id: '1',
      title: 'Math Homework',
      subject: 'Mathematics',
      dueDate: '2023-05-15',
      completed: false,
    },
    {
      id: '2',
      title: 'Science Project',
      subject: 'Science',
      dueDate: '2023-05-20',
      completed: false,
    },
    {
      id: '3',
      title: 'History Essay',
      subject: 'History',
      dueDate: '2023-05-25',
      completed: true,
    },
  ]);

  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: '',
    dueDate: '',
  });

  const [isAdding, setIsAdding] = useState(false);

  const toggleComplete = (id) => {
    setAssignments(
      assignments.map((assignment) =>
        assignment.id === id
          ? { ...assignment, completed: !assignment.completed }
          : assignment
      )
    );
  };

  const addAssignment = () => {
    if (
      newAssignment.title.trim() === '' ||
      newAssignment.subject.trim() === '' ||
      newAssignment.dueDate.trim() === ''
    ) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const assignment = {
      id: Date.now().toString(),
      title: newAssignment.title,
      subject: newAssignment.subject,
      dueDate: newAssignment.dueDate,
      completed: false,
    };

    setAssignments([...assignments, assignment]);
    setNewAssignment({ title: '', subject: '', dueDate: '' });
    setIsAdding(false);
  };

  const deleteAssignment = (id) => {
    setAssignments(assignments.filter((assignment) => assignment.id !== id));
  };

  const renderAssignment = ({ item }) => (
    <View style={styles.assignmentCard}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleComplete(item.id)}
      >
        <Text style={styles.checkboxText}>
          {item.completed ? '✓' : '○'}
        </Text>
      </TouchableOpacity>
      <View style={styles.assignmentContent}>
        <Text
          style={[
            styles.assignmentTitle,
            item.completed && styles.completedAssignment,
          ]}
        >
          {item.title}
        </Text>
        <Text style={styles.assignmentDetails}>
          Subject: {item.subject} | Due: {item.dueDate}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteAssignment(item.id)}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assignments</Text>

      {isAdding ? (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Assignment Title"
            value={newAssignment.title}
            onChangeText={(text) =>
              setNewAssignment({ ...newAssignment, title: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Subject"
            value={newAssignment.subject}
            onChangeText={(text) =>
              setNewAssignment({ ...newAssignment, subject: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Due Date (YYYY-MM-DD)"
            value={newAssignment.dueDate}
            onChangeText={(text) =>
              setNewAssignment({ ...newAssignment, dueDate: text })
            }
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
              onPress={addAssignment}
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
          <Text style={styles.addButtonText}>+ Add Assignment</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={assignments}
        renderItem={renderAssignment}
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
  assignmentCard: {
    flexDirection: 'row',
    backgroundColor: '#f0e6ff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  checkboxText: {
    fontSize: 18,
    color: '#7a42f4',
  },
  assignmentContent: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5e17eb',
    marginBottom: 5,
  },
  completedAssignment: {
    textDecorationLine: 'line-through',
    color: '#a67df2',
  },
  assignmentDetails: {
    fontSize: 14,
    color: '#7a42f4',
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
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