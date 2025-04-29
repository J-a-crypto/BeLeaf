import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, onValue } from 'firebase/database';
import { auth, database } from './configuration';

interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  teacher: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const initialAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Math Tutoring Session',
    date: '2023-11-15',
    time: '3:30 PM',
    duration: '45 min',
    teacher: 'Ms. Johnson',
    location: 'Room 204',
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Parent-Teacher Conference',
    date: '2023-11-20',
    time: '5:00 PM',
    duration: '30 min',
    teacher: 'Mr. Smith',
    location: 'Main Office',
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Science Project Discussion',
    date: '2023-11-10',
    time: '2:15 PM',
    duration: '45 min',
    teacher: 'Dr. Williams',
    location: 'Science Lab',
    status: 'completed'
  },
  {
    id: '4',
    title: 'Reading Assessment',
    date: '2023-10-30',
    time: '10:00 AM',
    duration: '60 min',
    teacher: 'Ms. Brown',
    location: 'Library',
    status: 'completed'
  },
  {
    id: '5',
    title: 'Art Class Extra Help',
    date: '2023-11-05',
    time: '4:00 PM',
    duration: '45 min',
    teacher: 'Mrs. Davis',
    location: 'Art Studio',
    status: 'cancelled'
  }
];

// Generate days for the calendar view
const generateCalendarDays = () => {
  const days = [];
  const today = new Date();
  
  for (let i = -3; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayOfMonth = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const formattedDate = date.toISOString().split('T')[0];
    
    days.push({
      date: formattedDate,
      dayOfWeek,
      dayOfMonth,
      month,
      isToday: i === 0
    });
  }
  
  return days;
};

const AppointmentsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  
  const calendarDays = generateCalendarDays();
  
  // Load appointments from AsyncStorage on mount
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setAppointments([]);
      return;
    }
    const appointmentsRef = ref(database, `appointments/${userId}`);
    const unsubscribe = onValue(appointmentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedAppointments = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value,
        }));
        setAppointments(loadedAppointments);
      } else {
        setAppointments([]);
      }
    });
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (params?.newAppointment) {
      try {
        const newAppointment = JSON.parse(params.newAppointment as string);
        setAppointments(current => {
          const updated = [...current, newAppointment];
          AsyncStorage.setItem('appointments', JSON.stringify(updated));
          return updated;
        });
        setSelectedDate(newAppointment.date);
      } catch (e) {
        console.error('Failed to parse new appointment:', e);
      }
    }
  }, [params?.newAppointment]);
  
  useEffect(() => {
    AsyncStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);
  
  const filteredAppointments = appointments.filter(appointment => {
    const dateFilter = selectedDate ? appointment.date === selectedDate : true;
    const statusFilter = selectedFilter === 'all' ? true : appointment.status === selectedFilter;
    
    return dateFilter && statusFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return '#4CAF50';
      case 'completed':
        return '#757575';
      case 'cancelled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const handleCancel = (id: string) => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        {
          text: "No",
          style: "cancel"
        },
        { 
          text: "Yes", 
          onPress: () => {
            setAppointments(
              appointments.map(appointment =>
                appointment.id === id
                  ? { ...appointment, status: 'cancelled' }
                  : appointment
              )
            );
          }
        }
      ]
    );
  };

  const handleRequestAppointment = () => {
    Alert.alert(
      "Request New Appointment",
      "This would open a form to request a new appointment with a teacher.",
      [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed")
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: "Appointments",
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
      
      {/* Calendar Strip */}
      <View style={styles.calendarContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarContent}
        >
          {calendarDays.map((day) => (
            <TouchableOpacity
              key={day.date}
              style={[
                styles.calendarDay,
                day.isToday && styles.today,
                selectedDate === day.date && styles.selectedDay
              ]}
              onPress={() => setSelectedDate(day.date)}
            >
              <Text style={[
                styles.dayOfWeek,
                selectedDate === day.date && styles.selectedDayText
              ]}>
                {day.dayOfWeek}
              </Text>
              <Text style={[
                styles.dayOfMonth,
                selectedDate === day.date && styles.selectedDayText
              ]}>
                {day.dayOfMonth}
              </Text>
              <Text style={[
                styles.month,
                selectedDate === day.date && styles.selectedDayText
              ]}>
                {day.month}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Filter Buttons */}
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
              selectedFilter === 'upcoming' && styles.activeFilterButton
            ]}
            onPress={() => setSelectedFilter('upcoming')}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === 'upcoming' && styles.activeFilterText
            ]}>Upcoming</Text>
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
              selectedFilter === 'cancelled' && styles.activeFilterButton
            ]}
            onPress={() => setSelectedFilter('cancelled')}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === 'cancelled' && styles.activeFilterText
            ]}>Cancelled</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      {/* Appointments List */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        {filteredAppointments.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="event-busy" size={60} color="#CCCCCC" />
            <Text style={styles.emptyStateText}>No appointments found for this date</Text>
          </View>
        ) : (
          filteredAppointments.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                <View 
                  style={[
                    styles.statusBadge, 
                    { backgroundColor: getStatusColor(appointment.status) }
                  ]}
                >
                  <Text style={styles.statusText}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.appointmentDetails}>
                <View style={styles.detailRow}>
                  <MaterialIcons name="person" size={16} color="#5e17eb" />
                  <Text style={styles.detailText}>{appointment.teacher}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <MaterialIcons name="access-time" size={16} color="#5e17eb" />
                  <Text style={styles.detailText}>{appointment.time} ({appointment.duration})</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <MaterialIcons name="location-on" size={16} color="#5e17eb" />
                  <Text style={styles.detailText}>{appointment.location}</Text>
                </View>
              </View>
              
              <View style={styles.appointmentFooter}>
                {appointment.status === 'upcoming' && (
                  <>
                    <TouchableOpacity 
                      style={styles.rescheduleButton}
                      onPress={() => Alert.alert('Reschedule', 'Reschedule functionality would open here')}
                    >
                      <Text style={styles.rescheduleButtonText}>Reschedule</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={() => handleCancel(appointment.id)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </>
                )}
                
                <TouchableOpacity 
                  style={styles.detailsButton}
                  onPress={() => Alert.alert('Details', 'Appointment details would show here')}
                >
                  <Text style={styles.detailsButtonText}>Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push({ pathname: '/add-appointment', params: { selectedDate } })}
      >
        <Text style={styles.addButtonText}>Add New Appointment</Text>
      </TouchableOpacity>
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
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  calendarContent: {
    paddingHorizontal: 10,
  },
  calendarDay: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 80,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: '#F5F5F5',
  },
  today: {
    borderWidth: 2,
    borderColor: '#5e17eb',
  },
  selectedDay: {
    backgroundColor: '#5e17eb',
  },
  dayOfWeek: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  dayOfMonth: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  month: {
    fontSize: 12,
    color: '#757575',
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  filterContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
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
    paddingBottom: 80, // Make room for the floating button
  },
  appointmentCard: {
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
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  appointmentTitle: {
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
  appointmentDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 8,
  },
  appointmentFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  rescheduleButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  rescheduleButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  detailsButton: {
    backgroundColor: '#5e17eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#757575',
    marginTop: 10,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#5e17eb',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AppointmentsScreen; 