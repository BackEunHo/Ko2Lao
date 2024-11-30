import { Audio } from 'expo-av';

export async function speakLao(text) {
    if (!text) return;

    try {
        console.log('TTS Request:', text);

        const response = await fetch(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_CLOUD_TTS_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    input: { text },
                    voice: {
                        languageCode: 'lo-LA',
                        name: 'lo-LA-Standard-A',
                        ssmlGender: 'NEUTRAL'
                    },
                    audioConfig: {
                        audioEncoding: 'MP3',
                        speakingRate: 1.0,
                        pitch: 0,
                        volumeGainDb: 0,
                        sampleRateHertz: 24000
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Google Cloud API Error:', errorData);
            throw new Error(errorData.error?.message || '음성 변환 서비스 오류가 발생했습니다.');
        }

        const data = await response.json();
        console.log('TTS Response received');

        if (!data.audioContent) {
            console.error('No audio content in response:', data);
            throw new Error('음성 데이터를 받아올 수 없습니다.');
        }

        const audioUri = `data:audio/mp3;base64,${data.audioContent}`;
        const sound = new Audio.Sound();

        try {
            await sound.loadAsync({ uri: audioUri });
            console.log('Audio loaded successfully');
            await sound.playAsync();
            console.log('Audio started playing');

            sound.setOnPlaybackStatusUpdate(async (status) => {
                if (status.didJustFinish) {
                    console.log('Audio finished playing');
                    await sound.unloadAsync();
                }
            });
        } catch (audioError) {
            console.error('Audio playback error:', audioError);
            await sound.unloadAsync();
            throw audioError;
        }
    } catch (error) {
        console.error('TTS error:', error);
        throw error;
    }
} 