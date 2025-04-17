import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
    const ring1padding = useSharedValue(0);
    const ring2padding = useSharedValue(0);
    const navigation = useNavigation();

    useEffect(() => {
        ring1padding.value = withSpring(35); // Adjusted directly for simplicity
        ring2padding.value = withSpring(35);
        setTimeout(() => navigation.navigate('Signup'), 2500);
    }, []);

    const animatedRing1Style = useAnimatedStyle(() => ({
        padding: ring1padding.value,
    }));

    const animatedRing2Style = useAnimatedStyle(() => ({
        padding: ring2padding.value,
    }));

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Logo image with rings */}
            <Animated.View style={[animatedRing1Style, styles.ring]}>
                <Animated.View style={[animatedRing2Style, styles.ring]}>
                    <Image
                        source={require('../../assets/images/Welcome.png')}
                        style={styles.logo}
                    />
                </Animated.View>
            </Animated.View>

            {/* Title and punchline */}
            <View style={styles.textContainer}>
                <Text style={styles.title}>MealMate</Text>
                <Text style={styles.subtitle}>Plan Your Meal</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fbbf24', // Amber-500
        paddingHorizontal: 20,
    },
    ring: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // White with 20% opacity
        borderRadius: 9999, // Fully rounded
    },
    logo: {
        width: 160, // 40 * 4
        height: 160, // 40 * 4
    },
    textContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    title: {
        color: '#ffffff', // White
        fontWeight: 'bold',
        fontSize: 40, // 5xl
        letterSpacing: 2, // Widest tracking
    },
    subtitle: {
        color: '#ffffff', // White
        fontWeight: '500',
        fontSize: 18, // lg
        letterSpacing: 2, // Widest tracking
    },
});

export default WelcomeScreen;