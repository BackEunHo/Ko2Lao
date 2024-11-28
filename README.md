# Ko2Lao

Ko2Lao는 라오스 외국인 노동자와 한국인 고용주 간의 원활한 의사소통을 지원하는 모바일 애플리케이션입니다. 텍스트와 음성을 손쉽게 번역하여 양방향 의사소통을 가능하게 합니다.

## 주요 기능

### 1. TextTranslate (텍스트 번역)
- 사용자가 입력한 텍스트를 번역하고, 번역된 텍스트의 음성을 제공합니다.
- **주요 요구사항**: 텍스트 입력 창, 번역 결과 출력, 텍스트-음성 변환(TTS).

### 2. VoiceTranslate (음성 번역)
- 사용자가 입력한 음성을 번역된 텍스트와 음성으로 제공합니다.
- **주요 요구사항**: 실시간 음성 인식 및 텍스트로 변환(STT), 번역된 음성 제공.

### 3. AIConverse (AI 대화 기능)
- ChatGPT의 Voice Conversation 기능과 유사한 대화형 번역 기능을 제공합니다.
- **주요 요구사항**: AI 기반 실시간 번역 및 대화 지원, 자연스러운 대화 흐름 유지.

![mermaid-ai-diagram-2024-11-28-141743](https://github.com/user-attachments/assets/b5ccc0c6-7fb9-4a94-9881-9e6c2aa6b45e)

## 기술 스택

- **프론트엔드**: React Native
- **백엔드**: Supabase
- **AI 번역 및 음성 기술**:
  - Google Translate API
  - Google Speech-to-Text 및 Text-to-Speech API
  - OpenAI GPT-4 API
