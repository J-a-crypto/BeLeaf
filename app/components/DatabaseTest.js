import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { testDatabaseConnection } from '../configuration';

const DatabaseTest = () => {
    const [connectionStatus, setConnectionStatus] = useState('Not tested');
    const [isLoading, setIsLoading] = useState(false);

    const checkConnection = async () => {
        setIsLoading(true);
        setConnectionStatus('Testing connection...');

        try {
            const isConnected = await testDatabaseConnection();
            setConnectionStatus(isConnected ? 'Connected' : 'Connection failed');
        } catch (error) {
            setConnectionStatus(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Database Connection Test</Text>
            <Text style={styles.status}>Status: {connectionStatus}</Text>
            <Button
                title={isLoading ? "Testing..." : "Test Connection"}
                onPress={checkConnection}
                disabled={isLoading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    status: {
        fontSize: 16,
        marginBottom: 20,
    },
});

export default DatabaseTest;
