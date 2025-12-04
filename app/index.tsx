import { useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function StartScreen() {
    const router = useRouter();

    return (
        <ImageBackground
            source={require('../assets/splash.jpg')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <Text style={styles.title}>{'Welcome to Calmora'}</Text>

                <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => router.replace('/login-patient')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.startButtonText}>{'start'}</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 90,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 40,
        color: '#8C789E',
        fontFamily: 'Georgia',
        marginBottom: 300,
        textAlign: 'center',
    },
    startButton: {
        backgroundColor: '#8C789E',
        paddingVertical: 10,
        paddingHorizontal: 60,
        borderRadius: 50,
        borderWidth: 0.25,
        borderColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#8C789E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    startButtonText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'normal',
    },
});