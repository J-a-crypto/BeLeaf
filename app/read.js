import { Text, View, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Speaking() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    center: {
      textAlign: 'center',
      fontSize: 20,
    }
  });

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.center}>Coming soon!</Text>
      </SafeAreaView>
    </View>
  );
}