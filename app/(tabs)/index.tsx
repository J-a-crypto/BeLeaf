import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function Dashboard() {
  const [isDimmed, setIsDimmed] = useState(false);
  const [progress] = useState(65); // Progress percentage

  return (
    <SafeAreaView style={[styles.container, isDimmed && styles.dimmed]} edges={['top']}>
      <View style={styles.topHeader}>
        <View style={styles.headerRow}>
          <Text style={styles.topHeaderTitle}>Student Dashboard</Text>
          <TouchableOpacity 
            style={styles.dimButton}
            onPress={() => setIsDimmed(!isDimmed)}
          >
            <Ionicons 
              name={isDimmed ? "sunny" : "moon"} 
              size={24} 
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        <View style={styles.welcomeSection}>
          <View style={styles.titleRow}>
            <Ionicons name="school" size={32} color="#5e17eb" />
            <Text style={styles.title}>Student Dashboard</Text>
          </View>
          <Text style={styles.welcomeText}>Welcome back!</Text>
        </View>

        <View style={styles.menuGrid}>
          <Link href="/assignments" asChild>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="book" size={32} color="#5e17eb" />
              <Text style={styles.menuTitle}>Assignments</Text>
              <Text style={styles.menuSubtitle}>View and manage your assignments</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/appointments" asChild>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="calendar" size={32} color="#5e17eb" />
              <Text style={styles.menuTitle}>Appointments</Text>
              <Text style={styles.menuSubtitle}>Schedule and track appointments</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/resources" asChild>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="folder" size={32} color="#5e17eb" />
              <Text style={styles.menuTitle}>Resources</Text>
              <Text style={styles.menuSubtitle}>Access educational resources</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/messages" asChild>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="chatbubbles" size={32} color="#5e17eb" />
              <Text style={styles.menuTitle}>Messages</Text>
              <Text style={styles.menuSubtitle}>Chat with teachers and peers</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/pomodoro" asChild>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="timer" size={32} color="#5e17eb" />
              <Text style={styles.menuTitle}>Pomodoro Timer</Text>
              <Text style={styles.menuSubtitle}>Focus timer with 25/5 minute cycles</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Progress Overview</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress}% of assignments completed</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  dimmed: {
    backgroundColor: '#1a1a1a',
  },
  topHeader: {
    backgroundColor: '#5e17eb',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topHeaderTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  welcomeSection: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5e17eb',
    flex: 1,
    marginLeft: 8,
  },
  welcomeText: {
    fontSize: 18,
    color: '#5e17eb',
    opacity: 0.8,
  },
  menuGrid: {
    padding: 16,
  },
  menuItem: {
    backgroundColor: '#f8f0ff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5e17eb',
    marginTop: 8,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  progressSection: {
    backgroundColor: '#f8f0ff',
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#5e17eb',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5e17eb',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  dimButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
}); 