import React from 'react';
import { View, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Stack } from 'expo-router';
import TranslateCard from '../components/TranslateCard';
import VoiceTranslateCard from '../components/VoiceTranslateCard';
import AIConverseCard from '../components/AIConverseCard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'LinguaBridge',
                    headerStyle: {
                        backgroundColor: '#ffffff',
                    },
                    headerShadowVisible: false,
                }}
            />
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <TranslateCard />
                    <VoiceTranslateCard />
                    <AIConverseCard />
                </ScrollView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        gap: 16,
        paddingBottom: 32,
    },
}); 