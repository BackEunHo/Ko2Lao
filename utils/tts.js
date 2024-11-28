import { Audio } from 'expo-av';
import { ELEVENLABS_API_KEY } from '@env';
import * as FileSystem from 'expo-file-system';

export const speakLao = async (text) => {
    try {
        // ElevenLabs API로 음성 파일 생성 요청
        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY,
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_multilingual_v2",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                }
            }),
        });

        if (!response.ok) {
            throw new Error('TTS request failed');
        }

        // 응답으로 받은 오디오 데이터를 blob으로 변환
        const audioBlob = await response.blob();

        // 임시 파일 경로 생성
        const tempFilePath = FileSystem.cacheDirectory + 'temp_audio.mp3';

        // Blob을 파일로 저장하기 위해 FileReader 사용
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);

        await new Promise((resolve, reject) => {
            reader.onload = async () => {
                try {
                    const base64Data = reader.result.split(',')[1];
                    await FileSystem.writeAsStringAsync(tempFilePath, base64Data, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
        });

        // 저장된 파일을 재생
        const { sound } = await Audio.Sound.createAsync(
            { uri: tempFilePath },
            { shouldPlay: true }
        );

        // 재생이 끝나면 리소스 해제
        sound.setOnPlaybackStatusUpdate(async (status) => {
            if (status.didJustFinish) {
                await sound.unloadAsync();
                // 임시 파일 삭제
                await FileSystem.deleteAsync(tempFilePath, { idempotent: true });
            }
        });

    } catch (error) {
        console.error('TTS error:', error);
        throw error;
    }
}; 