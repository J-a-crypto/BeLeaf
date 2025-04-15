import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

export default function Dashboard({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🎓 Student Dashboard</Text>
        <Text style={styles.subtitle}>Welcome back!</Text>

        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Assignments')}
          >
            <Text style={styles.cardIcon}>📚</Text>
            <Text style={styles.cardTitle}>Assignments</Text>
            <Text style={styles.cardDescription}>View and manage your assignments</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Appointments')}
          >
            <Text style={styles.cardIcon}>📅</Text>
            <Text style={styles.cardTitle}>Appointments</Text>
            <Text style={styles.cardDescription}>Schedule and track appointments</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Resources')}
          >
            <Text style={styles.cardIcon}>📁</Text>
            <Text style={styles.cardTitle}>Resources</Text>
            <Text style={styles.cardDescription}>Access educational resources</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Messages')}
          >
            <Text style={styles.cardIcon}>💬</Text>
            <Text style={styles.cardTitle}>Messages</Text>
            <Text style={styles.cardDescription}>Chat with teachers and peers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('PomodoroTimer')}
          >
            <Text style={styles.cardIcon}>⏱️</Text>
            <Text style={styles.cardTitle}>Pomodoro Timer</Text>
            <Text style={styles.cardDescription}>Focus timer with 25/5 minute cycles</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>Progress Overview</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '65%' }]} />
          </View>
          <Text style={styles.progressText}>65% of assignments completed</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    padding: 20,
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5e17eb',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#7a42f4',
    marginBottom: 30,
    textAlign: 'center',
  },
  cardContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#f0e6ff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    width: '48%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5e17eb',
    marginBottom: 5,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 12,
    color: '#7a42f4',
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    backgroundColor: '#f0e6ff',
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5e17eb',
    marginBottom: 15,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0d0ff',
    borderRadius: 5,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7a42f4',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: '#7a42f4',
    textAlign: 'center',
  },
});
