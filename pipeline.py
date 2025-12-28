from ai_modules.text_extraction import extract_text
from ai_modules.summarization import summarize_text
from ai_modules.tts import text_to_speech


def ai_pipeline(uploaded_file_path, audio_output_path):
    text = extract_text(uploaded_file_path)
    summary = summarize_text(text)
    audio_file = text_to_speech(summary, audio_output_path)
    return summary, audio_file
