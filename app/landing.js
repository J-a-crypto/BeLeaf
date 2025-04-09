import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, ScrollView } from 'react-native';

const LandingPage = ({ navigation }) => {
    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.heading}>Welcome to the App</Text>
                <Text style={styles.subHeading}>Choose a Function to Start</Text>

                {/* Button for the Reading Function */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('reading')}
                >
                    <ImageBackground
                        source={require('@/assets/images/readingicon.png')} // Add your own image
                        resizeMode="contain"
                        style={styles.buttonImage}
                    >
                        <Text style={styles.buttonText}>Reading Function</Text>
                    </ImageBackground>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFCF9',
        padding: 20,
    },
    heading: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FF6F61', // Bright Coral color
        marginBottom: 20,
    },
    subHeading: {
        fontSize: 20,
        color: '#333',
        marginBottom: 40,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF9CFF',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 50,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
        overflow: 'hidden',
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
        textAlign: 'center',
    },
    buttonImage: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    icon: {
        width: 30,
        height: 30,
        // tintColor: '#fff',
    },
});

export default LandingPage;
