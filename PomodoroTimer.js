import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, AppState } from 'react-native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_FETCH_TASK = 'background-fetch';

// Register the background task
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    // This is where you would handle the background task
    // For now, we'll just return success
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export default function PomodoroTimer({ navigation }) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isBreak, setIsBreak] = useState(false);
  const [totalTime, setTotalTime] = useState(0); // Total time in seconds
  const [cycles, setCycles] = useState(0);
  const timerRef = useRef(null);
  const appState = useRef(AppState.currentState);

  // Register background fetch task
  useEffect(() => {
    registerBackgroundFetchAsync();
    return () => {
      unregisterBackgroundFetchAsync();
    };
  }, []);

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        isRunning
      ) {
        // App has come to the foreground and timer is running
        // We could update the timer here if needed
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isRunning]);

  const registerBackgroundFetchAsync = async () => {
    try {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60, // 1 minute
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log('Background fetch registered');
    } catch (err) {
      console.log('Background fetch registration failed:', err);
    }
  };

  const unregisterBackgroundFetchAsync = async () => {
    try {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
      console.log('Background fetch unregistered');
    } catch (err) {
      console.log('Background fetch unregistration failed:', err);
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Time's up
            clearInterval(timerRef.current);
            
            // Play notification sound or show alert
            Alert.alert(
              isBreak ? 'Break Time Over!' : 'Work Time Over!',
              isBreak ? 'Time to get back to work!' : 'Time for a break!',
              [{ text: 'OK' }]
            );
            
            // Switch between work and break
            if (isBreak) {
              // Break is over, back to work
              setCycles(prev => prev + 1);
              setTotalTime(prev => prev + 5 * 60); // Add 5 minutes to total time
              
              // Check if we've reached 2 hours (120 minutes)
              if (totalTime + 5 * 60 >= 120 * 60) {
                setIsRunning(false);
                Alert.alert('Pomodoro Session Complete!', 'You\'ve completed a 2-hour Pomodoro session.');
                return 0;
              }
              
              setIsBreak(false);
              return 25 * 60; // 25 minutes
            } else {
              // Work is over, time for break
              setTotalTime(prev => prev + 25 * 60); // Add 25 minutes to total time
              setIsBreak(true);
              return 5 * 60; // 5 minutes
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    
    return () => {
      clearInterval(timerRef.current);
    };
  }, [isRunning, isBreak, totalTime]);

  const toggleTimer = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      // Check if we've already reached 2 hours
      if (totalTime >= 120 * 60) {
        Alert.alert('Session Complete', 'You\'ve already completed a 2-hour Pomodoro session.');
        return;
      }
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
    setIsBreak(false);
    setTotalTime(0);
    setCycles(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTotalTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pomodoro Timer</Text>
      
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        <Text style={styles.phaseText}>{isBreak ? 'Break Time' : 'Work Time'}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Cycles: {cycles}</Text>
        <Text style={styles.statsText}>Total Time: {formatTotalTime(totalTime)}</Text>
        <Text style={styles.statsText}>Remaining: {formatTotalTime(120 * 60 - totalTime)}</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, isRunning ? styles.stopButton : styles.startButton]} 
          onPress={toggleTimer}
        >
          <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.resetButton]} 
          onPress={resetTimer}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
      
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5e17eb',
    marginBottom: 30,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#7a42f4',
  },
  phaseText: {
    fontSize: 24,
    color: '#a67df2',
    marginTop: 10,
  },
  statsContainer: {
    width: '100%',
    backgroundColor: '#f0e6ff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
  },
  statsText: {
    fontSize: 18,
    color: '#5e17eb',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#7a42f4',
  },
  stopButton: {
    backgroundColor: '#f44242',
  },
  resetButton: {
    backgroundColor: '#a67df2',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 20,
    padding: 10,
  },
  backButtonText: {
    color: '#7a42f4',
    fontSize: 16,
    fontWeight: '500',
  },
}); 