import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { translateText } from '../utils/openai';
import { speakLao } from '../utils/tts';

export default function TranslateCard() {
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleTranslate = async () => {
        if (!inputText.trim()) return;

        Keyboard.dismiss();
        setIsLoading(true);
        try {
            const result = await translateText(inputText);
            setTranslatedText(result);
        } catch (error) {
            console.error('Translation failed:', error);
            alert('번역 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSpeak = async () => {
        try {
            await speakLao(translatedText);
        } catch (error) {
            console.error('Speech failed:', error);
            alert('음성 재생 중 오류가 발생했습니다.');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.card}>
                <Text style={styles.title}>텍스트 번역</Text>
                <TextInput
                    style={styles.input}
                    placeholder="번역할 텍스트를 입력하세요"
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                    numberOfLines={3}
                    returnKeyType="done"

                />
                <TouchableOpacity
                    style={styles.translateButton}
                    onPress={handleTranslate}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.buttonText}>번역하기</Text>
                    )}
                </TouchableOpacity>

                {translatedText ? (
                    <View style={styles.resultContainer}>
                        <Text style={styles.translatedText}>{translatedText}</Text>
                        <TouchableOpacity style={styles.speakButton} onPress={handleSpeak}>
                            <Ionicons name="volume-high" size={24} color="#007AFF" />
                        </TouchableOpacity>
                    </View>
                ) : null}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E5EA',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 100,
        maxHeight: 150,
        textAlignVertical: 'top',
    },
    translateButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginTop: 12,
        minHeight: 48,
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    resultContainer: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#F2F2F7',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    translatedText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 24,
    },
    speakButton: {
        padding: 8,
    },
}); 