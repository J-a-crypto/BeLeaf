import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { TimerCountDownDisplay } from "../components/TimerCountDownDisplay";
import { TimerModeDisplay, TimerModes } from "../components/TimerModeDisplay";
import { TimerToggleButton } from "../components/TimerToggleButton";
import React from "react";

const FOCUS_TIME_MINUTES = 25 * 60 * 1000;
const BREAK_TIME_MINUTES = 5.0 * 60 * 1000;

export default function App() {
  const [timerCount, setTimerCount] = useState<number>(FOCUS_TIME_MINUTES);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);
  const [timerMode, setTimerMode] = useState<TimerModes>("Focus");
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

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

  return (
    <View
      style={{
        ...styles.container,
        ...{ backgroundColor: timerMode === "Break" ? "#2a9d8f" : "#d95550" },
      }}
    >
      <StatusBar style="auto" />
      <TimerModeDisplay timerMode={timerMode} />

      <TimerToggleButton
        startCountDownHandler={startCountDown}
        isTimerRunning={isTimerRunning}
        setIsTimerRunning={setIsTimerRunning}
        stopCountDownHandler={stopCountDown}
      />
      <TimerCountDownDisplay countDownDate={new Date(timerCount)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d95550",
    alignItems: "center",
    justifyContent: "center",
  },
});
