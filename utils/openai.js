import OpenAI from 'openai';
import { OPENAI_API_KEY } from '@env';
import * as FileSystem from 'expo-file-system';

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

export const translateText = async (text, targetLang = 'Lao', sourceLang = 'Korean') => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `You are a professional translator. Translate the following text from ${sourceLang} to ${targetLang}. Only provide the translation, no explanations.`
                },
                {
                    role: "user",
                    content: text
                }
            ],
            temperature: 0.3,
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('Translation error:', error);
        throw error;
    }
};

export const generateAIResponse = async (userMessage, conversationHistory = []) => {
    try {
        const messages = [
            {
                role: "system",
                content: "You are a helpful assistant that can communicate in both Korean and Lao languages. Always respond in the same language as the user's message."
            },
            ...conversationHistory,
            {
                role: "user",
                content: userMessage
            }
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: messages,
            temperature: 0.7,
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('AI response error:', error);
        throw error;
    }
};

export const transcribeAudio = async (uri) => {
    try {
        // 1. 먼저 파일을 FormData로 준비
        const formData = new FormData();
        formData.append('file', {
            uri: uri,
            type: 'audio/m4a',
            name: 'audio.m4a'
        });
        formData.append('model', 'whisper-1');

        // 2. fetch API를 사용하여 OpenAI API에 직접 요청
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Accept': 'application/json',
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error('Audio transcription error:', error);
        throw error;
    }
}; 