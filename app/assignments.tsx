import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, FlatList } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'late';
  subject: string;
}

const initialAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Math Homework - Algebra Basics',
    description: 'Complete problems 1-20 on page 45 of the textbook',
    dueDate: '2023-11-15',
    status: 'completed',
    subject: 'Mathematics'
  },
  {
    id: '2',
    title: 'Science Lab Report',
    description: 'Write a report on the photosynthesis experiment',
    dueDate: '2023-11-20',
    status: 'pending',
    subject: 'Science'
  },
  {
    id: '3',
    title: 'History Essay',
    description: 'Write a 500-word essay on Ancient Egypt',
    dueDate: '2023-11-10',
    status: 'late',
    subject: 'History'
  },
  {
    id: '4',
    title: 'English Book Review',
    description: 'Read "To Kill a Mockingbird" and write a 1-page review',
    dueDate: '2023-11-30',
    status: 'pending',
    subject: 'English'
  },
  {
    id: '5',
    title: 'Computer Science Project',
    description: 'Create a simple calculator app using React Native',
    dueDate: '2023-12-05',
    status: 'pending',
    subject: 'Computer Science'
  }
];

const AssignmentsScreen = () => {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'completed' | 'late'>('all');

  const filteredAssignments = assignments.filter(assignment => {
    if (selectedFilter === 'all') return true;
    return assignment.status === selectedFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'late':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const markAsCompleted = (id: string) => {
    setAssignments(
      assignments.map(assignment =>
        assignment.id === id
          ? { ...assignment, status: 'completed' }
          : assignment
      )
    );
  };

  const renderAssignmentItem = ({ item }: { item: Assignment }) => (
    <View style={styles.assignmentCard}>
      <View style={styles.assignmentHeader}>
        <Text style={styles.assignmentTitle}>{item.title}</Text>
        <View 
          style={[
            styles.statusBadge, 
            { backgroundColor: getStatusColor(item.status) }
          ]}
        >
          <Text style={styles.statusText}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.subjectText}>{item.subject}</Text>
      <Text style={styles.descriptionText}>{item.description}</Text>
      
      <View style={styles.assignmentFooter}>
        <Text style={styles.dueDateText}>Due: {item.dueDate}</Text>
        
        {item.status !== 'completed' && (
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={() => markAsCompleted(item.id)}
          >
            <Text style={styles.completeButtonText}>Mark Complete</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: "Assignments",
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#FFFCF9' },
          headerTintColor: '#5e17eb',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#5e17eb" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              selectedFilter === 'all' && styles.activeFilterButton
            ]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === 'all' && styles.activeFilterText
            ]}>All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              selectedFilter === 'pending' && styles.activeFilterButton
            ]}
            onPress={() => setSelectedFilter('pending')}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === 'pending' && styles.activeFilterText
            ]}>Pending</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              selectedFilter === 'completed' && styles.activeFilterButton
            ]}
            onPress={() => setSelectedFilter('completed')}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === 'completed' && styles.activeFilterText
            ]}>Completed</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              selectedFilter === 'late' && styles.activeFilterButton
            ]}
            onPress={() => setSelectedFilter('late')}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === 'late' && styles.activeFilterText
            ]}>Late</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <FlatList
        data={filteredAssignments}
        renderItem={renderAssignmentItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          {assignments.filter(a => a.status === 'completed').length} of {assignments.length} assignments completed
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.round((assignments.filter(a => a.status === 'completed').length / assignments.length) * 100)}%` 
              }
            ]} 
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFCF9',
  },
  backButton: {
    marginLeft: 10,
  },
  filterContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#F5F5F5',
  },
  activeFilterButton: {
    backgroundColor: '#5e17eb',
  },
  filterText: {
    color: '#757575',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 15,
  },
  assignmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  subjectText: {
    fontSize: 14,
    color: '#5e17eb',
    marginBottom: 8,
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
  },
  assignmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dueDateText: {
    fontSize: 13,
    color: '#757575',
    marginRight: 10,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  viewButton: {
    backgroundColor: '#5e17eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  summaryText: {
    fontSize: 14,
    color: '#5e17eb',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5e17eb',
    borderRadius: 4,
  },
});

export default AssignmentsScreen; 