import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
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
        <View className="flex-1 justify-center items-center bg-amber-500 px-5">
            <StatusBar style="light" />

            {/* Logo image with rings */}
            <Animated.View style={animatedRing1Style} className="bg-white/20 rounded-full">
                <Animated.View style={animatedRing2Style} className="bg-white/20 rounded-full">
                    <Image
                        source={require('../../assets/images/Welcome.png')}
                        className="w-40 h-40"
                    />
                </Animated.View>
            </Animated.View>

            {/* Title and punchline */}
            <View className="items-center mt-5">
                <Text className="text-white font-bold tracking-widest text-5xl">MealMate</Text>
                <Text className="text-white font-medium tracking-widest text-lg">Plan Your Meal</Text>
            </View>
        </View>
    );
};

export default WelcomeScreen;
