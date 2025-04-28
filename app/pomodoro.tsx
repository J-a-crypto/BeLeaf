import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, SafeAreaView } from "react-native";
import { TimerCountDownDisplay } from "../components/TimerCountDownDisplay";
import { TimerModeDisplay, TimerModes } from "../components/TimerModeDisplay";
import { TimerToggleButton } from "../components/TimerToggleButton";
import React from "react";
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const FOCUS_TIME_MINUTES = 25 * 60 * 1000;
const BREAK_TIME_MINUTES = 5.0 * 60 * 1000;

export default function PomodoroPage() {
  const [timerCount, setTimerCount] = useState<number>(FOCUS_TIME_MINUTES);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [timerMode, setTimerMode] = useState<TimerModes>("Focus");
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (timerCount === 0) {
      if (timerMode === "Focus") {
        setTimerMode("Break");
        setTimerCount(BREAK_TIME_MINUTES);
      } else {
        setTimerMode("Focus");
        setTimerCount(FOCUS_TIME_MINUTES);
      }
      stopCountDown();
    }
  }, [timerCount]);

  const startCountDown = () => {
    setIsTimerRunning(true);
    const id = setInterval(() => setTimerCount((prev) => prev - 1000), 1000);
    setIntervalId(id);
  };

  const stopCountDown = () => {
    setIsTimerRunning(false);
    if (intervalId) {
      clearInterval(intervalId);
    }
    setIntervalId(null);
  };

  const skipToBreak = () => {
    stopCountDown();
    setTimerMode("Break");
    setTimerCount(BREAK_TIME_MINUTES);
  };

  const backToStudy = () => {
    stopCountDown();
    setTimerMode("Focus");
    setTimerCount(FOCUS_TIME_MINUTES);
  };

  return (
    <SafeAreaView 
      style={{
        flex: 1,
        backgroundColor: timerMode === "Break" ? "#2a9d8f" : "#d95550",
      }}
    >
      <StatusBar style="light" />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {timerMode === "Focus" ? (
          <TouchableOpacity 
            onPress={skipToBreak} 
            style={styles.modeButton}
          >
            <Text style={styles.modeButtonText}>Skip to Break</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={backToStudy} 
            style={styles.modeButton}
          >
            <Text style={styles.modeButtonText}>Back to Study</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.container}>
        <TimerModeDisplay timerMode={timerMode} />
        <TimerToggleButton
          startCountDownHandler={startCountDown}
          isTimerRunning={isTimerRunning}
          setIsTimerRunning={setIsTimerRunning}
          stopCountDownHandler={stopCountDown}
        />
        <TimerCountDownDisplay countDownDate={new Date(timerCount)} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 10,
  },
  modeButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    marginRight: 10,
  },
  modeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  }
}); 