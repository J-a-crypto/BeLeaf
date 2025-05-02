import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from './configuration';

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

const generateCalendarDays = () => {
  const days = [];
  const today = new Date();
  for (let i = -3; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      date: date.toISOString().split('T')[0],
      dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayOfMonth: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
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

  useEffect(() => {
    const fetchAppointments = async () => {
      const user = auth.currentUser;
      if (!user) {
        setAppointments([]);
        return;
      }

      try {
        const snapshot = await getDocs(collection(db, 'appointments', user.uid, 'items'));
        const loadedAppointments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Appointment[];

        setAppointments(loadedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setAppointments([]);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(appointment => {
    const statusFilter = selectedFilter === 'all' ? true : appointment.status === selectedFilter;
    const dateFilter = appointment.date === selectedDate;
    return statusFilter && dateFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return '#4CAF50';
      case 'completed': return '#757575';
      case 'cancelled': return '#F44336';
      default: return '#757575';
    }
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
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#5e17eb" />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.calendarContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarContent}>
          {calendarDays.map((day) => (
            <TouchableOpacity
              key={day.date}
              style={[styles.calendarDay, day.isToday && styles.today, selectedDate === day.date && styles.selectedDay]}
              onPress={() => setSelectedDate(day.date)}
            >
              <Text style={[styles.dayOfWeek, selectedDate === day.date && styles.selectedDayText]}>{day.dayOfWeek}</Text>
              <Text style={[styles.dayOfMonth, selectedDate === day.date && styles.selectedDayText]}>{day.dayOfMonth}</Text>
              <Text style={[styles.month, selectedDate === day.date && styles.selectedDayText]}>{day.month}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'upcoming', 'completed', 'cancelled'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterButton, selectedFilter === filter && styles.activeFilterButton]}
              onPress={() => setSelectedFilter(filter as any)}
            >
              <Text style={[styles.filterText, selectedFilter === filter && styles.activeFilterText]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

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
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
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
                <TouchableOpacity style={styles.detailsButton}>
                  <Text style={styles.detailsButtonText}>Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-appointment')}>
        <Text style={styles.addButtonText}>Add New Appointment</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFCF9' },
  backButton: { marginLeft: 10 },
  calendarContainer: { backgroundColor: '#FFFFFF', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  calendarContent: { paddingHorizontal: 10 },
  calendarDay: { alignItems: 'center', justifyContent: 'center', width: 60, height: 80, borderRadius: 10, marginHorizontal: 5, backgroundColor: '#F5F5F5' },
  today: { borderWidth: 2, borderColor: '#5e17eb' },
  selectedDay: { backgroundColor: '#5e17eb' },
  dayOfWeek: { fontSize: 12, color: '#757575', marginBottom: 4 },
  dayOfMonth: { fontSize: 20, fontWeight: 'bold', color: '#333333', marginBottom: 2 },
  month: { fontSize: 12, color: '#757575' },
  selectedDayText: { color: '#FFFFFF' },
  filterContainer: { paddingVertical: 10, paddingHorizontal: 15, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  filterButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10, backgroundColor: '#F5F5F5' },
  activeFilterButton: { backgroundColor: '#5e17eb' },
  filterText: { color: '#757575', fontWeight: '500' },
  activeFilterText: { color: '#FFFFFF' },
  listContainer: { padding: 15, paddingBottom: 80 },
  appointmentCard: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 16, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2 },
  appointmentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  appointmentTitle: { fontSize: 16, fontWeight: '600', color: '#333333', flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, minWidth: 80, alignItems: 'center' },
  statusText: { color: '#FFFFFF', fontSize: 12, fontWeight: '500' },
  appointmentDetails: { marginBottom: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  detailText: { fontSize: 14, color: '#757575', marginLeft: 8 },
  appointmentFooter: { flexDirection: 'row', justifyContent: 'flex-end', flexWrap: 'wrap' },
  detailsButton: { backgroundColor: '#5e17eb', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  detailsButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '500' },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyStateText: { fontSize: 16, color: '#757575', marginTop: 10, textAlign: 'center' },
  addButton: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: '#5e17eb', borderRadius: 25, paddingVertical: 12, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  addButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

export default AppointmentsScreen;
