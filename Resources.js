import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';

export default function Resources({ navigation }) {
  const resources = [
    {
      id: '1',
      title: 'Khan Academy',
      description: 'Free educational resources for students of all ages',
      url: 'https://www.khanacademy.org',
      icon: '📚',
    },
    {
      id: '2',
      title: 'Coursera',
      description: 'Online courses from top universities',
      url: 'https://www.coursera.org',
      icon: '🎓',
    },
    {
      id: '3',
      title: 'Duolingo',
      description: 'Free language learning platform',
      url: 'https://www.duolingo.com',
      icon: '🌍',
    },
    {
      id: '4',
      title: 'TED-Ed',
      description: 'Educational videos on various topics',
      url: 'https://ed.ted.com',
      icon: '🎥',
    },
    {
      id: '5',
      title: 'Quizlet',
      description: 'Flashcards and study tools',
      url: 'https://www.quizlet.com',
      icon: '📝',
    },
    {
      id: '6',
      title: 'Wolfram Alpha',
      description: 'Computational knowledge engine',
      url: 'https://www.wolframalpha.com',
      icon: '🧮',
    },
  ];

  const openResource = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Educational Resources</Text>
      
      <ScrollView style={styles.scrollView}>
        {resources.map((resource) => (
          <TouchableOpacity
            key={resource.id}
            style={styles.resourceCard}
            onPress={() => openResource(resource.url)}
          >
            <Text style={styles.resourceIcon}>{resource.icon}</Text>
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>{resource.title}</Text>
              <Text style={styles.resourceDescription}>{resource.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
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
  scrollView: {
    flex: 1,
  },
  resourceCard: {
    flexDirection: 'row',
    backgroundColor: '#f0e6ff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  resourceIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5e17eb',
    marginBottom: 5,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#7a42f4',
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