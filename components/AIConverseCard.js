import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { transcribeAudio, generateAIResponse } from '../utils/openai';
import { speakLao } from '../utils/tts';

export default function AIConverseCard() {
    const [isListening, setIsListening] = useState(false);
    const [recording, setRecording] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        return () => {
            if (recording) {
                recording.stopAndUnloadAsync();
            }
        };
    }, [recording]);

    async function startRecording() {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            setRecording(recording);
            setIsListening(true);
        } catch (err) {
            console.error('Failed to start recording', err);
            alert('음성 녹음을 시작할 수 없습니다.');
        }
    }

    async function stopRecording() {
        setIsListening(false);
        setIsProcessing(true);

        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();

            // 음성을 텍스트로 변환
            const transcription = await transcribeAudio(uri);

            // 사용자 메시지 추가
            const userMessage = {
                text: transcription,
                isAI: false,
            };
            setConversations(prev => [...prev, userMessage]);

            // AI 응답 생성
            const aiResponse = await generateAIResponse(
                transcription,
                conversations.map(c => ({
                    role: c.isAI ? 'assistant' : 'user',
                    content: c.text,
                }))
            );

            // AI 응답 추가
            const aiMessage = {
                text: aiResponse,
                isAI: true,
            };
            setConversations(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error('Processing failed:', error);
            alert('음성 처리 중 오류가 발생했습니다.');
        } finally {
            setRecording(null);
            setIsProcessing(false);
        }
    }

    const handleListen = () => {
        if (isListening) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleSpeak = async (text) => {
        try {
            await speakLao(text);
        } catch (error) {
            console.error('Speech failed:', error);
            alert('음성 재생 중 오류가 발생했습니다.');
        }
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>AI 대화</Text>

            <TouchableOpacity
                style={[styles.recordButton, isListening && styles.recordingButton]}
                onPress={handleListen}
                disabled={isProcessing}
            >
                {isProcessing ? (
                    <ActivityIndicator color="#FFFFFF" size="large" />
                ) : (
                    <Ionicons
                        name={isListening ? "stop" : "mic"}
                        size={32}
                        color="#FFFFFF"
                    />
                )}
            </TouchableOpacity>
            <Text style={styles.recordHint}>
                {isProcessing ? '처리 중...' :
                    isListening ? '듣는 중... 탭하여 중지' : '탭하여 대화 시작'}
            </Text>

            {conversations.length > 0 && (
                <ScrollView
                    style={styles.conversationContainer}
                    contentContainerStyle={styles.conversationContent}
                >
                    {conversations.map((message, index) => (
                        <View
                            key={index}
                            style={[
                                styles.messageContainer,
                                message.isAI ? styles.aiMessage : styles.userMessage,
                            ]}
                        >
                            <Text style={styles.messageText}>{message.text}</Text>
                            <TouchableOpacity
                                style={styles.speakButton}
                                onPress={() => handleSpeak(message.text)}
                            >
                                <Ionicons name="volume-high" size={20} color="#007AFF" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
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
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 24,
        alignSelf: 'flex-start',
    },
    recordButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    recordingButton: {
        backgroundColor: '#FF3B30',
    },
    recordHint: {
        color: '#8E8E93',
        marginBottom: 16,
    },
    conversationContainer: {
        width: '100%',
        maxHeight: 200,
        marginTop: 16,
    },
    conversationContent: {
        paddingBottom: 16,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        maxWidth: '85%',
    },
    aiMessage: {
        backgroundColor: '#F2F2F7',
        alignSelf: 'flex-start',
    },
    userMessage: {
        backgroundColor: '#007AFF20',
        alignSelf: 'flex-end',
    },
    messageText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 24,
    },
    speakButton: {
        padding: 4,
        marginLeft: 8,
    },
}); 