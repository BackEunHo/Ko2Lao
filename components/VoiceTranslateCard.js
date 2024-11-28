import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { transcribeAudio, translateText } from '../utils/openai';
import { speakLao } from '../utils/tts';

export default function VoiceTranslateCard() {
    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState(null);
    const [translatedText, setTranslatedText] = useState('');
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
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording', err);
            alert('음성 녹음을 시작할 수 없습니다.');
        }
    }

    async function stopRecording() {
        setIsRecording(false);
        setIsProcessing(true);

        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();

            // 음성을 텍스트로 변환
            const transcription = await transcribeAudio(uri);

            // 텍스트를 라오어로 번역
            const translation = await translateText(transcription);

            setTranslatedText(translation);
        } catch (error) {
            console.error('Processing failed:', error);
            alert('음성 처리 중 오류가 발생했습니다.');
        } finally {
            setRecording(null);
            setIsProcessing(false);
        }
    }

    const handleRecord = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
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
        <View style={styles.card}>
            <Text style={styles.title}>음성 번역</Text>

            <TouchableOpacity
                style={[styles.recordButton, isRecording && styles.recordingButton]}
                onPress={handleRecord}
                disabled={isProcessing}
            >
                {isProcessing ? (
                    <ActivityIndicator color="#FFFFFF" size="large" />
                ) : (
                    <Ionicons
                        name={isRecording ? "stop" : "mic"}
                        size={32}
                        color="#FFFFFF"
                    />
                )}
            </TouchableOpacity>
            <Text style={styles.recordHint}>
                {isProcessing ? '처리 중...' :
                    isRecording ? '녹음 중... 탭하여 중지' : '탭하여 음성 녹음 시작'}
            </Text>

            {translatedText ? (
                <View style={styles.resultContainer}>
                    <Text style={styles.translatedText}>{translatedText}</Text>
                    <TouchableOpacity style={styles.speakButton} onPress={handleSpeak}>
                        <Ionicons name="volume-high" size={24} color="#007AFF" />
                    </TouchableOpacity>
                </View>
            ) : null}
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
    resultContainer: {
        width: '100%',
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
    },
    speakButton: {
        padding: 8,
    },
}); 