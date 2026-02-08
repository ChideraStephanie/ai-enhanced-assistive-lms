
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

export const generateSummary = async (text: string) => {
  if (!API_KEY) return "API Key not configured. Please check your environment.";
  
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Please provide a concise, structured summary of the following lecture material. Use bullet points for key takeaways: \n\n${text}`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 2048
      }
    });

    return response.text || "Failed to generate summary.";
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return "An error occurred while generating the summary.";
  }
};

export const generateAudio = async (text: string) => {
  if (!API_KEY) throw new Error("API Key not configured");

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Please read the following text clearly and professionally: ${text.substring(0, 5000)}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      console.error("No audio data in response:", response);
      throw new Error("No audio data returned from Gemini TTS");
    }
    
    return base64Audio;
  } catch (error) {
    console.error("Gemini TTS Error Detail:", error);
    throw error;
  }
};

// Manual base64 decoding following standard rules
export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Manual base64 encoding following standard rules
export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  // raw PCM data is typically 16-bit signed integers
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Normalize Int16 to Float32 range [-1.0, 1.0]
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
